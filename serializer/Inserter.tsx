import { AsyncStyledValue } from "@core/typing";

import builder from "@setup/builder";

import convertStringToCssString from "@utils/convertStringToCssString";

interface InserterProps {
  hashId: number;
  cssString: string;
  asyncStyledValue: AsyncStyledValue;
}

function Inserter({ hashId, cssString, asyncStyledValue }: InserterProps) {
  let newCssString = cssString;

  Object.keys(asyncStyledValue).forEach((key) => {
    const asKey = key as keyof typeof asyncStyledValue;

    const promise = asyncStyledValue[asKey];

    promise?.then((styledValue) => {
      if (!styledValue) return;

      newCssString = newCssString
        .replace(
          `[pending:${asKey}]`,
          typeof styledValue === "object" ? convertStringToCssString(styledValue) : styledValue
        )
        .replace(/\s+/g, " ")
        .replace(/\n/g, "");
    });
  });

  return (
    <style id={`${builder.prefix}-${hashId}`} dangerouslySetInnerHTML={{ __html: newCssString }} />
  );
}

export default Inserter;
