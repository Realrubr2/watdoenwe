import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Idea, IdeaCategory, Vote } from '../models';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  private platformId = inject(PLATFORM_ID);
  private ideas = signal<Idea[]>([]);
  private votes = signal<Vote[]>([]);

  readonly allIdeas = this.ideas.asReadonly();

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

  getIdeasForPlan(planId: string): Idea[] {
    return this.ideas().filter(i => i.planId === planId);
  }

  createIdea(
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

  deleteIdea(id: string): void {
    this.ideas.update(ideas => ideas.filter(i => i.id !== id));
    this.votes.update(votes => votes.filter(v => v.ideaId !== id));
    this.saveToStorage();
  }

  voteForIdea(ideaId: string, userId: string): void {
    const existingVote = this.votes().find(
      v => v.ideaId === ideaId && v.userId === userId
    );

    if (existingVote) {
      return;
    }

    const vote: Vote = {
      id: crypto.randomUUID(),
      userId,
      ideaId,
      createdAt: new Date()
    };

    this.votes.update(votes => [...votes, vote]);
    this.ideas.update(ideas =>
      ideas.map(i =>
        i.id === ideaId
          ? { ...i, votes: i.votes + 1, hasVoted: true }
          : i
      )
    );
    this.saveToStorage();
  }

  removeVote(ideaId: string, userId: string): void {
    this.votes.update(votes =>
      votes.filter(v => !(v.ideaId === ideaId && v.userId === userId))
    );
    this.ideas.update(ideas =>
      ideas.map(i =>
        i.id === ideaId
          ? { ...i, votes: Math.max(0, i.votes - 1), hasVoted: false }
          : i
      )
    );
    this.saveToStorage();
  }

  toggleVote(ideaId: string, userId: string): void {
    const hasVoted = this.votes().some(
      v => v.ideaId === ideaId && v.userId === userId
    );

    if (hasVoted) {
      this.removeVote(ideaId, userId);
    } else {
      this.voteForIdea(ideaId, userId);
    }
  }

  getWinningIdea(planId: string): Idea | null {
    const planIdeas = this.getIdeasForPlan(planId);
    if (planIdeas.length === 0) return null;

    return planIdeas.reduce((max, idea) =>
      idea.votes > max.votes ? idea : max
    , planIdeas[0]);
  }
}
