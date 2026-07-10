"use client";

import { useProfileContext } from "@/src/contexts/user-context";

export function useProfile() {
  return useProfileContext();
}
