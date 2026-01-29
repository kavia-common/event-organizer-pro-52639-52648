import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { DataAccessService } from './data-access.service';
import { EventRecord, EventUpsertInput, EventViewMode } from '../models/event.models';

export interface EventsState {
  loading: boolean;
  items: EventRecord[];
  viewMode: EventViewMode;
  search: string;
  selectedDateIso: string; // YYYY-MM-DD for calendar focus
}

function todayIsoDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

@Injectable({ providedIn: 'root' })
export class EventsStoreService {
  private readonly _state$ = new BehaviorSubject<EventsState>({
    loading: false,
    items: [],
    viewMode: 'list',
    search: '',
    selectedDateIso: todayIsoDate(),
  });

  readonly state$: Observable<EventsState> = this._state$.asObservable();

  readonly visibleEvents$: Observable<EventRecord[]> = combineLatest([this.state$]).pipe(
    map(([s]) => s.items),
  );

  constructor(
    private readonly auth: AuthService,
    private readonly data: DataAccessService,
  ) {}

  // PUBLIC_INTERFACE
  setViewMode(mode: EventViewMode): void {
    /** Switch between list and calendar views. */
    this._state$.next({ ...this._state$.value, viewMode: mode });
  }

  // PUBLIC_INTERFACE
  setSearch(search: string): void {
    /** Set search term for filtering in data layer. */
    this._state$.next({ ...this._state$.value, search });
  }

  // PUBLIC_INTERFACE
  setSelectedDateIso(iso: string): void {
    /** Set the active calendar date (YYYY-MM-DD). */
    this._state$.next({ ...this._state$.value, selectedDateIso: iso });
  }

  // PUBLIC_INTERFACE
  async refresh(): Promise<void> {
    /** Reload events from the active data source. */
    const userId = this.authSnapshotUserId();
    if (!userId) {
      this._state$.next({ ...this._state$.value, items: [], loading: false });
      return;
    }

    this._state$.next({ ...this._state$.value, loading: true });
    try {
      const { search } = this._state$.value;
      const items = await this.data.listEvents(userId, search);
      this._state$.next({ ...this._state$.value, items, loading: false });
    } catch {
      this._state$.next({ ...this._state$.value, loading: false });
      throw new Error('Failed to load events.');
    }
  }

  // PUBLIC_INTERFACE
  async create(input: EventUpsertInput): Promise<EventRecord> {
    /** Create an event and refresh the list. */
    const userId = this.authSnapshotUserId();
    if (!userId) throw new Error('Not signed in.');
    const created = await this.data.createEvent(userId, input);
    await this.refresh();
    return created;
  }

  // PUBLIC_INTERFACE
  async update(id: string, input: EventUpsertInput): Promise<EventRecord> {
    /** Update an event and refresh the list. */
    const userId = this.authSnapshotUserId();
    if (!userId) throw new Error('Not signed in.');
    const updated = await this.data.updateEvent(userId, id, input);
    await this.refresh();
    return updated;
  }

  // PUBLIC_INTERFACE
  async remove(id: string): Promise<void> {
    /** Delete an event and refresh the list. */
    const userId = this.authSnapshotUserId();
    if (!userId) throw new Error('Not signed in.');
    await this.data.deleteEvent(userId, id);
    await this.refresh();
  }

  private authSnapshotUserId(): string | null {
    // We keep it simple: BehaviorSubject in AuthService gives latest value via subscription.
    // For this store, we only need a quick synchronous snapshot:
    const anyAuth = this.auth as any;
    const state = anyAuth?._state$?.value as { user: { id: string } | null } | undefined;
    return state?.user?.id ?? null;
  }
}
