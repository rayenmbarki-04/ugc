import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  error = '';
  loading = false;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  async onLogin() {
    this.error = '';
    this.loading = true;

    try {
      const email = this.credentials.email.trim().toLowerCase();
      const password = this.credentials.password;

      // 1️⃣ Attempt login
      const user = await this.auth.signIn(email, password);
      if (!user) {
        this.error = 'Invalid email or password';
        return;
      }

      // 2️⃣ Save user session
      this.auth.login(user.id); // <-- stores userId in localStorage

      // 3️⃣ Fetch profile
      const profile = await this.auth.getProfile();
      if (!profile) {
        this.error = 'Profile not found';
        return;
      }

      // 4️⃣ Route based on role
      const creatorRoles = ['user', 'micro_influencer', 'influencer'];
      const brandRoles = ['Small_brand', 'Large_brand'];

      if (creatorRoles.includes(profile.role)) {
  this.auth.login(profile.id);  // save session
  this.router.navigate(['/dashboard/micro-influencer']);
} else if (brandRoles.includes(profile.role)) {
  this.auth.login(profile.id);
  this.router.navigate(['/dashboard/brand/large']); // choose small or large based on your logic
} else {
  this.auth.login(profile.id);
  this.router.navigate(['/dashboard/creator']);
}

    } catch (err: any) {
      console.error('Login error:', err);
      this.error = err?.message || 'An unexpected error occurred';
    } finally {
      this.loading = false;
    }
  }
}
