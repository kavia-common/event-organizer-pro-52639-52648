import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// PUBLIC_INTERFACE
export const authGuard: CanActivateFn = async () => {
  /** Prevent access to /app routes unless signed in. */
  const auth = inject(AuthService);
  const router = inject(Router);

  const anyAuth = auth as any;
  const state = anyAuth?._state$?.value as { initialized: boolean; user: { id: string } | null } | undefined;

  if (state?.initialized && state?.user?.id) return true;

  // If not initialized yet, allow navigation; components will redirect if necessary.
  if (!state?.initialized) return true;

  await router.navigateByUrl('/login');
  return false;
};
