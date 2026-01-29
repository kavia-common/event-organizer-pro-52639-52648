import { environment } from '../../../environments/environment';

/**
 * Provides a stable place to read environment variables from.
 * This is useful when later swapping from Supabase to backend APIs.
 */
export const AppEnv = {
  supabaseUrl: environment.supabaseUrl,
  supabaseKey: environment.supabaseKey,
  apiBase: environment.apiBase,
  backendUrl: environment.backendUrl,
  wsUrl: environment.wsUrl,
  frontendUrl: environment.frontendUrl,
  nodeEnv: environment.nodeEnv,
  production: environment.production,
};
