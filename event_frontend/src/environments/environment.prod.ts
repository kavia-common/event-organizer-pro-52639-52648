/**
 * Production environment configuration.
 */
export const environment = {
  production: true,

  supabaseUrl: (globalThis as any)?.process?.env?.['NG_APP_SUPABASE_URL'] ?? '',
  supabaseKey: (globalThis as any)?.process?.env?.['NG_APP_SUPABASE_KEY'] ?? '',

  apiBase: (globalThis as any)?.process?.env?.['NG_APP_API_BASE'] ?? '',
  backendUrl: (globalThis as any)?.process?.env?.['NG_APP_BACKEND_URL'] ?? '',
  wsUrl: (globalThis as any)?.process?.env?.['NG_APP_WS_URL'] ?? '',

  frontendUrl: (globalThis as any)?.process?.env?.['NG_APP_FRONTEND_URL'] ?? '',
  nodeEnv: (globalThis as any)?.process?.env?.['NG_APP_NODE_ENV'] ?? 'production'
};
