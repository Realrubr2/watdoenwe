import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/layout/header/header.component';
import { MobileNavComponent } from '../../components/layout/mobile-nav/mobile-nav.component';
import { SharePopupComponent } from '../../components/shared/share-popup/share-popup.component';
import { CalendarService, PlanService, AuthService } from '../../services';
import { DateMatch, Plan } from '../../models';
import { CalendarDay } from '../../models/availability.model';

interface DateRange {
  start: Date;
  end: Date;
  dates: Date[];
}

@Component({
  selector: 'app-vaste-activiteit',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MobileNavComponent, SharePopupComponent],
  templateUrl: './vaste-activiteit.component.html'
})
export class VasteActiviteitComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  calendarService = inject(CalendarService);
  private planService = inject(PlanService);
  authService = inject(AuthService);

  currentDate = signal(new Date());
  weekDays = ['MA', 'DI', 'WO', 'DO', 'VR', 'ZA', 'ZO'];
  
  planId = signal<string>('');
  plan = signal<Plan | null>(null);
  isLoading = signal(false);

  // Selection state - simple click-based range selection
  selectionStart = signal<Date | null>(null);
  selectionEnd = signal<Date | null>(null);
  confirmedRanges = signal<DateRange[]>([]);
  
  // Share popup state
  showSharePopup = signal(false);
  currentShareToken = signal('');
  
  // Get participant from auth service (current user only, no mock)
  participants = computed(() => {
    const user = this.authService.user();
    return user ? [{ id: user.id, name: user.name || 'Onbekend' }] : [];
  });

  calendarDays = computed(() => {
    const date = this.currentDate();
    const planId = this.planId();
    return this.calendarService.getCalendarDays(
      date.getFullYear(),
      date.getMonth(),
      planId,
      this.participants()
    );
  });

  monthName = computed(() => {
    const months = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
                    'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
    return months[this.currentDate().getMonth()];
  });

  currentYear = computed(() => this.currentDate().getFullYear());

  // Get best matches from calendar service
  bestMatches = computed(() => {
    const planId = this.planId();
    if (!planId) return [];
    return this.calendarService.getDateMatches(planId, this.participants(), 5);
  });

  // Check if there are any matches
  hasMatches = computed(() => this.bestMatches().length > 0);

  // Check if a date is in any confirmed range
  isDateInConfirmedRange(date: Date): boolean {
    const ranges = this.confirmedRanges();
    return ranges.some(range => 
      range.dates.some(d => d.getTime() === date.getTime())
    );
  }

  // Check if a date is in the current selection (between start and end)
  isDateInSelection(date: Date): boolean {
    const start = this.selectionStart();
    const end = this.selectionEnd();
    if (!start || !end) return false;
    
    const min = Math.min(start.getTime(), end.getTime());
    const max = Math.max(start.getTime(), end.getTime());
    return date.getTime() >= min && date.getTime() <= max;
  }

  async ngOnInit(): Promise<void> {
    // Get plan ID from route params
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.planId.set(id);
      await this.loadPlanData(id);
    }
  }

  private async loadPlanData(planId: string): Promise<void> {
    this.isLoading.set(true);
    try {
      // Fetch plan details
      await this.planService.fetchPlans();
      const plans = this.planService.allPlans();
      const foundPlan = plans.find(p => p.id === planId);
      if (foundPlan) {
        this.plan.set(foundPlan);
      }

      // Fetch date slots and availabilities for this plan
      await this.calendarService.fetchDateSlots(planId);
      await this.calendarService.fetchAvailabilities(planId);
    } catch (error) {
      console.error('Error loading plan data:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  previousMonth(): void {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  }

  onDayClick(day: CalendarDay): void {
    const clickedDate = day.date;
    
    // If no selection in progress, start new selection
    if (!this.selectionStart()) {
      this.selectionStart.set(clickedDate);
      this.selectionEnd.set(clickedDate);
      return;
    }

    // If already have a selection
    const start = this.selectionStart()!;
    const end = this.selectionEnd()!;
    
    // If clicked on start date, this is the end (single day selection)
    if (clickedDate.getTime() === start.getTime()) {
      this.selectionEnd.set(clickedDate);
      return;
    }
    
    // If clicked on end date, just confirm we understand it's the end
    // User must press the confirm button to actually save
    if (clickedDate.getTime() === end.getTime()) {
      return;
    }
    
    // If clicked date is before start, it becomes the new start
    if (clickedDate.getTime() < start.getTime()) {
      this.selectionStart.set(clickedDate);
      return;
    }
    
    // Otherwise, clicked date becomes the new end
    this.selectionEnd.set(clickedDate);
  }

  confirmSelection(): void {
    const start = this.selectionStart();
    const end = this.selectionEnd();
    
    if (!start || !end) return;

    // Calculate all dates in range
    const min = Math.min(start.getTime(), end.getTime());
    const max = Math.max(start.getTime(), end.getTime());
    
    const dates: Date[] = [];
    for (let t = min; t <= max; t += 86400000) {
      dates.push(new Date(t));
    }

    const newRange: DateRange = { start, end, dates };
    
    // Add to confirmed ranges
    this.confirmedRanges.update(ranges => [...ranges, newRange]);
    
    // Clear current selection
    this.selectionStart.set(null);
    this.selectionEnd.set(null);

    // Save to backend
    this.saveRangeToBackend(dates);
  }

  cancelSelection(): void {
    this.selectionStart.set(null);
    this.selectionEnd.set(null);
  }

  removeRange(index: number): void {
    this.confirmedRanges.update(ranges => ranges.filter((_, i) => i !== index));
  }

  private async saveRangeToBackend(dates: Date[]): Promise<void> {
    const planId = this.planId();
    const user = this.authService.user();
    if (!planId || !user) return;

    for (const date of dates) {
      const slot = await this.calendarService.getOrCreateDateSlot(planId, date);
      if (slot) {
        await this.calendarService.markAvailability(slot.id, user.id, 'AVAILABLE', planId);
      }
    }
  }

  selectMatch(match: DateMatch): void {
    console.log('Selected match:', match);
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    return date.toLocaleDateString('nl-NL', options);
  }

  formatShortDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short' 
    };
    return date.toLocaleDateString('nl-NL', options);
  }

  getParticipantCount(match: DateMatch): string {
    return `${match.participantCount}/${match.totalParticipants} Aanwezig`;
  }

  isPerfectMatch(match: DateMatch): boolean {
    return match.participantCount === match.totalParticipants && match.totalParticipants > 0;
  }

  getSelectionLabel(): string {
    const start = this.selectionStart();
    const end = this.selectionEnd();
    if (!start || !end) return '';
    
    if (start.getTime() === end.getTime()) {
      return this.formatShortDate(start);
    }
    
    return `${this.formatShortDate(start)} - ${this.formatShortDate(end)}`;
  }

  sharePlan(): void {
    const planData = this.plan();
    console.log('[VasteActiviteit] sharePlan called, plan:', planData);
    if (planData?.shareToken) {
      console.log('[VasteActiviteit] Setting shareToken:', planData.shareToken);
      this.currentShareToken.set(planData.shareToken);
    } else {
      console.log('[VasteActiviteit] No shareToken in plan, using planId:', this.planId());
      // Fallback: use plan ID as share token for older plans
      this.currentShareToken.set(this.planId());
    }
    console.log('[VasteActiviteit] currentShareToken:', this.currentShareToken());
    this.showSharePopup.set(true);
  }
}
