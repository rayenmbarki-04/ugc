import { Component } from '@angular/core';

type StatCard = {
  label: string;
  value: string | number;
  icon: string;   // emoji for simplicity; swap with material/icons later
};

type NotificationItem = {
  title: string;
  meta: string;
  tone?: 'success' | 'info';
};

type TabKey = 'campaigns' | 'submissions' | 'earnings';

@Component({
  selector: 'normal-user-dashboard',
  templateUrl: './normal-user-dashboard.html',
  styleUrls: ['./normal-user-dashboard.css'],
})
export class NormalUserDashboardComponent {
  userName = 'Ali Bouali';
  balance = 250;
  currency = 'DT';
  unreadCount = 2;

  stats: StatCard[] = [
    { label: 'VIDEOS SUBMITTED', value: 3, icon: '🎥' },
    { label: 'TOTAL EARNED', value: `750 ${this.currency}`, icon: '💵' },
    { label: 'MEMBER SINCE', value: '6 months', icon: '🗓️' },
  ];

  notifications: NotificationItem[] = [
    { title: 'Your video was approved for Tutto Sport! +204 DT', meta: '2 hours ago', tone: 'success' },
    { title: 'New campaign available: Vendi.tn Launch', meta: '5 hours ago', tone: 'info' },
  ];

  activeTab: TabKey = 'campaigns';

  setTab(tab: TabKey) {
    this.activeTab = tab;
  }

  trackByIdx = (i: number) => i;
}
