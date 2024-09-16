import { CSSObject } from "@styled/typing";

import convertCamelToKebab from "./convertCamelToKebab";

export default function convertToCssString(cssObject: CSSObject): string {
  return Object.entries(cssObject)
    .map(([key, value]) => {
      if (typeof value === "object") {
        return `${convertCamelToKebab(key)} { ${convertToCssString(value)} }`;
      }

      return `${convertCamelToKebab(key)}: ${value}`;
    })
    .join("; ");
}
