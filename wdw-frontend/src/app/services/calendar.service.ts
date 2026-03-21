import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Availability, AvailabilityStatus, CalendarDay, DateSlot, DateMatch, ParticipantAvailability } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private platformId = inject(PLATFORM_ID);
  private dateSlots = signal<DateSlot[]>([]);
  private availabilities = signal<Availability[]>([]);

  readonly allDateSlots = this.dateSlots.asReadonly();
  readonly allAvailabilities = this.availabilities.asReadonly();

  readonly participantColors = [
    'rgba(70, 71, 211, 0.3)',
    'rgba(34, 197, 94, 0.3)',
    'rgba(239, 68, 68, 0.3)',
    'rgba(249, 115, 22, 0.3)',
    'rgba(168, 85, 247, 0.3)',
    'rgba(236, 72, 153, 0.3)',
  ];

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    const storedSlots = localStorage.getItem('wdw_date_slots');
    const storedAvailabilities = localStorage.getItem('wdw_availabilities');

    if (storedSlots) {
      try {
        this.dateSlots.set(JSON.parse(storedSlots));
      } catch {
        localStorage.removeItem('wdw_date_slots');
      }
    }

    if (storedAvailabilities) {
      try {
        this.availabilities.set(JSON.parse(storedAvailabilities));
      } catch {
        localStorage.removeItem('wdw_availabilities');
      }
    }
  }

  private saveToStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('wdw_date_slots', JSON.stringify(this.dateSlots()));
      localStorage.setItem('wdw_availabilities', JSON.stringify(this.availabilities()));
    }
  }

  getDateSlotsForPlan(planId: string): DateSlot[] {
    return this.dateSlots().filter(s => s.planId === planId);
  }

  createDateSlot(planId: string, date: Date): DateSlot {
    const slot: DateSlot = {
      id: crypto.randomUUID(),
      date,
      planId,
      createdAt: new Date()
    };

    this.dateSlots.update(slots => [...slots, slot]);
    this.saveToStorage();

    return slot;
  }

  getAvailabilityForPlan(planId: string): Availability[] {
    const slotIds = this.getDateSlotsForPlan(planId).map(s => s.id);
    return this.availabilities().filter(a => slotIds.includes(a.dateSlotId));
  }

  markAvailability(
    dateSlotId: string,
    userId: string,
    status: AvailabilityStatus
  ): void {
    const existing = this.availabilities().find(
      a => a.dateSlotId === dateSlotId && a.userId === userId
    );

    if (existing) {
      this.availabilities.update(availabilities =>
        availabilities.map(a =>
          a.id === existing.id
            ? { ...a, status, updatedAt: new Date() }
            : a
        )
      );
    } else {
      const availability: Availability = {
        id: crypto.randomUUID(),
        userId,
        dateSlotId,
        status,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.availabilities.update(availabilities => [...availabilities, availability]);
    }

    this.saveToStorage();
  }

  getCalendarDays(
    year: number,
    month: number,
    planId: string,
    participants: { id: string; name: string }[]
  ): CalendarDay[] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = (firstDay.getDay() + 6) % 7;

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push(this.createCalendarDay(date, false, today, planId, participants));
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push(this.createCalendarDay(date, true, today, planId, participants));
    }

    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(year, month + 1, day);
      days.push(this.createCalendarDay(date, false, today, planId, participants));
    }

    return days;
  }

  private createCalendarDay(
    date: Date,
    isCurrentMonth: boolean,
    today: Date,
    planId: string,
    participants: { id: string; name: string }[]
  ): CalendarDay {
    const dateSlot = this.dateSlots().find(
      s => s.planId === planId &&
        new Date(s.date).toDateString() === date.toDateString()
    );

    const dayAvailabilities = dateSlot
      ? this.availabilities().filter(a => a.dateSlotId === dateSlot.id)
      : [];

    const participantAvailability: ParticipantAvailability[] = dayAvailabilities.map((a, index) => {
      const participant = participants.find(p => p.id === a.userId);
      return {
        userId: a.userId,
        userName: participant?.name || 'Unknown',
        userColor: this.participantColors[index % this.participantColors.length],
        status: a.status
      };
    });

    const availableCount = participantAvailability.filter(
      p => p.status === 'AVAILABLE'
    ).length;

    return {
      date,
      dayNumber: date.getDate(),
      isCurrentMonth,
      isToday: date.toDateString() === today.toDateString(),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      participants: participantAvailability,
      availabilityCount: availableCount,
      isPerfectMatch: availableCount === participants.length && participants.length > 0
    };
  }

  getDateMatches(planId: string, participants: { id: string; name: string }[]): DateMatch[] {
    const slots = this.getDateSlotsForPlan(planId);
    const matches: DateMatch[] = [];

    for (const slot of slots) {
      const slotAvailabilities = this.availabilities().filter(
        a => a.dateSlotId === slot.id
      );

      const participantAvailability: ParticipantAvailability[] = slotAvailabilities.map((a, index) => {
        const participant = participants.find(p => p.id === a.userId);
        return {
          userId: a.userId,
          userName: participant?.name || 'Unknown',
          userColor: this.participantColors[index % this.participantColors.length],
          status: a.status
        };
      });

      const availableCount = participantAvailability.filter(
        p => p.status === 'AVAILABLE'
      ).length;

      matches.push({
        date: new Date(slot.date),
        participantCount: availableCount,
        totalParticipants: participants.length,
        isPerfectMatch: availableCount === participants.length && participants.length > 0,
        participants: participantAvailability
      });
    }

    return matches.sort((a, b) => b.participantCount - a.participantCount);
  }
}
