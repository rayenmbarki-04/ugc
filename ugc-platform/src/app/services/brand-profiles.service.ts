// brand-profiles.service.ts
import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

// ---- Interfaces ----
export interface BrandProfile {
  id: string;
  brand_name: string;
  industry?: string;
  main_products?: string;
  visual_identity?: string;
  values?: string[];
}


// ---- Interfaces ----
export interface BrandProfile {
  id: string;
  brand_name: string;
  industry?: string;
  main_products?: string;
  visual_identity?: string;
  values?: string[];
}

export interface BrandProfileWithParent extends BrandProfile {
  profiles?: {
    full_name: string;
    email: string;
  };
}

// ---- Service ----
@Injectable({
  providedIn: 'root'
})
export class BrandProfilesService {

  constructor() {}
async getCurrentBrand(): Promise<BrandProfileWithParent | null> {
  // Get current session first
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    console.error('Error getting session:', sessionError);
    return null;
  }

  const userId = session?.user.id;
  if (!userId) return null;

  const { data, error } = await supabase
    .from('brand_profiles')
    .select(`*, profiles(full_name,email)`)
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching current brand:', error);
    return null;
  }

  return data as BrandProfileWithParent;
}

 

}
