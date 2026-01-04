    import { Component, OnInit } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { FormsModule } from '@angular/forms';
    import { Chart, registerables, ChartData, ChartOptions } from 'chart.js';
    import { CampaignsService } from '../../services/campaigns';
    import { Campaign } from '../../services/campaigns';
    import { NotificationsService } from '../../services/notifications';
    import { Notification as AppNotification } from '../../services/notifications';
import { UserSubmissionsService } from '../../services/user-submission';
  import { Router } from '@angular/router';
  import { AuthService } from '../../services/auth.service';
    import { BaseChartDirective } from 'ng2-charts';
import { ProfileService } from '../../services/profile';

    // Register all chart types and plugins
    Chart.register(...registerables);
    @Component({
      selector: 'app-micro-influencer',
      templateUrl: './micro-influencer-dashboard.html',
      styleUrls: ['./micro-influencer-dashboard.css'],
      standalone: true,

      imports: [CommonModule, FormsModule, BaseChartDirective]
    })
    export class MicroInfluencerComponent implements OnInit {
      constructor(
          private notificationsService: NotificationsService,
        private campaignsService: CampaignsService,
        private profileService: ProfileService,
          private userSubmissionsService: UserSubmissionsService, // <-- add this

      public auth: AuthService,
      private router: Router
    
      ) {
        
      }

      activeSection: string = 'dashboard';
      isBrowser: boolean = false; // <-- for client-only rendering

   
    // campaigns = [ ... ];  <-- remove or comment out
    campaigns: Campaign[] = [];

      // add more campaigns here

    dailyNotesArray = [
      { dailyNote: "Use multiple UGC formats: short videos, photos, and live streams for maximum engagement.", noteDate: new Date() },
      { dailyNote: "Leverage micro-influencers—they often drive higher trust and conversions.", noteDate: new Date() },
      { dailyNote: "Moderate content carefully: highlight the best submissions to reflect your brand positively.", noteDate: new Date() },
      { dailyNote: "Repurpose top-performing UGC across channels: email, social ads, and on-site visuals.", noteDate: new Date() },
      { dailyNote: "Incentivize participation with contests or rewards to boost UGC creation.", noteDate: new Date() },
      { dailyNote: "Use hashtags to centralize content and make it easily discoverable.", noteDate: new Date() },
      { dailyNote: "Measure engagement metrics like shares, comments, and conversions to optimize strategy.", noteDate: new Date() },
      { dailyNote: "Test immersive formats like AR, 360° videos, or filters to capture attention in 2025.", noteDate: new Date() },
      { dailyNote: "Integrate UGC into your product pages—it can increase purchase confidence significantly.", noteDate: new Date() },
      { dailyNote: "Always respect user rights and comply with legal guidelines when using their content.", noteDate: new Date() }
    ];
      stats = {
        followers: 12000,
        engagement: 5.6,
        shares: 320,
        comments: 180,
        postsToday: 2,
        hashtags: ['#fashion', '#lifestyle', '#trending']
      };


     

      badges: string[] = ['Top Influencer', 'Viral Post', 'Content Creator'];
      points: number = 4500;
      balance: number = 1200;
notifications: AppNotification[] = [];
      showPersonalization: boolean = false;
      showHelp: boolean = false;

         profile: any = {}; // will hold DB data
  

      notifCampaignLaunch: boolean = true;
      notifDeadline: boolean = true;
      notifCampaignClose: boolean = true;
      notifPassword: boolean = true;
currentUser: any = null;
mySubmission: any = null;
approvedVideos: any[] = [];

     async ngOnInit() {
  this.isBrowser = typeof window !== 'undefined';

  // 1️⃣ Get current user
  this.currentUser = await this.auth.getCurrentUser();

  if (this.currentUser?.email) {
    // 2️⃣ Fetch user notifications
    this.notifications = await this.notificationsService.getUserNotifications(this.currentUser.email);
    console.log('Fetched notifications:', this.notifications);
  }
  console.log('Interests:', this.profile.age);

  if (this.currentUser?.id) {
    // 3️⃣ Fetch profile from DB using currentUser.id
    this.profile = await this.profileService.getProfileById(this.currentUser.id) || {};

    // Convert arrays to comma-separated strings for inputs
    if (this.currentUser?.id) {
    this.profile = await this.profileService.getProfileById(this.currentUser.id) || {};

    // Convert arrays to strings for input fields
    this.profile.interestsString = (this.profile.interests || []).join(', ');
    this.profile.platformsString = (this.profile.platforms || []).join(', ');
    this.profile.preferredContentString = (this.profile.preferred_content_types || []).join(', ');
  }
  }

  // -----------------------------
  // ✅ PHASE 7: Load approved videos
  // -----------------------------
  if (this.currentUser?.email) {
    this.approvedVideos = await this.userSubmissionsService.getUserApprovedVideos(this.currentUser.email);
    console.log('User approved videos:', this.approvedVideos);
  }

  // Fetch campaigns
  this.campaigns = (await this.campaignsService.getCampaigns()).map(c => ({
    ...c,
    submissions: c.submissions || []
  }));
}

      openPersonalization() { this.showPersonalization = true; }
      closePersonalization() { this.showPersonalization = false; }
      async savePersonalization() {
    
    this.showPersonalization = false;
  }

      openHelp() { this.showHelp = true; }
      closeHelp() { this.showHelp = false; }

      // Charts
      followersData: ChartData<'line'> = {
        labels: ['Day 1','Day 2','Day 3','Day 4','Day 5','Day 6','Day 7'],
        datasets: [{
          data: [12000, 12100, 12300, 12450, 12600, 12750, 13000],
          label: 'Followers',
          fill: true,
          tension: 0.4,
          borderColor: '#244272',
          backgroundColor: 'rgba(36,66,114,0.2)'
        }]
      };

      followersOptions: ChartOptions<'line'> = { responsive: true, plugins: { legend: { display: false } } };

      engagementData: ChartData<'doughnut'> = {
        labels: ['Likes', 'Comments', 'Shares'],
        datasets: [{ data: [60,25,15], backgroundColor: ['#244272','#6e96ca','#d46957'] }]
      };

      engagementOptions: ChartOptions<'doughnut'> = { responsive: true, plugins: { legend: { position: 'bottom' } } };
 contentPreference = {
        Humor: 50,
        Storytelling: 20,
        Aesthetic: 15,
        Informative: 15
      };
      campaignsData: ChartData<'bar'> = {
        labels: ['Active', 'Completed', 'Upcoming'],
        datasets: [{ label: 'Campaigns', data: [1,1,0], backgroundColor: ['#244272','#6e96ca','#d46957'] }]
      };

      campaignsOptions: ChartOptions<'bar'> = { responsive: true, plugins: { legend: { display: false } } };

      contentData: ChartData<'radar'> = {
        labels: Object.keys(this.contentPreference),
        datasets: [{
          label: 'Content Preference %',
          data: Object.values(this.contentPreference),
          backgroundColor: 'rgba(36,66,114,0.2)',
          borderColor: '#244272',
          pointBackgroundColor: '#d46957'
        }]
      };

      contentOptions: ChartOptions<'radar'> = {
        responsive: true,
        scales: { r: { angleLines: { color: '#ccc' }, grid: { color: '#eee' }, min: 0, max: 100 } }
      };

      setActiveSection(section: string) { this.activeSection = section; }

        

    selectedCampaign: any = null;

  submissionExists: boolean = false;
async openCampaignPopup(campaign: any) {
  const fullCampaign = await this.campaignsService.getCampaignById(campaign.id);
 
 
 this.currentUser = await this.auth.getCurrentUser();

const mySub = (fullCampaign.submissions || []).find(
  (s: any) => s.user?.name === this.currentUser.email && s.videoUrl
);  

this.selectedCampaign = fullCampaign;
this.mySubmission = mySub;
this.submissionExists = !!mySub;

console.log('Current user submission:', this.mySubmission);

}


    closeCampaignPopup() {
      this.selectedCampaign = null;
    }
    
  async reserveSpot(campaign: Campaign) {
    
    if (!campaign.campaign_details?.spots_remaining || campaign.campaign_details.spots_remaining <= 0) {
      alert('Sorry, no spots left!');
      return;
    }

  if (this.submissionExists) {
    alert('You already submitted a video for this campaign.');
    return;
  }
    // Decrement locally
    campaign.campaign_details.spots_remaining--;

    try {
      // Update in the database
      await this.campaignsService.updateCampaign(campaign.id!, {
        campaign_details: { ...campaign.campaign_details }
      });
      alert('Spot reserved successfully!');
    } catch (error) {
      console.error('Error reserving spot:', error);
      alert('Failed to reserve spot. Try again.');
      // Revert local change
      campaign.campaign_details.spots_remaining++;
    }
  }

    // Badges definition
    badgesList = [
      { name: 'Découvreur', level: 'Bronze', pointsRequired: 100, icon: 'assets/badge1.png' },
      { name: 'Actif', level: 'Argent', pointsRequired: 300, icon: 'assets/badge2.png' },
      { name: 'Créateur engagé', level: 'Or', pointsRequired: 600, icon: 'assets/badge3.png' },
      { name: 'Influenceur confirmé', level: 'Diamant', pointsRequired: 1000, icon: 'assets/badge4.png' },
      { name: 'Icône UGC', level: 'Légendaire', pointsRequired: 2000, icon: 'assets/badge5.png' }
    ];

    // User points/actions
    userPoints = 450; // exemple, tu peux mettre le vrai total
    userActions = [
      { action: 'Publier une vidéo validée', points: 20 },
      { action: 'Recevoir un feedback positif', points: 15 },
      { action: 'Collaborer avec un autre créateur', points: 25 },
      { action: 'Participer à une mission sponsorisée', points: 30 },
      { action: 'Compléter une formation flash', points: 10 },
      { action: 'Donner un feedback utile', points: 10 }
    ];

    // Calcul du prochain badge et points restants
    get nextBadge() {
      return this.badgesList.find(b => b.pointsRequired > this.userPoints);
    }

    get pointsToNextBadge() {
      return this.nextBadge ? this.nextBadge.pointsRequired - this.userPoints : 0;
    }
    logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
// Currently selected file for upload
selectedFile: File | null = null;
uploadMessage: string = '';

// User selects file
onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
    this.uploadMessage = `Selected file: ${this.selectedFile.name}`;
  }
}

