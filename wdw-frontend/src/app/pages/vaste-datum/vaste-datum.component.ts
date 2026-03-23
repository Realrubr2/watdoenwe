import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/layout/header/header.component';
import { MobileNavComponent } from '../../components/layout/mobile-nav/mobile-nav.component';
import { ActivityService, AuthService, PlanService } from '../../services';

@Component({
  selector: 'app-vaste-datum',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, MobileNavComponent],
  templateUrl: './vaste-datum.component.html'
})
export class VasteDatumComponent implements OnInit {
  newActivityTitle = signal('');
  newActivityDescription = signal('');
  newActivityLink = signal('');
  newActivityImageUrl = signal('');
  showAddModal = false;
  currentPlanId = signal<string | null>(null);
  planName = signal('Mijn Plan');

  activities = computed(() => {
    const planId = this.currentPlanId();
    return planId ? this.activityService.getActivitiesForPlan(planId) : [];
  });

  constructor(
    private activityService: ActivityService,
    private authService: AuthService,
    private planService: PlanService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get plan ID from route params
    this.route.params.subscribe(params => {
      const planId = params['id'];
      if (planId) {
        this.currentPlanId.set(planId);
        // Set as active plan and fetch activities
        this.planService.getPlan(planId).then(plan => {
          if (plan) {
            this.planService.setCurrentPlan(plan);
            this.planName.set(plan.name);
            this.activityService.fetchActivities(planId);
          }
        });
      }
    });
  }

  addActivity(): void {
    const title = this.newActivityTitle();
    if (!title) return;

    const user = this.authService.user();
    const planId = this.currentPlanId();
    if (!user || !planId) return;

    this.activityService.createActivity(
      planId,
      title,
      user.id,
      {
        description: this.newActivityDescription() || undefined,
        link: this.newActivityLink() || undefined,
        imageUrl: this.newActivityImageUrl() || undefined,
        category: 'OVERIG'
      }
    );

    this.newActivityTitle.set('');
    this.newActivityDescription.set('');
    this.newActivityLink.set('');
    this.newActivityImageUrl.set('');
  }
}
