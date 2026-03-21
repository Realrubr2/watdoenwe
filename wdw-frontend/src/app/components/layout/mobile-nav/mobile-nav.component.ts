import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export type MobileNavVariant = 'default' | 'minimal';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="mobile-nav md:hidden">
      <!-- Feed -->
      <a
        routerLink="/dashboard"
        routerLinkActive="text-primary"
        [routerLinkActiveOptions]="{ exact: true }"
        class="flex flex-col items-center justify-center text-on-surface-variant/50 hover:text-primary transition-all"
      >
        <span class="material-symbols-outlined mb-1">auto_awesome</span>
        <span class="text-[11px] font-bold tracking-tight">Feed</span>
      </a>

      <!-- Add Button (Floating) -->
      <a
        [routerLink]="addRoute"
        class="flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded w-14 h-14 -mt-10 shadow-lg active:scale-90 transition-all duration-300"
      >
        <span class="material-symbols-outlined">add</span>
      </a>

      <!-- Schedule -->
      <a
        routerLink="/dashboard"
        routerLinkActive="text-primary"
        class="flex flex-col items-center justify-center text-on-surface-variant/50 hover:text-primary transition-all"
      >
        <span class="material-symbols-outlined mb-1">calendar_today</span>
        <span class="text-[11px] font-bold tracking-tight">Schedule</span>
      </a>
    </nav>
  `
})
export class MobileNavComponent {
  @Input() addRoute = '/dashboard';
}
