import { BasicTheme } from "@styled/typing";
// eslint-disable-next-line no-restricted-imports
import * as React from "react";

let clientContext: React.Context<BasicTheme | undefined>;

function GetThemeContext() {
  if (!clientContext) {
    clientContext = React.createContext<BasicTheme | undefined>(undefined);
  }

  return clientContext;
}

export default GetThemeContext;
