const pr = new Intl.PluralRules("en-US", { type: "ordinal" });

const suffixMap: Record<string, string> = {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th",
};

export function toOrdinal(n: number): string {
  const absInt = Math.floor(Math.abs(n));
  const rule = pr.select(absInt);
  return `${n < 0 ? "-" : ""}${absInt}${suffixMap[rule] ?? "th"}`;
}
