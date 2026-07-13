// admin/submissions/_types.ts
import type { Submission } from "@/src/types/submission.types"

/** SubmissionRow extends the API Submission type with extra participant details for the admin table. */
export interface SubmissionRow extends Submission {
  participantAvatar?: string | null
  participantPhone?: string | null
  institution?: string | null
  members?: { name: string; avatar: string | null; email: string | null; phone: string | null }[]
}

export interface Competition {
  id?: string | null
  name: string
}