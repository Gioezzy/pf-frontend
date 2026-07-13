// committee/submissions/_components/submissions-table-card.tsx
"use client"

import { useState } from "react"
import { ExternalLink, InboxIcon, EyeIcon, XIcon, MailIcon, PhoneIcon } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Skeleton } from "@/src/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import type { SubmissionRow } from "../_types"
import { FilePreviewDialog } from "@/src/components/ui/file-preview-dialog"

interface SubmissionsTableCardProps {
  hasSelectedCompetition: boolean
  activeCompetitionName?: string
  isLoading: boolean
  submissions: SubmissionRow[]
}

export function SubmissionsTableCard({
  hasSelectedCompetition,
  activeCompetitionName,
  isLoading,
  submissions,
}: SubmissionsTableCardProps) {
  const [detailModal, setDetailModal] = useState<SubmissionRow | null>(null)
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null)
  
  if (!hasSelectedCompetition) {
    return <EmptyState message="Pilih lomba terlebih dahulu untuk melihat karya." />
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 w-full rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  if (submissions.length === 0) {
    return <EmptyState message="Belum ada karya yang dikumpulkan untuk lomba ini." />
  }

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden w-full flex flex-col">
      {/* Dynamic Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">
          Karya Peserta: <span className="text-[#5C7C99]">{activeCompetitionName || "Lomba"}</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">{submissions.length} karya berhasil dikumpulkan.</p>
      </div>

      {/* Table Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Judul Karya</th>
              <th className="px-6 py-4 font-medium">Peserta / Tim</th>
              <th className="px-6 py-4 font-medium">Tanggal Kumpul</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {submissions.map((submission) => (
              <tr key={submission.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 truncate max-w-[300px]">{submission.title}</div>
                  {submission.description ? (
                    <div className="line-clamp-1 text-sm text-gray-500 mt-0.5 max-w-[300px]">
                      {submission.description}
                    </div>
                  ) : null}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {submission.teamName ?? submission.participantName ?? "-"}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {submission.submittedAt
                    ? new Intl.DateTimeFormat("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(submission.submittedAt))
                    : "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="shadow-none border-gray-200 text-gray-500 h-8 w-8"
                      onClick={() => setDetailModal(submission)}
                    >
                      <EyeIcon className="size-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="shadow-none border-gray-200 text-gray-600 h-8 px-3 hover:bg-gray-50"
                      onClick={() => setPreviewFile({ url: submission.fileUrl, name: `Karya: ${submission.title}` })}
                    >
                      Buka File <ExternalLink className="ml-2 size-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col divide-y divide-gray-100">
        {submissions.map((submission, index) => (
          <div key={submission.id} className="p-5 flex flex-col gap-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-base leading-tight">
                {submission.title}
              </h3>
              {submission.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {submission.description}
                </p>
              )}
            </div>
            
            <div className="flex flex-col gap-1 mt-1 text-sm text-gray-600">
              <div><span className="text-gray-500 mr-2">Peserta/Tim:</span> {submission.teamName ?? submission.participantName ?? "-"}</div>
              <div>
                <span className="text-gray-500 mr-2">Tgl Kumpul:</span>
                {submission.submittedAt
                  ? new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(submission.submittedAt))
                  : "-"}
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                className="shadow-none border-gray-200 text-gray-500 px-3 w-10"
                onClick={() => setDetailModal(submission)}
              >
                <EyeIcon className="size-4" />
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 shadow-none border-gray-200 text-gray-700"
                onClick={() => setPreviewFile({ url: submission.fileUrl, name: `Karya: ${submission.title}` })}
              >
                Buka File <ExternalLink className="ml-2 size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {detailModal && (
        <DetailModal 
          submission={detailModal} 
          onClose={() => setDetailModal(null)} 
        />
      )}
      
      <FilePreviewDialog 
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        fileUrl={previewFile?.url || null}
        fileName={previewFile?.name}
      />
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
      <div className="p-4 bg-gray-50 rounded-full">
        <InboxIcon className="size-8 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500 max-w-[250px]">{message}</p>
    </div>
  )
}

function DetailModal({ submission, onClose }: { submission: SubmissionRow, onClose: () => void }) {
  const isTeam = !!submission.teamName
  const leaderName = submission.participantName ?? "-"
  const members = submission.members || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Detail Submission</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <XIcon className="size-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Judul Karya</p>
            <p className="font-medium text-gray-900">{submission.title}</p>
          </div>

          {submission.description && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Deskripsi</p>
              <p className="text-sm text-gray-800">{submission.description}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500 mb-1">Tanggal Kumpul</p>
            <p className="font-medium text-gray-900">
              {submission.submittedAt ? new Intl.DateTimeFormat("id-ID", {
                day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
              }).format(new Date(submission.submittedAt)) : "-"}
            </p>
          </div>
          
          {isTeam ? (
            <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
              <p className="text-sm text-gray-500 mb-4">Informasi Tim</p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-500">Nama Tim</span>
                  <span className="font-bold text-gray-900 text-lg">{submission.teamName}</span>
                </div>
                
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Ketua Tim</p>
                  <div className="flex gap-4 items-start">
                    <Avatar className="size-12 border border-gray-100">
                      <AvatarImage src={submission.participantAvatar || ""} />
                      <AvatarFallback className="bg-blue-50 text-blue-700">{leaderName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{leaderName}</p>
                      {submission.participantEmail && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <MailIcon className="size-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{submission.participantEmail}</span>
                        </div>
                      )}
                      {submission.participantPhone && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <PhoneIcon className="size-3.5 text-gray-400 shrink-0" />
                          <span>{submission.participantPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {members.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Anggota Lainnya</p>
                    <div className="flex flex-col gap-4">
                      {members.map((m, i: number) => {
                        const memberName = m.name;
                        return (
                        <div key={i} className="flex gap-3 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                          <Avatar className="size-9 border border-gray-100">
                            <AvatarImage src={m.avatar || ""} />
                            <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">{memberName.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{memberName}</p>
                            {m.email && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <MailIcon className="size-3 text-gray-400 shrink-0" />
                                <span className="truncate">{m.email}</span>
                              </div>
                            )}
                            {m.phone && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <PhoneIcon className="size-3 text-gray-400 shrink-0" />
                                <span>{m.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )})}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
              <p className="text-sm text-gray-500 mb-3">Peserta Individu</p>
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex gap-4 items-start">
                  <Avatar className="size-14 border border-gray-100">
                    <AvatarImage src={submission.participantAvatar || ""} />
                    <AvatarFallback className="bg-blue-50 text-blue-700 text-lg">{(submission.participantName ?? "-").charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-lg truncate">{submission.participantName ?? "-"}</p>
                    {submission.participantEmail && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-0.5">
                        <MailIcon className="size-4 text-gray-400 shrink-0" />
                        <span className="truncate">{submission.participantEmail}</span>
                      </div>
                    )}
                    {submission.participantPhone && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-0.5">
                        <PhoneIcon className="size-4 text-gray-400 shrink-0" />
                        <span>{submission.participantPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <Button onClick={onClose} className="bg-white border-gray-200 text-gray-700 hover:bg-gray-100 shadow-sm" variant="outline">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  )
}
