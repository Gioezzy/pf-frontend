"use client"

import { useState } from "react"
import { toast } from "sonner"

import * as userService from "@/src/services/user.service"

import type { AdminCreateUserPayload, UserRole } from "../_lib/roles"

const EMPTY_FORM = {
  email: "",
  password: "",
  fullName: "",
  role: "PARTICIPANT" as UserRole,
}

type FormState = typeof EMPTY_FORM

export function useCreateUserForm(onSuccess?: () => void) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.email.trim() || !form.password || !form.fullName.trim()) {
      toast.error("Email, password, dan nama lengkap wajib diisi.")
      return
    }
    if (form.password.length < 6) {
      toast.error("Password minimal 6 karakter.")
      return
    }

    setIsSubmitting(true)
    try {
      const payload: AdminCreateUserPayload = {
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        role: form.role,
      }
      await userService.adminCreateUser(payload)
      toast.success(
        `Akun untuk "${payload.fullName}" berhasil dibuat dan langsung terverifikasi.`,
      )
      setForm(EMPTY_FORM)
      onSuccess?.()
    } catch (error) {
      console.error("Gagal membuat akun pengguna:", error)
      toast.error(
        "Gagal membuat akun. Periksa kembali data yang diisi (email mungkin sudah dipakai).",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return { form, setField, isSubmitting, submit }
}
