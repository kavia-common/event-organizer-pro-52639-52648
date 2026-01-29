import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppEnv } from '../config/app-env';

let _client: SupabaseClient | null = null;

// PUBLIC_INTERFACE
export function getSupabaseClient(): SupabaseClient {
  /**
   * Lazily create the Supabase client.
   * This keeps the rest of the app independent from initialization details.
   */
  if (_client) return _client;

  if (!AppEnv.supabaseUrl || !AppEnv.supabaseKey) {
    // We keep the client creation guarded to avoid confusing runtime errors.
    // App can still render login screen but will show error on actions.
    _client = createClient('http://invalid-supabase-url.local', 'invalid-key');
    return _client;
  }

  _client = createClient(AppEnv.supabaseUrl, AppEnv.supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return _client;
}
