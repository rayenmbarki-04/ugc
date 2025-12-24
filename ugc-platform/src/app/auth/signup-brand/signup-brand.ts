import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup-brand',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup-brand.html',
  styleUrls: ['./signup-brand.css']
})
export class SignupBrandComponent {
  signupData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    brandType: 'small',        // 'small' | 'large'
    budgetRange: '1000-5000',
    industry: ''
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
      const cleanEmail = this.signupData.email.trim().toLowerCase();
      const fullName = this.signupData.name.trim();

      // map brand type to role
      const role = this.signupData.brandType === 'large' ? 'enterprise' : 'brand';

      await this.auth.signUpWithProfile({
        email: cleanEmail,
        password: this.signupData.password,
        fullName,
        role
      });

      this.router.navigate(['/login']);
    } catch (err: any) {
      console.error('Brand signup error:', err);
      this.error = err.message || JSON.stringify(err);
    } finally {
      this.loading = false;
    }
  }
}
