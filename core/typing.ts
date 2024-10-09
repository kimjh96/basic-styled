import type { Properties, Pseudos } from "csstype";
import { ComponentPropsWithRef, JSX, ReactNode } from "react";

export type GeneralStyledProps = {
  theme: BasicTheme;
  globalStyle?: boolean;
};

export type CSSObject =
  | Properties
  | { [K in Pseudos]?: Properties }
  | {
      [propertiesName: string]: Properties;
    };

export type StyledValue = CSSObject | string | null;

export type AsyncStyledValue = {
  [key: string]: Promise<StyledValue> | null;
};

export type StyledArrayFunction<P> = (
  props: P & GeneralStyledProps
) => StyledValue | Promise<StyledValue>;

export type ForwardProps<T extends keyof JSX.IntrinsicElements, P> = Partial<GeneralStyledProps> &
  P &
  ComponentPropsWithRef<T>;

export type CreateStyledTemplate<T extends keyof JSX.IntrinsicElements> = <P>(
  styledArray: TemplateStringsArray,
  ...styledArrayFunctions: StyledArrayFunction<P>[]
) => (props: ForwardProps<T, P>) => ReactNode;

export type CreateStyledObjectFunction = {
  [T in keyof JSX.IntrinsicElements]: CreateStyledTemplate<T>;
};

export type CreateStyledFunction = <T extends keyof JSX.IntrinsicElements>(
  Tag: T
) => CreateStyledTemplate<T>;

export interface CreateStyled extends CreateStyledObjectFunction, CreateStyledFunction {}

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
