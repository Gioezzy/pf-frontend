"use client"

import { Loader2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog"

import type { Competition } from "../_types"

interface DeleteCompetitionDialogProps {
  competition: Competition | null
  isDeleting: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteCompetitionDialog({
  competition,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteCompetitionDialogProps) {
  return (
    <AlertDialog open={!!competition} onOpenChange={(open) => !open && onOpenChange(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Nonaktifkan lomba ini?</AlertDialogTitle>
          <AlertDialogDescription>
            &quot;{competition?.name}&quot; akan disembunyikan dari katalog
            publik. Tindakan ini bisa dibatalkan kembali lewat menu edit.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <AlertDialogAction disabled={isDeleting} onClick={onConfirm}>
            {isDeleting && <Loader2Icon className="size-4 animate-spin" />}
            Ya, Nonaktifkan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
