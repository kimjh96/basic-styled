import getThemeContext from "@setup/getThemeContext";
import { BasicTheme } from "@styled/typing";
import { PropsWithChildren } from "react";

interface ThemeProviderProps {
  theme?: BasicTheme;
}

const defaultTheme: BasicTheme = {};

function ThemeProvider({ children, theme }: PropsWithChildren<ThemeProviderProps>) {
  const ThemeContext = getThemeContext();

  if (!ThemeContext) return children;

  return <ThemeContext.Provider value={theme || defaultTheme}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
