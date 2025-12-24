// influencer.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type EliteTabKey = 'premium' | 'collabs' | 'badges' | 'insights';

type StatCard = {
  label: string;
  value: string;
  footer: string;
};

type OfferTag = 'EXCLUSIVE' | 'FEATURED' | 'HOT';

type OfferCard = {
  tag: OfferTag;
  title: string;
  brand: string;
  description: string;
  reward: string;   // ex: "1200 DT"
  duration: string; // ex: "30 days"
};

@Component({
  selector: 'app-influencer-dashboard',
  standalone: true,
  templateUrl: './influencer-dashboard.html',
  styleUrl: './influencer-dashboard.css',
  imports: [CommonModule],
})

export class InfluencerDashboardComponent {
  // header
  creatorName = 'Yasmine El Maoui';
  followersText = '52000K followers • 9.2% engagement';
  unreadCount = 2;
  tier = 'PLATINUM';
  balance = 8750;
  currency = 'DT';

  // tabs
  activeTab: EliteTabKey = 'premium';

  // stats (top 4 cards)
  stats: StatCard[] = [
    { label: 'AVG ENGAGEMENT', value: '9.2%', footer: '↑ 2.1%' },
    { label: 'AUDIENCE GROWTH', value: '+2.5K', footer: '↑ Monthly' },
    { label: 'CONTENT QUALITY', value: '4.9/5', footer: '⭐ Excellent' },
    { label: 'BRAND COLLABORATIONS', value: '12', footer: '↑ This year' },
  ];

  // premium offers (cards)
  offers: OfferCard[] = [
    {
      tag: 'EXCLUSIVE',
      title: 'Premium Brand Partnership',
      brand: 'Luxury Brands Co',
      description: 'Exclusive collaboration for premium product line.',
      reward: `1200 ${this.currency}`,
      duration: '30 days',
    },
    {
      tag: 'FEATURED',
      title: 'Tech Influencer Series',
      brand: 'TechCorp Tunisia',
      description: 'Monthly tech reviews and tutorials.',
      reward: `950 ${this.currency}`,
      duration: '14 days',
    },
    {
      tag: 'HOT',
      title: 'Fashion Forward Campaign',
      brand: 'Fashion Elite',
      description: 'Seasonal fashion collection launch.',
      reward: `1500 ${this.currency}`,
      duration: '10 days',
    },
  ];

  setTab(tab: EliteTabKey) {
    this.activeTab = tab;
  }

  // Optional: use this in *ngFor trackBy for better performance
  trackByIdx = (i: number) => i;

  // Helper for tag CSS class in the HTML
  tagClass(tag: OfferTag) {
    switch (tag) {
      case 'EXCLUSIVE': return 'tag tag-gold';
      case 'FEATURED':  return 'tag tag-blue';
      case 'HOT':       return 'tag tag-pink';
    }
  }
}
