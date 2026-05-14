import { ParaglideMessage } from "@inlang/paraglide-js-react";
import type { MessageLike } from "@inlang/paraglide-js-react";

import * as m from "#/paraglide/messages";
import { paraglideMarkup } from "#/shared/ui/paraglide-markup";

import { faqKeys } from "../model/faqKeys";
import { useFaqInputs } from "../model/useFaqInputs";

type FaqKey = (typeof faqKeys)[number];
type FaqMessageName = `${FaqKey}_${"q" | "a"}`;
type AnyMessage = MessageLike<any, any, any>;

const faqMessages = m as unknown as Partial<Record<FaqMessageName, AnyMessage>>;

function getFaqMessage(name: FaqMessageName): AnyMessage | undefined {
  const fn = faqMessages[name];
  return typeof fn === "function" ? fn : undefined;
}

export function Faq() {
  const inputs = useFaqInputs();

  return (
    <>
      <h2 className="mb-6 text-2xl font-bold">{m.nav_faq()}</h2>
      <div className="flex max-w-3xl flex-col gap-6">
        {faqKeys.map((key) => {
          const q = getFaqMessage(`${key}_q`);
          const a = getFaqMessage(`${key}_a`);
          if (!q || !a) return null;
          return (
            <div key={key}>
              <h3 className="mb-1 text-xl font-semibold">{q(inputs)}</h3>
              <div className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                <ParaglideMessage
                  message={a}
                  inputs={inputs}
                  markup={paraglideMarkup}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
