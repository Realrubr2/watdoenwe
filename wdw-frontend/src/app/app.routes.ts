import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'WDW? - Wat De Week?'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard - WDW?'
  },
  {
    path: 'gast-ervaring/:shareToken',
    loadComponent: () => import('./pages/guest-experience/guest-experience.component').then(m => m.GuestExperienceComponent),
    title: 'Welkom - WDW?'
  },
  {
    path: 'vaste-datum/:id',
    loadComponent: () => import('./pages/vaste-datum/vaste-datum.component').then(m => m.VasteDatumComponent),
    title: 'Vaste Datum - WDW?'
  },
  {
    path: 'vaste-activiteit/:id',
    loadComponent: () => import('./pages/vaste-activiteit/vaste-activiteit.component').then(m => m.VasteActiviteitComponent),
    title: 'Vaste Activiteit - WDW?'
  },
  {
    path: 'we-zien-wel/:id',
    loadComponent: () => import('./pages/we-zien-wel/we-zien-wel.component').then(m => m.WeZienWelComponent),
    title: 'We Zien Wel - WDW?'
  },
  {
    path: 'ideeenmuur',
    loadComponent: () => import('./pages/ideeenmuur/ideeenmuur.component').then(m => m.IdeeenmuurComponent),
    title: 'Ideeënmuur - WDW?'
  },
  {
    path: 'kalender-select',
    loadComponent: () => import('./pages/kalender-select/kalender-select.component').then(m => m.KalenderSelectComponent),
    title: 'Selecteer Beschikbaarheid - WDW?'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
