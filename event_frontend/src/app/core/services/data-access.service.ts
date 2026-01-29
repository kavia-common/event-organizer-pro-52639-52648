import { Injectable } from '@angular/core';
import { getSupabaseClient } from '../supabase/supabase-client';
import { AppEnv } from '../config/app-env';
import { EventRecord, EventUpsertInput } from '../models/event.models';

/**
 * Data access mode:
 * - 'supabase': read/write directly from Supabase
 * - 'backend': (future) read/write via backend REST
 *
 * We select 'backend' only when an API base/backend URL is configured.
 */
type DataMode = 'supabase' | 'backend';

function resolveMode(): DataMode {
  if (AppEnv.apiBase || AppEnv.backendUrl) return 'backend';
  return 'supabase';
}

@Injectable({ providedIn: 'root' })
export class DataAccessService {
  private readonly mode: DataMode = resolveMode();

  // PUBLIC_INTERFACE
  async listEvents(userId: string, search?: string): Promise<EventRecord[]> {
    /** List events for the given user with optional full-text-ish search (title/description/location). */
    if (this.mode === 'backend') {
      throw new Error('Backend mode not implemented yet. Configure Supabase or implement backend APIs.');
    }

    const supabase = getSupabaseClient();
    let query = supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('starts_at', { ascending: true });

    if (search && search.trim().length > 0) {
      // Simple ilike OR across common fields
      const s = `%${search.trim()}%`;
      query = query.or(`title.ilike.${s},description.ilike.${s},location.ilike.${s}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as EventRecord[];
  }

  // PUBLIC_INTERFACE
  async createEvent(userId: string, input: EventUpsertInput): Promise<EventRecord> {
    /** Create a new event for the user. */
    if (this.mode === 'backend') {
      throw new Error('Backend mode not implemented yet.');
    }

    const supabase = getSupabaseClient();
    const payload = {
      user_id: userId,
      title: input.title,
      description: input.description ?? null,
      location: input.location ?? null,
      starts_at: input.starts_at,
      ends_at: input.ends_at,
      all_day: input.all_day,
    };

    const { data, error } = await supabase.from('events').insert(payload).select('*').single();
    if (error) throw error;
    return data as EventRecord;
  }

  // PUBLIC_INTERFACE
  async updateEvent(userId: string, id: string, input: EventUpsertInput): Promise<EventRecord> {
    /** Update an existing event for the user. */
    if (this.mode === 'backend') {
      throw new Error('Backend mode not implemented yet.');
    }

    const supabase = getSupabaseClient();
    const payload = {
      title: input.title,
      description: input.description ?? null,
      location: input.location ?? null,
      starts_at: input.starts_at,
      ends_at: input.ends_at,
      all_day: input.all_day,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('events')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw error;
    return data as EventRecord;
  }

  // PUBLIC_INTERFACE
  async deleteEvent(userId: string, id: string): Promise<void> {
    /** Delete an event for the user. */
    if (this.mode === 'backend') {
      throw new Error('Backend mode not implemented yet.');
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.from('events').delete().eq('id', id).eq('user_id', userId);
    if (error) throw error;
  }
}
