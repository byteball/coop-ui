export function getContactUrl(
  username: string | undefined,
  resource: "telegram" | "discord",
  userId?: string,
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
