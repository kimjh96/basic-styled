import getThemeContext from "@setup/getThemeContext";
import { useContext } from "react";

export default function useTheme() {
  return useContext(getThemeContext());
}
