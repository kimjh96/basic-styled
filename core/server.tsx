import { PropsWithChildren } from "react";

import { InjectorProps } from "@core/typing";

import optimizeCSSRule from "@utils/optimizeCSSRule";

function Server({ className, rule, globalStyle }: PropsWithChildren<Omit<InjectorProps, "hash">>) {
  if (typeof document !== "undefined") {
    return null;
  }

  return (
    <style
      id={className}
      dangerouslySetInnerHTML={{
        __html: globalStyle ? rule : optimizeCSSRule(`.${className}`, rule)
      }}
    />
  );
}

export default Server;
