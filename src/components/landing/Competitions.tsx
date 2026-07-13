"use client";

import { motion, Variants } from "framer-motion";
import { FlipCard } from "./FlipCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useEffect, useState, useRef } from "react";
import { getActiveCompetitions } from "@/src/services/competition.service";
import { Competition, CompetitionParticipantType } from "@/src/types/competition.types";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
};

const FALLBACK_COMPETITIONS: Competition[] = [
  {
    id: "galaxy-voyage",
    name: "Galaxy Voyage",
    participantType: CompetitionParticipantType.INDIVIDUAL,
    minTeamMembers: 1,
    maxTeamMembers: 1,
    description: "Uji kemampuan fisika dasar hingga menengah Anda dalam Olimpiade Fisika tingkat nasional. Jelajahi tantangan intelektual melampaui batas.",
    requiresSubmission: false,
    isOpen: false,
    isActive: true,
    activeWave: null,
    waves: [{ id: "w1", name: "Gelombang 1", price: 55000, startDate: "", endDate: "" }, { id: "w2", name: "Gelombang 2", price: 65000, startDate: "", endDate: "" }],
    whatsappGroupUrl: null,
  },
  {
    id: "orbit-of-champions",
    name: "Orbit of Champions",
    participantType: CompetitionParticipantType.INDIVIDUAL,
    minTeamMembers: 1,
    maxTeamMembers: 1,
    description: "Beradu wawasan dan ketangkasan dalam menjawab soal secara cepat dan tepat. Siapkah Anda menjadi satu-satunya yang bertahan di orbit?",
    requiresSubmission: false,
    isOpen: false,
    isActive: true,
    activeWave: null,
    waves: [{ id: "w1", name: "Gelombang 1", price: 30000, startDate: "", endDate: "" }, { id: "w2", name: "Gelombang 2", price: 35000, startDate: "", endDate: "" }],
    whatsappGroupUrl: null,
  },
  {
    id: "cosmic-brainstorm",
    name: "Cosmic Brainstorm Battle",
    participantType: CompetitionParticipantType.TEAM,
    minTeamMembers: 3,
    maxTeamMembers: 3,
    description: "Kompetisi adu cepat tangkas tim yang menguji pengetahuan seputar fisika dan aplikasinya dalam kehidupan kosmik dan bumi.",
    requiresSubmission: false,
    isOpen: false,
    isActive: true,
    activeWave: null,
    waves: [{ id: "w1", name: "Gelombang 1", price: 150000, startDate: "", endDate: "" }, { id: "w2", name: "Gelombang 2", price: 160000, startDate: "", endDate: "" }],
    whatsappGroupUrl: null,
  },
  {
    id: "galaxy-research",
    name: "Galaxy Research Odyssey",
    participantType: CompetitionParticipantType.TEAM,
    minTeamMembers: 2,
    maxTeamMembers: 3,
    description: "Kompetisi karya tulis ilmiah untuk mendorong inovasi hijau dan solusi teknologi ramah lingkungan demi masa depan berkelanjutan.",
    requiresSubmission: true,
    isOpen: false,
    isActive: true,
    activeWave: null,
    waves: [{ id: "w1", name: "Gelombang 1", price: 150000, startDate: "", endDate: "" }],
    whatsappGroupUrl: null,
  },
  {
    id: "vortex",
    name: "Vortex (Digital Poster)",
    participantType: CompetitionParticipantType.INDIVIDUAL,
    minTeamMembers: 1,
    maxTeamMembers: 1,
    description: "Tuangkan ide kreatif Anda melalui desain poster digital yang memadukan sains, teknologi ruang angkasa, dan isu lingkungan bumi.",
    requiresSubmission: true,
    isOpen: false,
    isActive: true,
    activeWave: null,
    waves: [{ id: "w1", name: "Gelombang 1", price: 50000, startDate: "", endDate: "" }, { id: "w2", name: "Gelombang 2", price: 60000, startDate: "", endDate: "" }],
    whatsappGroupUrl: null,
  },
  {
    id: "nebula-visual",
    name: "Nebula Visual Quest",
    participantType: CompetitionParticipantType.TEAM,
    minTeamMembers: 2,
    maxTeamMembers: 2,
    description: "Eksplorasi pembuatan video kreatif berdurasi pendek yang mengedukasi masyarakat tentang pentingnya fisika dalam kehidupan kita.",
    requiresSubmission: true,
    isOpen: false,
    isActive: true,
    activeWave: null,
    waves: [{ id: "w1", name: "Gelombang 1", price: 50000, startDate: "", endDate: "" }, { id: "w2", name: "Gelombang 2", price: 60000, startDate: "", endDate: "" }],
    whatsappGroupUrl: null,
  },
];

