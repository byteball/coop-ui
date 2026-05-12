import obyte from "obyte";

export const getReferrerFromUrl = (): string | undefined => {
  if (typeof window === "undefined") return undefined;

  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (ref && obyte.utils.isValidAddress(ref)) return ref;

  const pathMatch = window.location.pathname.match(/^\/user\/([^/?#]+)/);
  if (pathMatch && obyte.utils.isValidAddress(pathMatch[1]))
    return pathMatch[1];

  return undefined;
};
