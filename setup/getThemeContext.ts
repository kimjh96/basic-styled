import { BasicTheme } from "@core/typing";
// eslint-disable-next-line no-restricted-imports
import * as React from "react";

let clientContext: React.Context<BasicTheme>;

function GetThemeContext() {
  if (!clientContext) {
    clientContext = React.createContext<BasicTheme>({});
  }

  return clientContext;
}

export default GetThemeContext;
