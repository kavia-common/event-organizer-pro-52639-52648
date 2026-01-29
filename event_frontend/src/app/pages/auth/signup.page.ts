import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth">
      <div class="card">
        <div class="title">Create your account</div>
        <div class="sub">Use email + password to get started.</div>

        <form class="form" (ngSubmit)="submit()" #f="ngForm">
          <label class="field">
            <span>Email</span>
            <input name="email" type="email" required [(ngModel)]="email" autocomplete="email" />
          </label>

          <label class="field">
            <span>Password</span>
            <input name="password" type="password" required minlength="6" [(ngModel)]="password" autocomplete="new-password" />
          </label>

          <button class="btn btn--primary" type="submit" [disabled]="busy() || !f.valid">
            {{ busy() ? 'Creating…' : 'Create account' }}
          </button>

          <div class="links">
            <a routerLink="/login">Back to sign in</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .auth {
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: radial-gradient(
            1200px 700px at 10% 10%,
            color-mix(in srgb, var(--primary) 18%, transparent),
            transparent
          ),
          radial-gradient(
            1200px 700px at 90% 20%,
            color-mix(in srgb, var(--accent) 18%, transparent),
            transparent
          ),
          var(--bg);
        padding: 20px;
      }
      .card {
        width: min(420px, 100%);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        box-shadow: var(--shadow);
        padding: 18px;
      }
      .title {
        font-size: 20px;
        font-weight: 800;
        color: var(--text);
      }
      .sub {
        margin-top: 6px;
        color: var(--muted);
        font-size: 13px;
      }
      .form {
        margin-top: 14px;
        display: grid;
        gap: 12px;
      }
      .field span {
        display: block;
        font-size: 12px;
        color: var(--muted);
        margin-bottom: 6px;
      }
      .field input {
        width: 100%;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--text);
        outline: none;
      }
      .field input:focus {
        border-color: color-mix(in srgb, var(--primary) 55%, var(--border));
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 14%, transparent);
      }

      .btn {
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--text);
        padding: 10px 12px;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 650;
      }
      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .btn--primary {
        border-color: transparent;
        color: #fff;
        background: linear-gradient(135deg, var(--primary), var(--accent));
      }
      .btn--primary:hover {
        filter: brightness(1.03);
      }
      .links {
        text-align: center;
        margin-top: 6px;
      }
      .links a {
        color: var(--primary);
        text-decoration: none;
        font-weight: 650;
        font-size: 13px;
      }
    `,
  ],
})
export class SignupPage {
  email = '';
  password = '';
  busy = signal(false);

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly notifications: NotificationService,
  ) {}

  async submit(): Promise<void> {
    this.busy.set(true);
    try {
      await this.auth.signUp(this.email, this.password);
      this.notifications.push('success', 'Account created', 'Check your email if confirmation is required.');
      await this.router.navigateByUrl('/app');
    } catch (e: any) {
      this.notifications.push('error', 'Sign up failed', e?.message ?? 'Please try again.');
    } finally {
      this.busy.set(false);
    }
  }
}
