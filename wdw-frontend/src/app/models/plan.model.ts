export type PlanMode = 'FIXED_DATE' | 'FIXED_ACTIVITY' | 'FLEXIBLE';
export type PlanStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Plan {
  id: string;
  name: string;
  mode: PlanMode;
  status: PlanStatus;
  hostId: string;
  date?: Date;
  activityName?: string;
  activityLocation?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanParticipant {
  id: string;
  planId: string;
  userId: string;
  role: 'HOST' | 'PARTICIPANT' | 'GUEST';
  joinedAt: Date;
}
