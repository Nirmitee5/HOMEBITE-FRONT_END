// services/customer/notifications.ts
// Customer notification centre. In-memory mock store.

import type { Notification, NotificationType } from "../../types/customer";
import { request } from "./api";

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60000).toISOString();
}

let notifications: Notification[] = [
  {
    id: "notif_1",
    type: "order",
    title: "Order accepted",
    body: "Your order #HB4821 has been accepted by Meera's Kitchen.",
    isRead: false,
    createdAt: minutesAgo(35),
    data: { orderId: "HB4821" },
  },
  {
    id: "notif_2",
    type: "order",
    title: "Out for delivery",
    body: "Your order #HB4821 is out for delivery. Arriving in about 12 mins.",
    isRead: false,
    createdAt: minutesAgo(10),
    data: { orderId: "HB4821" },
  },
  {
    id: "notif_3",
    type: "subscription",
    title: "Meal scheduled",
    body: "Your subscription meal from Annapurna Mess is scheduled for tomorrow's lunch.",
    isRead: false,
    createdAt: minutesAgo(240),
    data: { subscriptionId: "sub_1" },
  },
  {
    id: "notif_4",
    type: "payment",
    title: "Payment successful",
    body: "₹650 paid for your Weekly Lunch Plan. Next billing on the 7th.",
    isRead: true,
    createdAt: minutesAgo(60 * 26),
    data: { subscriptionId: "sub_1" },
  },
  {
    id: "notif_5",
    type: "subscription",
    title: "Subscription paused",
    body: "Your Breakfast Plan is paused. Meals resume automatically next Monday.",
    isRead: true,
    createdAt: minutesAgo(60 * 50),
    data: { subscriptionId: "sub_2" },
  },
  {
    id: "notif_6",
    type: "system",
    title: "Account updated",
    body: "Your account information was updated successfully.",
    isRead: true,
    createdAt: minutesAgo(60 * 72),
  },
  {
    id: "notif_7",
    type: "promotion",
    title: "₹50 off your next tiffin",
    body: "Use code HOMEBITE50 on any instant order above ₹250.",
    isRead: true,
    createdAt: minutesAgo(60 * 96),
  },
];

export async function getNotifications(
  type?: NotificationType
): Promise<Notification[]> {
  return request(() =>
    (type ? notifications.filter((n) => n.type === type) : notifications).slice()
  );
}

export async function getUnreadCount(): Promise<number> {
  return request(() => notifications.filter((n) => !n.isRead).length, {
    delayMs: 120,
  });
}

export async function markNotificationAsRead(
  id: string
): Promise<Notification> {
  const notification = notifications.find((n) => n.id === id);
  if (!notification) throw new Error("Notification not found.");
  notification.isRead = true;
  return request(notification, { delayMs: 180 });
}

export async function markAllNotificationsAsRead(): Promise<Notification[]> {
  notifications = notifications.map((n) => ({ ...n, isRead: true }));
  return request(() => notifications, { delayMs: 250 });
}

export async function deleteNotification(id: string): Promise<{ id: string }> {
  notifications = notifications.filter((n) => n.id !== id);
  return request({ id }, { delayMs: 180 });
}

/** Relative time label for the notification list. */
export function timeAgo(isoDate: string): string {
  const diffMins = Math.round((Date.now() - new Date(isoDate).getTime()) / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const hours = Math.round(diffMins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}
