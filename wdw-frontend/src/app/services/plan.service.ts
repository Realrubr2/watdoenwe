import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Plan, PlanMode, PlanStatus } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private platformId = inject(PLATFORM_ID);
  private plans = signal<Plan[]>([]);
  private currentPlan = signal<Plan | null>(null);

  readonly allPlans = this.plans.asReadonly();
  readonly activePlan = this.currentPlan.asReadonly();

  readonly recentPlans = computed(() =>
    this.plans()
      .filter(p => p.status === 'ACTIVE' || p.status === 'DRAFT')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
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

  createPlan(name: string, mode: PlanMode, hostId: string): Plan {
    const plan: Plan = {
      id: crypto.randomUUID(),
      name,
      mode,
      status: 'DRAFT',
      hostId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.plans.update(plans => [...plans, plan]);
    this.saveToStorage();
    this.currentPlan.set(plan);

    return plan;
  }

  getPlan(id: string): Plan | undefined {
    return this.plans().find(p => p.id === id);
  }

  setCurrentPlan(plan: Plan | null): void {
    this.currentPlan.set(plan);
  }

  updatePlan(id: string, updates: Partial<Plan>): void {
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

  completePlan(id: string): void {
    this.updatePlan(id, { status: 'COMPLETED' });
  }

  setPlanDate(id: string, date: Date): void {
    this.updatePlan(id, { date });
  }

  setPlanActivity(id: string, activityName: string, activityLocation?: string): void {
    this.updatePlan(id, { activityName, activityLocation });
  }
}
