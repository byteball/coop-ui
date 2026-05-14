import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

const linkClassName = "underline underline-offset-4 hover:text-foreground";

export const paraglideMarkup = {
  link: ({
    children,
    options,
  }: {
    children?: ReactNode;
    options: { to: string };
  }) => {
    if (options.to.startsWith("/")) {
      return (
        <Link to={options.to} className={linkClassName}>
          {children}
        </Link>
      );
    }
    return (
      <a
        href={options.to}
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
};
