import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Activity, ActivityCategory, Vote } from '../models';
import { buildUrl, API_CONFIG } from '../config/api.config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  private activities = signal<Activity[]>([]);
  private votes = signal<Vote[]>([]);
  private loading = signal<boolean>(false);

  readonly allActivities = this.activities.asReadonly();
  readonly isLoading = this.loading.asReadonly();

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

  private getAuthHeaders(): HeadersInit {
    const token = this.authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  async fetchActivities(planId: string): Promise<void> {
    this.loading.set(true);
    try {
      const url = `${buildUrl(API_CONFIG.endpoints.activities.list)}?planId=${planId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      
      // Transform backend response to Activity format
      const fetchedActivities: Activity[] = (data.activities || []).map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        address: a.address,
        link: a.link,
        category: a.category,
        planId: a.planId,
        createdBy: a.createdBy,
        imageUrl: a.imageUrl,
        votes: a.votes,
        hasVoted: false,
        createdAt: new Date(a.createdAt),
      }));

      // Merge with local activities (keep local-only ones)
      const localActivities = this.activities().filter(a => a.planId !== planId);
      this.activities.set([...localActivities, ...fetchedActivities]);
      this.saveToStorage();
    } catch (error) {
      console.error('Error fetching activities:', error);
      // Keep local data on error
    } finally {
      this.loading.set(false);
    }
  }

  getActivitiesForPlan(planId: string): Activity[] {
    return this.activities().filter(a => a.planId === planId);
  }

  async createActivity(
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
  ): Promise<Activity | null> {
    try {
      const response = await fetch(buildUrl(API_CONFIG.endpoints.activities.create), {
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
        throw new Error('Failed to create activity');
      }

      const data = await response.json();
      
      const activity: Activity = {
        id: data.id,
        title: data.title,
        description: data.description,
        address: data.address,
        link: data.link,
        category: data.category,
        planId: data.planId,
        createdBy: data.createdBy,
        imageUrl: data.imageUrl,
        votes: data.votes,
        hasVoted: false,
        createdAt: new Date(data.createdAt),
      };

      this.activities.update(activities => [...activities, activity]);
      this.saveToStorage();

      return activity;
    } catch (error) {
      console.error('Error creating activity:', error);
      // Fallback to local creation
      return this.createLocalActivity(planId, title, createdBy, options);
    }
  }

  private createLocalActivity(
    planId: string,
    title: string,
    createdBy: string,
    options: {
      description?: string;
      address?: string;
      link?: string;
      category?: ActivityCategory;
      imageUrl?: string;
    }
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

  async deleteActivity(id: string, planId: string): Promise<void> {
    try {
      const url = `${buildUrl(API_CONFIG.endpoints.activities.delete(id))}?planId=${planId}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete activity');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
    }

    // Always remove locally
    this.activities.update(activities => activities.filter(a => a.id !== id));
    this.votes.update(votes => votes.filter(v => v.activityId !== id));
    this.saveToStorage();
  }

  voteForActivity(activityId: string, userId: string): void {
    const existingVote = this.votes().find(
      v => v.activityId === activityId && v.userId === userId
    );

    if (!existingVote) {
      const vote: Vote = {
        id: crypto.randomUUID(),
        activityId,
        userId,
        createdAt: new Date()
      };

      this.votes.update(votes => [...votes, vote]);
      
      // Increment vote count
      const activity = this.activities().find(a => a.id === activityId);
      if (activity) {
        this.updateActivity(activityId, { votes: activity.votes + 1, hasVoted: true });
      }
    }
  }
}