export function Competitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const data = await getActiveCompetitions();
        if (data && data.length > 0) {
          setCompetitions(data);
        } else {
          setCompetitions(FALLBACK_COMPETITIONS);
        }
      } catch (error) {
        console.error("Failed to fetch competitions:", error);
        setCompetitions(FALLBACK_COMPETITIONS);
      } finally {
        setLoading(false);
      }
    }
    fetchCompetitions();
  }, []);

  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Inisialisasi posisi scroll di tengah (replika 3)
  useEffect(() => {
    if (competitions.length > 0 && carouselRef.current) {
      let isInitialized = false;
      const el = carouselRef.current;
      
      const centerCarousel = () => {
        const scrollWidth = el.scrollWidth;
        // ScrollWidth bisa jadi 0 atau sangat kecil jika belum di-render sempurna
        if (scrollWidth > window.innerWidth && !isInitialized) {
          const segmentWidth = scrollWidth / 5;
          el.style.scrollSnapType = 'none';
          el.scrollLeft = segmentWidth * 2;
          void el.offsetWidth; // Paksa reflow
          el.style.scrollSnapType = 'x mandatory';
          
          if (el.scrollLeft > 0) {
            isInitialized = true;
          }
        }
      };

      // Coba langsung jalankan
      centerCarousel();

      // Gunakan ResizeObserver untuk menangkap momen ketika layout/image selesai dirender
      const observer = new ResizeObserver(() => {
        if (!isInitialized) {
          centerCarousel();
        }
      });
      observer.observe(el);

      return () => observer.disconnect();
    }
  }, [competitions]);

  const handleScroll = () => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      if (!carouselRef.current || competitions.length === 0) return;
      const { scrollLeft, scrollWidth } = carouselRef.current;
      
      const segmentWidth = scrollWidth / 5;
      
      // Jika scroll masuk ke replika 1
      if (scrollLeft < segmentWidth) {
        carouselRef.current.style.scrollSnapType = 'none';
        carouselRef.current.scrollLeft += segmentWidth * 2;
        void carouselRef.current.offsetWidth;
        carouselRef.current.style.scrollSnapType = 'x mandatory';
      } 
      // Jika scroll masuk ke replika 5
      else if (scrollLeft >= segmentWidth * 4 - 10) {
        carouselRef.current.style.scrollSnapType = 'none';
        carouselRef.current.scrollLeft -= segmentWidth * 2;
        void carouselRef.current.offsetWidth;
        carouselRef.current.style.scrollSnapType = 'x mandatory';
      }
    }, 250);
  };

  const scrollLeftAction = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRightAction = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  // Buat 5 replika untuk infinite loop (tanpa putus/rewind)
  const infiniteCompetitions = [
    ...competitions,
    ...competitions,
    ...competitions,
    ...competitions,
    ...competitions,
  ];

  return (
    <section id="competitions" className="relative py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-24"
        >
          <span className="text-[#5C7C99] font-semibold tracking-widest uppercase text-sm mb-4 block">
            Cabang Lomba
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#2C2621] leading-tight mb-6">
            Eksplorasi Cabang Lomba
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            Pilih medan gravitasi Anda. Dari olimpiade murni hingga kreativitas digital, temukan tempat di mana bintang Anda akan bersinar.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-[#5C7C99]/20 border-t-[#5C7C99] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Mobile Carousel View (visible on < md) */}
            <div className="md:hidden relative w-full px-2">
              <div 
                ref={carouselRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-8 pt-4 px-4 -mx-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {infiniteCompetitions.map((competition, idx) => (
                  <div key={`${competition.id}-${idx}`} className="w-[85vw] sm:w-[320px] max-w-[340px] snap-center shrink-0 mx-auto flex justify-center">
                    <FlipCard competition={competition} />
                  </div>
                ))}
              </div>
              
              {/* Carousel Navigation Buttons */}
              <div className="flex justify-center items-center gap-4 mt-4">
                <button 
                  onClick={scrollLeftAction}
                  className="w-10 h-10 rounded-full bg-[#5C7C99]/10 text-[#5C7C99] flex items-center justify-center hover:bg-[#5C7C99] hover:text-white transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={scrollRightAction}
                  className="w-10 h-10 rounded-full bg-[#5C7C99]/10 text-[#5C7C99] flex items-center justify-center hover:bg-[#5C7C99] hover:text-white transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Desktop Grid View (visible on >= md) */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[400px]"
            >
              {competitions.length > 0 ? (
                competitions.map((competition) => (
                  <motion.div key={competition.id} variants={cardVariants}>
                    <FlipCard competition={competition} />
                  </motion.div>
                ))
              ) : null}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
