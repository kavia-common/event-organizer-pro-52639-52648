import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-redirect-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wrap">
      <div class="card">
        <div class="title">Loading…</div>
        <div class="sub">Preparing your workspace.</div>
      </div>
    </div>
  `,
  styles: [
    `
      .wrap {
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: var(--bg);
        padding: 20px;
      }
      .card {
        width: min(520px, 100%);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        box-shadow: var(--shadow);
        padding: 18px;
        text-align: center;
      }
      .title {
        font-size: 18px;
        font-weight: 900;
        color: var(--text);
      }
      .sub {
        margin-top: 6px;
        color: var(--muted);
        font-size: 13px;
      }
    `,
  ],
})
export class RedirectPage implements OnInit, OnDestroy {
  private sub?: Subscription;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.sub = this.auth.state$.subscribe((s) => {
      if (!s.initialized) return;
      void this.router.navigateByUrl(s.user ? '/app' : '/login');
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
