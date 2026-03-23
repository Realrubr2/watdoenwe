import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, PlanService } from '../../services';
import { Plan } from '../../models';
import { GuestNamePopupComponent } from '../../components/shared';

@Component({
  selector: 'app-guest-experience',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, GuestNamePopupComponent],
  templateUrl: './guest-experience.component.html'
})
export class GuestExperienceComponent implements OnInit, OnDestroy {
  guestName = signal('');
  hostName = signal('');
  eventName = signal('');
  hostInitial = signal('');
  plan = signal<Plan | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  
  showNamePopup = signal(false);

  private shareToken = '';

  constructor(
    private authService: AuthService,
    private planService: PlanService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get share token from route params
    this.route.params.subscribe(params => {
      this.shareToken = params['shareToken'];
      if (this.shareToken) {
        this.loadPlan();
      } else {
        // No token, show error
        this.error.set('Ongeldige link. Probeer de link opnieuw te openen.');
        this.loading.set(false);
      }
    });
  }

  ngOnDestroy(): void {}

  private async loadPlan(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      // First try to get plan by share token
      const plan = await this.planService.getPlanByShareToken(this.shareToken);
      
      if (plan) {
        this.plan.set(plan);
        this.eventName.set(plan.name);
        
        // For now, we'll show a generic host name until backend provides participant data
        this.hostName.set('De organisator');
        this.hostInitial.set('?');
        
        this.showNamePopup.set(true);
      } else {
        this.error.set('Plan niet gevonden. Controleer of de link correct is.');
      }
    } catch (err) {
      console.error('Error loading plan:', err);
      this.error.set('Er ging iets mis. Probeer later opnieuw.');
    } finally {
      this.loading.set(false);
    }
  }

  async enterPlan(name: string): Promise<void> {
    if (!name || name.trim().length < 2) return;

    try {
      // Create guest session with the provided name
      await this.authService.createGuestSession(name.trim());
      
      // Update local guest name signal
      this.guestName.set(name.trim());
      
      // Navigate to the appropriate page based on plan mode
      const currentPlan = this.plan();
      if (currentPlan) {
        const route = this.getPlanRoute(currentPlan.mode);
        this.router.navigate([route, currentPlan.id]);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch (err) {
      console.error('Error entering plan:', err);
      this.error.set('Er ging iets mis bij het joinen. Probeer opnieuw.');
    }
  }

  private getPlanRoute(mode: string): string {
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

  getPlanModeText(mode: string): string {
    switch (mode) {
      case 'FIXED_DATE': return 'Vaste datum';
      case 'FIXED_ACTIVITY': return 'Vaste activiteit';
      case 'FLEXIBLE': return 'We zien wel';
      default: return mode;
    }
  }
}
