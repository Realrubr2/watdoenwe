import { Creatable } from './base.model';

export type ActivityCategory = 'ETEN' | 'CULTUUR' | 'SPORT' | 'OVERIG';

export interface Activity extends Creatable {
  id: string;
  title: string;
  description?: string;
  address?: string;
  link?: string;
  category: ActivityCategory;
  planId: string;
  createdBy: string;
  imageUrl?: string;
  votes: number;
  hasVoted: boolean;
}

export interface Vote extends Creatable {
  id: string;
  userId: string;
  activityId?: string;
  ideaId?: string;
}
