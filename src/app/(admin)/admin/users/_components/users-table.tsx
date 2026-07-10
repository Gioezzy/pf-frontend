"use client"

import { useEffect, useState } from "react"
import { userService } from "@/src/services"
import type { User } from "@/src/types/auth.types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Skeleton } from "@/src/components/ui/skeleton"
import { Badge } from "@/src/components/ui/badge"

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await userService.getAllUsers()
        setUsers(data)
      } catch (error) {
        console.error("Gagal mengambil daftar pengguna:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (isLoading) {
    return <Skeleton className="h-96 w-full mt-8" />
  }

  const staffUsers = users.filter((u) => u.role !== "PARTICIPANT")

  return (
    <Card className="mt-8 border-muted/60 shadow-sm transition-all">
      <CardHeader className="border-b bg-muted/20 px-6 py-5">
        <CardTitle className="text-lg">Daftar Akun Staff / Panitia</CardTitle>
        <CardDescription>
          Menampilkan akun Admin, Committee, dan Bendahara (Treasurer).
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 text-xs text-muted-foreground uppercase border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Pengguna</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/30">
              {staffUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    Belum ada akun staff terdaftar.
                  </td>
                </tr>
              ) : (
                staffUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatarUrl || ""} alt={user.fullName || "User"} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {(user.fullName || user.email).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{user.fullName || "Belum ada nama"}</span>
                          {user.phoneNumber && <span className="text-xs text-muted-foreground mt-0.5">{user.phoneNumber}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="font-medium">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Aktif" : "Non-aktif"}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
