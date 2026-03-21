export type ActivityCategory = 'ETEN' | 'CULTUUR' | 'SPORT' | 'OVERIG';

export interface Activity {
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
  createdAt: Date;
}

export interface Vote {
  id: string;
  userId: string;
  activityId?: string;
  ideaId?: string;
  createdAt: Date;
}
