import type * as competitionService from "@/src/services/competition.service"

export type Competition = Awaited<
  ReturnType<typeof competitionService.getAllCompetitions>
>[number]
export type ParticipantType = Competition["participantType"]

export type CreateCompetitionPayload = Parameters<
  typeof competitionService.createCompetition
>[0]
export type UpdateCompetitionPayload = Parameters<
  typeof competitionService.updateCompetition
>[1]
export type UpdateWavePayload = Parameters<
  typeof competitionService.updateWave
>[1]

export const PARTICIPANT_TYPE_OPTIONS: {
  value: ParticipantType
  label: string
}[] = [
  { value: "INDIVIDUAL" as ParticipantType, label: "Individu" },
  { value: "TEAM" as ParticipantType, label: "Tim" },
]

export interface WaveFormRow {
  name: string
  price: string
  startDate: string
  endDate: string
}

export const EMPTY_WAVE_ROW: WaveFormRow = {
  name: "",
  price: "0",
  startDate: "",
  endDate: "",
}

export interface DetailFormState {
  name: string
  participantType: ParticipantType
  minTeamMembers: string
  maxTeamMembers: string
  description: string
  isActive: boolean
  requiresSubmission: boolean;
  whatsappGroupUrl: string;
}

export const EMPTY_DETAIL_FORM: DetailFormState = {
  name: "",
  participantType: "INDIVIDUAL" as ParticipantType,
  minTeamMembers: "1",
  maxTeamMembers: "1",
  description: "",
  isActive: true,
  requiresSubmission: true,
  whatsappGroupUrl: "",
}
