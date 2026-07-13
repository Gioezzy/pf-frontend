"use client";

import { useState, useRef, useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Input } from "./input";
import { cn } from "@/src/lib/utils";

interface InstitutionComboboxProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onNpsnChange?: (npsn: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

interface School {
  id: string;
  npsn?: string;
  nama: string;
  kabupaten_kota: string;
  provinsi: string;
}

export function InstitutionCombobox({
  id,
  name,
  value,
  onChange,
  onNpsnChange,
  placeholder = "Ketik nama sekolah atau NPSN (min. 3 karakter)...",
  required,
  className,
}: InstitutionComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const [debouncedQuery, setDebouncedQuery] = useState(value || "");
  
  const [results, setResults] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external value changes
  useEffect(() => {
    if (value !== query) {
      setQuery(value);
    }
  }, [value]);

  // Handle Debounce (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch API when debouncedQuery changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    const fetchSchools = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/sekolah?q=${encodeURIComponent(debouncedQuery)}`
        );
        const data = await res.json();
        // Ekstrak data berdasarkan format { success: true, data: [...] }
        if (data && data.success && Array.isArray(data.data)) {
          setResults(data.data);
        } else if (Array.isArray(data)) {
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data sekolah:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, [debouncedQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(schoolName: string, npsn?: string) {
    setQuery(schoolName);
    onChange(schoolName);
    if (onNpsnChange && npsn) {
      onNpsnChange(npsn);
    }
    setOpen(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    if (onNpsnChange) {
      onNpsnChange("");
    }
    setOpen(true);
  }

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="relative">
        <input type="hidden" name={name} value={query || ""} />
        <div className="relative">
          <Input
            id={id}
            type="text"
            autoComplete="off"
            value={query || ""}
            onChange={handleInputChange}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            required={required}
            className={cn("bg-white border-[#5C7C99]/30 focus:border-[#5C7C99] focus:ring-[#5C7C99]", className)}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-[#5C7C99]" />
            </div>
          )}
        </div>
        
        {open && query && query.length >= 3 && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-[#5C7C99]/20 bg-white shadow-xl overflow-hidden">
            {loading ? (
              <div className="px-3 py-3 text-sm text-slate-500 text-center">
                Mencari sekolah...
              </div>
            ) : results.length > 0 ? (
              <ul className="max-h-60 overflow-y-auto py-1">
                {results.map((school, idx) => (
                  <li
                    key={school.npsn || school.id || idx}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(school.nama, school.npsn);
                    }}
                    className={cn(
                      "cursor-pointer px-4 py-2 hover:bg-[#FAF8F5] hover:text-[#2C2621] transition-colors border-b border-slate-50 last:border-0",
                      query === school.nama && "bg-[#FAF8F5] font-medium"
                    )}
                  >
                    <div className="text-sm font-medium text-[#2C2621]">
                      {school.nama} {school.npsn ? `(NPSN: ${school.npsn})` : ""}
                    </div>
                    {(school.kabupaten_kota || school.provinsi) && (
                      <div className="text-xs text-[#5C7C99]">
                        {[school.kabupaten_kota, school.provinsi].filter(Boolean).join(", ")}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="py-1">
                <li
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setOpen(false);
                  }}
                  className="cursor-pointer px-3 py-3 text-sm text-slate-500 text-center flex flex-col gap-1 bg-[#FAF8F5] hover:bg-slate-100 transition-colors"
                >
                  <span className="font-medium text-[#2C2621]">Sekolah tidak ditemukan.</span>
                  <span className="text-xs text-slate-500">Ketik manual nama sekolah Anda.</span>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-[#5C7C99]/30 bg-[#5C7C99]/5 px-3 py-2.5 text-xs text-[#2C2621]">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5C7C99]" />
        <p>
          <strong>Tips Pencarian:</strong> Anda dapat mencari sekolah berdasarkan <strong>Nama</strong> atau <strong>NPSN</strong> (8 digit angka). Pastikan anggota tim memilih instansi yang persis sama.
        </p>
      </div>
    </div>
  );
}
