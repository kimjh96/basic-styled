import { PropsWithChildren } from "react";

import optimizeCSSRule from "@utils/optimizeCSSRule";

function Server({
  className,
  rule,
  globalStyle
}: PropsWithChildren<{ className: string; rule: string; globalStyle?: boolean }>) {
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
