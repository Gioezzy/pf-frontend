// admin/submissions/page.tsx
"use client"

import { CompetitionPickerCard } from "./_components/competition-picker-card"
import { SubmissionsTableCard } from "./_components/submissions-table-card"
import { useSubmissionsPage } from "./_hooks/use-submissions-page"

export default function AdminSubmissionsPage() {
  const {
    competitions,
    isLoadingCompetitions,
    competitionId,
    handleCompetitionChange,
    submissions,
    isLoadingSubmissions,
  } = useSubmissionsPage()

  const activeCompetitionName = competitions.find(c => c.id === competitionId)?.name || ""

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manajemen Karya (Submissions)</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pantau dan kelola karya atau dokumen yang telah dikumpulkan oleh peserta lomba.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <CompetitionPickerCard
            competitions={competitions}
            isLoading={isLoadingCompetitions}
            value={competitionId}
            onValueChange={handleCompetitionChange}
          />
        </div>

        <div className="lg:col-span-3 w-full">
          <SubmissionsTableCard
            hasSelectedCompetition={!!competitionId}
            activeCompetitionName={activeCompetitionName}
            isLoading={isLoadingSubmissions}
            submissions={submissions}
          />
        </div>
      </div>
    </div>
  )
}