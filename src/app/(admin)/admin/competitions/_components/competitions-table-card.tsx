"use client"

import { MoreHorizontalIcon, PencilIcon, Trash2Icon, TrophyIcon } from "lucide-react"

import { Badge } from "@/src/components/ui/badge"
import { buttonVariants } from "@/src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Skeleton } from "@/src/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { cn } from "@/src/lib/utils"

import { formatRupiah } from "../_lib/format"
import type { Competition } from "../_types"

interface CompetitionsTableCardProps {
  competitions: Competition[]
  isLoading: boolean
  onEdit: (competition: Competition) => void
  onDelete: (competition: Competition) => void
}

export function CompetitionsTableCard({
  competitions,
  isLoading,
  onEdit,
  onDelete,
}: CompetitionsTableCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Lomba</CardTitle>
        <CardDescription>
          {isLoading
            ? "Memuat data..."
            : `${competitions.length} lomba terdaftar di sistem.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : competitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
            <TrophyIcon className="size-8" />
            <p className="text-sm">Belum ada lomba. Tambahkan lomba pertama.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Lomba</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pendaftaran</TableHead>
                <TableHead>Gelombang Aktif</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitions.map((competition) => (
                <TableRow key={competition.id ?? competition.name}>
                  <TableCell className="font-medium">{competition.name}</TableCell>
                  <TableCell>
                    {competition.participantType === "TEAM"
                      ? `Tim (${competition.minTeamMembers}-${competition.maxTeamMembers})`
                      : "Individu"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={competition.requiresSubmission
                        ? "border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" 
                        : "border-muted bg-muted/50 text-muted-foreground"
                      }
                    >
                      {competition.requiresSubmission ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={competition.isActive
                        ? "border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" 
                        : "border-muted bg-muted/50 text-muted-foreground"
                      }
                    >
                      {competition.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={competition.isOpen
                        ? "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400" 
                        : "border-muted bg-transparent text-muted-foreground"
                      }
                    >
                      {competition.isOpen ? "Buka" : "Tutup"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {competition.activeWave
                      ? `${competition.activeWave.name} · ${formatRupiah(
                          competition.activeWave.price,
                        )}`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon" }),
                        )}
                      >
                        <MoreHorizontalIcon className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(competition)}>
                          <PencilIcon className="size-4" />
                          Edit & Kelola Gelombang
                        </DropdownMenuItem>
                        {competition.isActive && (
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => onDelete(competition)}
                          >
                            <Trash2Icon className="size-4" />
                            Nonaktifkan
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}