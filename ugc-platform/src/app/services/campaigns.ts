import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

// Campaign model
export class Campaign {
  id?: number;
  name?: string;
  brand?: string;
  product?: string;
  image?: string;
  start_date?: string; // ISO string
  deadline?: string;   // ISO string
  price?: number;
  short_description?: string;
  full_description?: string;
}

// Service
@Injectable({
  providedIn: 'root',
})
export class CampaignsService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  // Get all campaigns
  async getCampaigns(): Promise<Campaign[]> {
    const { data, error } = await this.supabase.from('campaigns').select('*');
    if (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
    return (data as Campaign[]) || [];
  }

  // Add a new campaign
  async addCampaign(campaign: Campaign) {
    const { data, error } = await this.supabase.from('campaigns').insert([campaign]);
    if (error) console.error('Error adding campaign:', error);
    return data ?? [];
  }

  // Optional: add delete/update methods
}
