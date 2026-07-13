"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";

const NAV_LINKS = [
  { name: "Beranda", href: "#hero" },
  { name: "Tentang", href: "#about" },
  { name: "Cabang Lomba", href: "#competitions" },
  { name: "Timeline", href: "#timeline" },
  { name: "Kontak", href: "#footer" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#2C2621]/80 backdrop-blur-md shadow-sm border-b border-white/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logos */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo/Logo himafi.png" 
              alt="HIMAFI Logo" 
              width={36} 
              height={36}
              priority
              className="w-8 h-8 md:w-9 md:h-9 object-contain"
            />
            <Image 
              src="/logo/logo_pf_3d.png" 
              alt="Universitas Andalas Logo" 
              width={36} 
              height={36}
              priority
              className="w-8 h-8 md:w-9 md:h-9 object-contain"
            />
            <Image 
              src="/logo/logo_pf_tahun_25.png" 
              alt="Physics Festival Logo" 
              width={36} 
              height={36}
              priority
              className="w-8 h-8 md:w-9 md:h-9 object-contain rounded-full border border-white/20"
            />
          </div>
          <span className="hidden md:block text-xl font-bold text-white tracking-tight group-hover:text-[#EABF6A] transition-colors duration-300 border-l border-white/20 pl-3">
            Physics Festival<span className="text-[#5C7C99]">XXV</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-white/90 hover:text-[#EABF6A] transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="outline"
              className="rounded-full border border-slate-300 bg-white px-6 py-2 text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#5C7C99] hover:bg-slate-50 hover:text-[#5C7C99]"
            >
              Masuk
            </Button>
          </Link>

          <Link href="/register">
            <Button className="rounded-full bg-[#5C7C99] px-6 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#49657E] hover:shadow-xl">
              Daftar Sekarang
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white hover:text-[#EABF6A] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#2C2621] border-b border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-white/90 hover:text-[#EABF6A] py-2 border-b border-white/5"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-white text-[#5C7C99] border border-[#5C7C99] hover:bg-gray-50 rounded-full">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#5C7C99] hover:bg-[#49657E] text-white rounded-full border-none">
                    Daftar Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
