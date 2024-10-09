import { useContext } from "react";

import getThemeContext from "@setup/getThemeContext";

export default function useTheme() {
  return useContext(getThemeContext());
}
