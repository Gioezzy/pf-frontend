"use client";

import { motion, Variants } from "framer-motion";
import { Atom, ShieldCheck, Leaf, Target, Users, BookOpen } from "lucide-react";

const GOALS = [
  {
    id: 1,
    title: "Minat Ilmiah",
    description: "Meningkatkan ketertarikan siswa dan mahasiswa pada sains, khususnya ilmu fisika murni dan terapannya.",
    icon: Atom,
  },
  {
    id: 2,
    title: "Integritas",
    description: "Menanamkan nilai-nilai sportivitas, kejujuran, dan integritas dalam dunia akademik dan penelitian.",
    icon: ShieldCheck,
  },
  {
    id: 3,
    title: "Inovasi Hijau",
    description: "Mendorong inovasi teknologi berbasis sains yang berwawasan lingkungan untuk masa depan bumi.",
    icon: Leaf,
  },
  {
    id: 4,
    title: "Keterampilan Abad 21",
    description: "Mengembangkan kemampuan berpikir kritis, pemecahan masalah, kreativitas, dan kolaborasi.",
    icon: Target,
  },
  {
    id: 5,
    title: "Jejaring",
    description: "Membangun koneksi antara akademisi, pelajar, dan praktisi di bidang fisika secara nasional.",
    icon: Users,
  },
  {
    id: 6,
    title: "Publikasi",
    description: "Mewadahi publikasi karya tulis ilmiah dan kreativitas visual peserta ke masyarakat luas.",
    icon: BookOpen,
  },
];

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
};

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-[#F7F5F0]">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
        >
          <span className="text-[#5C7C99] font-semibold tracking-widest uppercase text-sm mb-4 block">
            Tentang Acara
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#2C2621] leading-tight mb-6">
            Menyatukan Visi Kosmik & Bumi yang Berkelanjutan
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            Physics Festival XXV adalah ajang kompetisi dan perayaan sains tahunan yang diusung oleh HIMAFI Universitas Andalas. Dengan tema <span className="font-bold text-[#2C2621]">"Cosmic Odyssey: Exploring the Boundaries of Space and Time"</span>, kami bertujuan menciptakan ruang bagi inovator muda.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {GOALS.map((goal) => {
            const Icon = goal.icon;
            return (
              <motion.div
                key={goal.id}
                variants={cardVariants}
                className="bg-white p-8 rounded-2xl shadow-md border border-slate-200/60 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-[#F7F5F0] rounded-xl flex items-center justify-center mb-6">
                  <Icon className="text-[#5C7C99]" size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#2C2621] mb-3">{goal.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {goal.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
