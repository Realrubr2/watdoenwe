import { Creatable } from './base.model';

export type IdeaCategory = 'ETEN' | 'CULTUUR' | 'SPORT' | 'OVERIG';

export interface Idea extends Creatable {
  id: string;
  title: string;
  description?: string;
  address?: string;
  link?: string;
  category: IdeaCategory;
  planId: string;
  createdBy: string;
  createdByUser?: {
    id: string;
    name: string;
  };
  imageUrl?: string;
  votes: number;
  hasVoted: boolean;
}
