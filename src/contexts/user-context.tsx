"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { userService } from "@/src/services";
import type { User } from "@/src/types/auth.types";
import { usePathname } from "next/navigation";

interface UserContextType {
  profile: User | null;
  isLoading: boolean;
  refetch: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const pathname = usePathname();

  const refetch = useCallback(() => setRefetchTrigger((prev) => prev + 1), []);

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      setIsLoading(true);
      try {
        const data = await userService.getMyProfile();
        if (isMounted) {
          setProfile(data);
          if (typeof window !== "undefined" && localStorage.getItem("welcomeToast") === "true") {
            toast.success("Verifikasi berhasil! Selamat datang di akun Anda.");
            localStorage.removeItem("welcomeToast");
          }
        }
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
          // Normal if the user doesn't have a valid token
          if (isMounted) setProfile(null);
        } else {
          console.error("Gagal memuat profil:", error);
          if (pathname !== "/login" && pathname !== "/register") {
            toast.error("Gagal memuat informasi profil");
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    
    // Only fetch if not on auth pages
    if (pathname && !pathname.startsWith('/login') && !pathname.startsWith('/register') && !pathname.startsWith('/verify') && !pathname.startsWith('/forgot-password') && !pathname.startsWith('/reset-password')) {
      void loadProfile();
    } else {
      setIsLoading(false);
    }
    
    return () => {
      isMounted = false;
    };
  }, [refetchTrigger, pathname]);

  return (
    <UserContext.Provider value={{ profile, isLoading, refetch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useProfileContext must be used within a UserProvider");
  }
  return context;
}
