export function getContactUrl(
  username: string | null | undefined,
  resource: "telegram" | "discord",
  userId?: string | null,
): string {
  if (!username) return "";

  if (resource === "discord" && userId) {
    return `https://discord.com/users/${encodeURIComponent(userId)}`;
  }

  if (resource === "telegram") {
    return `https://t.me/${encodeURIComponent(username)}`;
  }

  return "";
}
