"use client"

import * as React from "react"
import { Bell, Check, CheckCheck, Info, ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id as localeId } from "date-fns/locale"

import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { useNotification } from "../contexts/notification-context"
import { cn } from "../lib/utils"
import type { Notification } from "../types/notification"

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification()
  const [open, setOpen] = React.useState(false)
  const [selectedNotif, setSelectedNotif] = React.useState<Notification | null>(null)

  const getIcon = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return <CheckCircle2 className="size-4 text-green-500" />
      case "ERROR":
        return <ShieldAlert className="size-4 text-red-500" />
      case "WARNING":
        return <AlertTriangle className="size-4 text-amber-500" />
      default:
        return <Info className="size-4 text-sky-500" />
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="relative flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="font-semibold text-sm">Notifikasi</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-0 text-xs text-sky-500 hover:bg-transparent hover:text-sky-600"
              onClick={() => markAllAsRead()}
            >
              <CheckCheck className="mr-1 size-3" />
              Tandai semua dibaca
            </Button>
          )}
        </div>
        
        <div className="flex max-h-[400px] flex-col overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Bell className="mb-2 size-8 opacity-20" />
              <p className="text-sm">Belum ada notifikasi.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  "flex items-start gap-3 border-b px-4 py-3 text-sm transition-colors hover:bg-muted/50 cursor-pointer",
                  !notif.isRead && "bg-sky-50/50"
                )}
                onClick={() => {
                  if (!notif.isRead) markAsRead(notif.id)
                  setSelectedNotif(notif)
                }}
              >
                <div className="mt-0.5 shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className={cn("font-medium leading-none", !notif.isRead && "text-foreground")}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(notif.createdAt), {
                      addSuffix: true,
                      locale: localeId,
                    })}
                  </p>
                </div>
                {!notif.isRead && (
                  <div className="mt-1 size-2 shrink-0 rounded-full bg-sky-500" />
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>

      <Dialog open={!!selectedNotif} onOpenChange={(isOpen) => !isOpen && setSelectedNotif(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedNotif && getIcon(selectedNotif.type)}
              {selectedNotif?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedNotif && formatDistanceToNow(new Date(selectedNotif.createdAt), {
                addSuffix: true,
                locale: localeId,
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-foreground leading-relaxed py-4 border-y">
            {selectedNotif?.message}
          </div>
          <div className="flex justify-end mt-2">
            <Button variant="outline" onClick={() => setSelectedNotif(null)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Popover>
  )
}
