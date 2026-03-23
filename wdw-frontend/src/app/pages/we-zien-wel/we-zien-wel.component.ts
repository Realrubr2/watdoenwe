import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/layout/header/header.component';
import { MobileNavComponent } from '../../components/layout/mobile-nav/mobile-nav.component';
import { SharePopupComponent } from '../../components/shared';
import { IdeaService, CalendarService, PlanService, AuthService } from '../../services';

@Component({
  selector: 'app-we-zien-wel',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MobileNavComponent, SharePopupComponent],
  templateUrl: './we-zien-wel.component.html'
})
export class WeZienWelComponent implements OnInit {
  activeTab = signal<'ideas' | 'calendar'>('ideas');
  currentDate = signal(new Date());
  weekDays = ['MA', 'DI', 'WO', 'DO', 'VR', 'ZA', 'ZO'];
  
  showSharePopup = signal(false);
  showAddIdeaModal = signal(false);
  
  newIdeaTitle = signal('');
  newIdeaDescription = signal('');
  newIdeaCategory = signal<string>('OVERIG');
  
  participants = signal<{ id: string; name: string }[]>([]);

  ideas = computed(() => this.ideaService.allIdeas());

  winningIdea = computed(() => {
    const allIdeas = this.ideas();
    if (allIdeas.length === 0) return null;
    return allIdeas.reduce((max, idea) => idea.votes > max.votes ? idea : max, allIdeas[0]);
  });

  secondaryIdeas = computed(() => {
    const allIdeas = this.ideas();
    const winning = this.winningIdea();
    return allIdeas.filter(i => i.id !== winning?.id).slice(0, 4);
  });

  calendarDays = computed(() => {
    const date = this.currentDate();
    const plan = this.planService.activePlan();
    return this.calendarService.getCalendarDays(
      date.getFullYear(),
      date.getMonth(),
      plan?.id || 'default',
      this.participants()
    );
  });

  monthName = computed(() => {
    const months = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
                    'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
    return months[this.currentDate().getMonth()];
  });

  constructor(
    private ideaService: IdeaService,
    private calendarService: CalendarService,
    private planService: PlanService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get plan from route params or active plan
    this.route.params.subscribe(params => {
      const planId = params['id'];
      if (planId) {
        this.planService.getPlan(planId).then(plan => {
          if (plan) {
            this.planService.setCurrentPlan(plan);
          }
        });
      }
    });

    // Load current plan if not set
    const currentPlan = this.planService.activePlan();
    if (!currentPlan) {
      // Try to load from route
      const planId = this.route.snapshot.params['id'];
      if (planId) {
        this.planService.getPlan(planId).then(plan => {
          if (plan) {
            this.planService.setCurrentPlan(plan);
          }
        });
      }
    }

    // Fetch ideas for the current plan
    const plan = this.planService.activePlan();
    if (plan) {
      this.ideaService.fetchIdeas(plan.id);
      this.calendarService.fetchDateSlots(plan.id);
      this.calendarService.fetchAvailabilities(plan.id);
    }

    // Set up participants from auth service
    const user = this.authService.user();
    if (user) {
      this.participants.set([{ id: user.id, name: user.name }]);
    }
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'ETEN': 'restaurant',
      'CULTUUR': 'museum',
      'SPORT': 'sports_soccer',
      'OVERIG': 'more_horiz'
    };
    return icons[category] || 'lightbulb';
  }

  toggleVote(ideaId: string): void {
    const user = this.authService.user();
    if (user) {
      this.ideaService.toggleVote(ideaId, user.id);
    }
  }

  openSharePopup(): void {
    this.showSharePopup.set(true);
  }

  closeSharePopup(): void {
    this.showSharePopup.set(false);
  }

  getShareToken(): string {
    const plan = this.planService.activePlan();
    return plan?.shareToken || '';
  }

  getPlanName(): string {
    const plan = this.planService.activePlan();
    return plan?.name || 'Mijn Plan';
  }

  openAddIdeaModal(): void {
    this.showAddIdeaModal.set(true);
  }

  closeAddIdeaModal(): void {
    this.showAddIdeaModal.set(false);
    this.newIdeaTitle.set('');
    this.newIdeaDescription.set('');
    this.newIdeaCategory.set('OVERIG');
  }

  async addIdea(): Promise<void> {
    const title = this.newIdeaTitle().trim();
    if (!title) return;

    const user = this.authService.user();
    const plan = this.planService.activePlan();
    
    if (!user || !plan) {
      console.error('No user or plan found');
      return;
    }

    await this.ideaService.createIdea(
      plan.id,
      title,
      user.id,
      { id: user.id, name: user.name },
      {
        description: this.newIdeaDescription().trim() || undefined,
        category: this.newIdeaCategory() as any,
      }
    );

    this.closeAddIdeaModal();
  }

  async toggleDateAvailability(date: Date): Promise<void> {
    const user = this.authService.user();
    const plan = this.planService.activePlan();
    
    if (!user || !plan) {
      console.error('No user or plan found');
      return;
    }

    // Get or create the date slot first
    const slot = await this.calendarService.getOrCreateDateSlot(plan.id, date);
    if (slot) {
      await this.calendarService.markAvailability(slot.id, user.id, 'AVAILABLE', plan.id);
    }
  }
}
