import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppNotification, NotificationLevel } from '../models/notification.models';

function uid(): string {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _items$ = new BehaviorSubject<AppNotification[]>([]);

  readonly items$: Observable<AppNotification[]> = this._items$.asObservable();

  // PUBLIC_INTERFACE
  push(level: NotificationLevel, title: string, message?: string): void {
    /** Add a notification (also used as toast). */
    const item: AppNotification = {
      id: uid(),
      level,
      title,
      message,
      createdAt: Date.now(),
      read: false,
    };
    this._items$.next([item, ...this._items$.value].slice(0, 50));
  }

  // PUBLIC_INTERFACE
  markAllRead(): void {
    /** Mark all notifications as read. */
    this._items$.next(this._items$.value.map((n) => ({ ...n, read: true })));
  }

  // PUBLIC_INTERFACE
  markRead(id: string): void {
    /** Mark a single notification as read. */
    this._items$.next(this._items$.value.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  // PUBLIC_INTERFACE
  clear(): void {
    /** Clear all notifications. */
    this._items$.next([]);
  }
}
