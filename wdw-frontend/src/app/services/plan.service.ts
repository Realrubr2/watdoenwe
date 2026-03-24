import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Plan, PlanMode, PlanStatus } from '../models';
import { buildUrl, API_CONFIG } from '../config/api.config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  private plans = signal<Plan[]>([]);
  private currentPlan = signal<Plan | null>(null);
  private loading = signal<boolean>(false);

  readonly allPlans = this.plans.asReadonly();
  readonly activePlan = this.currentPlan.asReadonly();
  readonly isLoading = this.loading.asReadonly();

  readonly recentPlans = computed(() =>
    this.plans()
      .filter(p => p.status === 'ACTIVE' || p.status === 'DRAFT')
      .sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5)
  );

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('wdw_plans');
    if (stored) {
      try {
        const plans = JSON.parse(stored);
        this.plans.set(plans);
      } catch {
        localStorage.removeItem('wdw_plans');
      }
    }
  }

  private saveToStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('wdw_plans', JSON.stringify(this.plans()));
    }
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  async fetchPlans(): Promise<void> {
    this.loading.set(true);
    try {
      const response = await fetch(buildUrl(API_CONFIG.endpoints.plans.list), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }

      const data = await response.json();
      
      // Transform backend response to Plan format
      const plans: Plan[] = (data.plans || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        mode: p.mode,
        status: p.status,
        hostId: p.hostId || p.host_id,
        shareToken: p.shareToken || p.share_token,
        createdAt: new Date(p.createdAt || p.created_at),
        updatedAt: new Date(p.updatedAt || p.updated_at),
      }));

      this.plans.set(plans);
      this.saveToStorage();
    } catch (error) {
      console.error('Error fetching plans:', error);
      // Keep local data on error
    } finally {
      this.loading.set(false);
    }
  }

  async createPlan(name: string, mode: PlanMode, hostId: string): Promise<Plan | null> {
    console.log('createPlan called with:', name, mode, hostId);
    try {
      const response = await fetch(buildUrl(API_CONFIG.endpoints.plans.create), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ name, mode }),
      });
      console.log('API response status:', response.status);

      if (!response.ok) {
        throw new Error('Failed to create plan');
      }

      const data = await response.json();
      console.log('API response data:', data);
      
      const planData = data.plan || data;
      const plan: Plan = {
        id: planData.id,
        name: planData.name,
        mode: planData.mode,
        status: planData.status,
        hostId: planData.hostId || planData.host_id,
        shareToken: planData.shareToken || planData.share_token,
        createdAt: new Date(planData.createdAt || planData.created_at),
        updatedAt: new Date(planData.updatedAt || planData.updated_at),
      };

      this.plans.update(plans => [...plans, plan]);
      this.saveToStorage();
      this.currentPlan.set(plan);
      console.log('Created plan from API:', plan);

      return plan;
    } catch (error) {
      console.error('Error creating plan, falling back to local:', error);
      // Fallback to local creation
      const localPlan = this.createLocalPlan(name, mode, hostId);
      console.log('Created local plan:', localPlan);
      return localPlan;
    }
  }

  private createLocalPlan(name: string, mode: PlanMode, hostId: string): Plan {
    const plan: Plan = {
      id: crypto.randomUUID(),
      name,
      mode,
      status: 'DRAFT',
      hostId,
      shareToken: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.plans.update(plans => [...plans, plan]);
    this.saveToStorage();
    this.currentPlan.set(plan);

    return plan;
  }

  async getPlan(id: string): Promise<Plan | null> {
    try {
      const response = await fetch(buildUrl(API_CONFIG.endpoints.plans.get(id)), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch plan');
      }

      const data = await response.json();
      const planData = data.plan || data;
      console.log('[PlanService] getPlan API response:', data);
      console.log('[PlanService] planData.shareToken:', planData.shareToken);
      
      const plan: Plan = {
        id: planData.id,
        name: planData.name,
        mode: planData.mode,
        status: planData.status,
        hostId: planData.hostId,
        shareToken: planData.shareToken,
        createdAt: new Date(planData.createdAt),
        updatedAt: new Date(planData.updatedAt),
      };

      return plan;
    } catch (error) {
      console.error('Error fetching plan:', error);
      console.log('[PlanService] API failed, falling back to local');
      // Fallback to local plan
      return this.getPlanLocal(id) || null;
    }
  }

  getPlanLocal(id: string): Plan | undefined {
    return this.plans().find(p => p.id === id);
  }

  setCurrentPlan(plan: Plan | null): void {
    this.currentPlan.set(plan);
  }

  async updatePlan(id: string, updates: Partial<Plan>): Promise<void> {
    // For now, just update locally
    // In production, you'd call the API
    this.plans.update(plans =>
      plans.map(p =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date() }
          : p
      )
    );
    this.saveToStorage();

    if (this.currentPlan()?.id === id) {
      this.currentPlan.update(plan =>
        plan ? { ...plan, ...updates, updatedAt: new Date() } : null
      );
    }
  }

  deletePlan(id: string): void {
    this.plans.update(plans => plans.filter(p => p.id !== id));
    this.saveToStorage();

    if (this.currentPlan()?.id === id) {
      this.currentPlan.set(null);
    }
  }

  activatePlan(id: string): void {
    this.updatePlan(id, { status: 'ACTIVE' });
  }

  async getPlanByShareToken(shareToken: string): Promise<Plan | null> {
    try {
      const response = await fetch(buildUrl(`/plans/share/${shareToken}`), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch plan by share token');
      }

      const data = await response.json();
      
      const planData = data.plan || data;
      const plan: Plan = {
        id: planData.id,
        name: planData.name,
        mode: planData.mode,
        status: planData.status,
        hostId: planData.hostId || planData.host_id,
        shareToken: planData.shareToken || planData.share_token,
        createdAt: new Date(planData.createdAt || planData.created_at),
        updatedAt: new Date(planData.updatedAt || planData.updated_at),
      };

      return plan;
    } catch (error) {
      console.error('Error fetching plan by share token:', error);
      return null;
    }
  }
}
