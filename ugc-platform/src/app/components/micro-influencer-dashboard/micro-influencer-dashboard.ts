import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables, ChartData, ChartOptions } from 'chart.js';
import { CampaignsService } from '../../services/campaigns';
import { Campaign } from '../../services/campaigns';

import { BaseChartDirective } from 'ng2-charts';

// Register all chart types and plugins
Chart.register(...registerables);
@Component({
  selector: 'app-micro-influencer',
  templateUrl: './micro-influencer-dashboard.html',
  styleUrls: ['./micro-influencer-dashboard.css'],
  standalone: true,
    providers: [CampaignsService]  ,// <--- ADD THIS

  imports: [CommonModule, FormsModule, BaseChartDirective]
})
export class MicroInfluencerComponent implements OnInit {
  constructor(private campaignsService: CampaignsService) {}

  activeSection: string = 'dashboard';
  isBrowser: boolean = false; // <-- for client-only rendering

 notifications = [
  { message: 'Your report is ready', time: new Date() },
  { message: 'New comment on your post', time: new Date(Date.now() - 3600000) },
  { message: 'Your subscription will expire soon', time: new Date(Date.now() - 86400000) },
];
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


  contentPreference = {
    Humor: 50,
    Storytelling: 20,
    Aesthetic: 15,
    Informative: 15
  };

  badges: string[] = ['Top Influencer', 'Viral Post', 'Content Creator'];
  points: number = 4500;
  balance: number = 1200;

  showPersonalization: boolean = false;
  showHelp: boolean = false;

  user = {
    ageLocation: '25 / Tunis, Tunisia',
    interests: 'Mode, Beauté, Sport, Gaming, Musique, Voyage',
    platforms: 'Instagram, TikTok, YouTube',
    dailyTime: '3h',
    contentType: 'Humour, Storytelling, Esthétique, Informatif'
  };

  notifCampaignLaunch: boolean = true;
  notifDeadline: boolean = true;
  notifCampaignClose: boolean = true;
  notifPassword: boolean = true;

  async ngOnInit() {
  // Only render charts on the client
  this.isBrowser = typeof window !== 'undefined';

  // Fetch campaigns from Supabase
  this.campaigns = await this.campaignsService.getCampaigns();
}

  async addSampleCampaign() {
  const newCampaign: Campaign = {
    name: 'Bring your own bag - Maxxx chips pesto',
    brand: 'Maxxx chips',
    product: 'Maxxx pesto chips',
    image: 'assets/campaign1.jpg',
    start_date: new Date().toISOString(),
    deadline: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
    price: 50,
    short_description: 'Bring Maxxx Chips Pesto into the fastfood world...',
    full_description: 'Your mission: -Visit a local fastfood spot...'
  };
  await this.campaignsService.addCampaign(newCampaign);

  // Refresh campaigns
  this.campaigns = await this.campaignsService.getCampaigns();
}


  openPersonalization() { this.showPersonalization = true; }
  closePersonalization() { this.showPersonalization = false; }
  savePersonalization() {
    console.log('User info saved:', this.user);
    this.closePersonalization();
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

openCampaignPopup(campaign: any) {
  this.selectedCampaign = campaign;
}

closeCampaignPopup() {
  this.selectedCampaign = null;
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

}
