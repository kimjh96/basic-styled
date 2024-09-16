import builder from "@setup/builder";
import { AsyncStyledValue } from "@styled/typing";
import convertStringToCssString from "@utils/convertStringToCssString";
import convertStringToHash from "@utils/convertStringToHash";
import { useInsertionEffect } from "react";

interface UpdaterProps {
  cssString: string;
  asyncStyledValue: AsyncStyledValue;
}

function Updater({ cssString, asyncStyledValue }: UpdaterProps) {
  useInsertionEffect(() => {
    const hashId = convertStringToHash(cssString);
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
  }, [cssString, asyncStyledValue]);

  return null;
}

export default Updater;
