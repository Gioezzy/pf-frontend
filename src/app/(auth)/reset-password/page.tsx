"use client"

import { ResetPasswordForm } from "@/src/components/auth/reset-password-form"
import Image from "next/image"
import { Suspense } from "react"

export default function ResetPasswordPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-[#FAF8F5]">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-bold text-xl text-[#2C2621] hover:opacity-80 transition-opacity">
            <div className="flex size-8 items-center justify-center rounded-md bg-[#5C7C99] text-white shadow-sm">
              <span className="font-extrabold text-sm">PF</span>
            </div>
            Physics Festival
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Suspense fallback={<div className="text-center py-4 text-sm text-[#2C2621]">Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-gradient-to-br from-[#2C2621] to-[#1a1613] lg:flex lg:flex-col lg:items-center lg:justify-center p-12 border-l border-white/5">

        <div className="relative w-full max-w-md aspect-square">
          <Image
            src="/mascot/velune.png"
            alt="Velune Mascot"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain drop-shadow-[0_0_30px_rgba(234,191,106,0.15)] animate-[float_6s_ease-in-out_infinite]"
            priority
          />
        </div>
        <div className="mt-8 text-center text-[#F7F5F0] relative z-10 max-w-md">
          <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Cosmic Odyssey</h2>
          <p className="text-base text-slate-300 leading-relaxed">
            Menjelajahi batas ruang dan waktu melalui kompetisi sains bergengsi se-Indonesia.
          </p>
        </div>
      </div>
    </div>
  )
}
