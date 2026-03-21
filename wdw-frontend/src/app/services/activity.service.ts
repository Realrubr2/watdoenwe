import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Activity, ActivityCategory, Vote } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private platformId = inject(PLATFORM_ID);
  private activities = signal<Activity[]>([]);
  private votes = signal<Vote[]>([]);

  readonly allActivities = this.activities.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    const storedActivities = localStorage.getItem('wdw_activities');
    const storedVotes = localStorage.getItem('wdw_votes');

    if (storedActivities) {
      try {
        this.activities.set(JSON.parse(storedActivities));
      } catch {
        localStorage.removeItem('wdw_activities');
      }
    }

    if (storedVotes) {
      try {
        this.votes.set(JSON.parse(storedVotes));
      } catch {
        localStorage.removeItem('wdw_votes');
      }
    }
  }

  private saveToStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('wdw_activities', JSON.stringify(this.activities()));
      localStorage.setItem('wdw_votes', JSON.stringify(this.votes()));
    }
  }

  getActivitiesForPlan(planId: string): Activity[] {
    return this.activities().filter(a => a.planId === planId);
  }

  createActivity(
    planId: string,
    title: string,
    createdBy: string,
    options: {
      description?: string;
      address?: string;
      link?: string;
      category?: ActivityCategory;
      imageUrl?: string;
    } = {}
  ): Activity {
    const activity: Activity = {
      id: crypto.randomUUID(),
      title,
      description: options.description,
      address: options.address,
      link: options.link,
      category: options.category || 'OVERIG',
      planId,
      createdBy,
      imageUrl: options.imageUrl,
      votes: 0,
      hasVoted: false,
      createdAt: new Date()
    };

    this.activities.update(activities => [...activities, activity]);
    this.saveToStorage();

    return activity;
  }

  updateActivity(id: string, updates: Partial<Activity>): void {
    this.activities.update(activities =>
      activities.map(a =>
        a.id === id ? { ...a, ...updates } : a
      )
    );
    this.saveToStorage();
  }

  deleteActivity(id: string): void {
    this.activities.update(activities => activities.filter(a => a.id !== id));
    this.votes.update(votes => votes.filter(v => v.activityId !== id));
    this.saveToStorage();
  }

  voteForActivity(activityId: string, userId: string): void {
    const existingVote = this.votes().find(
      v => v.activityId === activityId && v.userId === userId
    );

    if (existingVote) {
      return;
    }

    const vote: Vote = {
      id: crypto.randomUUID(),
      userId,
      activityId,
      createdAt: new Date()
    };

    this.votes.update(votes => [...votes, vote]);
    this.activities.update(activities =>
      activities.map(a =>
        a.id === activityId
          ? { ...a, votes: a.votes + 1, hasVoted: true }
          : a
      )
    );
    this.saveToStorage();
  }

  removeVote(activityId: string, userId: string): void {
    this.votes.update(votes =>
      votes.filter(v => !(v.activityId === activityId && v.userId === userId))
    );
    this.activities.update(activities =>
      activities.map(a =>
        a.id === activityId
          ? { ...a, votes: Math.max(0, a.votes - 1), hasVoted: false }
          : a
      )
    );
    this.saveToStorage();
  }

  toggleVote(activityId: string, userId: string): void {
    const hasVoted = this.votes().some(
      v => v.activityId === activityId && v.userId === userId
    );

    if (hasVoted) {
      this.removeVote(activityId, userId);
    } else {
      this.voteForActivity(activityId, userId);
    }
  }
}
