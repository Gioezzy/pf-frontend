"use client";

import { motion, Variants } from "framer-motion";
import { CalendarDays } from "lucide-react";

const TIMELINE_EVENTS = [
  {
    id: 1,
    title: "Pendaftaran Gelombang 1",
    date: "1 - 30 Agustus 2026",
    description: "Pembukaan pendaftaran awal (Early Bird) untuk semua cabang lomba dengan biaya spesial.",
  },
  {
    id: 2,
    title: "Pendaftaran Gelombang 2",
    date: "1 - 30 September 2026",
    description: "Pendaftaran gelombang kedua (Normal) dibuka bagi peserta yang belum sempat mendaftar pada gelombang pertama.",
  },
  {
    id: 3,
    title: "Technical Meeting",
    date: "14 Oktober 2026",
    description: "Pertemuan teknis daring untuk membahas peraturan perlombaan, sistem penilaian, dan tata tertib peserta.",
  },
  {
    id: 4,
    title: "Penyisihan",
    date: "24 Oktober 2026",
    description: "Babak penyisihan secara serentak untuk menentukan peserta yang berhak melaju ke babak final.",
  },
  {
    id: 5,
    title: "Final & Penutupan",
    date: "25 Oktober 2026",
    description: "Babak final untuk cabang tertentu, pengumuman juara, serta upacara penutupan Physics Festival XXV.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
};

export function Timeline() {
  return (
    <section id="timeline" className="py-24 md:py-32 bg-[#F7F5F0]">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-24"
        >
          <span className="text-[#5C7C99] font-semibold tracking-widest uppercase text-sm mb-4 block">
            Jadwal Rangkaian
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#2C2621] leading-tight mb-6">
            Timeline Acara
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            Catat tanggal-tanggal penting ini dan pastikan Anda tidak melewatkan kesempatan emas untuk berpartisipasi dalam Cosmic Odyssey.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto relative"
        >
          {/* Vertical Line */}
          <div className="absolute left-[23px] md:left-1/2 md:-ml-[1px] top-4 bottom-4 w-[2px] bg-[#5C7C99]/30" />

          <div className="space-y-12">
            {TIMELINE_EVENTS.map((event, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  className={`relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 mt-1 w-12 h-12 bg-white rounded-full border-4 border-[#F7F5F0] flex items-center justify-center shadow-md z-10">
                    <div className="w-3 h-3 bg-[#5C7C99] rounded-full" />
                  </div>

                  {/* Content Box */}
                  <div className={`w-full pl-16 md:pl-0 md:w-1/2 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/60 hover:shadow-lg transition-shadow duration-300">
                      <div className={`flex items-center gap-2 mb-3 text-[#5C7C99] ${isEven ? 'md:justify-end' : ''}`}>
                        <CalendarDays size={18} />
                        <span className="font-semibold text-sm tracking-wide">{event.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#2C2621] mb-2">{event.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