async submitFile() {
  if (!this.selectedFile || !this.selectedCampaign) {
    this.uploadMessage = 'Please select a file first.';
    return;
  }
  if (this.submissionExists) {
    this.uploadMessage = 'You already submitted a video for this campaign.';
    return;
  }
  this.uploadMessage = 'Uploading... ⏳';

  try {
    const fileUrl = await this.campaignsService.uploadSubmission(
      this.selectedCampaign.id!,
      this.selectedFile
    );

    if (!this.selectedCampaign.submissions) this.selectedCampaign.submissions = [];
    this.selectedCampaign.submissions.push({
      id: 0,
      user: {
        name: 'You',
        image: '',
        insta: '',
        tiktok: '',
        instaFollowers: 0,
        tiktokFollowers: 0
       
      },
            status: 'pending',
      feedback: '',
      videoUrl: fileUrl,
    });

    this.uploadMessage = 'File uploaded successfully! ✅';
    this.selectedFile = null;

  } catch (err: any) {
    console.error(err);
    this.uploadMessage = `Upload failed: ${err.message ?? err}`;
  }
}
async hasSubmitted(campaign: any): Promise<boolean> {
  if (!campaign?.submissions) return false;

  const user = await this.auth.getCurrentUser();
  if (!user) return false;

  // Check if there’s a submission for the current user with a video URL
  return campaign.submissions.some(
  (s: any) => s.user?.name === user.email && s.videoUrl
  );
}




    }