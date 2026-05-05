import { Routes } from '@angular/router';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: SearchBarComponent },
  { path: 'dashboard/:owner/:repo', component: DashboardComponent }
];