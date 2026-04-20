import type { FC, ReactNode } from "react";
import { Fragment, useState, useCallback } from "react";
import { Building2, ShieldCheck, Users, VerifiedIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "#/shared/ui/avatar";
import { getExplorerUrl } from "#/shared/lib/getExplorerUrl";
import { getContactUrl } from "#/shared/lib/getContactUrl";
import { obyteServiceUrls, attestationLinks } from "#/shared/config/appConfig";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/shared/ui/tooltip";

import { useWallet } from "#/entities/user";
import { useAttestations } from "#/entities/attestation";
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
): string {
  if (hasBalance && hasLockPeriod) return m.profile_eligible_tooltip();
  if (!hasBalance && !hasLockPeriod) return m.profile_ineligible_both();
  if (!hasBalance) return m.profile_ineligible_no_balance();
  return m.profile_ineligible_short_lock();
}

const linkClass =
  "font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground";

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

  const tgUsername = attestations?.telegram?.username;
  const tgUserId = attestations?.telegram?.userId;
  const discordUsername = attestations?.discord?.username;
  const discordUserId = attestations?.discord?.userId;
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-16 md:size-20">
          <AvatarImage
            key={avatarSrc ?? "no-src"}
            src={avatarSrc ?? undefined}
            onLoadingStatusChange={handleAvatarStatusChange}
          />
          <AvatarFallback className="bg-muted text-foreground text-lg">
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-5xl first-letter:uppercase">
              {displayName}
            </h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <VerifiedIcon
                    className={`size-8 ${isEligible ? "text-blue-500" : "text-muted-foreground"}`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {getEligibilityTooltip(hasBalance, hasLockPeriod)}
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
            className="font-mono text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            {address}
          </a>
        </div>
      </div>

      {(() => {
        const tgHref = tgUsername ? getContactUrl(tgUsername, "telegram") : null;
        const dcHref = discordUsername
          ? getContactUrl(discordUsername, "discord", discordUserId)
          : null;

        const telegramLink = tgHref ? (
          <a
            href={tgHref}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {m.profile_badge_telegram()}
          </a>
        ) : null;
        const discordLink = dcHref ? (
          <a
            href={dcHref}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {m.profile_badge_discord()}
          </a>
        ) : null;

        if (isYou) {
          const items: ReactNode[] = [];
          if (!telegramLink) {
            items.push(
              <a
                key="tg-setup"
                href={attestationLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {m.profile_setup_telegram()}
              </a>,
            );
          }
          if (!discordLink) {
            items.push(
              <a
                key="dc-setup"
                href={attestationLinks.discord}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {m.profile_setup_discord()}
              </a>,
            );
          }
          if (items.length === 0) return null;
          return (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {items}
            </div>
          );
        }

        if (!telegramLink && !discordLink) return null;

        let sentence: ReactNode[];
        if (telegramLink && discordLink) {
          sentence = interpolate(
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
        } else if (telegramLink) {
          sentence = interpolate(
            m.profile_discuss_telegram({
              name: "[NAME]",
              telegram: "[TG]",
            }),
            {
              "[NAME]": (
                <span className="font-medium">
                  {displayName.charAt(0).toUpperCase() + displayName.slice(1)}
                </span>
              ),
              "[TG]": telegramLink,
            },
          );
        } else {
          sentence = interpolate(
            m.profile_discuss_discord({
              name: "[NAME]",
              discord: "[DC]",
            }),
            {
              "[NAME]": (
                <span className="font-medium">
                  {displayName.charAt(0).toUpperCase() + displayName.slice(1)}
                </span>
              ),
              "[DC]": discordLink,
            },
          );
        }

        return <p className="text-sm text-muted-foreground">{sentence}</p>;
      })()}

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {hasRealName && (
          <div className="flex items-center gap-x-2">
            <ShieldCheck
              className="size-4 text-muted-foreground"
              strokeWidth={1.5}
            />
            <span>{m.profile_badge_real_name()}</span>
          </div>
        )}

        <a
          href={obyteServiceUrls.city(address)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-x-2 underline-offset-4 hover:underline"
        >
          <Building2
            className="size-4 text-muted-foreground"
            strokeWidth={1.5}
          />
          <span>{m.profile_badge_city()}</span>
        </a>

        <a
          href={obyteServiceUrls.friends(address)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-x-2 underline-offset-4 hover:underline"
        >
          <Users className="size-4 text-muted-foreground" strokeWidth={1.5} />
          <span>{m.profile_badge_friends()}</span>
        </a>
      </div>
    </div>
  );
};
