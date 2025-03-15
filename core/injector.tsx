import { PropsWithChildren, useInsertionEffect } from "react";

import optimizeCSSRule from "@utils/optimizeCSSRule";

function Injector({
  children,
  className,
  rule,
  globalStyle
}: PropsWithChildren<{ className: string; rule: string; globalStyle?: boolean }>) {
  useInsertionEffect(() => {
    if (typeof document !== "undefined") {
      const prevStyle = document.getElementById(className);
      const textContent = globalStyle ? rule : optimizeCSSRule(`.${className}`, rule);

      if (prevStyle) {
        prevStyle.textContent = textContent;
      } else {
        const style = document.createElement("style");

        style.id = className;
        style.textContent = textContent;

        document.head.appendChild(style);
      }
    }
  }, [className, rule]);

  return children;
}

export default Injector;
