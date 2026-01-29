import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabaseClient } from '../supabase/supabase-client';
import { AppEnv } from '../config/app-env';

export interface AuthState {
  session: Session | null;
  user: User | null;
  initialized: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _state$ = new BehaviorSubject<AuthState>({
    session: null,
    user: null,
    initialized: false,
  });

  readonly state$: Observable<AuthState> = this._state$.asObservable();

  constructor() {
    const supabase = getSupabaseClient();

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        this._state$.next({ session: null, user: null, initialized: true });
        return;
      }
      this._state$.next({
        session: data.session ?? null,
        user: data.session?.user ?? null,
        initialized: true,
      });
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      this._state$.next({
        session: session ?? null,
        user: session?.user ?? null,
        initialized: true,
      });
    });
  }

  // PUBLIC_INTERFACE
  async signInWithPassword(email: string, password: string): Promise<void> {
    /** Sign in with email + password using Supabase. */
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  // PUBLIC_INTERFACE
  async signUp(email: string, password: string): Promise<void> {
    /** Sign up with email + password using Supabase. */
    const supabase = getSupabaseClient();
    const redirectTo = AppEnv.frontendUrl || undefined;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    if (error) throw error;
  }

  // PUBLIC_INTERFACE
  async signOut(): Promise<void> {
    /** Signs out the current session. */
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
}
