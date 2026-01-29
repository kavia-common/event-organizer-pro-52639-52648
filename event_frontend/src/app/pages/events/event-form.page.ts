import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EventsStoreService } from '../../core/services/events-store.service';
import { NotificationService } from '../../core/services/notification.service';
import { EventRecord, EventUpsertInput } from '../../core/models/event.models';
import { IconComponent } from '../../shared/ui/icon/icon.component';

function toLocalInputValue(iso: string): string {
  // Convert ISO -> datetime-local (approx; assumes ISO in UTC)
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day}T${hh}:${mm}`;
}

function fromLocalInputValue(v: string): string {
  // datetime-local is interpreted in local timezone; convert to ISO.
  return new Date(v).toISOString();
}

@Component({
  selector: 'app-event-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="wrap">
      <div class="card">
        <div class="card__top">
          <div>
            <div class="title">{{ isEdit() ? 'Edit event' : 'Create event' }}</div>
            <div class="sub">Keep details clear so notifications make sense later.</div>
          </div>

          <button class="btn btn--ghost" type="button" (click)="cancel()">
            <app-icon name="x"></app-icon>
            Close
          </button>
        </div>

        <form class="form" (ngSubmit)="submit()" #f="ngForm">
          <label class="field">
            <span>Title</span>
            <input name="title" required [(ngModel)]="title" />
          </label>

          <label class="field">
            <span>Description</span>
            <textarea name="description" rows="3" [(ngModel)]="description"></textarea>
          </label>

          <label class="field">
            <span>Location</span>
            <input name="location" [(ngModel)]="location" />
          </label>

          <div class="row2">
            <label class="field">
              <span>Starts</span>
              <input name="starts" type="datetime-local" required [(ngModel)]="startsLocal" />
            </label>
            <label class="field">
              <span>Ends</span>
              <input name="ends" type="datetime-local" required [(ngModel)]="endsLocal" />
            </label>
          </div>

          <label class="check">
            <input type="checkbox" name="allDay" [(ngModel)]="allDay" />
            <span>All day</span>
          </label>

          <div class="actions">
            <button class="btn" type="button" (click)="cancel()">Cancel</button>
            <button class="btn btn--primary" type="submit" [disabled]="busy() || !f.valid">
              {{ busy() ? 'Saving…' : isEdit() ? 'Save changes' : 'Create event' }}
            </button>
          </div>

          <div class="dangerZone" *ngIf="isEdit()">
            <div class="dangerZone__title">Danger zone</div>
            <button class="btn btn--danger" type="button" (click)="remove()">Delete event</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .wrap {
        display: grid;
        place-items: start center;
        padding: 10px 0;
      }
      .card {
        width: min(740px, 100%);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        box-shadow: var(--shadow);
        padding: 14px;
      }
      .card__top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        flex-wrap: wrap;
        padding-bottom: 12px;
        border-bottom: 1px solid color-mix(in srgb, var(--border) 55%, transparent);
        margin-bottom: 12px;
      }
      .title {
        font-size: 20px;
        font-weight: 900;
        color: var(--text);
      }
      .sub {
        margin-top: 6px;
        color: var(--muted);
        font-size: 13px;
      }

      .form {
        display: grid;
        gap: 12px;
      }
      .field span {
        display: block;
        font-size: 12px;
        color: var(--muted);
        margin-bottom: 6px;
      }
      .field input,
      .field textarea {
        width: 100%;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--text);
        outline: none;
        resize: vertical;
      }
      .field input:focus,
      .field textarea:focus {
        border-color: color-mix(in srgb, var(--primary) 55%, var(--border));
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 14%, transparent);
      }

      .row2 {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
      @media (max-width: 720px) {
        .row2 {
          grid-template-columns: 1fr;
        }
      }

      .check {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--text);
        font-weight: 650;
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding-top: 8px;
      }

      .btn {
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--text);
        padding: 10px 12px;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 750;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .btn--ghost {
        border-color: transparent;
        background: transparent;
        color: var(--muted);
      }
      .btn--ghost:hover {
        background: var(--surface-2);
        color: var(--text);
      }
      .btn--primary {
        border-color: transparent;
        color: #fff;
        background: linear-gradient(135deg, var(--primary), var(--accent));
      }
      .btn--primary:hover {
        filter: brightness(1.03);
      }
      .btn--danger {
        border-color: transparent;
        background: var(--danger);
        color: #fff;
      }

      .dangerZone {
        margin-top: 10px;
        padding-top: 12px;
        border-top: 1px solid color-mix(in srgb, var(--border) 55%, transparent);
        display: grid;
        gap: 8px;
      }
      .dangerZone__title {
        font-weight: 900;
        color: var(--danger);
      }
    `,
  ],
})
export class EventFormPage implements OnInit {
  id: string | null = null;

  title = '';
  description: string | null = null;
  location: string | null = null;
  startsLocal = '';
  endsLocal = '';
  allDay = false;

  busy = signal(false);

  private current?: EventRecord;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: EventsStoreService,
    private readonly notifications: NotificationService,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    // Load existing event from store if edit
    const anyStore = this.store as any;
    const state = anyStore?._state$?.value as { items: EventRecord[] } | undefined;

    if (this.id && state?.items) {
      this.current = state.items.find((e) => e.id === this.id);
      if (this.current) {
        this.title = this.current.title;
        this.description = this.current.description;
        this.location = this.current.location;
        this.startsLocal = toLocalInputValue(this.current.starts_at);
        this.endsLocal = toLocalInputValue(this.current.ends_at);
        this.allDay = this.current.all_day;
      }
    }

    if (!this.startsLocal) {
      const now = new Date();
      const later = new Date(now.getTime() + 60 * 60 * 1000);
      this.startsLocal = toLocalInputValue(now.toISOString());
      this.endsLocal = toLocalInputValue(later.toISOString());
    }
  }

  isEdit(): boolean {
    return !!this.id;
  }

  async submit(): Promise<void> {
    this.busy.set(true);
    try {
      const payload: EventUpsertInput = {
        title: this.title,
        description: this.description ?? null,
        location: this.location ?? null,
        starts_at: fromLocalInputValue(this.startsLocal),
        ends_at: fromLocalInputValue(this.endsLocal),
        all_day: this.allDay,
      };

      if (this.id) {
        await this.store.update(this.id, payload);
        this.notifications.push('success', 'Event updated');
        this.notifications.push('info', 'Notification scheduled', 'We will alert you as the time approaches (UX only).');
      } else {
        await this.store.create(payload);
        this.notifications.push('success', 'Event created');
        this.notifications.push('info', 'Notification scheduled', 'We will alert you as the time approaches (UX only).');
      }

      await this.router.navigateByUrl('/app');
    } catch (e: any) {
      this.notifications.push('error', 'Save failed', e?.message ?? 'Please try again.');
    } finally {
      this.busy.set(false);
    }
  }

  async remove(): Promise<void> {
    if (!this.id) return;
    this.busy.set(true);
    try {
      await this.store.remove(this.id);
      this.notifications.push('success', 'Event deleted');
      await this.router.navigateByUrl('/app');
    } catch (e: any) {
      this.notifications.push('error', 'Delete failed', e?.message ?? 'Please try again.');
    } finally {
      this.busy.set(false);
    }
  }

  async cancel(): Promise<void> {
    await this.router.navigateByUrl('/app');
  }
}
