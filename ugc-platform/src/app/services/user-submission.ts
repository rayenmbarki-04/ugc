import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserSubmissionsService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  async getUserApprovedVideos(email: string) {
    const { data } = await this.supabase
      .from('user_submissions')
      .select('*')
      .eq('user_email', email   )
      .order('created_at', { ascending: false });

    return data ?? [];
  }
}
