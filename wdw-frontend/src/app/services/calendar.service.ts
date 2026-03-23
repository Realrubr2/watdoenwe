import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Availability, AvailabilityStatus, CalendarDay, DateSlot, DateMatch, ParticipantAvailability } from '../models';
import { buildUrl, API_CONFIG } from '../config/api.config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  private dateSlots = signal<DateSlot[]>([]);
  private availabilities = signal<Availability[]>([]);
  private loading = signal<boolean>(false);

  readonly allDateSlots = this.dateSlots.asReadonly();
  readonly allAvailabilities = this.availabilities.asReadonly();
  readonly isLoading = this.loading.asReadonly();

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

  private getAuthHeaders(): HeadersInit {
    const token = this.authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  async fetchDateSlots(planId: string): Promise<void> {
    this.loading.set(true);
    try {
      const url = `${buildUrl(API_CONFIG.endpoints.availability.dates)}?planId=${planId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch date slots');
      }

      const data = await response.json();
      
      // Transform backend response to DateSlot format
      const fetchedSlots: DateSlot[] = (data.dateSlots || []).map((s: any) => ({
        id: s.id,
        date: new Date(s.date),
        planId: s.planId,
        createdAt: new Date(s.createdAt),
      }));

      // Merge with local slots (keep local-only ones)
      const localSlots = this.dateSlots().filter(s => s.planId !== planId);
      this.dateSlots.set([...localSlots, ...fetchedSlots]);
      this.saveToStorage();
    } catch (error) {
      console.error('Error fetching date slots:', error);
      // Keep local data on error
    } finally {
      this.loading.set(false);
    }
  }

  async fetchAvailabilities(planId: string): Promise<void> {
    try {
      const url = `${buildUrl(API_CONFIG.endpoints.availability.list)}?planId=${planId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch availabilities');
      }

      const data = await response.json();
      
      // Transform backend response to Availability format
      const fetchedAvailabilities: Availability[] = (data.availabilities || []).map((a: any) => ({
        id: a.id,
        userId: a.userId,
        dateSlotId: a.dateSlotId,
        planId: a.planId,
        status: a.status,
        createdAt: new Date(a.createdAt),
      }));

      // Merge with local availabilities
      const localAvailabilities = this.availabilities();
      const merged = [...localAvailabilities];
      
      for (const fetched of fetchedAvailabilities) {
        const existingIndex = merged.findIndex(
          a => a.dateSlotId === fetched.dateSlotId && a.userId === fetched.userId
        );
        if (existingIndex >= 0) {
          merged[existingIndex] = fetched;
        } else {
          merged.push(fetched);
        }
      }

      this.availabilities.set(merged);
      this.saveToStorage();
    } catch (error) {
      console.error('Error fetching availabilities:', error);
      // Keep local data on error
    }
  }

  getDateSlotsForPlan(planId: string): DateSlot[] {
    return this.dateSlots().filter(s => s.planId === planId);
  }

  async createDateSlot(planId: string, date: Date): Promise<DateSlot | null> {
    try {
      const response = await fetch(buildUrl(API_CONFIG.endpoints.availability.dates), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          date: date.toISOString(),
          planId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create date slot');
      }

      const data = await response.json();
      
      const slot: DateSlot = {
        id: data.id,
        date: new Date(data.date),
        planId: data.planId,
        createdAt: new Date(data.createdAt),
      };

      this.dateSlots.update(slots => [...slots, slot]);
      this.saveToStorage();

      return slot;
    } catch (error) {
      console.error('Error creating date slot:', error);
      // Fallback to local creation
      return this.createLocalDateSlot(planId, date);
    }
  }

  private createLocalDateSlot(planId: string, date: Date): DateSlot {
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

  async markAvailability(
    dateSlotId: string,
    userId: string,
    status: AvailabilityStatus,
    planId: string
  ): Promise<void> {
    try {
      const url = `${buildUrl(API_CONFIG.endpoints.availability.set(dateSlotId))}?planId=${planId}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark availability');
      }

      const data = await response.json();
      
      const availability: Availability = {
        id: data.id,
        userId: data.userId,
        dateSlotId: data.dateSlotId,
        planId: data.planId,
        status: data.status,
        createdAt: new Date(data.createdAt),
      };

      // Update local state
      const existing = this.availabilities().find(
        a => a.dateSlotId === dateSlotId && a.userId === userId
      );

      if (existing) {
        this.availabilities.update(availabilities =>
          availabilities.map(a =>
            a.id === existing.id ? availability : a
          )
        );
      } else {
        this.availabilities.update(availabilities => [...availabilities, availability]);
      }
      
      this.saveToStorage();
    } catch (error) {
      console.error('Error marking availability:', error);
      // Fallback to local update
      this.markAvailabilityLocal(dateSlotId, userId, status);
    }
  }

  markAvailabilityLocal(
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
        createdAt: new Date()
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
    const days: CalendarDay[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get date slots and availabilities for this plan
    const dateSlots = this.getDateSlotsForPlan(planId);
    const availabilities = this.getAvailabilityForPlan(planId);

    // Get participant colors
    const colors = this.participantColors;

    // Add days from previous month to fill the first week
    const startDayOfWeek = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push(this.createCalendarDay(date, false, today, dateSlots, availabilities, participants, colors));
    }

    // Add days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push(this.createCalendarDay(date, true, today, dateSlots, availabilities, participants, colors));
    }

    // Add days from next month to fill the last week
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push(this.createCalendarDay(date, false, today, dateSlots, availabilities, participants, colors));
    }

    return days;
  }

  private createCalendarDay(
    date: Date,
    isCurrentMonth: boolean,
    today: Date,
    dateSlots: DateSlot[],
    availabilities: Availability[],
    participants: { id: string; name: string }[],
    colors: string[]
  ): CalendarDay {
    const dayNumber = date.getDate();
    const isToday = date.getTime() === today.getTime();
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    // Find matching date slot
    const slot = dateSlots.find(s => {
      const slotDate = new Date(s.date);
      slotDate.setHours(0, 0, 0, 0);
      return slotDate.getTime() === date.getTime();
    });

    // Get availabilities for this date
    const slotAvailabilities = slot
      ? availabilities.filter(a => a.dateSlotId === slot.id)
      : [];

    // Build participant availability
    const participantAvailabilities: ParticipantAvailability[] = participants.map((p, index) => {
      const availability = slotAvailabilities.find(a => a.userId === p.id);
      return {
        userId: p.id,
        userName: p.name,
        userColor: colors[index % colors.length],
        status: availability?.status || 'UNAVAILABLE',
      };
    });

    const availabilityCount = participantAvailabilities.filter(
      p => p.status === 'AVAILABLE'
    ).length;
    const isPerfectMatch =
      availabilityCount === participants.length && participants.length > 0;

    return {
      date,
      dayNumber,
      isCurrentMonth,
      isToday,
      isWeekend,
      participants: participantAvailabilities,
      availabilityCount,
      isPerfectMatch,
    };
  }
}
