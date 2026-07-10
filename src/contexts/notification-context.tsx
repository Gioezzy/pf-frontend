"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { io, Socket } from "socket.io-client"
import { toast } from "sonner"
import type { Notification } from "../types/notification"
import { notificationService } from "../services/notification.service"
import { useProfileContext } from "./user-context"
import Cookies from "js-cookie"

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refreshNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useProfileContext()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const refreshNotifications = useCallback(async () => {
    if (!profile) return
    try {
      const data = await notificationService.getNotifications()
      setNotifications(data)
    } catch (error) {
      console.error("Failed to fetch notifications", error)
    }
  }, [profile])

  // Connect to websocket when user is logged in
  useEffect(() => {
    if (!profile) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }
      setNotifications([])
      return
    }

    // Initial fetch
    refreshNotifications()

    // Setup Socket
    const token = Cookies.get("access_token")
    if (!token) return

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    const newSocket = io(`${backendUrl}/notifications`, {
      auth: { token },
      transports: ["websocket", "polling"],
      withCredentials: true,
    })

    newSocket.on("connect", () => {
      console.log("Connected to notification server")
    })

    newSocket.on("new_notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev])
      
      // Tampilkan toast berdasarkan tipe
      if (notification.type === "SUCCESS") {
        toast.success(notification.title, { description: notification.message })
      } else if (notification.type === "ERROR") {
        toast.error(notification.title, { description: notification.message })
      } else if (notification.type === "WARNING") {
        toast.warning(notification.title, { description: notification.message })
      } else {
        toast.info(notification.title, { description: notification.message })
      }
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [profile, refreshNotifications])

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
    } catch (error) {
      toast.error("Gagal menandai notifikasi dibaca")
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      )
    } catch (error) {
      toast.error("Gagal menandai semua notifikasi dibaca")
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
