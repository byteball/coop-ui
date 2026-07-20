"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";

import { cn } from "#/shared/lib/utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

interface TooltipContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

/**
 * Radix Tooltip never opens on touch pointers, so the Root is kept
 * controlled and the Trigger toggles it on tap (see TooltipTrigger).
 * Hover/focus behavior on desktop is unchanged.
 */
function Tooltip({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (openProp === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <TooltipContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      <TooltipPrimitive.Root
        data-slot="tooltip"
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </TooltipContext.Provider>
  );
}

function TooltipTrigger({
  onPointerDown,
  onPointerUp,
  onClick,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  const context = React.useContext(TooltipContext);
  // Open state captured before outside-pointerdown dismissal runs, so a
  // second tap on the trigger closes instead of instantly reopening.
  const wasOpenOnPointerDownRef = React.useRef(false);
  const touchToggledRef = React.useRef(false);

  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      onPointerDown={(event) => {
        wasOpenOnPointerDownRef.current = context?.open ?? false;
        touchToggledRef.current = false;
        onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        if (
          context &&
          event.pointerType === "touch" &&
          !event.defaultPrevented
        ) {
          touchToggledRef.current = true;
          context.onOpenChange(!wasOpenOnPointerDownRef.current);
        }
      }}
      onClick={(event) => {
        onClick?.(event);
        // The tap already toggled the tooltip; preventDefault stops Radix's
        // built-in click handler from immediately closing it again.
        if (touchToggledRef.current) {
          touchToggledRef.current = false;
          event.preventDefault();
        }
      }}
      {...props}
    />
  );
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in rounded-md bg-foreground px-3 py-1.5 text-xs text-background fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
