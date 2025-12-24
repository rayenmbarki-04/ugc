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
  signupData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    creatorType: 'user',     // 'user' | 'micro' | 'influencer'
    followersRange: '0-1000',
    socialPlatform: 'tiktok',
    profileName: ''
  };

  error = '';
  loading = false;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  async onSignup() {
    this.error = '';

    if (!this.signupData.name || !this.signupData.email || !this.signupData.password) {
      this.error = 'Please fill all required fields';
      return;
    }

    if (this.signupData.password !== this.signupData.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.signupData.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;

    try {
      const role: 'creator' = 'creator';
      const cleanEmail = this.signupData.email.trim().toLowerCase();

      await this.auth.signUpWithProfile({
        email: cleanEmail,
        password: this.signupData.password,
        fullName: this.signupData.name.trim(),
        role,
        creatorType: this.signupData.creatorType
      });

      this.router.navigate(['/login']);
    } catch (err: any) {
      console.error('Signup error:', err);
      this.error = err.message || JSON.stringify(err);
    } finally {
      this.loading = false;
    }
  }
}
