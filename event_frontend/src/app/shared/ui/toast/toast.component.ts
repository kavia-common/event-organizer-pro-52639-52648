import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, timer } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { AppNotification } from '../../../core/models/notification.models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="toast-stack" aria-live="polite" aria-relevant="additions">
      <div
        *ngFor="let t of toasts; trackBy: trackById"
        class="toast"
        [class.toast--success]="t.level === 'success'"
        [class.toast--error]="t.level === 'error'"
      >
        <div class="toast__title">{{ t.title }}</div>
        <div *ngIf="t.message" class="toast__msg">{{ t.message }}</div>
        <button class="toast__btn" type="button" (click)="dismiss(t.id)" aria-label="Dismiss">
          <app-icon name="x" [size]="16"></app-icon>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-stack {
        position: fixed;
        right: 16px;
        bottom: 16px;
        display: grid;
        gap: 10px;
        z-index: 60;
      }
      .toast {
        width: min(360px, calc(100vw - 32px));
        border: 1px solid var(--border);
        background: var(--surface);
        border-radius: 12px;
        padding: 10px 10px 10px 12px;
        box-shadow: var(--shadow);
        position: relative;
      }
      .toast--success {
        border-color: color-mix(in srgb, var(--accent) 60%, var(--border));
      }
      .toast--error {
        border-color: color-mix(in srgb, var(--danger) 60%, var(--border));
      }
      .toast__title {
        font-weight: 600;
        color: var(--text);
        padding-right: 28px;
      }
      .toast__msg {
        margin-top: 4px;
        color: var(--muted);
        font-size: 13px;
        padding-right: 28px;
      }
      .toast__btn {
        position: absolute;
        top: 8px;
        right: 8px;
        border: 0;
        background: transparent;
        color: var(--muted);
        padding: 6px;
        border-radius: 8px;
        cursor: pointer;
      }
      .toast__btn:hover {
        background: var(--surface-2);
        color: var(--text);
      }
    `,
  ],
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: AppNotification[] = [];
  private sub?: Subscription;

  constructor(private readonly notifications: NotificationService) {}

  ngOnInit(): void {
    this.sub = this.notifications.items$.subscribe((items) => {
      // show only newest unread items as toasts (max 3)
      const list = items.filter((n) => !n.read).slice(0, 3);
      this.toasts = list;

      // auto-dismiss each toast after 4 seconds
      for (const t of list) {
        timer(4000).subscribe(() => this.dismiss(t.id));
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  dismiss(id: string): void {
    this.notifications.markRead(id);
  }

  trackById(_: number, item: AppNotification): string {
    return item.id;
  }
}
