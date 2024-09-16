import getThemeContext from "@setup/getThemeContext";
import { BasicTheme } from "@styled/typing";
import { PropsWithChildren } from "react";

interface ThemeProviderProps {
  theme?: BasicTheme;
}

function ThemeProvider({ children, theme }: PropsWithChildren<ThemeProviderProps>) {
  const ThemeContext = getThemeContext();

  if (!ThemeContext) return children;

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
