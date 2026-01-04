import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup-creator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup-creator.html',
  styleUrls: ['./signup-creator.css']
})
export class SignupCreatorComponent {
  // Step 1: common info for all creators
  step1Data = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'micro_influencer' | 'influencer'
  };

  // Step 2: common creator fields
  creatorData: any = {
    age: null,
    location: '',
    interests: [] as string[],
    platforms: [] as string[],
    daily_time: '',
    preferred_content_types: [] as string[],
    instagram_link: '',
    tiktok_link: '',
    youtube_link: ''
  };
// Predefined options
allInterests = ['Mode', 'Sport', 'Gaming', 'Food', 'Travel', 'Music'];
allPlatforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter'];
allContentTypes = ['Photo', 'Video', 'Reels', 'Stories'];
allCollaborationTypes = ['Sponsored Post', 'Product Review', 'Giveaway', 'Affiliate', 'Event Appearance'];

toggleSelection(array: string[], event: any) {
  const value = event.target.value;
  if (event.target.checked) {
    if (!array.includes(value)) array.push(value);
  } else {
    const index = array.indexOf(value);
    if (index > -1) array.splice(index, 1);
  }
}

  // Step 3: role-specific extra fields
  microInfluencerData: any = {
    content_experience_years: null,
    main_goal: '',
    followers_count: null,
    engagement_rate: null,
    communication_style: '',
    collaboration_history: '',
    describe_u: ''
  };

  influencerData: any = {
    management_agency: '',
    niche: '',
    audience_country: '',
    collaboration_types: [] as string[],
    previous_brand_collabs: false,
    pricing_range: '',
    average_reach: null
  };

  step = 1; // current step
  error = '';
  loading = false;

  constructor(private router: Router, private auth: AuthService) {}

  // Proceed from step 1 to step 2
  proceedToStep2() {
    this.error = '';

    if (!this.step1Data.name || !this.step1Data.email || !this.step1Data.password) {
      this.error = 'Please fill all required fields';
      return;
    }
    if (this.step1Data.password !== this.step1Data.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    if (this.step1Data.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    this.step = 2;
  }

  // Final signup submission
  async onSignup() {
    this.error = '';
    this.loading = true;

    try {
      const email = this.step1Data.email.trim().toLowerCase();
      const fullName = this.step1Data.name.trim();
      const role = this.step1Data.role;

      const payload: any = {
        email,
        password: this.step1Data.password,
        fullName,
        role,
        creatorData: this.creatorData
      };

      // attach role-specific data if needed
      if (role === 'micro_influencer') payload.microInfluencerData = this.microInfluencerData;
      if (role === 'influencer') payload.influencerData = this.influencerData;

      await this.auth.signUpWithProfile(payload);

      // redirect to login after successful signup
      this.router.navigate(['/login']);
    } catch (err: any) {
      console.error('Signup error:', err);
      this.error = err.message || JSON.stringify(err);
    } finally {
      this.loading = false;
    }
  }

  // Helpers to render role-specific step 3 fields
  isUser() {
    return this.step1Data.role === 'user';
  }
  isMicroInfluencer() {
    return this.step1Data.role === 'micro_influencer';
  }
  isInfluencer() {
    return this.step1Data.role === 'influencer';
  }
}
