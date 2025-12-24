// micro-influencer.component.ts
import { Component } from '@angular/core';

type PerfCard = {
  label: string;
  value: string;
  icon: string;
};

type TabKey = 'campaigns' | 'videos' | 'badges' | 'analytics';

type Campaign = {
  title: string;
  brand: string;
  tag: 'HOT' | 'TRENDING' | 'ACTIVE';
  description: string;
};

@Component({
  selector: 'app-micro-influencer',
  templateUrl: './micro-influencer-dashboard.html',
  styleUrls: ['./micro-influencer-dashboard.css'],
})
export class MicroInfluencerComponent {
  creatorName = 'Amira Saïdi';
  followers = 5200;

  unreadCount = 3;
  rating = 4.8;
  balance = 1250;
  currency = 'DT';

  activeTab: TabKey = 'campaigns';

  performanceRow1: PerfCard[] = [
    { label: 'AVG ENGAGEMENT', value: '8.2%', icon: '📈' },
    { label: 'VIDEO QUALITY', value: '4.8/5', icon: '⭐' },
    { label: 'BRAND FIT', value: 'Excellent', icon: '🎯' },
  ];

  performanceRow2: PerfCard[] = [
    { label: 'VIDEOS SUBMITTED', value: '18', icon: '🎬' },
    { label: 'APPROVED', value: '16', icon: '✅' },
    { label: 'TOTAL EARNED', value: `2840 ${this.currency}`, icon: '💵' },
  ];

  campaigns: Campaign[] = [
    {
      title: 'Tutto Sport Campaign',
      brand: 'Tutto Sport',
      tag: 'HOT',
      description: 'Showcase the latest sports gear in a short, dynamic video.',
    },
    {
      title: 'Vendi.tn Launch',
      brand: 'Vendi.tn',
      tag: 'TRENDING',
      description: 'Be part of the e-commerce revolution with authentic UGC content.',
    },
    {
      title: 'Fashion Collaboration',
      brand: 'LaMode.tn',
      tag: 'ACTIVE',
      description: 'Create trendy fashion content featuring the latest collection.',
    },
  ];

  setTab(tab: TabKey) {
    this.activeTab = tab;
  }

  trackByIdx = (i: number) => i;
}
