"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

import { useRouter } from "next/navigation";
import { login } from "../../services/auth.service";
import { getApiErrorMessage } from "../../lib/axios";

const ROLE_DASHBOARD: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  COMMITTEE: "/committee/dashboard",
  PARTICIPANT: "/dashboard",
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await login({ email, password });

      const role = response.user.role;
      const target = ROLE_DASHBOARD[role] ?? "/dashboard";

      // Menggunakan full reload karena Hostinger memotong header 'Vary: RSC' 
      // yang menyebabkan bug munculnya raw JSON payload di layar.
      window.location.href = target;
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Gagal melakukan login. Silakan coba lagi."));
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
          <h1 className="text-2xl font-extrabold text-[#2C2621]">Masuk ke Akun</h1>
          <p className="text-sm text-balance text-[#5C7C99]">
            Masukkan email dan password Anda untuk masuk.
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md text-center">
            {error}
          </div>
        )}

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email" className="text-[#2C2621] font-semibold">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
            required
            className="bg-white border-[#5C7C99]/30 focus:border-[#5C7C99] focus:ring-[#5C7C99]"
          />
        </Field>

        {/* Password */}
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password" className="text-[#2C2621] font-semibold">Password</FieldLabel>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm text-[#5C7C99] hover:underline"
            >
              Lupa password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="pr-10 bg-white border-[#5C7C99]/30 focus:border-[#5C7C99] focus:ring-[#5C7C99]"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-0 top-0 h-full w-10 rounded-l-none hover:bg-transparent text-[#5C7C99]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </Field>

        {/* Login Button */}
        <Field className="mt-2">
          <Button type="submit" className="w-full bg-[#5C7C99] hover:bg-[#49657E] text-white rounded-md font-semibold" disabled={isLoading}>
            {isLoading ? "Masuk..." : "Masuk"}
          </Button>
        </Field>

        {/* Redirect to Register */}
        <div className="mt-2 text-center text-sm text-[#2C2621]">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-[#5C7C99] font-bold hover:underline"
          >
            Daftar di sini
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}
