import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

// Campaign model
export class Campaign {
  id?: number;
  name?: string;
  brand?: string;
  publication_date?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  budget?: number;
  image?: string;

  brand_info?: {
    description: string;
    qualities: string[];
  };

  campaign_details?: {
    objective: string;
    content_type: string;
    platforms: string[];
    hashtag: string;
    product: { name: string; description: string };
    number_of_creators: number;
    spots_remaining: number;
    creator_type: string;
    your_mission: string;
    what_to_do: string[];
    what_not_to_do: string[];
  };

  submissions?: {
    id: number;
    user: {
      name: string;
      image?: string;
      insta: string;
     tiktok: string;
      instaFollowers: number;

      tiktokFollowers: number;
    };
        status: string;

    feedback: string;
        videoUrl: string;

  }[];
}

// Service
@Injectable({
  providedIn: 'root',
})
export class CampaignsService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  // ✅ Test upload method
  async testUpload() {
    try {
      // Make sure user is logged in
      const { data: { user }, error: userError } = await this.supabase.auth.getUser();
      if (userError || !user) {
        console.error('No logged-in user! Please sign in first.');
        return;
      }

      console.log('Logged-in user:', user);

      // Upload file
      const { data, error } = await this.supabase
        .storage
        .from('campaign-uploads')
        .upload(`test_${Date.now()}.txt`, new File(["hello world"], "test.txt"));

      if (error) {
        console.error('Upload failed:', error);
        return;
      }

      console.log('Upload succeeded:', data);

      // Get public URL
      const { data: publicUrlData } = this.supabase
        .storage
        .from('campaign-uploads')
        .getPublicUrl(data.path);

      console.log('Public URL:', publicUrlData.publicUrl);

    } catch (err) {
      console.error('Test upload exception:', err);
    }
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
async getCampaignById(id: number): Promise<Campaign> {
  // Fetch single campaign including submissions from DB
  const { data, error } = await this.supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return {
    ...data,
    submissions: data.submissions || []
  };
}

  // Add a new campaign
  async addCampaign(campaign: Campaign) {
    const { data, error } = await this.supabase.from('campaigns').insert([campaign]);
    if (error) console.error('Error adding campaign:', error);
    return data ?? [];
  }

  // Delete campaign
  async deleteCampaign(id: number) {
    const { data, error } = await this.supabase.from('campaigns').delete().eq('id', id);
    if (error) console.error('Error deleting campaign:', error);
    return data ?? [];
  }

  // Update campaign
  async updateCampaign(id: number, campaign: Partial<Campaign>) {
    const { data, error } = await this.supabase.from('campaigns').update(campaign).eq('id', id);
    if (error) console.error('Error updating campaign:', error);
    return data ?? [];
  }

  // Upload a submission to a campaign
 async uploadSubmission(campaignId: number, file: File) {
  try {
    const { data: { user }, error: userError } =
      await this.supabase.auth.getUser();
    if (userError || !user) throw new Error('User not logged in');

    const allowedTypes = ['image/', 'video/'];
    if (!allowedTypes.some(t => file.type.startsWith(t))) {
      throw new Error('Only images or videos are allowed');
    }

    const fileName = `${campaignId}/${user.id}_${Date.now()}_${file.name}`;

    const { error: uploadError } = await this.supabase
      .storage
      .from('campaign-uploads')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = this.supabase
      .storage
      .from('campaign-uploads')
      .getPublicUrl(fileName);

    const fileUrl = publicUrlData.publicUrl;

    const { data: campaignData, error: fetchError } = await this.supabase
      .from('campaigns')
      .select('submissions')
      .eq('id', campaignId)
      .single();

    if (fetchError) throw fetchError;

    const submissions = Array.isArray(campaignData?.submissions)
      ? campaignData.submissions
      : [];

    submissions.push({
      id: Date.now(),
      user: {
        name: user.email ?? 'Anonymous',
        image: '',
        insta: '',
        tiktok: '',
        instaFollowers: 0,
        tiktokFollowers: 0
      },
      status: 'pending',
      feedback: '',
      videoUrl: fileUrl
    });

    const { error: updateError } = await this.supabase
      .from('campaigns')
      .update({ submissions })
      .eq('id', campaignId);

    if (updateError) throw updateError;

    return fileUrl;

  } catch (err) {
    console.error('Upload error:', err);
    throw err;
  }
}
 
// Update submission feedback & status
async updateSubmission(
  campaignId: number,
  submissionId: number,
  status: string,
  feedback: string
) {
  try {
    // 1️⃣ Fetch campaign submissions
    const { data: campaignData, error: fetchError } = await this.supabase
      .from('campaigns')
      .select('submissions')
      .eq('id', campaignId)
      .single();

    if (fetchError) throw fetchError;

    const submissions = Array.isArray(campaignData?.submissions)
      ? campaignData.submissions
      : [];

    // 2️⃣ Get target submission
    const targetSubmission = submissions.find(
      s => s.id === submissionId
    );

    if (!targetSubmission) {
      throw new Error('Submission not found');
    }

    // 3️⃣ Update submissions array
    const updatedSubmissions = submissions.map(sub =>
      sub.id === submissionId
        ? { ...sub, status, feedback }
        : sub
    );

    // 4️⃣ Update campaign
    const { error: updateError } = await this.supabase
      .from('campaigns')
      .update({ submissions: updatedSubmissions })
      .eq('id', campaignId);

    if (updateError) throw updateError;

    // -----------------------
    // ✅ PHASE 5 — Notification
    // -----------------------
    await this.supabase.from('notifications').insert({
      user_id: targetSubmission.user?.id ?? null, // ⚠️ TEMP until auth.uid
      message:
        status === 'approved'
          ? '🎉 Your submission has been approved!'
          : '❌ Your submission has been declined. Check feedback.',
      type: status === 'approved' ? 'success' : 'warning'
    });

    // -----------------------
    // ✅ PHASE 7 — Save to user_submissions
    // -----------------------
   // -----------------------
// ✅ PHASE 7 — Save ONLY approved videos
// -----------------------
if (status === 'approved') {
  await this.supabase.from('user_submissions').insert({
    user_email: targetSubmission.user.name, // 👈 email
    campaign_id: campaignId,
    video_url: targetSubmission.videoUrl,
    feedback
  });
}


    return true;

  } catch (err) {
    console.error('Error updating submission:', err);
    throw err;
  }
}

async updateCampaignStatus(campaignId: number, status: string) {
    const { data, error } = await this.supabase
      .from('campaigns')
      .update({ status })
      .eq('id', campaignId);

    if (error) {
      console.error('Error updating campaign status:', error);
      throw error;
    }

    return data;
  }

}