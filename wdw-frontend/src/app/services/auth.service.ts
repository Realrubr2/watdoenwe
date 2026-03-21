import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User, GuestSession } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private currentUser = signal<User | null>(null);
  private guestToken = signal<string | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isGuest = computed(() => this.currentUser()?.isGuest ?? false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    const storedUser = localStorage.getItem('wdw_user');
    const storedToken = localStorage.getItem('wdw_guest_token');

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUser.set(user);
      } catch {
        localStorage.removeItem('wdw_user');
      }
    }

    if (storedToken) {
      this.guestToken.set(storedToken);
    }
  }

  async createGuestSession(name: string): Promise<GuestSession> {
    const user: User = {
      id: crypto.randomUUID(),
      name,
      isGuest: true,
      guestToken: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const token = user.guestToken!;

    this.currentUser.set(user);
    this.guestToken.set(token);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('wdw_user', JSON.stringify(user));
      localStorage.setItem('wdw_guest_token', token);
    }

    return { user, token };
  }

  async verifyGuestToken(token: string): Promise<User | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const storedUser = localStorage.getItem('wdw_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.guestToken === token) {
          this.currentUser.set(user);
          return user;
        }
      } catch {
        return null;
      }
    }
    return null;
  }

  logout(): void {
    this.currentUser.set(null);
    this.guestToken.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('wdw_user');
      localStorage.removeItem('wdw_guest_token');
    }
  }

  updateUserName(name: string): void {
    const user = this.currentUser();
    if (user) {
      const updatedUser = { ...user, name, updatedAt: new Date() };
      this.currentUser.set(updatedUser);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('wdw_user', JSON.stringify(updatedUser));
      }
    }
  }
}
