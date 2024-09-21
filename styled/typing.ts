import type { Properties, Pseudos } from "csstype";
import { ComponentPropsWithRef, JSX, ReactElement } from "react";

export type CSSObject =
  | Properties
  | { [K in Pseudos]?: Properties }
  | {
      [propertiesName: string]: Properties;
    };

export type StyledValue = CSSObject | string | null;

export type StyledProps<T extends keyof JSX.IntrinsicElements, P> = ComponentPropsWithRef<T> & {
  theme: BasicTheme;
  globalStyle?: boolean;
} & P;

export type StyledPropsWithoutTheme<T extends keyof JSX.IntrinsicElements, P> = Omit<
  StyledProps<T, P>,
  "theme"
> & {
  theme?: BasicTheme;
};

export type AsyncStyledValue = {
  [key: string]: Promise<StyledValue> | null;
};

export type StyledArrayFunction<T extends keyof JSX.IntrinsicElements, P> = (
  props: StyledProps<T, P>
) => StyledValue | Promise<StyledValue>;

export type StyledArrayFunctionWithoutTheme<T extends keyof JSX.IntrinsicElements, P> = (
  props: StyledPropsWithoutTheme<T, P>
) => StyledValue | Promise<StyledValue>;

export type CreateStyledTemplate<T extends keyof JSX.IntrinsicElements> = <P>(
  styledArray: TemplateStringsArray,
  ...styledArrayFunctions: StyledArrayFunction<T, P>[]
) => (props: StyledPropsWithoutTheme<T, P>) => ReactElement;

export type CreateStyledObject = {
  [T in keyof JSX.IntrinsicElements]: CreateStyledTemplate<T>;
};

export type CreateStyledFunction = <T extends keyof JSX.IntrinsicElements>(
  Tag: T
) => CreateStyledTemplate<T>;

export interface CreateStyled extends CreateStyledObject, CreateStyledFunction {}

// eslint-disable-next-line
type ArrowFunction = (...args: any[]) => any;

export interface BasicTheme {
  [key: string]:
    | string
    | number
    | ArrowFunction
    | Record<
        string,
        | string
        | number
        | ArrowFunction
        | Record<
            string,
            string | number | ArrowFunction | Record<string, string | number | ArrowFunction>
          >
      >;
}
