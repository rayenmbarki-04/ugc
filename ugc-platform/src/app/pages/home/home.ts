import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  stats = [
    { value: '+3000', label: 'Content Creators' },
    { value: '+130', label: 'Campaigns' },
    { value: '+60', label: 'Brands' }
  ];

  creatorBenefits = [
    { icon: '🤝', title: 'Collaboration Opportunities', desc: 'Work with brands that align with your style and values.' },
    { icon: '💰', title: 'Earn Money', desc: 'Earn a rewarding income for your creativity and valuable contributions to campaigns.' },
    { icon: '🧩', title: 'Build Skills and Simplify Work', desc: 'Improve your skills with feedback and resources while managing all your projects in one place.' }
  ];

  constructor(private router: Router) {}

  navigateToCreatorSignup() {
    this.router.navigate(['/signup/creator']);
  }

  navigateToBrandSignup() {
    this.router.navigate(['/signup/brand']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
