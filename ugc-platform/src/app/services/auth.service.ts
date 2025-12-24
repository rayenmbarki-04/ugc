import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

export type UserRole = 'creator' | 'brand' | 'enterprise';

@Injectable({ providedIn: 'root' })
export class AuthService {

  async signUpWithProfile(params: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    creatorType?: string;
  }) {
    const { email, password, fullName, role, creatorType } = params;

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;
    const user = data.user;
    if (!user) throw new Error('No user returned from sign up');

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: fullName,
        role,
        email,
        creator_type: creatorType ?? null
      });

    if (profileError) throw profileError;

    return user;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data.user;
  }

  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  async signOut() {
    await supabase.auth.signOut();
  }
}
