import builder from "@setup/builder";

import getExtractCSSProperties from "@utils/getExtractCSSProperties";
import removeSpace from "@utils/removeSpace";
import stringToHash from "@utils/stringToHash";

const styleSheet = new Map<string, string>();

function insertRule(rule: string, globalStyle = false) {
  const hash = stringToHash(globalStyle ? getExtractCSSProperties(rule).join(" ") : rule);
  const className = `${builder.prefix}-${hash}`;

  if (!styleSheet.has(className)) {
    styleSheet.set(className, rule);
  }

  return { className, rule, hash };
}

type StyleValue = string | number;
type NestedStyleObject = {
  [key: string]: StyleValue | NestedStyleObject;
};

function stringifyStyle(style: NestedStyleObject, parentSelector: string = ""): string {
  const rules: string[] = [];

  for (const [key, value] of Object.entries(style)) {
    if (typeof value === "object") {
      const selector = key.startsWith("&")
        ? parentSelector
          ? key.replace("&", parentSelector)
          : key // Keep the & if there's no parent selector
        : parentSelector
          ? `${parentSelector} ${key}`
          : key;
      rules.push(stringifyStyle(value, selector));
      continue;
    }

    // Convert camelCase to kebab-case for property names
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

function reduceRule(strings: TemplateStringsArray, ...values: CSSValue[]) {
  return strings.reduce((acc, str, i) => {
    const value = values[i];
    if (typeof value === "function") {
      const result = value({});
      if (typeof result === "object") {
        return acc + str + stringifyStyle(result);
      }
      return acc + str + result;
    }
    return acc + str + (value ?? "");
  }, "");
}

type CSSValue = string | number | ((props: object) => string | number | NestedStyleObject);

function css(strings: TemplateStringsArray, ...values: CSSValue[]) {
  const rule = reduceRule(strings, ...values);

  return insertRule(removeSpace(rule));
}

export function globalCSS(strings: TemplateStringsArray, ...values: CSSValue[]) {
  const rule = reduceRule(strings, ...values);

  return insertRule(removeSpace(rule), true);
}

export default css;
