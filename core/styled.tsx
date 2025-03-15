// eslint-disable-next-line no-restricted-imports
import React, { type ElementType, JSX } from "react";

import attributes from "@core/attributes";
import css from "@core/css";
import events from "@core/events";
import Injector from "@core/injector";

import Server from "@core/server";
import tags from "@core/tags";
import { BasicTheme, CSSObject } from "@core/typing";

import builder from "@setup/builder";

import getThemeContext from "@setup/getThemeContext";

import stringToKebabCase from "@utils/stringToKebabCase";

type BaseStyledProps = {
  theme?: BasicTheme;
  globalStyle?: boolean;
  css?:
    | CSSObject
    | (<T extends ElementType, P extends object = object>(
        props: StyledProps<T, P> & { theme: BasicTheme }
      ) => CSSObject);
};

type StyledProps<T extends ElementType, P extends object = object> = P &
  BaseStyledProps &
  Omit<
    JSX.IntrinsicElements[T extends keyof JSX.IntrinsicElements ? T : "div"],
    keyof BaseStyledProps | "ref"
  >;

type StyledComponent<T extends ElementType, P extends object = object> = {
  <As extends ElementType>(
    props: Omit<StyledProps<As, P>, keyof BaseStyledProps> & BaseStyledProps & { as: As }
  ): JSX.Element;
  (props: StyledProps<T, P>): JSX.Element;
} & {
  withComponent: <NewT extends ElementType>(component: NewT) => StyledComponent<NewT, P>;
};

type ThemedProps<P extends object = object> = P & Required<BaseStyledProps>;

type CSSInterpolation<P extends object = object> =
  | string
  | number
  | ((props: ThemedProps<P>) => string | number);

type StyledTagFunction<T extends ElementType, P extends object = object> = {
  (
    strings: TemplateStringsArray,
    ...values: CSSInterpolation<StyledProps<T, P>>[]
  ): StyledComponent<T, P>;
  <Props extends object = object>(
    strings: TemplateStringsArray,
    ...values: CSSInterpolation<StyledProps<T, Props>>[]
  ): StyledComponent<T, Props>;
};

type StyledFunction = {
  <T extends ElementType, P extends object = object>(component: T): StyledTagFunction<T, P>;
} & {
  [Tag in (typeof tags)[number]]: StyledTagFunction<Tag>;
};

function createStyledComponent<T extends ElementType, P extends object = object>(
  Component: T,
  strings: TemplateStringsArray,
  values: CSSInterpolation<StyledProps<T, P>>[]
): StyledComponent<T, P> {
  const StyledComponent = ({
    as,
    className,
    ...props
  }: StyledProps<T, P> & { as?: ElementType }) => {
    if (!props?.theme) {
      try {
        props.theme = React.useContext(getThemeContext()) as StyledProps<T, P>["theme"];
      } catch {
        props.theme = builder.theme as StyledProps<T, P>["theme"];
      }
    }

    const baseStyle = css(
      strings,
      ...values.map((value) =>
        typeof value === "function"
          ? () => value({ ...props, theme: props?.theme } as ThemedProps<StyledProps<T, P>>)
          : value
      )
    );

    let inlineCSS = { className: "", rule: "" };

    if (props?.css) {
      const cssValue =
        typeof props.css === "function"
          ? props.css({ ...props, theme: props.theme } as StyledProps<T, P> & { theme: BasicTheme })
          : props.css;

      const cssString = Object.entries(cssValue)
        .map(([key, value]) => {
          if (typeof value === "object") {
            const nestedRules = Object.entries(value)
              .map(([nestedKey, nestedValue]) => `${stringToKebabCase(nestedKey)}: ${nestedValue};`)
              .join(" ");
            return `${key} { ${nestedRules} }`;
          }

          return `${stringToKebabCase(key)}: ${value};`;
        })
        .join(" ");

      inlineCSS = css`
        ${cssString}
      `;
    }

    if (props?.globalStyle) {
      return (
        <>
          <Injector className={baseStyle.className} rule={baseStyle.rule} />
          {inlineCSS.className && (
            <Injector className={inlineCSS.className} rule={inlineCSS.rule} />
          )}
          <Server className={baseStyle.className} rule={baseStyle.rule} />
          {inlineCSS.className && <Server className={inlineCSS.className} rule={inlineCSS.rule} />}
        </>
      );
    }

    const finalClassName = [baseStyle.className, inlineCSS.className, className]
      .filter(Boolean)
      .join(" ");
    const naturalProps = Object.keys(props)
      .map((key) => {
        if (
          attributes.includes(key.toLocaleLowerCase()) ||
          events.includes(key.toLocaleLowerCase()) ||
          key.indexOf("data") === 0 ||
          key.indexOf("aria") === 0
        ) {
          return {
            [key]: props[key as keyof typeof props]
          };
        }

        return null;
      })
      .filter(Boolean)
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});
    const FinalComponent = as || Component;

    return (
      <>
        <Injector className={baseStyle.className} rule={baseStyle.rule} />
        {inlineCSS.className && <Injector className={inlineCSS.className} rule={inlineCSS.rule} />}
        <Server className={baseStyle.className} rule={baseStyle.rule} />
        {inlineCSS.className && <Server className={inlineCSS.className} rule={inlineCSS.rule} />}
        <FinalComponent {...naturalProps} className={finalClassName}>
          {props?.children}
        </FinalComponent>
      </>
    );
  };

  return Object.assign(StyledComponent, {
    withComponent: <NewT extends ElementType>(newComponent: NewT) =>
      createStyledComponent<NewT, P>(newComponent, strings, values)
  }) as StyledComponent<T, P>;
}

const styled = (<T extends ElementType, P extends object = object>(
  Component: T
): StyledTagFunction<T, P> => {
  return ((strings: TemplateStringsArray, ...values: CSSInterpolation<StyledProps<T, P>>[]) =>
    createStyledComponent<T, P>(Component, strings, values)) as StyledTagFunction<T, P>;
}) as StyledFunction;

const styledWithTags = Object.assign(styled, {}) as StyledFunction;

tags.forEach((tag) => {
  styledWithTags[tag] = styled(tag);
});

export default styledWithTags;
