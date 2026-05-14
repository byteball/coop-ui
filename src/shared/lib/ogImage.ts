import { env } from "#/shared/config/env";

export const ogImageUrl = (path: string): string | undefined => {
  const base = env.VITE_OG_URL;
  if (!base) return undefined;
  return new URL(path, base).toString();
};

export const ogImageMeta = (path: string) => {
  const url = ogImageUrl(path);
  if (!url) return [];
  return [
    { property: "og:image", content: url },
    { name: "twitter:image", content: url },
  ];
};
