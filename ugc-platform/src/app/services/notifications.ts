import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

export interface Notification {
  id?: string;
  user_email: string;           // changed from user_id
  message: string;
  type?: 'info' | 'success' | 'warning';
  read?: boolean;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  // Get notifications for a specific user email
  async getUserNotifications(userEmail: string): Promise<Notification[]> {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('user_email', userEmail)     // updated filter
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return data ?? [];
  }

  // Add a new notification
  async addNotification(notification: Notification) {
    const { error } = await this.supabase
      .from('notifications')
      .insert(notification);

    if (error) {
      console.error('Error adding notification:', error);
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string) {
    const { error } = await this.supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
    }
  }
}
