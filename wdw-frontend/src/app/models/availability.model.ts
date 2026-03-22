import { Creatable, Timestamped } from './base.model';

export type AvailabilityStatus = 'AVAILABLE' | 'MAYBE' | 'UNAVAILABLE';

export interface DateSlot extends Creatable {
  id: string;
  date: Date;
  planId: string;
}

export interface Availability extends Timestamped {
  id: string;
  userId: string;
  dateSlotId: string;
  status: AvailabilityStatus;
}

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  participants: ParticipantAvailability[];
  availabilityCount: number;
  isPerfectMatch: boolean;
}

export interface ParticipantAvailability {
  userId: string;
  userName: string;
  userColor: string;
  status: AvailabilityStatus;
}

export interface DateMatch {
  date: Date;
  participantCount: number;
  totalParticipants: number;
  isPerfectMatch: boolean;
  participants: ParticipantAvailability[];
}
