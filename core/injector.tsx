import { useInsertionEffect, useState, useEffect, PropsWithChildren } from "react";

import optimizeCSSRule from "@utils/optimizeCSSRule";

function InjectorServerGuard({ children }: PropsWithChildren) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted) {
    return null;
  }

  return children;
}

function Injector({
  className,
  rule,
  globalStyle
}: {
  className: string;
  rule: string;
  globalStyle?: boolean;
}) {
  useInsertionEffect(() => {
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
  }, [className, rule, globalStyle]);

  return (
    <InjectorServerGuard>
      <style
        id={className + "-server"}
        dangerouslySetInnerHTML={{
          __html: globalStyle ? rule : optimizeCSSRule(`.${className}`, rule)
        }}
      />
    </InjectorServerGuard>
  );
}

export default Injector;
