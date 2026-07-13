"use client"

import { useCallback, useEffect, useState } from "react"
import { userService } from "@/src/services"
import type { User } from "@/src/types/auth.types"
import type { PaginatedUsersResponse } from "@/src/services/user.service"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Skeleton } from "@/src/components/ui/skeleton"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  UsersIcon,
  ShieldCheckIcon,
  CrownIcon,
  WalletIcon,
} from "lucide-react"

const ROLE_OPTIONS = [
  { value: "ALL", label: "Semua Role" },
  { value: "ADMIN", label: "Admin" },
  { value: "COMMITTEE", label: "Panitia" },
  { value: "TREASURER", label: "Bendahara" },
  { value: "PARTICIPANT", label: "Peserta" },
]

const ROLE_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  ADMIN: {
    label: "Admin",
    className: "border-purple-200 bg-purple-50 text-purple-700",
    icon: <CrownIcon className="size-3" />,
  },
  COMMITTEE: {
    label: "Panitia",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    icon: <ShieldCheckIcon className="size-3" />,
  },
  TREASURER: {
    label: "Bendahara",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: <WalletIcon className="size-3" />,
  },
  PARTICIPANT: {
    label: "Peserta",
    className: "border-gray-200 bg-gray-50 text-gray-600",
    icon: <UsersIcon className="size-3" />,
  },
}

const PAGE_LIMIT = 8

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_CONFIG[role] ?? { label: role, className: "border-gray-200 bg-gray-50 text-gray-600", icon: null }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

function UserCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-muted/40 bg-white p-4">
          <Skeleton className="size-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full shrink-0 hidden sm:block" />
        </div>
      ))}
    </div>
  )
}

export function UsersTable({ onMutate }: { onMutate?: number }) {
  const [result, setResult] = useState<PaginatedUsersResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  // Reset page on filter change
  useEffect(() => {
    setPage(1)
  }, [roleFilter])

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await userService.getAllUsers({
        page,
        limit: PAGE_LIMIT,
        search: debouncedSearch || undefined,
        role: roleFilter === "ALL" ? undefined : roleFilter,
      })
      setResult(data)
    } catch (err) {
      console.error("Gagal mengambil daftar pengguna:", err)
    } finally {
      setIsLoading(false)
    }
  }, [page, debouncedSearch, roleFilter])

  // Re-fetch when page/filter/search changes OR when parent signals a mutation (new user created)
  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers, onMutate])

  const users = result?.data ?? []
  const totalPages = result?.totalPages ?? 1
  const total = result?.total ?? 0

  return (
    <Card className="mt-8 border-muted/60 shadow-sm">
      <CardHeader className="border-b bg-muted/20 px-5 py-4">
        <div className="flex flex-col gap-3">
          <div>
            <CardTitle className="text-base font-semibold">Daftar Akun Pengguna</CardTitle>
            <CardDescription className="mt-0.5 text-xs">
              {isLoading ? "Memuat data..." : `${total} pengguna ditemukan`}
            </CardDescription>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="users-search"
                placeholder="Cari nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-sm"
              />
            </div>
            <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val ?? "ALL")}>
              <SelectTrigger id="users-role-filter" className="h-8 w-full sm:w-[160px] text-sm">
                <SelectValue placeholder="Filter Role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-sm">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4">
            <UserCardSkeleton />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-center text-muted-foreground">
            <UsersIcon className="size-10 opacity-30" />
            <div>
              <p className="text-sm font-medium">Tidak ada pengguna ditemukan</p>
              <p className="mt-0.5 text-xs">Coba ubah kata kunci pencarian atau filter</p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/10">
                  <tr className="text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="px-5 py-3 text-left font-medium">Pengguna</th>
                    <th className="px-5 py-3 text-left font-medium">Email</th>
                    <th className="px-5 py-3 text-left font-medium">Role</th>
                    <th className="px-5 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/20">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 shrink-0">
                            <AvatarImage src={user.avatarUrl || ""} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                              {(user.fullName || user.email).charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-foreground truncate">
                              {user.fullName || "—"}
                            </span>
                            {user.phoneNumber && (
                              <span className="text-xs text-muted-foreground">{user.phoneNumber}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground text-sm truncate max-w-[200px]">
                        {user.email}
                      </td>
                      <td className="px-5 py-3.5">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant={user.isActive ? "default" : "secondary"}
                          className={`text-xs ${user.isActive ? "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" : ""}`}
                        >
                          {user.isActive ? "Aktif" : "Non-aktif"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="flex flex-col divide-y divide-muted/20 md:hidden">
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-3 px-4 py-3.5">
                  <Avatar className="size-10 shrink-0">
                    <AvatarImage src={user.avatarUrl || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {(user.fullName || user.email).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium text-sm text-foreground truncate">
                      {user.fullName || "—"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    {user.phoneNumber && (
                      <span className="text-xs text-muted-foreground">{user.phoneNumber}</span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <RoleBadge role={user.role} />
                    <Badge
                      variant={user.isActive ? "default" : "secondary"}
                      className={`text-[10px] px-1.5 py-0 h-4 ${user.isActive ? "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" : ""}`}
                    >
                      {user.isActive ? "Aktif" : "Non-aktif"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t bg-muted/5 px-5 py-3">
            <p className="text-xs text-muted-foreground">
              Hal. <span className="font-semibold text-foreground">{page}</span> dari{" "}
              <span className="font-semibold text-foreground">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1">
              <Button
                id="users-prev-page"
                variant="outline"
                size="icon"
                className="size-7"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeftIcon className="size-4" />
              </Button>

              {/* Page numbers — show up to 5 pages */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const startPage = Math.max(1, Math.min(page - 2, totalPages - 4))
                const pageNum = startPage + i
                if (pageNum > totalPages) return null
                return (
                  <Button
                    key={pageNum}
                    id={`users-page-${pageNum}`}
                    variant={pageNum === page ? "default" : "outline"}
                    size="icon"
                    className="size-7 text-xs"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}

              <Button
                id="users-next-page"
                variant="outline"
                size="icon"
                className="size-7"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
