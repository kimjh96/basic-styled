// eslint-disable-next-line no-restricted-imports
import React from "react";

import { BasicTheme } from "@core/typing";

let clientContext: React.Context<BasicTheme>;

export default function getThemeContext() {
  if (!clientContext) {
    clientContext = React.createContext<BasicTheme>({});
  }

  return clientContext;
}
