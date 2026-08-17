import { Fragment } from "react";
import type { FC } from "react";
import { MessagesSquare } from "lucide-react";
import { ParaglideMessage } from "@inlang/paraglide-js-react";

import {
  useAttestations,
  useDisplayName,
  getDiscordUserId,
} from "#/entities/attestation";
import { useContributions, CONTRIBUTIONS_LIMIT } from "#/entities/contribution";
import { env } from "#/shared/config/env";
import { obyteCommunityUrls } from "#/shared/config/appConfig";
import { Button } from "#/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/shared/ui/card";
import { paraglideMarkup } from "#/shared/ui/paraglide-markup";
import { Separator } from "#/shared/ui/separator";
import { Skeleton } from "#/shared/ui/skeleton";

import { ContributionRow } from "./ContributionRow";

import * as m from "#/paraglide/messages";

interface ContributionsCardProps {
  address: string;
  /** Own profile: 0 posts shows a call-to-action instead of hiding the card. */
  isOwn: boolean;
  className?: string;
}

/**
 * Recent contribution-log posts (Discord forum) for the profile's user.
 * Self-degrading: without VITE_CONTRIBUTION_LOG_URL, without a Discord
 * attestation, on any fetch/validation error, or with no posts on someone
 * else's profile it renders nothing — including the grid wrapper, so no
 * empty cell is left behind.
 */
export const ContributionsCard: FC<ContributionsCardProps> = ({
  address,
  isOwn,
  className,
}) => {
  const { data: attestations } = useAttestations(address);
  const discordUserId = getDiscordUserId(attestations);
  const contributions = useContributions(discordUserId);
  const rawName = useDisplayName(address);
  const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const forumUrl = env.VITE_DISCORD_FORUM_URL ?? obyteCommunityUrls.discord;

  if (!env.VITE_CONTRIBUTION_LOG_URL) return null;
  if (!discordUserId) return null;

  if (contributions.isPending) {
    return (
      <div className={className}>
        <ContributionsSkeleton />
      </div>
    );
  }

  if (contributions.isError) return null;

  const posts = contributions.data.posts.slice(0, CONTRIBUTIONS_LIMIT);

  if (posts.length === 0 && !isOwn) return null;

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>{m.contributions_title()}</CardTitle>
          <CardDescription>
            <ParaglideMessage
              message={m.contributions_description}
              inputs={{ user: name, forumUrl }}
              markup={paraglideMarkup}
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length > 0 ? (
            <div className="space-y-3 text-sm">
              {posts.map((post, i) => (
                <Fragment key={post.postId}>
                  {i > 0 && <Separator />}
                  <ContributionRow post={post} />
                </Fragment>
              ))}
            </div>
          ) : (
            <ContributionsEmptyState forumUrl={forumUrl} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ContributionsEmptyState: FC<{ forumUrl: string }> = ({ forumUrl }) => (
  <div className="space-y-3 py-6 text-center">
    <MessagesSquare className="mx-auto size-8 text-muted-foreground" />
    <div>
      <p className="text-sm font-medium">{m.contributions_empty_title()}</p>
      <p className="mx-auto mt-1 max-w-[36ch] text-sm text-muted-foreground">
        {m.contributions_empty_description()}
      </p>
    </div>
    <Button variant="secondary" size="sm" asChild>
      <a href={forumUrl} target="_blank" rel="noopener noreferrer">
        {m.contributions_empty_cta()}
      </a>
    </Button>
  </div>
);

const ContributionsSkeleton: FC = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-3.5 w-2/3" />
    </CardHeader>
    <CardContent className="space-y-4">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </CardContent>
  </Card>
);
