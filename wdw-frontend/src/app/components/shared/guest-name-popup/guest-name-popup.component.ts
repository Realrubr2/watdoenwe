import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-guest-name-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="'Welkom!'"
      [subtitle]="'Vertel ons hoe we je noemen'"
      size="sm"
      [showCloseButton]="false"
      [closeOnBackdrop]="false"
      (isOpenChange)="onModalClose($event)"
    >
      <div class="guest-popup">
        <!-- Avatar Preview -->
        <div class="guest-popup__avatar-preview">
          <div class="guest-popup__avatar" [style.background-color]="avatarColor()">
            {{ nameInitial }}
          </div>
        </div>

        <!-- Name Input -->
        <div class="guest-popup__input-group">
          <label class="form-label">Je naam</label>
          <input
            type="text"
            [(ngModel)]="name"
            [placeholder]="'Hoe mogen we je noemen?'"
            class="input-field"
            (ngModelChange)="onNameChange($event)"
            maxlength="30"
          />
        </div>

        <!-- Name Suggestions -->
        @if (suggestions().length > 0) {
          <div class="guest-popup__suggestions">
            @for (suggestion of suggestions(); track suggestion) {
              <button
                class="guest-popup__suggestion-btn"
                (click)="selectSuggestion(suggestion)"
              >
                {{ suggestion }}
              </button>
            }
          </div>
        }

        <!-- CTA Button -->
        <button
          class="btn-primary w-full"
          [disabled]="!isValid()"
          (click)="submit()"
        >
          Ga verder
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>

        <!-- Trust Note -->
        <p class="guest-popup__trust-note">
          <span class="material-symbols-outlined">verified_user</span>
          Geen wachtwoord nodig
        </p>
      </div>
    </app-modal>
  `,
  styles: [`
    .guest-popup {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      text-align: center;
    }

    .guest-popup__avatar-preview {
      display: flex;
      justify-content: center;
    }

    .guest-popup__avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: bold;
      color: white;
      transition: background-color 0.3s;
    }

    .guest-popup__input-group {
      text-align: left;
    }

    .guest-popup__suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
    }

    .guest-popup__suggestion-btn {
      padding: 0.5rem 1rem;
      border: 1px solid var(--outline-variant, #ccc);
      border-radius: 2rem;
      background: var(--surface-container-low, #f0f0f0);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .guest-popup__suggestion-btn:hover {
      background: var(--primary-container, #e0e0e0);
      border-color: var(--primary, #6200ee);
    }

    .guest-popup__trust-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--on-surface-variant, #666);
    }

    .guest-popup__trust-note .material-symbols-outlined {
      font-size: 1rem;
      color: var(--primary, #6200ee);
    }
  `]
})
export class GuestNamePopupComponent {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() nameSubmit = new EventEmitter<string>();

  name = '';
  private currentName = signal('');

  readonly avatarColors = [
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#F43F5E', // Rose
    '#EF4444', // Red
    '#F97316', // Orange
    '#EAB308', // Yellow
    '#22C55E', // Green
    '#14B8A6', // Teal
    '#06B6D4', // Cyan
    '#3B82F6', // Blue
  ];

  readonly nameSuggestions = [
    'Jan', 'Pieter', 'Klaas', 'Marie', 'Sophie', 
    'Lisa', 'Thomas', 'Emma', 'Max', 'Julia',
    'Bob', 'Alice', 'David', 'Eva', 'Frank'
  ];

  get nameInitial(): string {
    const n = this.currentName();
    return n ? n.charAt(0).toUpperCase() : '?';
  }

  avatarColor(): string {
    const n = this.currentName().toLowerCase();
    if (!n) return this.avatarColors[0];
    const charCode = n.charCodeAt(0);
    return this.avatarColors[charCode % this.avatarColors.length];
  }

  suggestions(): string[] {
    const n = this.currentName().toLowerCase();
    if (!n || n.length < 2) return [];
    return this.nameSuggestions
      .filter(s => s.toLowerCase().startsWith(n))
      .slice(0, 4);
  }

  isValid(): boolean {
    return this.name.trim().length >= 2;
  }

  onNameChange(value: string): void {
    this.currentName.set(value);
  }

  selectSuggestion(name: string): void {
    this.name = name;
    this.currentName.set(name);
  }

  submit(): void {
    if (this.isValid()) {
      this.nameSubmit.emit(this.name.trim());
    }
  }

  onModalClose(open: boolean): void {
    this.isOpen = open;
    this.isOpenChange.emit(open);
  }

  reset(): void {
    this.name = '';
    this.currentName.set('');
  }
}
