// types/team.types.ts
// Sesuai: src/modules/festival/teams (pf-backend)

/** Anggota tim (bukan ketua) */
export interface TeamMember {
  id: string;
  userId: string;
  fullName: string;
  joinedAt: string;
  avatarUrl: string | null;
}

/** Ketua tim */
export interface TeamLeader {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

/** Response dari POST /teams, POST /teams/members, GET /teams/my-team */
export interface Team {
  id: string;
  name: string;
  institution: string;
  leader: TeamLeader;
  members: TeamMember[];
  createdAt: string;
}

// ── Payload (Request Body) ──────────────────────────────────────────────────

/** Body untuk POST /teams */
export interface CreateTeamPayload {
  name: string;
}

/** Body untuk POST /teams/members — hanya bisa dipanggil oleh ketua tim */
export interface AddMemberPayload {
  email: string;
}