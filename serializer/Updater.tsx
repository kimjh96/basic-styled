import { AsyncStyledValue } from "@core/typing";
import builder from "@setup/builder";
import convertStringToCssString from "@utils/convertStringToCssString";
import { useInsertionEffect } from "react";

interface UpdaterProps {
  hashId: number;
  cssString: string;
  asyncStyledValue: AsyncStyledValue;
}

function Updater({ hashId, cssString, asyncStyledValue }: UpdaterProps) {
  useInsertionEffect(() => {
    let newStyleElement = null;
    const prevStyleElement = document.head.querySelector(`#${builder.prefix}-${hashId}`);

    if (prevStyleElement) {
      prevStyleElement.innerHTML = cssString;
      newStyleElement = prevStyleElement;
    } else {
      newStyleElement = document.createElement("style");
      newStyleElement.id = `${builder.prefix}-${hashId}`;
      newStyleElement.innerHTML = cssString;
      document.head.appendChild(newStyleElement);
    }

    Object.keys(asyncStyledValue).forEach((key) => {
      const asKey = key as keyof typeof asyncStyledValue;

      const promise = asyncStyledValue[asKey];

      promise?.then((styledValue) => {
        if (!styledValue) return;

        newStyleElement.innerHTML = newStyleElement.innerHTML
          .replace(
            `[pending:${asKey}]`,
            typeof styledValue === "object" ? convertStringToCssString(styledValue) : styledValue
          )
          .replace(/\s+/g, " ")
          .replace(/\n/g, "");
      });
    });
  }, [cssString, asyncStyledValue, hashId]);

  return null;
}

export default Updater;
