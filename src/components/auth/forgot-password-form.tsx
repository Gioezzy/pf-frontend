"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

import { forgotPassword } from "../../services/auth.service";
import { getApiErrorMessage } from "../../lib/axios";
import { toast } from "sonner";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      await forgotPassword({ email });
      toast.success("Kode OTP untuk reset password telah dikirim ke email Anda.");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Gagal mengirim permintaan reset password."));
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
          <h1 className="text-2xl font-extrabold text-[#2C2621]">Lupa Password</h1>
          <p className="text-sm text-balance text-[#5C7C99]">
            Masukkan email Anda dan kami akan mengirimkan OTP untuk mereset password.
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
            placeholder="m@example.com"
            autoComplete="email"
            required
            className="bg-white border-[#5C7C99]/30 focus:border-[#5C7C99] focus:ring-[#5C7C99]"
          />
        </Field>

        <Field className="mt-2">
          <Button type="submit" className="w-full bg-[#5C7C99] hover:bg-[#49657E] text-white rounded-md font-semibold" disabled={isLoading}>
            {isLoading ? "Mengirim..." : "Kirim OTP Reset"}
          </Button>
        </Field>

        <div className="mt-2 text-center text-sm text-[#2C2621]">
          Ingat password Anda?{" "}
          <Link
            href="/login"
            className="text-[#5C7C99] font-bold hover:underline"
          >
            Masuk kembali
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}
