"use client"

import { useState } from "react"
import { toast } from "sonner"
import * as competitionService from "@/src/services/competition.service"

export function useImportCompetitions(onImported: () => void) {
  const [isImporting, setIsImporting] = useState(false)

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string
        const json = JSON.parse(text)

        if (!Array.isArray(json)) {
          throw new Error("Format JSON harus berupa array.")
        }

        const result = await competitionService.importCompetitions(json)
        
        toast.success(`Import selesai! ${result.imported} ditambahkan, ${result.skipped} dilewati (sudah ada).`)
        onImported()
      } catch (error: unknown) {
        console.error("Gagal import competitions:", error)
        const message = error instanceof Error ? error.message : "Gagal import competitions. Pastikan format JSON valid."
        toast.error(message)
      } finally {
        setIsImporting(false)
        // Reset the input value so the same file can be selected again
        event.target.value = ""
      }
    }
    
    reader.onerror = () => {
      toast.error("Gagal membaca file.")
      setIsImporting(false)
      event.target.value = ""
    }

    reader.readAsText(file)
  }

  return { isImporting, handleImport }
}
