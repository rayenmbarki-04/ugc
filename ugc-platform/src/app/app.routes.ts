import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { SignupCreatorComponent } from './auth/signup-creator/signup-creator';
import { SignupBrandComponent } from './auth/signup-brand/signup-brand';
import { MicroInfluencerComponent } from './components/micro-influencer-dashboard/micro-influencer-dashboard';
import { SmallBrandDashboardComponent } from './components/small-brand-dashboard/small-brand-dashboard';
import { LargeBrandDashboardComponent } from './components/large-brand-dashboard/large-brand-dashboard';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup/creator', component: SignupCreatorComponent },
  { path: 'signup/brand', component: SignupBrandComponent },
  { path: 'dashboard/micro-influencer', component: MicroInfluencerComponent },
  { path: 'dashboard/brand/small', component: SmallBrandDashboardComponent },
  { path: 'dashboard/brand/large', component: LargeBrandDashboardComponent },
  { path: '**', redirectTo: '/login' }  
];
