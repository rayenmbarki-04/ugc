import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import { CampaignsService ,Campaign} from '../../services/campaigns';
import { BrandProfileWithParent } from '../../services/brand-profiles.service';
import { BrandProfilesService } from '../../services/brand-profiles.service';
function isGibberish(feedback: string): boolean {
  const cleaned = feedback.trim();
  if (!cleaned) return true; // empty

  // Reject if too short
  if (cleaned.length < 30) return true;

  // Reject if too few words
  const words = cleaned.split(/\s+/).filter(w => w.length > 1); // ignore single-letter words
  if (words.length < 5) return true;

  // Reject if long repeated character sequences (5+ same char)
  if (/(.)\1{4,}/.test(cleaned)) return true;

  // Reject if too many repeated words
  const wordCounts: Record<string, number> = {};
  for (const word of words) {
    const lower = word.toLowerCase();
    wordCounts[lower] = (wordCounts[lower] || 0) + 1;
    if (wordCounts[lower] > 2) return true; // any word repeated more than 2x
  }

  // Reject if too few letters (spammy like 12345 or symbols)
  const letters = cleaned.match(/[a-zA-Z]/g) || [];
  if (letters.length / cleaned.length < 0.5) return true;

  return false; // passes all checks
}

@Pipe({
  name: 'filterStatus',
  standalone: true
})
export class FilterStatusPipe implements PipeTransform {
  transform(campaigns: any[], status: string): any[] {
    if (!campaigns || !status) return campaigns;
    return campaigns.filter(c => c.status === status);
  }
}

@Pipe({
  name: 'filterByStatus',
  standalone: true
})
export class FilterByStatusPipe implements PipeTransform {
  transform(submissions: any[], status: string): any[] {
    if (!submissions || !status) return [];
    return submissions.filter(sub => sub.status === status);
  }
}

@Component({
  selector: 'app-large-brand-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule, BaseChartDirective ,FilterStatusPipe, FilterByStatusPipe],
  templateUrl: './large-brand-dashboard.html',
  styleUrls: ['./large-brand-dashboard.css']
})
export class LargeBrandDashboardComponent implements OnInit {
   brands: BrandProfileWithParent[] = [];
  loading: boolean = false;
showCreatePopup = false;

  Form: any = {
    name: '',
    brand: '',
    start_date: '',
    end_date: '',
    budget: null,
    image: '',
    description: '',
    qualities: '',
    objective: '',
    content_type: '',
    platforms: '',
    hashtag: '',
    product_name: '',
    product_description: '',
    number_of_creators: null,
    creator_type: '',
    your_mission: '',
    what_to_do: '',
    what_not_to_do: ''
  };
currentBrand: BrandProfileWithParent | null = null;
  campaigns: Campaign[] = [];

  constructor(private campaignsService: CampaignsService,
    private brandService: BrandProfilesService
  ) {}

  async ngOnInit() {
        this.loading = true;
try {
    this.currentBrand = await this.brandService.getCurrentBrand();
  } finally {
    this.loading = false;
  }
  // Fetch campaigns
  const campaigns = await this.campaignsService.getCampaigns();

  const now = new Date();

  for (const c of campaigns) {
    // Check if end_date has passed and campaign is not already closed
    if (c.status !== 'closed' && c.end_date && new Date(c.end_date) < now) {
      c.status = 'closed';

      // Only update if id exists
      if (c.id) {
        try {
          await this.campaignsService.updateCampaignStatus(c.id, 'closed');
        } catch (err) {
          console.error('Failed to update campaign status:', err);
        }
      }
    
    }
  }

  this.campaigns = campaigns;
}

  async createCampaign() {
    // Validate dates
    const startDate = this.Form.start_date ? new Date(this.Form.start_date) : null;
    const endDate = this.Form.end_date ? new Date(this.Form.end_date) : null;

    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Invalid start or end date');
      return;
    }

    const newCampaign: Campaign = {
      name: this.Form.name,
      brand: this.Form.brand,
      publication_date: new Date().toISOString(),
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      status: 'ongoing',
      budget: this.Form.budget,
      image: this.Form.image || 'assets/default-campaign.jpg',
      brand_info: {
        description: this.Form.description,
        qualities: this.Form.qualities
          ? this.Form.qualities.split(',').map((q: string) => q.trim())
          : []
      },
      campaign_details: {
        objective: this.Form.objective,
        content_type: this.Form.content_type,
        platforms: this.Form.platforms
          ? this.Form.platforms.split(',').map((p: string) => p.trim())
          : [],
        hashtag: this.Form.hashtag,
        product: {
          name: this.Form.product_name,
          description: this.Form.product_description
        },
        number_of_creators: this.Form.number_of_creators || 0,
        spots_remaining: this.Form.number_of_creators || 0,
        creator_type: this.Form.creator_type,
        your_mission: this.Form.your_mission,
        what_to_do: this.Form.what_to_do
          ? this.Form.what_to_do.split('\n').filter((x: string) => x.trim() !== '')
          : [],
        what_not_to_do: this.Form.what_not_to_do
          ? this.Form.what_not_to_do.split('\n').filter((x: string) => x.trim() !== '')
          : []
      },
      submissions: []
    };

