import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {  UserRole } from '../../services/auth.service';
import { BrandAuthService ,BrandRole } from '../../services/Brand';

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
    brandName: '',
    industry: '',
    mainProducts: '',
    visualIdentity: '',
    values: '',
    brandType: 'Small_brand' // default value
  };

  error = '';
  loading = false;

  constructor(private router: Router, private brandAuth: BrandAuthService) {}

  async onSignup() {
    this.error = '';

    // --- validation ---
    if (!this.signupData.name || !this.signupData.email || !this.signupData.password || !this.signupData.brandName) {
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
      const email = this.signupData.email.trim().toLowerCase();
      const fullName = this.signupData.name.trim();
      const valuesArray = this.signupData.values
        ? this.signupData.values.split(',').map(v => v.trim())
        : [];

      const role: BrandRole = this.signupData.brandType as BrandRole; // small_brand or large_brand

      // --- brand data for brand_profiles table ---
      const brandData = {
        brandName: this.signupData.brandName.trim(),
       industry: this.signupData.industry.trim() || undefined,
mainProducts: this.signupData.mainProducts.trim() || undefined,
visualIdentity: this.signupData.visualIdentity.trim() || undefined,

        values: valuesArray
      };

      // ✅ Use the new BrandAuthService
      await this.brandAuth.signUpBrand({
        email,
        password: this.signupData.password,
        fullName,
        role,
        brandName: brandData.brandName,
        industry: brandData.industry,
        mainProducts: brandData.mainProducts,
        visualIdentity: brandData.visualIdentity,
        values: brandData.values
      });

      // redirect to login page
      this.router.navigate(['/login']);
    } catch (err: any) {
      console.error('Brand signup error:', err);
      this.error = err.message || JSON.stringify(err);
    } finally {
      this.loading = false;
    }
  }
}
