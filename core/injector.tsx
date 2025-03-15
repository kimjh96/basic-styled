import { PropsWithChildren, useInsertionEffect } from "react";

import { InjectorProps } from "@core/typing";

import optimizeCSSRule from "@utils/optimizeCSSRule";

function Injector({
  children,
  className,
  rule,
  hash,
  globalStyle
}: PropsWithChildren<InjectorProps>) {
  useInsertionEffect(() => {
    if (typeof document !== "undefined") {
      const prevStyle = document.getElementById(globalStyle && hash ? hash : className);
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
  }, [className, rule, hash, globalStyle]);

  return children;
}

export default Injector;
