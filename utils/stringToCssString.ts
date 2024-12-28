import { CSSObject } from "@core/typing";

import camelToKebab from "./camelToKebab";

export default function convertToCssString(cssObject: CSSObject): string {
  return Object.entries(cssObject)
    .map(([key, value]) => {
      if (typeof value === "object") {
        return `${camelToKebab(key)} { ${convertToCssString(value)} }`;
      }

      return `${camelToKebab(key)}: ${value}`;
    })
    .join("; ");
}
