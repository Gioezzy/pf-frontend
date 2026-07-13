"use client"

import { Skeleton } from "@/src/components/ui/skeleton"
import { cn } from "@/src/lib/utils"

interface Competition {
  id?: string | null
  name: string
}

interface CompetitionPickerProps {
  competitions: Competition[]
  isLoading: boolean
  activeCompetition: string
  onCompetitionChange: (id: string) => void
}

export function CompetitionPickerCard({
  competitions,
  isLoading,
  activeCompetition,
  onCompetitionChange,
}: CompetitionPickerProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Kategori Lomba</h2>
        {/* Desktop skeletons */}
        <div className="hidden lg:flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
        {/* Mobile skeletons */}
        <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-32 shrink-0 rounded-full" />
          ))}
        </div>
      </div>
    )
  }

  if (competitions.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Kategori Lomba</h2>
        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200">
          Belum ada lomba tersedia.
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 w-full overflow-hidden">
      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Kategori Lomba</h2>
      
      {/* Mobile view: Horizontal scrollable pills */}
      <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 snap-x scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {competitions.map((comp) => {
          const isActive = comp.id === activeCompetition
          return (
            <button
              key={comp.id ?? comp.name}
              onClick={() => onCompetitionChange(comp.id ?? "")}
              className={cn(
                "shrink-0 snap-start px-5 py-2 text-sm font-medium transition-all duration-200 rounded-full border whitespace-nowrap",
                isActive
                  ? "bg-[#5C7C99] text-white shadow-md border-transparent"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {comp.name}
            </button>
          )
        })}
      </div>

      {/* Desktop view: Vertical list */}
      <div className="hidden lg:flex flex-col gap-2">
        {competitions.map((comp) => {
          const isActive = comp.id === activeCompetition
          return (
            <button
              key={comp.id ?? comp.name}
              onClick={() => onCompetitionChange(comp.id ?? "")}
              className={cn(
                "w-full text-left p-3 rounded-lg text-sm font-medium transition-all duration-200 border",
                isActive
                  ? "bg-[#5C7C99] text-white shadow-md border-transparent"
                  : "bg-transparent text-gray-600 border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm"
              )}
            >
              {comp.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
