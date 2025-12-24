import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-large-brand-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './large-brand-dashboard.html',
  styleUrls: ['./large-brand-dashboard.css']
})
export class LargeBrandDashboardComponent {
  brand = {
    name: 'Fashion Global Inc',
    type: 'Enterprise',
    budget: 150000,
    spent: 78500,
    activeCampaigns: 6,
    totalReach: '2.5M',
    engagement: '12.4%'
  };

  analytics = [
    { title: 'Total Reach', value: '2.5M', icon: '👥', trend: '↑ 24%' },
    { title: 'Avg Engagement', value: '12.4%', icon: '📊', trend: '↑ 3.2%' },
    { title: 'Conversion Rate', value: '4.8%', icon: '💳', trend: '↑ 1.1%' },
    { title: 'ROI', value: '340%', icon: '📈', trend: '↑ 18%' }
  ];

  campaigns = [
    { id: 1, title: 'Spring Collection 2025', status: 'active', budget: 35000, spent: 22500, reach: '850K', engagement: '11.2%', creators: 45, videos: 38 },
    { id: 2, title: 'Summer Campaign', status: 'planning', budget: 45000, spent: 0, reach: '0', engagement: '0%', creators: 0, videos: 0 },
    { id: 3, title: 'Holiday Season', status: 'completed', budget: 40000, spent: 40000, reach: '1.2M', engagement: '13.8%', creators: 60, videos: 55 }
  ];
}
