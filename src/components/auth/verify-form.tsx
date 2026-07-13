"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { verifyEmail, resendOtp } from "../../services/auth.service";

export function VerifyForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendOtp = async () => {
    if (countdown > 0 || !email) return;
    setIsLoading(true);
    setError(null);
    try {
      await resendOtp(email);
      toast.success("OTP berhasil dikirim ulang. Silakan cek email Anda.");
      setCountdown(30);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Gagal mengirim ulang OTP.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp") as string;

    try {
      const response = await verifyEmail({ email, otp });
      localStorage.setItem("welcomeToast", "true");
      
      const role = response.user.role;
      const ROLE_DASHBOARD: Record<string, string> = {
        ADMIN: "/admin/dashboard",
        COMMITTEE: "/committee/dashboard",
        PARTICIPANT: "/dashboard",
      };
      const target = ROLE_DASHBOARD[role] ?? "/dashboard";
      
      // Menggunakan full reload karena Hostinger memotong header 'Vary: RSC'
      window.location.href = target;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal memverifikasi OTP. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center mb-4">
          <h1 className="text-2xl font-extrabold text-[#2C2621]">Verifikasi Email</h1>
          <p className="text-sm text-balance text-[#5C7C99]">
            Kami telah mengirimkan 6 digit kode OTP ke email Anda.
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md text-center">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email" className="text-[#2C2621] font-semibold">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            readOnly // Sengaja di-lock sesuai permintaan agar tidak diganti
            className="bg-gray-100 border-[#5C7C99]/30 text-gray-500 cursor-not-allowed select-none pointer-events-none focus:ring-0"
            tabIndex={-1}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="otp" className="text-[#2C2621] font-semibold">Kode OTP</FieldLabel>
          <Input
            id="otp"
            name="otp"
            type="text"
            maxLength={6}
            placeholder="123456"
            required
            className="text-center tracking-[0.5em] font-bold text-lg bg-white border-[#5C7C99]/30 focus:border-[#5C7C99] focus:ring-[#5C7C99]"
          />
        </Field>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Belum menerima OTP? </span>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={countdown > 0 || isLoading}
            className={cn(
              "font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              countdown > 0 
                ? "text-muted-foreground cursor-not-allowed" 
                : "text-primary hover:text-primary/80 underline underline-offset-4"
            )}
          >
            {countdown > 0 ? `Kirim ulang (${countdown}s)` : "Kirim ulang OTP"}
          </button>
        </div>

        <Field className="mt-2">
          <Button type="submit" className="w-full bg-[#5C7C99] hover:bg-[#49657E] text-white rounded-md font-semibold" disabled={isLoading}>
            {isLoading ? "Memverifikasi..." : "Verifikasi & Masuk"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}