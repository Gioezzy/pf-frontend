"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { FaInstagram, FaYoutube, FaTiktok  } from 'react-icons/fa';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-[#2C2621] pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & About */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="flex items-center gap-2">
                <Image 
                  src="/logo/Logo himafi.png" 
                  alt="HIMAFI Logo" 
                  width={36} 
                  height={36}
                  className="w-8 h-8 md:w-9 md:h-9 object-contain"
                />
                <Image 
                  src="/logo/logo_pf_3d.png" 
                  alt="Universitas Andalas Logo" 
                  width={36} 
                  height={36}
                  className="w-8 h-8 md:w-9 md:h-9 object-contain"
                />
                <Image 
                  src="/logo/logo_pf_tahun_25.png" 
                  alt="Physics Festival Logo" 
                  width={36} 
                  height={36}
                  className="w-8 h-8 md:w-9 md:h-9 object-contain rounded-full border border-white/20"
                />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight group-hover:text-[#EABF6A] transition-colors duration-300 border-l border-white/20 pl-3">
                Physics Festival<span className="text-[#5C7C99]">XXV</span>
              </span>
            </Link>
            <p className="text-slate-300 leading-relaxed max-w-md mb-6 text-sm">
              Physics Festival XXV "Cosmic Odyssey" diselenggarakan oleh HIMAFI, Departemen Fisika, Fakultas Matematika dan Ilmu Pengetahuan Alam, Universitas Andalas. Menjelajahi batas ruang dan waktu melalui kompetisi sains bergengsi.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/physicsfestivalunand"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#5C7C99] hover:bg-[#5C7C99] hover:text-white"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="https://www.tiktok.com/@physicsfestivalunand25?_r=1&_t=ZS-97tdFRNmE0A"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#5C7C99] hover:bg-[#5C7C99] hover:text-white"
              >
                <FaTiktok size={20} />
              </a>

              <a
                href="https://youtube.com/@physicsfestivalxxv?si=9z5MWY8VpDSi9-As"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#5C7C99] hover:bg-[#5C7C99] hover:text-white"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">Tautan Cepat</h4>
            <ul className="space-y-4">
              {['Beranda', 'Tentang', 'Cabang Lomba', 'Timeline', 'Unduh Berkas'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                    className="text-slate-300 hover:text-[#EABF6A] transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  href="/register"
                  className="text-[#EABF6A] hover:text-white transition-colors text-sm font-semibold"
                >
                  Daftar Sekarang
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Location Info */}
          <div>
            <h4 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <Phone size={18} className="text-[#5C7C99] shrink-0 mt-0.5" />
                <div>
                  <p>Madani Ulfa: <a href="https://wa.me/6282172738476" className="hover:text-white transition-colors">0821-7273-8476</a></p>
                  <p>Agiel: <a href="https://wa.me/6289502751930" className="hover:text-white transition-colors">0895-0275-1930</a></p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <MapPin size={18} className="text-[#5C7C99] shrink-0 mt-0.5" />
                <p>
                  Auditorium & Convention Hall<br />
                  Universitas Andalas<br />
                  Padang, Sumatera Barat
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Embedded Google Maps dengan Fallback UI jika diblokir AdBlocker */}
        <div className="mb-12 w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-xl relative z-10 bg-[#1a1613] flex items-center justify-center">
          
          {/* Fallback Text yang terlihat jika iframe diblokir atau gagal dimuat */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-0">
            <p className="text-slate-400 mb-2 text-sm md:text-base">Peta tidak dapat dimuat (mungkin diblokir oleh ekstensi Privasi/AdBlocker).</p>
            <a 
              href="https://maps.google.com/?q=Universitas+Andalas" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#EABF6A] underline text-sm hover:text-white transition-colors"
            >
              Buka langsung di Google Maps
            </a>
          </div>

          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15957.251390497576!2d100.44686255169624!3d-0.9122501007817478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b7b30db434df%3A0xc3e655cf31c360b9!2sUniversitas%20Andalas!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Peta Lokasi Universitas Andalas"
            className="w-full h-full relative z-10"
          ></iframe>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-slate-400 text-xs">
            &copy; {currentYear}{" "}
            <a 
              href="https://github.com/erlaaaand" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-slate-300 hover:text-white hover:underline transition-colors duration-200"
            >
              Erland Agsya Agustian
            </a>
            . All rights reserved.
          </p>
          <p className="text-slate-400 text-xs">
            Designed & Developed for Physics Festival XXV
          </p>
        </div>
      </div>
    </footer>
  );
}
