// admin/competitions/page.tsx
"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner" // 1. Pastikan toast di-import
import { Button } from "@/src/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { CompetitionsTableCard } from "./_components/competitions-table-card"
import { CreateCompetitionDialog } from "./_components/create-competition-dialog"
import { DeleteCompetitionDialog } from "./_components/delete-competition-dialog"
import { EditCompetitionDialog } from "./_components/edit-competition-dialog"
import { useCompetitions } from "./_hooks/use-competitions"
import { useDeleteCompetition } from "./_hooks/use-delete-competition"
import { useImportCompetitions } from "./_hooks/use-import-competitions"
import type { Competition } from "./_types"
import { useRef } from "react"
import { UploadIcon } from "lucide-react"

export default function CompetitionsPage() {
  const { competitions, isLoading, refetch } = useCompetitions()

  // Fungsi untuk refresh data tanpa jeda/loading skeleton
  const handleSilentRefresh = () => {
    refetch(true)
  }

  const {
    target: deleteTarget,
    setTarget: setDeleteTarget,
    isDeleting,
    confirmDelete,
  } = useDeleteCompetition(handleSilentRefresh)

  const { isImporting, handleImport } = useImportCompetitions(handleSilentRefresh)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null)

  // Pisahkan data berdasarkan status aktif/nonaktif
  const activeCompetitions = competitions.filter((c) => c.isActive)
  const inactiveCompetitions = competitions.filter((c) => !c.isActive)

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Manajemen Lomba</h1>
          <p className="text-sm text-muted-foreground">
            Kelola katalog lomba beserta gelombang pendaftarannya.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            accept=".json" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImport}
          />
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
          >
            <UploadIcon className="size-4 mr-2" />
            {isImporting ? "Mengimpor..." : "Import JSON"}
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <PlusIcon className="size-4 mr-2" />
            Tambah Lomba
          </Button>
        </div>
      </div>

      {/* Implementasi Tabs UI */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Lomba Aktif ({activeCompetitions.length})</TabsTrigger>
          <TabsTrigger value="inactive">Nonaktif ({inactiveCompetitions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <CompetitionsTableCard
            competitions={activeCompetitions}
            isLoading={isLoading}
            onEdit={setEditingCompetition}
            onDelete={setDeleteTarget}
          />
        </TabsContent>

        <TabsContent value="inactive">
          <CompetitionsTableCard
            competitions={inactiveCompetitions}
            isLoading={isLoading}
            onEdit={setEditingCompetition}
            onDelete={setDeleteTarget}
          />
        </TabsContent>
      </Tabs>

      <CreateCompetitionDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreated={handleSilentRefresh} // Gunakan silent refresh
      />
      <EditCompetitionDialog
        competition={editingCompetition}
        onOpenChange={(open) => !open && setEditingCompetition(null)}
        onUpdated={handleSilentRefresh} // Gunakan silent refresh
      />
      <DeleteCompetitionDialog
        competition={deleteTarget}
        isDeleting={isDeleting}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
