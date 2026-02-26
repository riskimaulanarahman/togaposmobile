"use client";

import { MobileSelect, MobileSelectProps } from "./mobile-select";

export function SelectField(props: MobileSelectProps) {
  return <MobileSelect {...props} />;
}

export { MobileSelect };
export type { MobileSelectProps };
