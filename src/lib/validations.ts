// src/lib/validations.ts
import { z } from 'zod';

// ==========================================
// 1. MODUL AUTHENTICATION
// ==========================================

export const loginSchema = z.object({
  email: z.string().email({ message: 'Format email tidak valid.' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'Nama lengkap minimal 3 karakter.' })
    .max(100, { message: 'Nama lengkap maksimal 100 karakter.' })
    .regex(/^[a-zA-Z\s]*$/, { message: 'Nama hanya boleh berisi huruf dan spasi.' }), // Keamanan: Mencegah karakter aneh/script
  email: z.string().email({ message: 'Format email tidak valid.' }),
  password: z
    .string()
    .min(8, { message: 'Password minimal 8 karakter.' })
    .regex(/[A-Z]/, { message: 'Password harus mengandung huruf besar.' })
    .regex(/[0-9]/, { message: 'Password harus mengandung angka.' }),
  phoneNumber: z
    .string()
    .min(10, { message: 'Nomor HP tidak valid.' })
    .max(15, { message: 'Nomor HP terlalu panjang.' })
    .regex(/^[0-9]+$/, { message: 'Nomor HP hanya boleh berisi angka.' }),
  institution: z.string().min(2, { message: 'Nama instansi/sekolah wajib diisi.' }),
});

// ==========================================
// 2. MODUL TIM & REGISTRASI
// ==========================================

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nama tim minimal 3 karakter.' })
    .max(50, { message: 'Nama tim maksimal 50 karakter.' })
    .regex(/^[a-zA-Z0-9\s-]+$/, {
      message: 'Nama tim hanya boleh berisi huruf, angka, spasi, dan strip.'
    }),
});

export const addMemberSchema = z.object({
  email: z.string().email({ message: 'Format email anggota tidak valid.' }),
});
