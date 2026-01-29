import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { EventsStoreService } from '../../core/services/events-store.service';
import { NotificationService } from '../../core/services/notification.service';
import { EventRecord, EventViewMode } from '../../core/models/event.models';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { CalendarViewComponent } from './parts/calendar-view.component';

function isoDateOf(iso: string): string {
  return iso.slice(0, 10);
}

@Component({
  selector: 'app-events-page',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, CalendarViewComponent, DatePipe],
  template: `
    <div class="page">
      <div class="page__header">
        <div>
          <div class="h1">Your events</div>
          <div class="sub">Create, update, and stay on top of upcoming plans.</div>
        </div>

        <div class="actions">
          <div class="seg">
            <button type="button" class="seg__btn" [class.seg__btn--active]="viewMode() === 'list'" (click)="setMode('list')">
              <app-icon name="list"></app-icon>
              List
            </button>
            <button
              type="button"
              class="seg__btn"
              [class.seg__btn--active]="viewMode() === 'calendar'"
              (click)="setMode('calendar')"
            >
              <app-icon name="calendar"></app-icon>
              Calendar
            </button>
          </div>

          <a class="btn btn--primary" routerLink="/app/new">
            <app-icon name="plus"></app-icon>
            New event
          </a>
        </div>
      </div>

      <div class="panel" *ngIf="loading(); else content">
        <div class="loading">Loading events…</div>
      </div>

      <ng-template #content>
        <div class="panel" *ngIf="viewMode() === 'list'; else cal">
          <div class="list" *ngIf="events().length > 0; else empty">
            <div class="row" *ngFor="let e of events(); trackBy: trackById">
              <div class="row__main">
                <div class="row__title">{{ e.title }}</div>
                <div class="row__meta">
                  <span>{{ e.starts_at | date: 'MMM d, y, h:mm a' }}</span>
                  <span class="dot">•</span>
                  <span>{{ e.ends_at | date: 'MMM d, y, h:mm a' }}</span>
                  <ng-container *ngIf="e.location">
                    <span class="dot">•</span>
                    <span>{{ e.location }}</span>
                  </ng-container>
                </div>
                <div class="row__desc" *ngIf="e.description">{{ e.description }}</div>
              </div>

              <div class="row__actions">
                <a class="iconbtn" [routerLink]="['/app/edit', e.id]" aria-label="Edit">
                  <app-icon name="edit"></app-icon>
                </a>
                <button class="iconbtn iconbtn--danger" type="button" (click)="remove(e.id)" aria-label="Delete">
                  <app-icon name="trash"></app-icon>
                </button>
              </div>
            </div>
          </div>

          <ng-template #empty>
            <div class="empty">
              <div class="empty__title">No events found</div>
              <div class="empty__sub">Try adjusting your search, or create a new event.</div>
              <a class="btn btn--primary" routerLink="/app/new">
                <app-icon name="plus"></app-icon>
                Create event
              </a>
            </div>
          </ng-template>
        </div>

        <ng-template #cal>
          <app-calendar-view
            [events]="events()"
            [selectedDateIso]="selectedDateIso()"
            (selectedDateIsoChange)="setSelectedDate($event)"
            (requestDelete)="remove($event)"
          ></app-calendar-view>
        </ng-template>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .page {
        display: grid;
        gap: 14px;
      }
      .page__header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 14px;
        flex-wrap: wrap;
      }
      .h1 {
        font-size: 22px;
        font-weight: 850;
        letter-spacing: -0.02em;
        color: var(--text);
      }
      .sub {
        margin-top: 6px;
        color: var(--muted);
        font-size: 13px;
      }

      .actions {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .panel {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        box-shadow: var(--shadow-sm);
        padding: 12px;
      }

      .seg {
        display: inline-flex;
        border: 1px solid var(--border);
        background: var(--surface);
        border-radius: 12px;
        padding: 4px;
        gap: 4px;
      }
      .seg__btn {
        border: 0;
        background: transparent;
        color: var(--muted);
        padding: 8px 10px;
        border-radius: 10px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 650;
      }
      .seg__btn--active {
        background: var(--surface-2);
        color: var(--text);
      }

      .list {
        display: grid;
      }
      .row {
        padding: 12px;
        border-radius: 14px;
        border: 1px solid transparent;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 12px;
      }
      .row:hover {
        background: var(--surface-2);
        border-color: color-mix(in srgb, var(--border) 70%, transparent);
      }
      .row__title {
        font-weight: 800;
        color: var(--text);
      }
      .row__meta {
        margin-top: 4px;
        color: var(--muted);
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .dot {
        opacity: 0.6;
      }
      .row__desc {
        margin-top: 6px;
        color: var(--muted);
        font-size: 13px;
      }

      .row__actions {
        display: flex;
        gap: 6px;
      }
      .iconbtn {
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--muted);
        border-radius: 12px;
        padding: 8px;
        cursor: pointer;
      }
      .iconbtn:hover {
        background: var(--surface);
        color: var(--text);
        border-color: color-mix(in srgb, var(--primary) 20%, var(--border));
      }
      .iconbtn--danger:hover {
        border-color: color-mix(in srgb, var(--danger) 30%, var(--border));
        color: var(--danger);
      }

      .btn {
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--text);
        padding: 10px 12px;
        border-radius: 12px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        font-weight: 700;
      }
      .btn--primary {
        border-color: transparent;
        color: #fff;
        background: linear-gradient(135deg, var(--primary), var(--accent));
      }
      .btn--primary:hover {
        filter: brightness(1.03);
      }

      .loading {
        color: var(--muted);
        font-weight: 650;
      }

      .empty {
        display: grid;
        place-items: center;
        padding: 24px 12px;
        text-align: center;
        gap: 10px;
      }
      .empty__title {
        font-weight: 900;
        color: var(--text);
      }
      .empty__sub {
        color: var(--muted);
        font-size: 13px;
        max-width: 44ch;
      }
    `,
  ],
})
export class EventsPage implements OnInit, OnDestroy {
  private sub?: Subscription;

