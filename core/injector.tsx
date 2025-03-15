import { PropsWithChildren, useInsertionEffect } from "react";

import optimizeCSSRule from "@utils/optimizeCSSRule";

function Injector({
  children,
  className,
  rule
}: PropsWithChildren<{ className: string; rule: string }>) {
  useInsertionEffect(() => {
    if (typeof document !== "undefined") {
      const prevStyle = document.getElementById(className);
      const textContent = optimizeCSSRule(`.${className}`, rule);

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
