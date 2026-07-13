"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ArrowRight, Globe } from "lucide-react";

import type { Competition } from "@/src/types/competition.types";

interface FlipCardProps {
  competition: Competition;
}

export function FlipCard({ competition }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Menggabungkan interaksi hover (desktop) dan klik (mobile)
  const isCardFlipped = isHovered || isFlipped;

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);

    const suffix = competition.participantType === "INDIVIDUAL" ? " / siswa" : " / tim";
    return `${formatted}${suffix}`;
  };

  const getParticipantTypeDisplay = () => {
    if (competition.participantType === "INDIVIDUAL") {
      return "Individu";
    }
    if (competition.minTeamMembers === competition.maxTeamMembers) {
      return `Tim (${competition.minTeamMembers || 0} org)`;
    }
    return `Tim (${competition.minTeamMembers || 0}-${competition.maxTeamMembers || 0} org)`;
  };

  const getLocationInfo = () => {
    const name = (competition.name || "").toLowerCase();
    if (name.includes("vortex") || name.includes("nebula") || name.includes("poster") || name.includes("video")) {
      return { isOnline: true, text: "Daring / Online" };
    }
    if (name.includes("galaxy voyage") || name.includes("olimpiade")) {
      return { isOnline: false, text: "Auditorium & Convention Hall Universitas Andalas" };
    }
    if (name.includes("research") || name.includes("lkti") || name.includes("karya tulis")) {
      return { isOnline: false, text: "Convention Hall Universitas Andalas" };
    }
    if (name.includes("orbit") || name.includes("brainstorm") || name.includes("cerdas cermat") || name.includes("ranking")) {
      return { isOnline: false, text: "Auditorium Universitas Andalas" };
    }
    return { isOnline: false, text: "Universitas Andalas" };
  };

  const getLogoForCompetition = () => {
    const name = (competition.name || "").toLowerCase();
    if (name.includes("galaxy voyage") || name.includes("olimpiade")) return "/logo/olimpiade.png";
    if (name.includes("orbit") || name.includes("ranking")) return "/logo/ranking_1.png";
    if (name.includes("brainstorm") || name.includes("cerdas cermat")) return "/logo/cerdas_cermat.png";
    if (name.includes("research") || name.includes("lkti")) return "/logo/lkti.png";
    if (name.includes("vortex") || name.includes("poster")) return "/logo/digital_poster.png";
    if (name.includes("nebula") || name.includes("video")) return "/logo/video_kreatif.png";
    return null;
  };

  const location = getLocationInfo();
  const logo = getLogoForCompetition();

  return (
    <div
      className="relative w-full max-w-[340px] mx-auto h-[450px] [perspective:1000px] cursor-pointer"
      onPointerEnter={(e) => {
        // Hanya aktifkan hover jika menggunakan mouse desktop
        if (e.pointerType === "mouse") setIsHovered(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setIsHovered(false);
      }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d] transition-transform duration-700 ease-out"
        animate={{ rotateY: isCardFlipped ? 180 : 0 }}
      >
        {/* Front Face (Earth / Warm Cream) */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-[#FAF8F5] rounded-2xl border border-slate-200/60 shadow-md p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden group">
          
          {/* Logo Kompetisi (Utama) */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-2 group-hover:scale-105 transition-transform duration-500 ease-out z-10">
            {logo ? (
              <Image 
                src={logo} 
                alt={`${competition.name} Logo`} 
                fill
                sizes="(max-width: 768px) 112px, 128px"
                className="object-contain drop-shadow-[0_8px_16px_rgba(44,38,33,0.15)]"
              />
            ) : (
              <Image 
                src="/mascot/velune.png" 
                alt="Velune Mascot" 
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain drop-shadow-[0_4px_8px_rgba(44,38,33,0.15)]"
                priority
              />
            )}
          </div>

          {/* Maskot Kecil di Pojok Kanan Bawah */}
          {logo && (
            <div className="absolute bottom-4 right-4 w-12 h-12 opacity-80 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 z-10 pointer-events-none">
              <Image 
                src="/mascot/velune.png" 
                alt="Velune Mascot" 
                fill
                sizes="48px"
                className="object-contain drop-shadow-sm"
                priority
              />
            </div>
          )}

          {/* PERBAIKAN 2: Menambahkan break-words dan px-2 agar teks yang panjang terpotong rapi ke bawah */}
          <h3 className="text-2xl font-bold text-[#2C2621] tracking-tight leading-tight z-10 break-words px-2 w-full">
            {competition.name}
          </h3>
          <span className="text-sm font-semibold tracking-widest uppercase text-[#5C7C99] bg-[#5C7C99]/10 px-3 py-1 rounded-full shrink-0">
            {getParticipantTypeDisplay()}
          </span>
          
          <div className="mt-auto pt-6 border-t border-slate-200/60 w-full flex items-center justify-center gap-2 text-[#5C7C99] group">
            <span className="text-sm font-medium">Lihat Detail</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Back Face (Space / Dark Espresso) */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-[#2C2621] to-[#1a1613] rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col border border-white/5">
          {/* PERBAIKAN 3: Memastikan judul di belakang juga menggunakan break-words */}
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 break-words">
            {competition.name}
          </h3>
          
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 flex-grow overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {competition.description || "Jelajahi tantangan intelektual melampaui batas dalam kompetisi ini."}
          </p>

          <div className="space-y-3">
            {/* Waves Fee */}
            <div className="flex flex-col gap-2 bg-white/5 rounded-lg p-3 border border-white/10">
              {competition.waves && competition.waves.length > 0 ? (
                competition.waves.map((wave) => (
                  <div key={wave.id || Math.random()} className="flex justify-between items-center gap-2">
                    <span className="text-xs text-[#5C7C99] uppercase tracking-widest font-semibold shrink-0">
                      {wave.name || "Gelombang"}
                    </span>
                    <span className="text-sm font-bold text-[#EABF6A] text-right">
                      {formatPrice(wave.price || 0)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs text-[#5C7C99] uppercase tracking-widest font-semibold shrink-0">
                    Biaya
                  </span>
                  <span className="text-sm font-bold text-[#EABF6A] text-right">
                    Belum Ada Gelombang
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 bg-white/5 rounded-lg p-3 border border-white/10">
              {location.isOnline ? (
                <Globe size={16} className="text-[#5C7C99] mt-0.5 shrink-0" />
              ) : (
                <MapPin size={16} className="text-[#5C7C99] mt-0.5 shrink-0" />
              )}
              <span className="text-sm text-slate-200 leading-snug">
                {location.text}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}