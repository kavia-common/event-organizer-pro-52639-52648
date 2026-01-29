export type EventViewMode = 'list' | 'calendar';

export interface EventRecord {
  id: string;
  user_id: string;

  title: string;
  description: string | null;
  location: string | null;

  /**
   * ISO string; stored in UTC for consistency.
   * UI may display in local time.
   */
  starts_at: string;
  ends_at: string;

  all_day: boolean;

  created_at?: string;
  updated_at?: string;
}

export interface EventUpsertInput {
  id?: string;
  title: string;
  description?: string | null;
  location?: string | null;
  starts_at: string;
  ends_at: string;
  all_day: boolean;
}
