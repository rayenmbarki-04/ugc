import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

export type UserRole =
  | 'user'
  | 'micro_influencer'
  | 'influencer'
  | 'small_brand'
  | 'large_brand';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // ------------------------
  // Simple localStorage session
  // ------------------------
  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('userId');
  }

  login(userId: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('userId', userId);
  }

  logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('userId');
    this.signOut(); // optional: sign out from Supabase
  }

  getUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('userId');
  }

  // ------------------------
  // Supabase methods
  // ------------------------
  async signUpWithProfile(params: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    creatorData?: any;
    microInfluencerData?: any;
    influencerData?: any;
    brandData?: any;
  }) {
    const { email, password, fullName, role } = params;

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    const user = data.user;
    if (!user) throw new Error('No user returned from sign up');

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: user.id, full_name: fullName, role, email });
    if (profileError) throw profileError;

    switch(role) {
      case 'user':
        if (params.creatorData) {
          await supabase.from('creator_profiles').insert({ id: user.id, ...params.creatorData });
        }
        break;
      case 'micro_influencer':
        if (params.microInfluencerData) {
          await supabase.from('micro_influencer_details').insert({ id: user.id, ...params.microInfluencerData });
        }
        break;
      case 'influencer':
        if (params.influencerData) {
          await supabase.from('influencer_details').insert({ id: user.id, ...params.influencerData });
        }
        break;
      case 'small_brand':
      case 'large_brand':
        if (params.brandData) {
          await supabase.from('brand_profiles').insert({ id: user.id, ...params.brandData });
        }
        break;
    }

    return user;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  }

  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) throw error;

    let roleData: any = null;
    switch(profile.role) {
      case 'user':
        roleData = await supabase.from('creator_profiles').select('*').eq('id', user.id).single();
        break;
      case 'micro_influencer':
        roleData = await supabase.from('micro_influencer_details').select('*').eq('id', user.id).single();
        break;
      case 'influencer':
        roleData = await supabase.from('influencer_details').select('*').eq('id', user.id).single();
        break;
      case 'small_brand':
      case 'large_brand':
        roleData = await supabase.from('brand_profiles').select('*').eq('id', user.id).single();
        break;
    }

    return { ...profile, roleData: roleData?.data ?? null };
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  async signOut() {
    await supabase.auth.signOut();
  }
}