    try {
      const result = await this.campaignsService.addCampaign(newCampaign);
      console.log('Campaign inserted:', result);

      // Update UI instantly
      this.campaigns.push(result[0]);

      // Close modal + reset form
      this.closeCreatePopup();
      this.resetForm();
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  }

  resetForm() {
    this.Form = {
      name: '',
      brand: '',
      start_date: '',
      end_date: '',
      budget: null,
      image: '',
      description: '',
      qualities: '',
      objective: '',
      content_type: '',
      platforms: '',
      hashtag: '',
      product_name: '',
      product_description: '',
      number_of_creators: null,
      creator_type: '',
      your_mission: '',
      what_to_do: '',
      what_not_to_do: ''
    };
  }

  openCreatePopup() {
    this.showCreatePopup = true;
  }

  closeCreatePopup() {
    this.showCreatePopup = false;
  }

  activeSection: string = 'dashboard';
  isBrowser = typeof window !== 'undefined';

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  company = {
    location: 'Tunis, Tunisia',
    email: 'contact@contonsi.com',
    social: '@contonsi'
  };

  notifications = [
    { message: 'New campaign submission received', time: new Date() },
    { message: 'Campaign approved', time: new Date() }
  ];

  stats = {
    totalCampaigns: 12,
    active: 4,
    completed: 8,
    avgFeedback: 87
  };


  submissionsData = { labels: ['Jan', 'Feb', 'Mar'], datasets: [{ data: [5, 12, 9], label: 'Submissions' }] };
  submissionsOptions = { responsive: true };

  campaignsData = { labels: ['Campaign A', 'Campaign B'], datasets: [{ data: [80, 55], label: 'Performance' }] };
  campaignsOptions = { responsive: true };

  feedbackData = { labels: ['Positive', 'Neutral', 'Negative'], datasets: [{ data: [70, 20, 10] }] };
  feedbackOptions = { responsive: true };

  

  selectedCampaign: any = null;

  openCampaignDetails(campaign: any) {
    this.selectedCampaign = campaign;
  }

  closeCampaignPopup() {
    this.selectedCampaign = null;
  }

  sendFeedback(submission: any) {
    console.log('Feedback sent:', submission.feedback);
  }

  reliabilityPoints = 120;

  badgesList = [
    { name: 'Découvreuse', level: 1, pointsRequired: 50, icon: 'assets/marque1.png' },
    { name: 'Active', level: 2, pointsRequired: 100, icon: 'assets/marque2.png' },
    { name: 'Dynamique ', level: 3, pointsRequired: 200, icon: 'assets/marque3.png' },
    { name: 'Prestige', level: 3, pointsRequired: 200, icon: 'assets/marque4.png' },
    { name: 'Icône du réseau', level: 3, pointsRequired: 200, icon: 'assets/marque5.png' }


  ];

  openPersonalization() {
    console.log('Edit profile');
  }

 
  openSettings() {
    console.log('Open settings');
  }
  async approveSubmission(submission: any, campaignId: number) {
  const feedback = submission.feedback?.trim() || '';

  if (isGibberish(feedback)) {
    alert(
      'Feedback is invalid! Must be at least 30 characters, 5 meaningful words, no repeated chars or words, and mostly letters.'
    );
    return;
  }

  try {
    await this.campaignsService.updateSubmission(campaignId, submission.id, 'approved', feedback);
    submission.status = 'approved';
    submission.showFeedback = false;
    console.log('Approved:', submission.user.name, '| Feedback:', feedback);
  } catch (err) {
    console.error('Failed to approve submission:', err);
  }
}



async declineSubmission(submission: any, campaignId: number) {
  try {
    await this.campaignsService.updateSubmission(campaignId, submission.id, 'declined', submission.feedback || '');
    submission.status = 'declined';
    submission.showFeedback = false;
    console.log('Declined:', submission.user.name);
  } catch (err) {
    console.error('Failed to decline submission:', err);
  }
}


activeTab: 'pending' | 'approved' | 'declined' = 'pending';

setStatus(submission: any, status: 'approved' | 'declined') {
  submission.status = status;
}


}