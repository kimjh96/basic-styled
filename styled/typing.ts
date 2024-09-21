import type { Properties, Pseudos } from "csstype";
import { ForwardRefExoticComponent, JSX } from "react";

export type GeneralStyledProps = {
  theme?: BasicTheme;
  globalStyle?: boolean;
};

export type CSSObject =
  | Properties
  | { [K in Pseudos]?: Properties }
  | {
      [propertiesName: string]: Properties;
    };

export type StyledValue = CSSObject | string | null;

export type StyledProps<T extends keyof JSX.IntrinsicElements, P> = JSX.IntrinsicElements[T] &
  GeneralStyledProps &
  P;

export type AsyncStyledValue = {
  [key: string]: Promise<StyledValue> | null;
};

export type StyledArrayFunction<T extends keyof JSX.IntrinsicElements, P> = (
  props: StyledProps<T, P>
) => StyledValue | Promise<StyledValue>;

export type StyledArrayFunctionWithoutTheme<T extends keyof JSX.IntrinsicElements, P> = (
  props: StyledProps<T, P>
) => StyledValue | Promise<StyledValue>;

export type CreateStyledTemplate<T extends keyof JSX.IntrinsicElements> = <P>(
  styledArray: TemplateStringsArray,
  ...styledArrayFunctions: StyledArrayFunction<T, P>[]
) => ForwardRefExoticComponent<GeneralStyledProps & JSX.IntrinsicElements[T]>;

export type CreateStyledObject = {
  [T in keyof JSX.IntrinsicElements]: CreateStyledTemplate<T>;
};

export type CreateStyledFunction = <T extends keyof JSX.IntrinsicElements>(
  Tag: T
) => CreateStyledTemplate<T>;

export interface CreateStyled extends CreateStyledObject, CreateStyledFunction {}

// eslint-disable-next-line
type ArrowFunction = (...args: any[]) => any;

type Recursive<T> = {
  [K in keyof T]: T[K] extends object ? Recursive<T[K]> : T[K];
};

export type BasicTheme = Recursive<{
  [key: string]: string | number | ArrowFunction | Record<string, string | number | ArrowFunction>;
}>;
