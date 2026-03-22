import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User, GuestSession } from '../models';
import { buildUrl, API_CONFIG } from '../config/api.config';

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

  private saveToStorage(user: User, token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('wdw_user', JSON.stringify(user));
      localStorage.setItem('wdw_guest_token', token);
    }
  }

  async createGuestSession(name: string): Promise<GuestSession> {
    try {
      const response = await fetch(buildUrl(API_CONFIG.endpoints.auth.guest), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Failed to create guest session');
      }

      const data = await response.json();
      
      // Transform backend response to User format
      const user: User = {
        id: data.user.id,
        name: data.user.name,
        isGuest: data.user.isGuest,
        guestToken: data.token,
        createdAt: new Date(data.user.createdAt),
        updatedAt: new Date(data.user.updatedAt),
      };

      const token = data.token;

      this.currentUser.set(user);
      this.guestToken.set(token);
      this.saveToStorage(user, token);

      return { user, token };
    } catch (error) {
      console.error('Error creating guest session:', error);
      // Fallback to local-only session if backend is not available
      return this.createLocalGuestSession(name);
    }
  }

  private createLocalGuestSession(name: string): GuestSession {
    const user: User = {
      id: crypto.randomUUID(),
      name,
      isGuest: true,
      guestToken: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const token = user.guestToken!;

    this.currentUser.set(user);
    this.guestToken.set(token);
    this.saveToStorage(user, token);

    return { user, token };
  }

  async verifyGuestToken(token: string): Promise<User | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    try {
      const response = await fetch(buildUrl(API_CONFIG.endpoints.auth.verify), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        // Fallback to local storage verification
        return this.verifyLocalToken(token);
      }

      const data = await response.json();
      
      const user: User = {
        id: data.user.id,
        name: data.user.name,
        isGuest: data.user.isGuest,
        guestToken: token,
        createdAt: new Date(data.user.createdAt),
        updatedAt: new Date(data.user.updatedAt),
      };

      this.currentUser.set(user);
      return user;
    } catch (error) {
      console.error('Error verifying token:', error);
      return this.verifyLocalToken(token);
    }
  }

  private verifyLocalToken(token: string): User | null {
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

  getToken(): string | null {
    return this.guestToken();
  }
}
