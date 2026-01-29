/**
 * Environment configuration for the application.
 * Note: values are provided at build-time via Angular's environment replacement OR at runtime via
 * injected globals. For this template, we read from process.env where available (SSR/build tooling).
 */
export const environment = {
  production: false,

  // Supabase (required for Supabase-first mode)
  supabaseUrl: (globalThis as any)?.process?.env?.['NG_APP_SUPABASE_URL'] ?? '',
  supabaseKey: (globalThis as any)?.process?.env?.['NG_APP_SUPABASE_KEY'] ?? '',

  // Future backend switching (optional)
  apiBase: (globalThis as any)?.process?.env?.['NG_APP_API_BASE'] ?? '',
  backendUrl: (globalThis as any)?.process?.env?.['NG_APP_BACKEND_URL'] ?? '',
  wsUrl: (globalThis as any)?.process?.env?.['NG_APP_WS_URL'] ?? '',

  frontendUrl: (globalThis as any)?.process?.env?.['NG_APP_FRONTEND_URL'] ?? '',
  nodeEnv: (globalThis as any)?.process?.env?.['NG_APP_NODE_ENV'] ?? 'development'
};
