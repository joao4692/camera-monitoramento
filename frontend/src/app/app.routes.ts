import { Routes } from '@angular/router';
import { PublicStatus } from './features/public-status/public-status';
import { AdminLogin } from './features/admin-login/admin-login';
import { AdminDashboard } from './features/admin-dashboard/admin-dashboard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: PublicStatus },
  { path: 'admin/login', component: AdminLogin },
  { path: 'admin', component: AdminDashboard, canActivate: [authGuard] },
];
