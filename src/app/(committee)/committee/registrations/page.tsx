'use client'
import { CompetitionPickerCard } from "./_components/competition-picker-card"
import { RegistrationsTableCard } from "./_components/registrations-table-card"
import { useRegistrationsPage } from "./_hooks/use-registrations-page"

export default function RegistrationsPage() {
  const {
    competitions,
    isLoadingCompetitions,
    activeCompetition,
    setActiveCompetition,
    registrations,
    isLoadingRegistrations,
  } = useRegistrationsPage()

  const activeCompetitionName = competitions.find(c => c.id === activeCompetition)?.name || ""

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Data Pendaftaran</h1>
        <p className="text-sm text-gray-500 mt-1">
          Lihat peserta yang pendaftarannya sudah terverifikasi beserta gelar juaranya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <CompetitionPickerCard
            competitions={competitions}
            isLoading={isLoadingCompetitions}
            activeCompetition={activeCompetition}
            onCompetitionChange={setActiveCompetition}
          />
        </div>

        <div className="lg:col-span-3 w-full">
          <RegistrationsTableCard
            activeCompetition={activeCompetition}
            activeCompetitionName={activeCompetitionName}
            isLoading={isLoadingRegistrations}
            registrations={registrations}
          />
        </div>
      </div>
    </div>
  )
}
