import { Timestamped } from './base.model';

export type PlanMode = 'FIXED_DATE' | 'FIXED_ACTIVITY' | 'FLEXIBLE';
export type PlanStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Plan extends Timestamped {
  id: string;
  name: string;
  mode: PlanMode;
  status: PlanStatus;
  hostId: string;
  shareToken?: string;
  date?: Date;
  activityName?: string;
  activityLocation?: string;
}

export interface PlanParticipant {
  id: string;
  planId: string;
  userId: string;
  role: 'HOST' | 'PARTICIPANT' | 'GUEST';
  joinedAt: Date;
}
