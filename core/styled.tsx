// eslint-disable-next-line no-restricted-imports
import React, { ElementType, forwardRef, JSX, PropsWithoutRef, Ref } from "react";

import attributes from "@core/attributes";
import events from "@core/events";
import {
  AsyncStyledValue,
  ForwardProps,
  GeneralStyledProps,
  StyledArrayFunction,
  StyledValue
} from "@core/typing";

import Inserter from "@serializer/Inserter";
import InserterGuard from "@serializer/InserterGuard";
import Updater from "@serializer/Updater";

import builder from "@setup/builder";
import getThemeContext from "@setup/getThemeContext";

import createStyle from "@utils/createStyle";
import getExtractCSSProperties from "@utils/getExtractCSSProperties";
import stringToHash from "@utils/stringToHash";

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

      const style = createStyle<P>({
        styledArray,
        styledArrayFunctions,
        props: newProps as P & GeneralStyledProps,
        asyncStyledValue,
        serializeStyledValues
      });
      const cssStyle = createStyle({
        styledArray: newProps?.css?.styledArray,
        styledArrayFunctions: newProps?.css?.styledArrayFunctions || [],
        props: newProps as GeneralStyledProps,
        asyncStyledValue,
        serializeStyledValues
      });
      const compactStyle = style?.replace(/\s+/g, " ").replace(/\n/g, "");
      const compactCssStyle = cssStyle?.replace(/\s+/g, " ").replace(/\n/g, "");
      const composedStyle = `${compactStyle}${compactCssStyle}`;
      const hashId = stringToHash(composedStyle);
      const className = hashId ? `${builder.prefix}-${hashId}` : undefined;

      const cssString = `.${className} {${composedStyle}}`;

      const isGlobalStyle = Tag === "style" && newProps?.globalStyle;

      delete newProps.theme;

      if (isGlobalStyle) {
        const globalCSSString = compactStyle;
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

      const FinalTag = (newProps?.tag || Tag) as ElementType;
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
