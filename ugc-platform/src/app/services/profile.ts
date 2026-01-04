import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  phone?: string;
  created_at?: string;

  // creator_profiles fields
  interests?: string[];
  platforms?: string[];
  daily_time?: string;
  preferred_content_types?: string[];
  instagram_link?: string;
  tiktok_link?: string;
  youtube_link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  /* =======================
     UPSERT (CREATE / UPDATE)
     Will create or update child (creator_profiles)
  ======================= */
 

  /* =======================
     GET FULL PROFILE BY USER ID
     Combines parent (profiles) + child (creator_profiles)
  ======================= */
  async getProfileById(userId: string): Promise<Profile | null> {
    // 1️⃣ Get creator-specific fields
    const { data: creatorData, error: creatorError } = await supabase
      .from('creator_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (creatorError && creatorError.code !== 'PGRST116') {
      throw creatorError;
    }

    // 2️⃣ Get parent info
    const { data: parentData, error: parentError } = await supabase
      .from('profiles')
      .select('full_name, email, role, phone, created_at')
      .eq('id', userId)
      .single();

    if (parentError && parentError.code !== 'PGRST116') {
      throw parentError;
    }

    // 3️⃣ Merge safely
    if (!creatorData && !parentData) return null;

    return {
      id: userId,
      full_name: parentData?.full_name || '',
      email: parentData?.email || '',
      role: parentData?.role || '',
      phone: parentData?.phone,
      created_at: parentData?.created_at,
      interests: creatorData?.interests || [],
      platforms: creatorData?.platforms || [],
      daily_time: creatorData?.daily_time || '',
      preferred_content_types: creatorData?.preferred_content_types || [],
      instagram_link: creatorData?.instagram_link || '',
      tiktok_link: creatorData?.tiktok_link || '',
      youtube_link: creatorData?.youtube_link || ''
    };
  }

  /* =======================
     UPDATE PROFILE
     Update only child table
  ======================= */
  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('creator_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /* =======================
     DELETE PROFILE
     Only deletes child, parent can remain
  ======================= */
  async deleteProfile(userId: string) {
    const { error } = await supabase
      .from('creator_profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    return true;
  }
}
