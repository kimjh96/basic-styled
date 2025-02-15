import {
  AsyncStyledValue,
  CSSObject,
  GeneralStyledProps,
  StyledArrayFunction,
  StyledValue
} from "@core/typing";

import convertStringToCssString from "@utils/stringToCssString";

export default function createStyle<P>({
  styledArray,
  styledArrayFunctions,
  props,
  asyncStyledValue,
  serializeStyledValues
}: {
  styledArray?: TemplateStringsArray;
  styledArrayFunctions?: StyledArrayFunction<P>[];
  props: P & GeneralStyledProps;
  asyncStyledValue: AsyncStyledValue;
  serializeStyledValues: Array<StyledValue>;
}) {
  return styledArray?.reduce((acc, curr, index) => {
    const styledArrayFunction = styledArrayFunctions?.[index - 1];

    if (typeof styledArrayFunction === "function") {
      const styledValue = styledArrayFunction(props);

      if (!styledValue) {
        return `${acc}${curr}`;
      }

      if (Promise.resolve(styledValue) === styledValue) {
        const promise = styledValue as Promise<StyledValue>;
        asyncStyledValue[index] = promise;

        promise.then((newStyledValue) => {
          serializeStyledValues[index] = newStyledValue;
        });

        const currentStyledValue = serializeStyledValues[index];

        if (typeof currentStyledValue === "string") {
          return `${acc}${currentStyledValue || `[pending:${index}]`}${curr}`;
        }

        return `${acc}${
          currentStyledValue ? convertStringToCssString(currentStyledValue) : `[pending:${index}]`
        }${curr}`;
      }

      if (typeof styledValue === "string") {
        return `${acc}${styledValue}${curr}`;
      }

      return `${acc}${convertStringToCssString(styledValue as CSSObject)}${curr}`;
    }

    return acc + curr;
  });
}
