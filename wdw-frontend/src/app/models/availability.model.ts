export type AvailabilityStatus = 'AVAILABLE' | 'MAYBE' | 'UNAVAILABLE';

export interface DateSlot {
  id: string;
  date: Date;
  planId: string;
  createdAt: Date;
}

export interface Availability {
  id: string;
  userId: string;
  dateSlotId: string;
  status: AvailabilityStatus;
  createdAt: Date;
  updatedAt: Date;
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
