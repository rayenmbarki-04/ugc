import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-small-brand-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './small-brand-dashboard.html',
  styleUrls: ['./small-brand-dashboard.css']
})
export class SmallBrandDashboardComponent {
  brand = {
    name: 'Local Cafe Co',
    type: 'Small Business',
    budget: 3500,
    activeCampaigns: 2,
    videosReviewed: 15,
    totalSpent: 2100
  };

  campaigns = [
    { id: 1, title: 'Cafe Grand Opening', status: 'active', budget: 1500, spent: 900, videos: 5, creators: 8 },
    { id: 2, title: 'Summer Menu Launch', status: 'draft', budget: 2000, spent: 0, videos: 0, creators: 0 }
  ];
}
