import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

const linkClassName = "link";

export const paraglideMarkup = {
  // `to` is typed as unknown because Paraglide infers `{}` for variable
  // options like {#link to=$url} — coerce to string at the boundary.
  link: ({
    children,
    options,
  }: {
    children?: ReactNode;
    options: { to: unknown };
  }) => {
    const to = String(options.to);
    if (to.startsWith("/")) {
      return (
        <Link to={to} className={linkClassName}>
          {children}
        </Link>
      );
    }
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {children}
      </a>
    );
  },
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mt-2 list-disc space-y-1 pl-6">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="mt-2 list-decimal space-y-1 pl-6">{children}</ol>
  ),
  li: ({ children }: { children?: ReactNode }) => <li>{children}</li>,
  b: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  i: ({ children }: { children?: ReactNode }) => (
    <em className="italic">{children}</em>
  ),
};
