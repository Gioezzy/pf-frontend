"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { InstitutionCombobox } from "../ui/institution-combobox";
import { register } from "../../services/auth.service";
import { isAxiosError } from "axios";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [institution, setInstitution] = useState("");
  const [npsn, setNpsn] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      institution,
      npsn: npsn || undefined,
      password: formData.get("password") as string,
    };

    try {
      await register(payload);
      router.push(`/verify?email=${encodeURIComponent(payload.email)}`);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registrasi gagal. Silakan coba lagi.");
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
          <h1 className="text-2xl font-extrabold text-[#2C2621]">Daftar Akun Baru</h1>
          <p className="text-sm text-balance text-[#5C7C99]">
            Lengkapi data diri Anda untuk memulai perjalanan kosmik.
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md text-center">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="fullName" className="text-[#2C2621] font-semibold">Nama Lengkap</FieldLabel>
          <Input id="fullName" name="fullName" placeholder="Nama Lengkap" required className="bg-white border-[#5C7C99]/30 focus:border-[#5C7C99] focus:ring-[#5C7C99]" />
        </Field>

        <Field>
          <FieldLabel htmlFor="email" className="text-[#2C2621] font-semibold">Email</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="Email" required className="bg-white border-[#5C7C99]/30 focus:border-[#5C7C99] focus:ring-[#5C7C99]" />
        </Field>

        <Field>
          <FieldLabel htmlFor="phoneNumber" className="text-[#2C2621] font-semibold">Nomor WhatsApp</FieldLabel>
          <Input id="phoneNumber" name="phoneNumber" placeholder="08123456789" required className="bg-white border-[#5C7C99]/30 focus:border-[#5C7C99] focus:ring-[#5C7C99]" />
        </Field>

        <Field>
          <FieldLabel htmlFor="institution" className="text-[#2C2621] font-semibold">Asal Sekolah / Instansi</FieldLabel>
          <InstitutionCombobox
            id="institution"
            name="institution"
            value={institution}
            onChange={setInstitution}
            onNpsnChange={setNpsn}
            required
          />
        </Field>



        <Field>
          <FieldLabel htmlFor="password" className="text-[#2C2621] font-semibold">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
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
            {isLoading ? "Mendaftar..." : "Daftar Sekarang"}
          </Button>
        </Field>

        <div className="text-center text-sm text-[#2C2621] mt-2">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-[#5C7C99] font-bold hover:underline">
            Masuk di sini
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}