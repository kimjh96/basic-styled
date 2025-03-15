import type { Properties, Pseudos } from "csstype";

export type CSSObject =
  | Properties
  | { [K in Pseudos]?: Properties }
  | {
      [propertiesName: string]: Properties;
    };

export interface BasicTheme {
  [key: string]: unknown;
}
