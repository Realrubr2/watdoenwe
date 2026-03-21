import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/layout/header/header.component';
import { MobileNavComponent } from '../../components/layout/mobile-nav/mobile-nav.component';
import { PlanService, AuthService } from '../../services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, MobileNavComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  recentPlans = computed(() => this.planService.recentPlans());

  constructor(
    private planService: PlanService,
    private authService: AuthService
  ) {}

  getPlanRoute(mode: string): string {
    switch (mode) {
      case 'FIXED_DATE': return '/vaste-datum';
      case 'FIXED_ACTIVITY': return '/vaste-activiteit';
      case 'FLEXIBLE': return '/we-zien-wel';
      default: return '/dashboard';
    }
  }

  getPlanStatusText(status: string): string {
    switch (status) {
      case 'DRAFT': return 'In afwachting van datum';
      case 'ACTIVE': return 'Actief';
      case 'COMPLETED': return 'Afgerond';
      case 'CANCELLED': return 'Geannuleerd';
      default: return status;
    }
  }
}
