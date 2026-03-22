import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Idea, IdeaCategory, Vote } from '../models';
import { buildUrl, API_CONFIG } from '../config/api.config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  private ideas = signal<Idea[]>([]);
  private votes = signal<Vote[]>([]);
  private loading = signal<boolean>(false);

  readonly allIdeas = this.ideas.asReadonly();
  readonly isLoading = this.loading.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    const storedIdeas = localStorage.getItem('wdw_ideas');
    const storedVotes = localStorage.getItem('wdw_idea_votes');

    if (storedIdeas) {
      try {
        this.ideas.set(JSON.parse(storedIdeas));
      } catch {
        localStorage.removeItem('wdw_ideas');
      }
    }

    if (storedVotes) {
      try {
        this.votes.set(JSON.parse(storedVotes));
      } catch {
        localStorage.removeItem('wdw_idea_votes');
      }
    }
  }

  private saveToStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('wdw_ideas', JSON.stringify(this.ideas()));
      localStorage.setItem('wdw_idea_votes', JSON.stringify(this.votes()));
    }
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  async fetchIdeas(planId: string): Promise<void> {
    this.loading.set(true);
    try {
      const url = `${buildUrl(API_CONFIG.endpoints.ideas.list)}?planId=${planId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ideas');
      }

      const data = await response.json();
      
      // Transform backend response to Idea format
      const fetchedIdeas: Idea[] = (data.ideas || []).map((i: any) => ({
        id: i.id,
        title: i.title,
        description: i.description,
        address: i.address,
        link: i.link,
        category: i.category,
        planId: i.planId,
        createdBy: i.createdBy,
        imageUrl: i.imageUrl,
        votes: i.votes,
        hasVoted: false,
        createdAt: new Date(i.createdAt),
      }));

      // Merge with local ideas (keep local-only ones)
      const localIdeas = this.ideas().filter(i => i.planId !== planId);
      this.ideas.set([...localIdeas, ...fetchedIdeas]);
      this.saveToStorage();
    } catch (error) {
      console.error('Error fetching ideas:', error);
      // Keep local data on error
    } finally {
      this.loading.set(false);
    }
  }

  getIdeasForPlan(planId: string): Idea[] {
    return this.ideas().filter(i => i.planId === planId);
  }

  async createIdea(
    planId: string,
    title: string,
    createdBy: string,
    createdByUser: { id: string; name: string },
    options: {
      description?: string;
      address?: string;
      link?: string;
      category?: IdeaCategory;
      imageUrl?: string;
    } = {}
  ): Promise<Idea | null> {
    try {
      const response = await fetch(buildUrl(API_CONFIG.endpoints.ideas.create), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          title,
          description: options.description,
          address: options.address,
          link: options.link,
          category: options.category || 'OVERIG',
          imageUrl: options.imageUrl,
          planId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create idea');
      }

      const data = await response.json();
      
      const idea: Idea = {
        id: data.id,
        title: data.title,
        description: data.description,
        address: data.address,
        link: data.link,
        category: data.category,
        planId: data.planId,
        createdBy: data.createdBy,
        createdByUser,
        imageUrl: data.imageUrl,
        votes: data.votes,
        hasVoted: false,
        createdAt: new Date(data.createdAt),
      };

      this.ideas.update(ideas => [...ideas, idea]);
      this.saveToStorage();

      return idea;
    } catch (error) {
      console.error('Error creating idea:', error);
      // Fallback to local creation
      return this.createLocalIdea(planId, title, createdBy, createdByUser, options);
    }
  }

  private createLocalIdea(
    planId: string,
    title: string,
    createdBy: string,
    createdByUser: { id: string; name: string },
    options: {
      description?: string;
      address?: string;
      link?: string;
      category?: IdeaCategory;
      imageUrl?: string;
    }
  ): Idea {
    const idea: Idea = {
      id: crypto.randomUUID(),
      title,
      description: options.description,
      address: options.address,
      link: options.link,
      category: options.category || 'OVERIG',
      planId,
      createdBy,
      createdByUser,
      imageUrl: options.imageUrl,
      votes: 0,
      hasVoted: false,
      createdAt: new Date()
    };

    this.ideas.update(ideas => [...ideas, idea]);
    this.saveToStorage();

    return idea;
  }

  updateIdea(id: string, updates: Partial<Idea>): void {
    this.ideas.update(ideas =>
      ideas.map(i =>
        i.id === id ? { ...i, ...updates } : i
      )
    );
    this.saveToStorage();
  }

  async deleteIdea(id: string, planId: string): Promise<void> {
    try {
      const url = `${buildUrl(API_CONFIG.endpoints.ideas.delete(id))}?planId=${planId}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete idea');
      }
    } catch (error) {
      console.error('Error deleting idea:', error);
    }

    // Always remove locally
    this.ideas.update(ideas => ideas.filter(i => i.id !== id));
    this.votes.update(votes => votes.filter(v => v.ideaId !== id));
    this.saveToStorage();
  }

  voteForIdea(ideaId: string, userId: string): void {
    const existingVote = this.votes().find(
      v => v.ideaId === ideaId && v.userId === userId
    );

    if (!existingVote) {
      const vote: Vote = {
        id: crypto.randomUUID(),
        ideaId,
        userId,
        createdAt: new Date()
      };

      this.votes.update(votes => [...votes, vote]);
      
      // Increment vote count
      const idea = this.ideas().find(i => i.id === ideaId);
      if (idea) {
        this.updateIdea(ideaId, { votes: idea.votes + 1, hasVoted: true });
      }
    }
  }
}
