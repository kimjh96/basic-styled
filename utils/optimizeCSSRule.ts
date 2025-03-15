import removeSpace from "@utils/removeSpace";

export default function optimizeCSSRule(selector: string, rule: string) {
  return `${selector}{${removeSpace(rule)}}`;
}
