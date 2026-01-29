import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand__logo">EO</div>
          <div class="brand__text">
            <div class="brand__title">Event Organizer</div>
            <div class="brand__sub">Pro</div>
          </div>
        </div>

        <nav class="nav" aria-label="Primary navigation">
          <a routerLink="/app" routerLinkActive="nav__item--active" class="nav__item">
            <span class="nav__icon"><app-icon name="calendar" /></span>
            <span>Events</span>
          </a>

          <a routerLink="/app/new" routerLinkActive="nav__item--active" class="nav__item">
            <span class="nav__icon"><app-icon name="plus" /></span>
            <span>New event</span>
          </a>
        </nav>

        <div class="sidebar__footer" *ngIf="authUserEmail() as email">
          <div class="user">
            <div class="user__dot"></div>
            <div class="user__meta">
              <div class="user__email">{{ email }}</div>
              <div class="user__hint">Signed in</div>
            </div>
          </div>

          <button class="btn btn--ghost" type="button" (click)="signOut()">
            <app-icon name="logout" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <div class="main">
        <header class="topbar">
          <div class="topbar__left">
            <div class="crumb">Event Organizer Pro</div>
          </div>

          <div class="topbar__right">
            <div class="search">
              <app-icon name="search" />
              <input
                type="search"
                placeholder="Search events..."
                [value]="searchValue()"
                (input)="onSearchInput($event)"
              />
              <button
                class="search__clear"
                type="button"
                *ngIf="searchValue().length > 0"
                (click)="setSearch('')"
                aria-label="Clear search"
              >
                <app-icon name="x" [size]="16"></app-icon>
              </button>
            </div>

            <button class="btn btn--ghost" type="button" (click)="toggleNotifications()" aria-label="Notifications">
              <span class="bell">
                <app-icon name="bell" />
                <span *ngIf="unreadCount() > 0" class="bell__badge">{{ unreadCount() }}</span>
              </span>
            </button>

            <div class="menu" *ngIf="showNotifications()">
              <div class="menu__header">
                <div class="menu__title">Notifications</div>
                <button class="btn btn--ghost btn--sm" type="button" (click)="markAllRead()">Mark all read</button>
              </div>

              <div class="menu__list" *ngIf="notificationsList().length > 0; else emptyNotifs">
                <button
                  type="button"
                  class="menu__item"
                  *ngFor="let n of notificationsList(); trackBy: trackById"
                  [class.menu__item--unread]="!n.read"
                  (click)="markRead(n.id)"
                >
                  <div class="menu__itemTitle">{{ n.title }}</div>
                  <div class="menu__itemMsg" *ngIf="n.message">{{ n.message }}</div>
                </button>
              </div>

              <ng-template #emptyNotifs>
                <div class="menu__empty">All caught up.</div>
              </ng-template>
            </div>
          </div>
        </header>

        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .shell {
        height: 100vh;
        background: var(--bg);
        display: grid;
        grid-template-columns: 260px 1fr;
      }

      .sidebar {
        background: var(--surface);
        border-right: 1px solid var(--border);
        padding: 16px;
        display: grid;
        grid-template-rows: auto 1fr auto;
        gap: 16px;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px;
        border-radius: 14px;
        background: linear-gradient(180deg, color-mix(in srgb, var(--primary) 10%, transparent), transparent);
        border: 1px solid color-mix(in srgb, var(--primary) 12%, var(--border));
      }
      .brand__logo {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        color: #fff;
        display: grid;
        place-items: center;
        font-weight: 800;
        letter-spacing: -0.02em;
      }
      .brand__title {
        font-weight: 700;
        color: var(--text);
        line-height: 1.05;
      }
      .brand__sub {
        font-size: 12px;
        color: var(--muted);
        margin-top: 2px;
      }

      .nav {
        display: grid;
        gap: 6px;
      }
      .nav__item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        color: var(--muted);
        text-decoration: none;
        border: 1px solid transparent;
      }
      .nav__item:hover {
        background: var(--surface-2);
        color: var(--text);
      }
      .nav__item--active {
        background: color-mix(in srgb, var(--primary) 10%, var(--surface));
        border-color: color-mix(in srgb, var(--primary) 18%, var(--border));
        color: var(--text);
      }
      .nav__icon {
        color: var(--primary);
      }

      .sidebar__footer {
        display: grid;
        gap: 10px;
      }
      .user {
        display: flex;
        gap: 10px;
        align-items: center;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid var(--border);
        background: var(--surface);
      }
      .user__dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--accent);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent);
      }
      .user__email {
        font-weight: 600;
        color: var(--text);
        font-size: 13px;
        max-width: 170px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .user__hint {
        font-size: 12px;
        color: var(--muted);
      }

      .main {
        display: grid;
        grid-template-rows: 64px 1fr;
        min-width: 0;
      }

      .topbar {
        position: sticky;
        top: 0;
        z-index: 40;
        background: color-mix(in srgb, var(--surface) 92%, transparent);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        gap: 16px;
      }
      .crumb {
        font-weight: 650;
        color: var(--text);
      }

      .topbar__right {
        display: flex;
        align-items: center;
        gap: 10px;
        position: relative;
      }

      .search {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 8px 10px;
        width: min(420px, 45vw);
      }
      .search app-icon {
        color: var(--muted);
      }
      .search input {
        border: 0;
        outline: none;
        flex: 1;
        background: transparent;
        color: var(--text);
        font-size: 14px;
      }
      .search__clear {
        border: 0;
        background: transparent;
        color: var(--muted);
        cursor: pointer;
        padding: 6px;
        border-radius: 10px;
      }
      .search__clear:hover {
        background: var(--surface-2);
        color: var(--text);
      }

      .bell {
        position: relative;
        display: inline-flex;
      }
      .bell__badge {
        position: absolute;
        top: -6px;
        right: -6px;
        background: var(--primary);
        color: #fff;
        border-radius: 999px;
        min-width: 18px;
        height: 18px;
        padding: 0 6px;
        font-size: 11px;
        display: grid;
        place-items: center;
        border: 2px solid var(--surface);
      }

      .menu {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        width: min(360px, calc(100vw - 32px));
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 14px;
        box-shadow: var(--shadow);
        overflow: hidden;
      }
      .menu__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        border-bottom: 1px solid var(--border);
      }
      .menu__title {
        font-weight: 700;
        color: var(--text);
      }
      .menu__list {
        max-height: 360px;
        overflow: auto;
      }
      .menu__item {
        width: 100%;
        text-align: left;
        border: 0;
        background: transparent;
        padding: 10px 12px;
        cursor: pointer;
        border-bottom: 1px solid color-mix(in srgb, var(--border) 55%, transparent);
      }
      .menu__item:hover {
        background: var(--surface-2);
      }
      .menu__item--unread .menu__itemTitle {
        color: var(--text);
        font-weight: 700;
      }
      .menu__itemTitle {
        color: var(--text);
        font-weight: 600;
        font-size: 13px;
      }
      .menu__itemMsg {
        margin-top: 2px;
        font-size: 12px;
        color: var(--muted);
      }
      .menu__empty {
        padding: 14px 12px;
        color: var(--muted);
        font-size: 13px;
      }

      .content {
        padding: 16px;
        min-width: 0;
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
      }
      .btn:hover {
        background: var(--surface-2);
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
      .btn--sm {
        padding: 7px 10px;
        border-radius: 10px;
        font-size: 12px;
      }

      @media (max-width: 980px) {
        .shell {
          grid-template-columns: 1fr;
        }
        .sidebar {
          display: none;
        }
        .search {
          width: min(420px, 55vw);
        }
      }
    `,
  ],
})
export class AppShellComponent {
  private readonly _showNotifications = signal(false);
  private readonly _searchValue = signal('');

  constructor(
    private readonly auth: AuthService,
    private readonly notifications: NotificationService,
  ) {}

  authUserEmail = computed(() => {
    const anyAuth = this.auth as any;
    const state = anyAuth?._state$?.value as { user: { email?: string } | null } | undefined;
    return state?.user?.email ?? null;
  });

  notificationsList = computed(() => {
    const any = this.notifications as any;
    const items = (any?._items$?.value ?? []) as { id: string; read: boolean; title: string; message?: string }[];
    return items;
  });

  unreadCount = computed(() => this.notificationsList().filter((n) => !n.read).length);

  showNotifications(): boolean {
    return this._showNotifications();
  }

  toggleNotifications(): void {
    this._showNotifications.set(!this._showNotifications());
  }

  markAllRead(): void {
    this.notifications.markAllRead();
  }

  markRead(id: string): void {
    this.notifications.markRead(id);
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  searchValue(): string {
    return this._searchValue();
  }

  onSearchInput(ev: Event): void {
    const target = ev.target as HTMLInputElement | null;
    const value = target?.value ?? '';
    this.setSearch(value);
  }

  setSearch(v: string): void {
    this._searchValue.set(v);
    // Broadcast through localStorage so the events page can pick it up without tight coupling.
    // In a larger app we'd use a shared store service; here we keep shell standalone.
    localStorage.setItem('eo_search', v);
    window.dispatchEvent(new CustomEvent('eo_search_changed', { detail: v }));
  }

  async signOut(): Promise<void> {
    await this.auth.signOut();
  }
}
