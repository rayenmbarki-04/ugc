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

      await this.auth.signIn(email, password);

      const profile = await this.auth.getProfile();
      if (!profile) {
        this.error = 'Profile not found';
        return;
      }

      // high-level role decides "creator vs brand"
      if (profile.role === 'creator') {
        const type = profile.creator_type || 'user';

        if (type === 'micro') {
          this.router.navigate(['/dashboard/micro'], { state: { profile } });
        } else if (type === 'influencer') {
          this.router.navigate(['/dashboard/influencer'], { state: { profile } });
        } else {
          this.router.navigate(['/dashboard/user'], { state: { profile } });
        }
      } else if (profile.role === 'brand') {
        this.router.navigate(['/dashboard/brand/small'], { state: { profile } });
      } else if (profile.role === 'enterprise') {
        this.router.navigate(['/dashboard/brand/large'], { state: { profile } });
      } else {
        this.router.navigate(['/dashboard/user'], { state: { profile } });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      this.error = err.message || JSON.stringify(err);
    } finally {
      this.loading = false;
    }
  }
}
