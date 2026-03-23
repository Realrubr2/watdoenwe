import { Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/layout/header/header.component';
import { MobileNavComponent } from '../../components/layout/mobile-nav/mobile-nav.component';
import { SharePopupComponent, GuestNamePopupComponent } from '../../components/shared';
import { PlanService, AuthService } from '../../services';
import { PlanMode } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, MobileNavComponent, SharePopupComponent, GuestNamePopupComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  recentPlans = computed(() => this.planService.recentPlans());
  showSharePopup = signal(false);
  currentShareToken = signal('');
  currentSharePlanName = signal('');
  showCreatePlanModal = signal(false);
  showNamePopup = signal(false);
  planName = signal('');
  selectedMode = signal<PlanMode>('FLEXIBLE');
  selectedDate = signal<string>('');

  constructor(
    public planService: PlanService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch plans from API
    this.planService.fetchPlans();
  }

  get today(): string {
    return new Date().toISOString().split('T')[0];
  }

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

  openSharePopup(plan: any): void {
    this.currentShareToken.set(plan.shareToken || '');
    this.currentSharePlanName.set(plan.name);
    this.showSharePopup.set(true);
  }

  deletePlan(planId: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (confirm('Weet je zeker dat je dit plan wilt verwijderen?')) {
      this.planService.deletePlan(planId);
    }
  }

  openCreatePlanModal(): void {
    // Check if user is authenticated, if not show name popup first
    if (!this.authService.isAuthenticated()) {
      this.showNamePopup.set(true);
    } else {
      this.showCreatePlanModal.set(true);
    }
  }

  async onNameSubmit(name: string): Promise<void> {
    this.showNamePopup.set(false);
    await this.authService.createGuestSession(name);
    // Ensure the UI updates before showing the modal
    setTimeout(() => {
      this.showCreatePlanModal.set(true);
    }, 100);
  }

  selectPlanMode(mode: PlanMode): void {
    this.selectedMode.set(mode);
    if (mode !== 'FIXED_DATE') {
      this.selectedDate.set('');
    }
  }

  async createPlan(): Promise<void> {
    const name = this.planName().trim();
    if (!name) return;

    // For FIXED_DATE, require a date to be selected
    if (this.selectedMode() === 'FIXED_DATE' && !this.selectedDate()) {
      console.error('Please select a date for FIXED_DATE plan');
      return;
    }

    const user = this.authService.user();
    if (!user) {
      console.error('No user found, cannot create plan');
      return;
    }

    // Create plan name with date if FIXED_DATE mode
    const finalName = this.selectedMode() === 'FIXED_DATE' && this.selectedDate()
      ? `${name} - ${this.formatDate(this.selectedDate())}`
      : name;

    const plan = await this.planService.createPlan(finalName, this.selectedMode(), user.id);
    console.log('Create plan result:', plan);
    
    if (plan && plan.id) {
      this.showCreatePlanModal.set(false);
      this.planName.set('');
      this.selectedDate.set('');
      // Navigate to the appropriate page
      const route = this.getPlanRoute(plan.mode);
      console.log('Navigating to:', route, plan.id);
      this.router.navigate([route, plan.id]);
    } else {
      console.error('Plan creation failed or returned no id');
    }
  }

  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    };
    return date.toLocaleDateString('nl-NL', options);
  }
}
