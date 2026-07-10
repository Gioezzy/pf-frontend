"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export function Downloads() {
  return (
    <section
      id="downloads"
      className="relative py-24 md:py-32 bg-white pb-32 md:pb-48"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-[#F7F5F0] to-white p-8 shadow-lg md:p-12 max-w-4xl mx-auto">
          {/* Decorative element */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#EABF6A]/10 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 text-center"
          >
            <span className="mb-4 block text-sm font-semibold uppercase tracking-widest text-[#5C7C99]">
              Pusat Unduhan
            </span>

            <h2 className="mb-6 text-3xl font-extrabold leading-tight text-[#2C2621] md:text-4xl">
              Unduh Berkas Penting
            </h2>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-700">
              Persiapkan diri dan tim Anda dengan baik. Unduh format surat
              keorisinalitasan karya dan template kartu peserta yang akan
              digunakan selama kegiatan berlangsung.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="/docs/surat-keorisinalitasan.docx" download>
                <Button className="w-full rounded-full border-none bg-[#5C7C99] px-8 py-6 text-base font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#49657E] sm:w-auto">
                  <Download className="mr-2 h-5 w-5" />
                  Surat Keorisinalitasan
                </Button>
              </a>

              <a href="/docs/template-kartu-peserta.docx" download>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-slate-200/60 bg-white px-8 py-6 text-base font-medium text-[#2C2621] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#F7F5F0] sm:w-auto"
                >
                  <Download className="mr-2 h-5 w-5 text-[#5C7C99]" />
                  Template Kartu Peserta
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}