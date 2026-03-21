import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CalendarService } from '../../services';

@Component({
  selector: 'app-kalender-select',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './kalender-select.component.html'
})
export class KalenderSelectComponent {
  currentDate = signal(new Date(2024, 2, 1)); // March 2024
  weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  selectedDates = signal<Date[]>([]);
  isPainting = signal(false);
  fingerPosition = signal({ x: 0, y: 0 });

  participants = [
    { id: '1', name: 'Jan' },
    { id: '2', name: 'Lisa' },
    { id: '3', name: 'Mark' }
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

  constructor(private calendarService: CalendarService) {}

  @HostListener('document:mouseup')
  onDocumentMouseUp(): void {
    this.isPainting.set(false);
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent): void {
    if (this.isPainting()) {
      this.fingerPosition.set({ x: event.clientX, y: event.clientY });
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

  startPaint(day: any): void {
    if (!day.isCurrentMonth) return;
    this.isPainting.set(true);
    this.toggleDate(day.date);
  }

  continuePaint(day: any): void {
    if (!this.isPainting() || !day.isCurrentMonth) return;
    this.addDate(day.date);
  }

  endPaint(): void {
    this.isPainting.set(false);
  }

  handleTouchMove(event: TouchEvent): void {
    if (!this.isPainting()) return;
    const touch = event.touches[0];
    this.fingerPosition.set({ x: touch.clientX, y: touch.clientY });
  }

  toggleDate(date: Date): void {
    const current = this.selectedDates();
    const index = current.findIndex(d => d.toDateString() === date.toDateString());

    if (index >= 0) {
      this.selectedDates.set(current.filter((_, i) => i !== index));
    } else {
      this.selectedDates.set([...current, date]);
    }
  }

  addDate(date: Date): void {
    const current = this.selectedDates();
    const exists = current.some(d => d.toDateString() === date.toDateString());

    if (!exists) {
      this.selectedDates.set([...current, date]);
    }
  }

  isDateSelected(day: any): boolean {
    return this.selectedDates().some(d => d.toDateString() === day.date.toDateString());
  }

  saveSelection(): void {
    const dates = this.selectedDates();
    if (dates.length === 0) return;

    console.log('Saving dates:', dates);
    alert(`${dates.length} dates saved!`);
  }
}
