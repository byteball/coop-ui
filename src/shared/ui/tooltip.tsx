"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { useControllableState } from "radix-ui/internal";

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
 * controlled and the Trigger opens it on tap (see TooltipTrigger).
 * Hover/focus behavior on desktop is unchanged.
 */
function Tooltip({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    caller: "Tooltip",
  });

  return (
    <TooltipContext.Provider value={{ open, onOpenChange: setOpen }}>
      <TooltipPrimitive.Root
        data-slot="tooltip"
        open={open}
        onOpenChange={setOpen}
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
  // Captured on pointerdown, before Radix's own pointerdown handler closes an
  // open tooltip — so the tap that closed it doesn't immediately reopen it.
  const wasOpenOnPointerDownRef = React.useRef(false);
  const touchTapPendingRef = React.useRef(false);

  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      onPointerDown={(event) => {
        wasOpenOnPointerDownRef.current = context?.open ?? false;
        touchTapPendingRef.current = false;
        onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        if (
          event.pointerType === "touch" &&
          !event.defaultPrevented &&
          !wasOpenOnPointerDownRef.current
        ) {
          touchTapPendingRef.current = true;
        }
      }}
      onClick={(event) => {
        onClick?.(event);
        // Open only after the whole click dispatch has finished: by then
        // Radix's built-in click-close ran on a still-closed tooltip (no-op)
        // and interactive children of the trigger (dialog triggers, links,
        // collapsible/sort buttons up the tree) received an untouched event.
        // A scroll gesture emits no click, so dragging over a trigger does
        // not open it.
        if (context && touchTapPendingRef.current) {
          touchTapPendingRef.current = false;
          const { onOpenChange } = context;
          queueMicrotask(() => onOpenChange(true));
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
