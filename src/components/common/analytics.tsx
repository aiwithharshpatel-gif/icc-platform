"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logger } from "@/lib/logger";

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    logger.info(`Page View: ${url}`);
  }, [pathname, searchParams]);

  return null;
}
