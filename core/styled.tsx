// eslint-disable-next-line no-restricted-imports
import React, { ElementType, forwardRef, JSX, PropsWithoutRef, Ref } from "react";

import Inserter from "@serializer/Inserter";
import InserterGuard from "@serializer/InserterGuard";
import Updater from "@serializer/Updater";

import builder from "@setup/builder";
import getThemeContext from "@setup/getThemeContext";

import getExtractCSSProperties from "@utils/getExtractCSSProperties";
import convertStringToCssString from "@utils/stringToCssString";
import stringToHash from "@utils/stringToHash";

import attributes from "./attributes";
import events from "./events";
import {
  AsyncStyledValue,
  CSSObject,
  ForwardProps,
  GeneralStyledProps,
  StyledArrayFunction,
  StyledValue
} from "./typing";

// TODO 중복 로직 모듈화
const styled = <T extends keyof JSX.IntrinsicElements>(Tag: T) => {
  return <P,>(
    styledArray: TemplateStringsArray,
    ...styledArrayFunctions: StyledArrayFunction<P>[]
  ) => {
    const asyncStyledValue: AsyncStyledValue = {};
    const serializeStyledValues: Array<StyledValue> = [];

    return forwardRef(function createStyled(props: PropsWithoutRef<ForwardProps<T, P>>, ref) {
      const newProps = { ...props };

      if (!newProps?.theme) {
        try {
          newProps.theme = React.useContext(getThemeContext());
        } catch {
          newProps.theme = builder.theme;
        }
      }

      const reducedStyle = styledArray.reduce((acc, curr, index) => {
        const styledArrayFunction = styledArrayFunctions?.[index - 1];

        if (typeof styledArrayFunction === "function") {
          const styledValue = styledArrayFunction(newProps as P & GeneralStyledProps);

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
              currentStyledValue
                ? convertStringToCssString(currentStyledValue)
                : `[pending:${index}]`
            }${curr}`;
          }

          if (typeof styledValue === "string") {
            return `${acc}${styledValue}${curr}`;
          }

          return `${acc}${convertStringToCssString(styledValue as CSSObject)}${curr}`;
        }

        return acc + curr;
      });

      const compactReducedStyle = reducedStyle.replace(/\s+/g, " ").replace(/\n/g, "");
      const hashId = stringToHash(compactReducedStyle);
      const className = hashId ? `${builder.prefix}-${hashId}` : undefined;

      const cssString = `.${className} {${compactReducedStyle}}`;
      const isGlobalStyle = Tag === "style" && newProps?.globalStyle;

      delete newProps.theme;

      if (isGlobalStyle) {
        const globalCSSString = compactReducedStyle;
        const globalHashId = stringToHash(getExtractCSSProperties(globalCSSString).join(" "));

        return (
          <>
            <Updater
              hashId={globalHashId}
              cssString={globalCSSString}
              asyncStyledValue={asyncStyledValue}
            />
            <InserterGuard>
              <Inserter
                hashId={globalHashId}
                cssString={globalCSSString}
                asyncStyledValue={asyncStyledValue}
              />
            </InserterGuard>
          </>
        );
      }

      const FinalTag = Tag as ElementType;
      const filteredProps = Object.keys(newProps)
        .map((key) => {
          if (
            attributes.includes(key.toLocaleLowerCase()) ||
            events.includes(key.toLocaleLowerCase()) ||
            key.indexOf("data") === 0 ||
            key.indexOf("aria") === 0
          ) {
            return {
              [key]: newProps[key as keyof typeof newProps]
            };
          }

          return null;
        })
        .filter(Boolean)
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});
      const mergedClassName =
        [className, filteredProps?.className].filter(Boolean).join(" ") || undefined;

      // TODO 더 나은 방법 고민
      if (FinalTag === "input") {
        return (
          <>
            <Updater hashId={hashId} cssString={cssString} asyncStyledValue={asyncStyledValue} />
            <InserterGuard>
              <Inserter hashId={hashId} cssString={cssString} asyncStyledValue={asyncStyledValue} />
            </InserterGuard>
            <FinalTag
              {...filteredProps}
              className={mergedClassName}
              ref={ref as Ref<HTMLInputElement>}
            >
              {newProps?.children}
            </FinalTag>
          </>
        );
      }

      return (
        <>
          <Updater hashId={hashId} cssString={cssString} asyncStyledValue={asyncStyledValue} />
          <FinalTag {...filteredProps} className={mergedClassName} ref={ref}>
            <InserterGuard>
              <Inserter hashId={hashId} cssString={cssString} asyncStyledValue={asyncStyledValue} />
            </InserterGuard>
            {newProps?.children}
          </FinalTag>
        </>
      );
    });
  };
};

export default styled;