  events = signal<EventRecord[]>([]);
  loading = signal(false);
  viewMode = signal<EventViewMode>('list');
  selectedDateIso = signal<string>(new Date().toISOString().slice(0, 10));

  constructor(
    private readonly store: EventsStoreService,
    private readonly notifications: NotificationService,
  ) {}

  ngOnInit(): void {
    this.sub = this.store.state$.subscribe((s) => {
      this.events.set(s.items);
      this.loading.set(s.loading);
      this.viewMode.set(s.viewMode);
      this.selectedDateIso.set(s.selectedDateIso);
    });

    const initialSearch = localStorage.getItem('eo_search') ?? '';
    this.store.setSearch(initialSearch);

    const handler = (ev: Event) => {
      const v = (ev as CustomEvent<string>).detail ?? '';
      this.store.setSearch(v);
      void this.safeRefresh();
    };
    window.addEventListener('eo_search_changed', handler as any);

    void this.safeRefresh();

    // Cleanup listener in destroy by storing closure
    (this as any)._searchHandler = handler;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    const handler = (this as any)._searchHandler as ((ev: Event) => void) | undefined;
    if (handler) window.removeEventListener('eo_search_changed', handler as any);
  }

  setMode(mode: EventViewMode): void {
    this.store.setViewMode(mode);
  }

  setSelectedDate(iso: string): void {
    this.store.setSelectedDateIso(isoDateOf(iso));
  }

  async remove(id: string): Promise<void> {
    try {
      await this.store.remove(id);
      this.notifications.push('success', 'Event deleted');
      this.notifications.push('info', 'Reminder', 'Your schedule is now up to date.');
    } catch (e: any) {
      this.notifications.push('error', 'Delete failed', e?.message ?? 'Please try again.');
    }
  }

  trackById(_: number, item: EventRecord): string {
    return item.id;
  }

  private async safeRefresh(): Promise<void> {
    try {
      await this.store.refresh();
    } catch (e: any) {
      this.notifications.push('error', 'Could not load events', e?.message ?? 'Check your Supabase configuration.');
    }
  }
}
