"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { userService } from "@/src/services";
import type { User } from "@/src/types/auth.types";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie"; // Contoh jika Anda pakai cookies, ubah sesuai implementasi

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
    const controller = new AbortController();
    
    async function loadProfile() {
      setIsLoading(true);
      try {
        const data = await userService.getMyProfile({ signal: controller.signal });
        if (isMounted) {
          setProfile(data);
          if (typeof window !== "undefined" && localStorage.getItem("welcomeToast") === "true") {
            toast.success("Verifikasi berhasil! Selamat datang di akun Anda.");
            localStorage.removeItem("welcomeToast");
          }
        }
      } catch (error: unknown) {
        const isCanceled = error instanceof Error &&
          (error.name === 'CanceledError' || error.message?.includes('canceled'));
        if (isCanceled) return;
        if (isAxiosError(error) && error.response?.status === 401) {
          if (isMounted) setProfile(null);
          if (typeof window !== "undefined") localStorage.removeItem('accessToken');
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
    
    if (pathname && !pathname.startsWith('/login') && !pathname.startsWith('/register') && !pathname.startsWith('/verify') && !pathname.startsWith('/forgot-password') && !pathname.startsWith('/reset-password')) {
      if (!profile || refetchTrigger > 0) {
        void loadProfile();
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
    
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [refetchTrigger, pathname]); // Hati-hati dengan dependensi profile, kita abaikan agar tidak loop

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