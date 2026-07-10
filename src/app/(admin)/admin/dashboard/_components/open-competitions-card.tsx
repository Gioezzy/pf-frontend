import Link from "next/link"

import { buttonVariants } from "@/src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Skeleton } from "@/src/components/ui/skeleton"
import { cn } from "@/src/lib/utils"

import type { Competition } from "../_hooks/use-dashboard-overview"

interface OpenCompetitionsCardProps {
  competitions: Competition[]
  isLoading: boolean
}

export function OpenCompetitionsCard({
  competitions,
  isLoading,
}: OpenCompetitionsCardProps) {
  return (
    <Card className="group rounded-2xl border-muted/60 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#5C7C99]/30 hover:bg-card h-full">
      <CardHeader>
        <CardTitle>Lomba dengan Pendaftaran Dibuka</CardTitle>
        <CardDescription>
          Lomba yang saat ini sedang menerima pendaftaran pada salah satu
          gelombangnya.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : competitions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Tidak ada lomba yang sedang membuka pendaftaran saat ini.
          </p>
        ) : (
          <div className="flex flex-col divide-y">
            {competitions.map((competition) => (
              <div
                key={competition.id ?? competition.name}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-medium">{competition.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {competition.activeWave?.name ?? "-"} · berakhir{" "}
                    {competition.activeWave
                      ? new Date(
                          competition.activeWave.endDate,
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link
          href="/admin/competitions"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Kelola Semua Lomba
        </Link>
      </CardFooter>
    </Card>
  )
}
