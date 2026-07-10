// committee/submissions/_types.ts

export interface SubmissionRow {
  id: string
  title: string
  description?: string | null
  fileUrl: string
  submittedAt: string
  participantName?: string
  teamName?: string
  participantEmail?: string
  participantAvatar?: string | null
  participantPhone?: string | null
  institution?: string | null
  members?: { name: string; avatar: string | null; email: string | null; phone: string | null }[]
}

export interface Competition {
  id?: string | null
  name: string
}
