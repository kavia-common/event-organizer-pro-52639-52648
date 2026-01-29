export type NotificationLevel = 'info' | 'success' | 'error';

export interface AppNotification {
  id: string;
  level: NotificationLevel;
  title: string;
  message?: string;
  createdAt: number;
  read: boolean;
}
