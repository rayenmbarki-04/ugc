import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

export type BrandRole = 'small_brand' | 'large_brand';

export interface BrandSignupData {
  fullName: string;
  email: string;
  password: string;
  role: BrandRole;
  brandName: string;
  industry?: string;
  mainProducts?: string;
  visualIdentity?: string;
  values?: string[]; // array
}

@Injectable({ providedIn: 'root' })
export class BrandAuthService {

  constructor() {}

  // ----------------------
  // Signup a new brand
  // ----------------------
  async signUpBrand(data: BrandSignupData) {
    // 1️⃣ Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password
    });
    if (authError) throw authError;
    const user = authData.user;
    if (!user) throw new Error('No user returned from sign up');

    // 2️⃣ Insert into profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: data.fullName,
        email: data.email,
        role: data.role
      });
    if (profileError) throw profileError;

    // 3️⃣ Insert into brand_profiles table
    const { error: brandError } = await supabase
      .from('brand_profiles')
      .insert({
        id: user.id,
        brand_name: data.brandName,
        industry: data.industry || null,
        main_products: data.mainProducts || null,
        visual_identity: data.visualIdentity || null,
        values: data.values || []
      });
    if (brandError) throw brandError;

    return user;
  }

  // ----------------------
  // Sign in brand
  // ----------------------
  async signInBrand(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  }

  // ----------------------
  // Get current brand profile
  // ----------------------
  async getCurrentBrand() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('brand_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching current brand:', error);
      return null;
    }

    return data;
  }

  async signOutBrand() {
    await supabase.auth.signOut();
  }
}
