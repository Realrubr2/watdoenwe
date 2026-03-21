import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/layout/header/header.component';
import { MobileNavComponent } from '../../components/layout/mobile-nav/mobile-nav.component';
import { IdeaService, CalendarService } from '../../services';

@Component({
  selector: 'app-we-zien-wel',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MobileNavComponent],
  templateUrl: './we-zien-wel.component.html'
})
export class WeZienWelComponent {
  activeTab = signal<'ideas' | 'calendar'>('ideas');
  currentDate = signal(new Date(2024, 7, 1)); // August 2024
  weekDays = ['MA', 'DI', 'WO', 'DO', 'VR', 'ZA', 'ZO'];

  participants = [
    { id: '1', name: 'Jan' },
    { id: '2', name: 'Lisa' },
    { id: '3', name: 'Mark' },
    { id: '4', name: 'Sarah' },
    { id: '5', name: 'Peter' },
    { id: '6', name: 'Emma' },
    { id: '7', name: 'Thomas' },
    { id: '8', name: 'Sophie' }
  ];

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
    return this.calendarService.getCalendarDays(
      date.getFullYear(),
      date.getMonth(),
      'demo-plan',
      this.participants
    );
  });

  monthName = computed(() => {
    const months = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
                    'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
    return months[this.currentDate().getMonth()];
  });

  constructor(
    private ideaService: IdeaService,
    private calendarService: CalendarService
  ) {}

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
    this.ideaService.toggleVote(ideaId, 'current-user');
  }
}
