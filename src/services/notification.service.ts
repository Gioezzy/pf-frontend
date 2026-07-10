import axiosInstance from "../lib/axios"
import type { Notification } from "../types/notification"

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await axiosInstance.get<Notification[]>("/notifications")
    return response.data
  },

  markAsRead: async (id: string): Promise<void> => {
    await axiosInstance.patch(`/notifications/${id}/read`)
  },

  markAllAsRead: async (): Promise<void> => {
    await axiosInstance.patch("/notifications/read-all")
  },
}
