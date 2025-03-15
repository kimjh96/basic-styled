import { ElementType, JSX, ComponentPropsWithRef } from "react";

import tags from "@core/tags";

import type { Properties, Pseudos } from "csstype";

export type CSSObject =
  | Properties
  | { [K in Pseudos]?: Properties }
  | {
      [propertiesName: string]: Properties;
    };

export type BaseStyledProps = {
  theme?: BasicTheme;
  globalStyle?: boolean;
  css?:
    | CSSObject
    | (<T extends ElementType, P extends object = object>(
        props: StyledProps<T, P> & { theme: BasicTheme }
      ) => CSSObject);
};

export type StyledProps<T extends ElementType, P extends object = object> = P &
  BaseStyledProps &
  Omit<
    JSX.IntrinsicElements[T extends keyof JSX.IntrinsicElements ? T : "div"],
    keyof BaseStyledProps
  > & {
    ref?: ComponentPropsWithRef<T>["ref"];
  };

export type StyledComponent<T extends ElementType, P extends object = object> = {
  <As extends ElementType>(
    props: Omit<StyledProps<As, P>, keyof BaseStyledProps> & BaseStyledProps & { as: As }
  ): JSX.Element;
  (props: StyledProps<T, P>): JSX.Element;
} & {
  withComponent: <NewT extends ElementType>(component: NewT) => StyledComponent<NewT, P>;
};

export type ThemedProps<P extends object = object> = P & Required<BaseStyledProps>;

export type NestedStyleObject = {
  [key: string]: string | number | CSSObject | NestedStyleObject;
};

export type CSSValue =
  | string
  | number
  | CSSObject
  | ((props: object) => string | number | NestedStyleObject);

export type CSSInterpolation<P extends object = object> =
  | string
  | number
  | CSSObject
  | ((props: ThemedProps<P>) => string | number | CSSObject);

export type StyledTagFunction<T extends ElementType, P extends object = object> = {
  (
    strings: TemplateStringsArray,
    ...values: CSSInterpolation<StyledProps<T, P>>[]
  ): StyledComponent<T, P>;
  <Props extends object = object>(
    strings: TemplateStringsArray,
    ...values: CSSInterpolation<StyledProps<T, Props>>[]
  ): StyledComponent<T, Props>;
};

export type StyledFunction = {
  <T extends ElementType, P extends object = object>(component: T): StyledTagFunction<T, P>;
} & {
  [Tag in (typeof tags)[number]]: StyledTagFunction<Tag>;
};

export interface BasicTheme {
  [key: string]: unknown;
}
