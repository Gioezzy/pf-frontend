"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

import { resetPassword } from "../../services/auth.service";
import { getApiErrorMessage } from "../../lib/axios";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp") as string;
    const newPassword = formData.get("newPassword") as string;

    try {
      await resetPassword({ email, otp, newPassword });
      toast.success("Password berhasil direset! Silakan masuk dengan password baru Anda.");
      router.push("/login");
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Gagal mereset password."));
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
          <h1 className="text-2xl font-extrabold text-[#2C2621]">Reset Password</h1>
          <p className="text-sm text-balance text-[#5C7C99]">
            Masukkan kode OTP yang dikirim ke email Anda beserta password baru.
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
            readOnly
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

        <Field>
          <FieldLabel htmlFor="newPassword" className="text-[#2C2621] font-semibold">Password Baru</FieldLabel>
          <div className="relative">
            <Input
              id="newPassword"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="pr-10 bg-white border-[#5C7C99]/30 focus:border-[#5C7C99] focus:ring-[#5C7C99]"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-0 top-0 h-full w-10 rounded-l-none hover:bg-transparent text-[#5C7C99]"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </Field>

        <Field className="mt-2">
          <Button type="submit" className="w-full bg-[#5C7C99] hover:bg-[#49657E] text-white rounded-md font-semibold" disabled={isLoading}>
            {isLoading ? "Memproses..." : "Reset Password"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
