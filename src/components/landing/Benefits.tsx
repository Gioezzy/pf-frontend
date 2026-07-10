"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, FileText, Gift, Award, Star } from "lucide-react";

const benefits = [
  {
    id: 1,
    title: "Tabanas (Uang Pembinaan)",
    description: "Hadiah berupa tabungan nasional bagi para juara di setiap cabang perlombaan.",
    icon: Trophy,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    id: 2,
    title: "Trofi Kejuaraan",
    description: "Trofi eksklusif untuk para pemenang (Juara 1, 2, dan 3) sebagai tanda prestasi.",
    icon: Award,
    color: "text-[#5C7C99]",
    bg: "bg-[#5C7C99]/10",
  },
  {
    id: 3,
    title: "Sertifikat Penghargaan",
    description: "Sertifikat resmi yang diberikan kepada para pemenang perlombaan.",
    icon: FileText,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: 4,
    title: "Honorable Mention",
    description: "Penghargaan apresiasi khusus bagi tim finalis lomba Karya Tulis Ilmiah (LKTI).",
    icon: Star,
    color: "text-[#EABF6A]",
    bg: "bg-[#EABF6A]/10",
  }
];

export function Benefits() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrameId: number;
    let scrollAmount = 0;

    const autoScroll = () => {
      scrollAmount += 0.5;
      if (scrollAmount >= el.scrollWidth / 2) {
        scrollAmount = 0;
        el.scrollTo({ left: scrollAmount, behavior: "instant" });
      } else {
        el.scrollTo({ left: scrollAmount, behavior: "instant" });
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section className="relative py-20 bg-[#FAF8F5] overflow-hidden border-y border-slate-200">
      <div className="container mx-auto px-4 md:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-[#5C7C99] font-semibold tracking-widest uppercase text-sm mb-4 block">
            Apresiasi
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#2C2621]">
            Hadiah & Benefit
          </h2>
        </motion.div>
      </div>

      <div className="relative w-full overflow-hidden flex select-none">
        {/* We double the list to create an infinite scroll effect */}
        <div ref={scrollRef} className="flex gap-6 overflow-hidden w-max pl-4 md:pl-8">
          {[...benefits, ...benefits].map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={`${benefit.id}-${index}`}
                className="w-[280px] shrink-0 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${benefit.bg}`}>
                  <Icon className={`w-6 h-6 ${benefit.color}`} />
                </div>
                <h3 className="text-lg font-bold text-[#2C2621] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Gradient fades for edge smoothness */}
        <div className="absolute top-0 bottom-0 left-0 w-12 md:w-32 bg-gradient-to-r from-[#FAF8F5] to-transparent pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 md:w-32 bg-gradient-to-l from-[#FAF8F5] to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
