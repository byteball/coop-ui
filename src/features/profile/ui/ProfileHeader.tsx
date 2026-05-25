import type { FC, ReactNode } from "react";
import { Fragment, useState, useCallback } from "react";
import { ShieldCheck, VerifiedIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "#/shared/ui/avatar";
import { TelegramIcon } from "#/shared/ui/icons/TelegramIcon";
import { DiscordIcon } from "#/shared/ui/icons/DiscordIcon";
import { getExplorerUrl } from "#/shared/lib/getExplorerUrl";
import { getContactUrl } from "#/shared/lib/getContactUrl";
import {
  obyteCommunityUrls,
  attestationLinks,
} from "#/shared/config/appConfig";
import { ObyteServiceLinks } from "./ObyteServiceLinks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/shared/ui/tooltip";

import { useWallet } from "#/entities/user";
import { useAttestations, getProfileField } from "#/entities/attestation";
import type { CoopUser } from "#/entities/coop";
import { getEligibility } from "#/entities/coop";

import * as m from "#/paraglide/messages";

const FRIENDS_AVATAR_BASE = "https://friends.obyte.org";

interface ProfileHeaderProps {
  address: string;
  user: CoopUser;
}

function getEligibilityTooltip(
  hasBalance: boolean,
  hasLockPeriod: boolean,
  isYou: boolean,
  name: string,
): string {
  if (hasBalance && hasLockPeriod) return m.profile_eligible_tooltip();
  if (!hasBalance && !hasLockPeriod)
    return isYou
      ? m.profile_ineligible_both_self()
      : m.profile_ineligible_both({ name });
  if (!hasBalance)
    return isYou
      ? m.profile_ineligible_no_balance_self()
      : m.profile_ineligible_no_balance({ name });
  return isYou
    ? m.profile_ineligible_short_lock_self()
    : m.profile_ineligible_short_lock({ name });
}

const linkClass =
  "font-medium text-foreground underline-offset-4 transition-opacity hover:underline hover:opacity-80";

const communityLinkClass = "font-medium link";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function interpolate(
  template: string,
  replacements: Record<string, ReactNode>,
): ReactNode[] {
  const markers = Object.keys(replacements);
  const pattern = new RegExp(`(${markers.map(escapeRegex).join("|")})`);
  return template.split(pattern).map((part, i) => (
    <Fragment key={i}>{replacements[part] ?? part}</Fragment>
  ));
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({ address, user }) => {
  const { address: connectedAddress } = useWallet();
  const { data: attestations } = useAttestations(address);

  const isYou = connectedAddress === address;

  const { isEligible, hasBalance, hasLockPeriod } = getEligibility(user);

  const tgUsername = getProfileField(attestations?.telegram, "username");
  const tgUserId = getProfileField(attestations?.telegram, "userId");
  const discordUsername = getProfileField(attestations?.discord, "username");
  const discordUserId = getProfileField(attestations?.discord, "userId");
  const hasRealName = !!attestations?.realName;
  const displayName =
    attestations?.displayName ??
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const tgAvatarSrc = tgUserId
    ? `${FRIENDS_AVATAR_BASE}/api/avatar/tg?userId=${encodeURIComponent(tgUserId)}${tgUsername ? `&username=${encodeURIComponent(tgUsername)}` : ""}`
    : null;
  const discordAvatarSrc = discordUserId
    ? `${FRIENDS_AVATAR_BASE}/api/avatar/discord?userId=${encodeURIComponent(discordUserId)}`
    : null;

  const [avatarStep, setAvatarStep] = useState<"tg" | "dc" | "text">(() => {
    if (tgAvatarSrc) return "tg";
    if (discordAvatarSrc) return "dc";
    return "text";
  });

  const avatarSrc =
    avatarStep === "tg"
      ? tgAvatarSrc
      : avatarStep === "dc"
        ? discordAvatarSrc
        : null;

  const handleAvatarStatusChange = useCallback(
    (status: "idle" | "loading" | "loaded" | "error") => {
      if (status === "error") {
        if (avatarStep === "tg")
          setAvatarStep(discordAvatarSrc ? "dc" : "text");
        else if (avatarStep === "dc") setAvatarStep("text");
      }
    },
    [avatarStep, discordAvatarSrc],
  );

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <div className="mb-3 flex items-center gap-3 sm:gap-4">
        <Avatar className="size-14 shrink-0 sm:size-16 md:size-20">
          <AvatarImage
            key={avatarSrc ?? "no-src"}
            src={avatarSrc ?? undefined}
            onLoadingStatusChange={handleAvatarStatusChange}
          />
          <AvatarFallback className="bg-muted text-foreground text-lg">
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:gap-x-3">
            <h1 className="text-2xl font-semibold tracking-tight break-words sm:text-3xl md:text-5xl first-letter:uppercase">
              {displayName}
            </h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <VerifiedIcon
                    className={`size-6 md:size-8 ${isEligible ? "text-blue-500" : "text-muted-foreground"}`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {getEligibilityTooltip(
                    hasBalance,
                    hasLockPeriod,
                    isYou,
                    displayName,
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {isYou && (
              <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                {m.profile_badge_you()}
              </span>
            )}
          </div>
          <a
            href={getExplorerUrl(address, "address")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs break-all link sm:text-sm"
          >
            {address}
          </a>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {tgUsername && (
          <div className="flex items-center gap-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <TelegramIcon />
                </TooltipTrigger>
                <TooltipContent>{m.profile_badge_telegram()}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <a
              href={getContactUrl(tgUsername, "telegram")}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {tgUsername}
            </a>
          </div>
        )}

        {discordUsername && (
          <div className="flex items-center gap-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <DiscordIcon />
                </TooltipTrigger>
                <TooltipContent>{m.profile_badge_discord()}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {(() => {
              const dcUrl = getContactUrl(
                discordUsername,
                "discord",
                discordUserId,
              );
              return dcUrl ? (
                <a
                  href={dcUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {discordUsername}
                </a>
              ) : (
                <span>{discordUsername}</span>
              );
            })()}
          </div>
        )}

        {hasRealName && (
          <div className="flex items-center gap-x-2">
            <ShieldCheck
              className="size-4 text-muted-foreground"
              strokeWidth={1.5}
            />
            <span>{m.profile_badge_real_name()}</span>
          </div>
        )}

        {isYou && !tgUsername && (
          <a
            href={attestationLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass} flex items-center gap-x-2`}
          >
            <TelegramIcon />
            {m.profile_setup_telegram()}
          </a>
        )}

        {isYou && !discordUsername && (
          <a
            href={attestationLinks.discord}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass} flex items-center gap-x-2`}
          >
            <DiscordIcon />
            {m.profile_setup_discord()}
          </a>
        )}
      </div>

      <ObyteServiceLinks address={address} displayName={displayName} />

      {!isYou &&
        (() => {
          const telegramLink = (
            <a
              href={obyteCommunityUrls.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className={communityLinkClass}
            >
              {m.profile_badge_telegram()}
            </a>
          );
          const discordLink = (
            <a
              href={obyteCommunityUrls.discord}
              target="_blank"
              rel="noopener noreferrer"
              className={communityLinkClass}
            >
              {m.profile_badge_discord()}
            </a>
          );

          const sentence = interpolate(
            m.profile_discuss_both({
              name: "[NAME]",
              telegram: "[TG]",
              discord: "[DC]",
            }),
            {
              "[NAME]": (
                <span className="font-medium">
                  {displayName.charAt(0).toUpperCase() + displayName.slice(1)}
                </span>
              ),
              "[TG]": telegramLink,
              "[DC]": discordLink,
            },
          );

          return <p className="text-sm text-muted-foreground">{sentence}</p>;
        })()}
    </div>
  );
};
