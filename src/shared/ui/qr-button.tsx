import { QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { forwardRef, useCallback, useState } from "react";
import * as m from "#/paraglide/messages";

import { openCustomProtocol } from "#/shared/lib/openCustomProtocol";
import { cn } from "#/shared/lib/utils";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { WalletProtocolPopover } from "./wallet-protocol-popover";

type QRButtonProps = React.ComponentProps<typeof Button> & {
  href: string;
};

export const QRButton = forwardRef<HTMLButtonElement, QRButtonProps>(
  ({ children, href, variant, disabled = false, className, ...props }, ref) => {
    const [showPopover, setShowPopover] = useState(false);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        openCustomProtocol({
          href,
          onProtocolMissing: () => {
            setShowPopover(true);
          },
        });
      },
      [href],
    );

    return (
      <div className={cn("flex", className)}>
        <Dialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  {...props}
                  variant={variant}
                  tabIndex={-1}
                  disabled={disabled}
                  className={cn(
                    "rounded-br-none rounded-tr-none",
                    variant === "link" ? "pl-1 pr-0" : "px-3",
                  )}
                >
                  <QrCode className="size-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent className="max-w-[250px]">
              <p>{m.qr_tooltip()}</p>
            </TooltipContent>
          </Tooltip>

          <DialogContent className="sm:max-w-[360px]">
            <DialogHeader className="mb-4 w-full text-center">
              <DialogTitle className="mx-auto max-w-[200px] text-center leading-snug">
                {m.qr_dialog_title()}
              </DialogTitle>
            </DialogHeader>
            <div className="mx-auto">
              <a href={href}>
                <QRCodeSVG
                  size={200}
                  bgColor="#24292e"
                  fgColor="#fff"
                  value={href}
                />
              </a>
            </div>
            <div className="mx-auto max-w-[220px] text-center text-xs text-foreground">
              {m
                .qr_install_prompt({ ios: "[IOS]", android: "[ANDROID]" })
                .split(/(\[IOS\]|\[ANDROID\])/)
                .map((part, i) => {
                  if (part === "[IOS]") {
                    return (
                      <a
                        key={i}
                        className="font-medium link"
                        rel="noopener noreferrer"
                        target="_blank"
                        href="https://itunes.apple.com/us/app/byteball/id1147137332?ls=1&mt=8"
                      >
                        iOS
                      </a>
                    );
                  }
                  if (part === "[ANDROID]") {
                    return (
                      <a
                        key={i}
                        className="font-medium link"
                        rel="noopener noreferrer"
                        target="_blank"
                        href="https://play.google.com/store/apps/details?id=org.byteball.wallet"
                      >
                        Android
                      </a>
                    );
                  }
                  return <span key={i}>{part}</span>;
                })}
            </div>
          </DialogContent>
        </Dialog>

        <WalletProtocolPopover
          open={showPopover}
          onOpenChange={setShowPopover}
          triggerType={variant === "link" ? "link" : "button"}
        >
          <Button
            {...props}
            variant={variant}
            disabled
            asChild
            ref={ref}
            className={cn(
              "cursor-pointer rounded-bl-none rounded-tl-none",
              // The link variant has no button chrome, so the icon reads as
              // part of the label — keep it tight to the text.
              variant === "link" ? "pl-0" : "pl-2",
              {
                "pointer-events-none select-none opacity-50": disabled,
              },
            )}
          >
            <a href={href} tabIndex={-1} onClick={handleClick}>
              {children}
            </a>
          </Button>
        </WalletProtocolPopover>
      </div>
    );
  },
);
