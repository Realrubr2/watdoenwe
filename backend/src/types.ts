// Base interfaces for common fields
export interface Timestamped {
  createdAt: Date;
  updatedAt?: Date;
}

export interface Creatable {
  createdAt: Date;
}


export interface User extends Timestamped {
  id: string;           // UUID
  name: string;         // Display name
  email?: string;       // Optional email
  isGuest: boolean;     // Always true for now
  guestToken?: string;  // Auth token
}


export type PlanMode = 'FIXED_DATE' | 'FIXED_ACTIVITY' | 'FLEXIBLE';
export type PlanStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Plan extends Timestamped {
  id: string;
  name: string;
  mode: PlanMode;
  status: PlanStatus;
  hostId: string;              // User who created the plan
  date?: Date;                 // For FIXED_DATE mode
  activityName?: string;       // For FIXED_ACTIVITY mode
  activityLocation?: string;   // For FIXED_ACTIVITY mode
}

export interface PlanParticipant {
  id: string;
  planId: string;
  userId: string;
  role: 'HOST' | 'PARTICIPANT' | 'GUEST';
  joinedAt: Date;
}


export type ActivityCategory = 'ETEN' | 'CULTUUR' | 'SPORT' | 'OVERIG';

export interface Activity extends Creatable {
  id: string;
  title: string;
  description?: string;
  address?: string;
  link?: string;
  category: ActivityCategory;
  planId: string;
  createdBy: string;     // User ID
  imageUrl?: string;
  votes: number;
  hasVoted: boolean;     // Computed field for current user
}


export type IdeaCategory = 'ETEN' | 'CULTUUR' | 'SPORT' | 'OVERIG';

export interface Idea extends Creatable {
  id: string;
  title: string;
  description?: string;
  address?: string;
  link?: string;
  category: IdeaCategory;
  planId: string;
  createdBy: string;     // User ID
  createdByUser?: {      // Populated on response
    id: string;
    name: string;
  };
  imageUrl?: string;
  votes: number;
  hasVoted: boolean;     // Computed field for current user
}


export type AvailabilityStatus = 'AVAILABLE' | 'MAYBE' | 'UNAVAILABLE';

export interface DateSlot extends Creatable {
  id: string;
  date: Date;        // ISO 8601 date string
  planId: string;
}

export interface Availability extends Timestamped {
  id: string;
  userId: string;
  dateSlotId: string;
  status: AvailabilityStatus;
}

export interface Vote extends Creatable {
  id: string;
  userId: string;
  activityId?: string;   // One of these must be set
  ideaId?: string;
}