import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="top-bar">
      <div class="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <!-- Logo -->
        <a routerLink="/" class="text-2xl font-black text-primary tracking-tighter hover:opacity-80 transition-opacity">
          WDW?
        </a>

        <!-- Desktop Navigation -->
        @if (showNav) {
          <nav class="hidden md:flex items-center gap-8">
            <a routerLink="/dashboard" class="text-on-surface-variant hover:text-primary transition-colors font-medium">
              Dashboard
            </a>
            <a routerLink="/vaste-datum" class="text-on-surface-variant hover:text-primary transition-colors font-medium">
              Vaste Datum
            </a>
            <a routerLink="/vaste-activiteit" class="text-on-surface-variant hover:text-primary transition-colors font-medium">
              Vaste Activiteit
            </a>
            <a routerLink="/we-zien-wel" class="text-on-surface-variant hover:text-primary transition-colors font-medium">
              We Zien Wel
            </a>
          </nav>
        }

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <button class="btn-icon">
            <span class="material-symbols-outlined">notifications</span>
          </button>
          <button class="btn-icon">
            <span class="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Input() showNav = true;

  constructor(public authService: AuthService) {}
}
