import { PropsWithChildren, useEffect, useState } from "react";

function InserterGuard({ children }: PropsWithChildren) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted) return null;

  return children;
}

export default InserterGuard;
