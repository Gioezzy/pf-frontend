"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  },
};

export function Hero() {
  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#2C2621]"
    >
      
      {/* Heavy Espresso/Dark Gradient Overlay for max contrast */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#2C2621]/95 to-[#2C2621]/75" />

      {/* Abstract Cosmic SVG Orbits */}
      <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute w-[800px] h-[800px] rounded-full border border-white/5 border-dashed"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
          className="absolute w-[1200px] h-[1200px] rounded-full border border-[#5C7C99]/20"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute w-[500px] h-[500px] rounded-full border border-[#EABF6A]/20 border-dotted"
        />

        {/* Mascot Velune Floating */}
        <motion.div
          animate={{ y: [-15, 15, -15], rotate: [-2, 2, -2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-10px] bottom-[5%] md:right-[2%] md:bottom-[10%] lg:right-[10%] lg:bottom-[15%] z-20 opacity-90 pointer-events-none"
        >
          <Image 
            src="/mascot/velune.png" 
            alt="Velune Mascot" 
            priority
            width={300} 
            height={400}
            className="w-32 sm:w-40 md:w-56 lg:w-72 h-auto drop-shadow-[0_0_30px_rgba(234,191,106,0.4)]"
          />
        </motion.div>
      </div>

      <div className="container relative z-30 mx-auto px-4 md:px-8 text-center pt-24 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-[#EABF6A] text-sm font-semibold tracking-widest uppercase shadow-md">
              Physics Festival XXV
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight tracking-tight mb-6"
          >
            Cosmic <span className="text-[#EABF6A]">Odyssey</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-2xl text-white/90 font-light max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Exploring the Boundaries of Space and Time
          </motion.p>

          {/* CTAs */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link href="#competitions" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#5C7C99] hover:bg-[#49657E] text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:-translate-y-1 transition-all duration-300 border-none">
                Jelajahi Lomba
              </Button>
            </Link>
            <Link href="https://drive.google.com/drive/folders/1BGzJoy1puJccn7c0vo_2CLMumKZfPnGK" target="_blank" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent border-[#5C7C99] hover:bg-[#5C7C99]/20 text-white rounded-full px-8 py-6 text-lg font-semibold hover:-translate-y-1 transition-all duration-300">
                Unduh Guide Book
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
