import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/layout/header/header.component';
import { MobileNavComponent } from '../../components/layout/mobile-nav/mobile-nav.component';
import { CalendarService } from '../../services';

@Component({
  selector: 'app-vaste-activiteit',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MobileNavComponent],
  templateUrl: './vaste-activiteit.component.html'
})
export class VasteActiviteitComponent {
  currentDate = signal(new Date());
  weekDays = ['MA', 'DI', 'WO', 'DO', 'VR', 'ZA', 'ZO'];

  participants = [
    { id: '1', name: 'Jan' },
    { id: '2', name: 'Lisa' },
    { id: '3', name: 'Mark' },
    { id: '4', name: 'Sarah' },
    { id: '5', name: 'Peter' }
  ];

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

  currentYear = computed(() => this.currentDate().getFullYear());

  constructor(private calendarService: CalendarService) {}

  previousMonth(): void {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const date = this.currentDate();
    this.currentDate.set(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  }
}
