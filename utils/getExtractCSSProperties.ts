export default function getExtractCSSProperties(cssString: string) {
  const regex = /([a-zA-Z-]+)\s*:/g;
  const matches = cssString.match(regex);
  return matches ? matches.map((match) => match.slice(0, -1)) : [];
}
