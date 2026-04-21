import type { FC, ReactNode } from "react";
import { Fragment, useState, useCallback } from "react";
import { Building2, ShieldCheck, Users, VerifiedIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "#/shared/ui/avatar";
import { getExplorerUrl } from "#/shared/lib/getExplorerUrl";
import { getContactUrl } from "#/shared/lib/getContactUrl";
import {
  obyteServiceUrls,
  obyteCommunityUrls,
  attestationLinks,
} from "#/shared/config/appConfig";
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
    <div className="flex flex-col gap-3">
      <div className="mb-3 flex items-center gap-4">
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

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {tgUsername && (
          <div className="flex items-center gap-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
                  </svg>
                </TooltipTrigger>
                <TooltipContent>{m.profile_badge_telegram()}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <a
              href={getContactUrl(tgUsername, "telegram")}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:underline"
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
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    className="text-muted-foreground"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M14.983 3l.123 .006c2.014 .214 3.527 .672 4.966 1.673a1 1 0 0 1 .371 .488c1.876 5.315 2.373 9.987 1.451 12.28c-1.003 2.005 -2.606 3.553 -4.394 3.553c-.732 0 -1.693 -.968 -2.328 -2.045a21.512 21.512 0 0 0 2.103 -.493a1 1 0 1 0 -.55 -1.924c-3.32 .95 -6.13 .95 -9.45 0a1 1 0 0 0 -.55 1.924c.717 .204 1.416 .37 2.103 .494c-.635 1.075 -1.596 2.044 -2.328 2.044c-1.788 0 -3.391 -1.548 -4.428 -3.629c-.888 -2.217 -.39 -6.89 1.485 -12.204a1 1 0 0 1 .371 -.488c1.439 -1.001 2.952 -1.459 4.966 -1.673a1 1 0 0 1 .935 .435l.063 .107l.651 1.285l.137 -.016a12.97 12.97 0 0 1 2.643 0l.134 .016l.65 -1.284a1 1 0 0 1 .754 -.54l.122 -.009zm-5.983 7a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15zm6 0a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15z"
                      strokeWidth="0"
                      fill="currentColor"
                    />
                  </svg>
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
                  className="underline-offset-4 hover:underline"
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
      </div>

      {(() => {
        if (isYou) {
          const items: ReactNode[] = [];
          if (!tgUsername) {
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
          if (!discordUsername) {
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

        const telegramLink = (
          <a
            href={obyteCommunityUrls.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {m.profile_badge_telegram()}
          </a>
        );
        const discordLink = (
          <a
            href={obyteCommunityUrls.discord}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
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

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
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
