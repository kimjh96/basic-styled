import { ElementType } from "react";

import {
  NestedStyleObject,
  CSSInterpolation,
  StyledProps,
  ThemedProps,
  CSSObject
} from "@core/typing";

import config from "@setup/config";

import getExtractCSSProperties from "@utils/getExtractCSSProperties";
import removeSpace from "@utils/removeSpace";
import stringToHash from "@utils/stringToHash";

function insertRule(rule: string, globalStyle = false) {
  const hash = stringToHash(globalStyle ? getExtractCSSProperties(rule).join(" ") : rule);
  const className = `${config.prefix}-${hash}`;

  return { className, rule, hash };
}

function stringifyStyle(style: NestedStyleObject | CSSObject, parentSelector: string = "") {
  const rules: string[] = [];

  for (const [key, value] of Object.entries(style)) {
    if (typeof value === "object") {
      const selector = key.startsWith("&")
        ? parentSelector
          ? key.replace("&", parentSelector)
          : key
        : parentSelector
          ? `${parentSelector} ${key}`
          : key;
      rules.push(stringifyStyle(value, selector));
      continue;
    }

    const property = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    const declaration = `${property}: ${value};`;

    if (parentSelector) {
      rules.push(`${parentSelector} { ${declaration} }`);
    } else {
      rules.push(declaration);
    }
  }

  return rules.join(" ");
}

function css<T extends ElementType, P extends object = object>(
  strings: TemplateStringsArray,
  ...values: CSSInterpolation<StyledProps<T, P>>[]
) {
  const rule = strings.reduce((acc, str, i) => {
    const value = values[i];
    if (typeof value === "function") {
      const result = value({} as ThemedProps<StyledProps<T, P>>);
      if (typeof result === "object") {
        return acc + str + stringifyStyle(result);
      }
      return acc + str + result;
    }
    return acc + str + (value ?? "");
  }, "");

  return insertRule(removeSpace(rule));
}

export function globalCSS<T extends ElementType, P extends object = object>(
  strings: TemplateStringsArray,
  ...values: CSSInterpolation<StyledProps<T, P>>[]
) {
  const rule = strings.reduce((acc, str, i) => {
    const value = values[i];
    if (typeof value === "function") {
      const result = value({} as ThemedProps<StyledProps<T, P>>);
      if (typeof result === "object") {
        return acc + str + stringifyStyle(result);
      }
      return acc + str + result;
    }
    return acc + str + (value ?? "");
  }, "");

  return insertRule(removeSpace(rule), true);
}

export default css;
