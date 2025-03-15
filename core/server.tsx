import { PropsWithChildren } from "react";

import optimizeCSSRule from "@utils/optimizeCSSRule";

function Server({ className, rule }: PropsWithChildren<{ className: string; rule: string }>) {
  if (typeof document !== "undefined") {
    return null;
  }

  return (
    <style
      id={className}
      dangerouslySetInnerHTML={{ __html: optimizeCSSRule(`.${className}`, rule) }}
    />
  );
}

export default Server;
