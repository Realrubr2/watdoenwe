import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IdeaService, AuthService } from '../../services';
import { IdeaCategory } from '../../models';

@Component({
  selector: 'app-add-activity-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen) {
      <!-- Background Overlay -->
      <div class="fixed inset-0 z-40">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <!-- Blurred Content Simulation -->
        <div class="absolute inset-0 blur-sm grayscale-[20%] pointer-events-none">
          <div class="h-full bg-background"></div>
        </div>
      </div>

      <!-- Modal Container -->
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4" (click)="close()">
        <div
          class="relative bg-surface-container-lowest shadow-2xl overflow-hidden w-full max-w-lg"
          (click)="$event.stopPropagation()"
        >
          <!-- Modal Header -->
          <div class="p-8 pb-0">
            <div class="flex items-start justify-between">
              <div>
                <h2 class="text-3xl font-bold tracking-tight">Voeg iets toe</h2>
                <p class="text-on-surface-variant mt-1">Deel een nieuw idee voor de Idea Wall</p>
              </div>
              <button
                class="p-2 rounded-full hover:bg-surface-container-high transition-colors"
                (click)="close()"
              >
                <span class="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>
          </div>

          <!-- Modal Form -->
          <div class="p-8 space-y-8">
            <!-- Title Field -->
            <div>
              <label class="form-label">Titel</label>
              <input
                type="text"
                [(ngModel)]="title"
                placeholder="Wat gaan we doen?"
                class="input-field text-lg font-semibold"
              />
            </div>

            <!-- Note/Link Field -->
            <div>
              <label class="form-label">Notitie/Link</label>
              <textarea
                [(ngModel)]="description"
                placeholder="Beschrijf het idee of plak een link..."
                rows="3"
                class="textarea-field"
              ></textarea>
            </div>

            <!-- Address Field -->
            <div>
              <label class="form-label">Adres</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">location_on</span>
                <input
                  type="text"
                  [(ngModel)]="address"
                  placeholder="Waar is het?"
                  class="input-field pl-12"
                />
              </div>
            </div>

            <!-- Category Selection -->
            <div class="pt-4">
              <div class="flex flex-wrap gap-2">
                @for (cat of categories; track cat.value) {
                  <button
                    (click)="selectedCategory.set(cat.value)"
                    [class]="selectedCategory() === cat.value
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-high text-on-surface-variant'"
                    class="px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    {{ cat.label }}
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            (click)="submit()"
            [disabled]="!title()"
            class="w-full py-5 bg-primary text-on-primary font-bold text-xl uppercase tracking-[0.15em] btn-offset-shadow"
          >
            Toevoegen
          </button>
        </div>
      </div>
    }
  `
})
export class AddActivityModalComponent {
  @Input() isOpen = false;
  @Input() planId = 'demo-plan';
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();
  @Output() ideaAdded = new EventEmitter<void>();

  title = signal('');
  description = signal('');
  address = signal('');
  selectedCategory = signal<IdeaCategory>('OVERIG');

  categories = [
    { value: 'ETEN' as IdeaCategory, label: 'Eten' },
    { value: 'CULTUUR' as IdeaCategory, label: 'Cultuur' },
    { value: 'SPORT' as IdeaCategory, label: 'Sport' },
    { value: 'OVERIG' as IdeaCategory, label: 'Overig' }
  ];

  constructor(
    private ideaService: IdeaService,
    private authService: AuthService
  ) {}

  close(): void {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.closed.emit();
    this.resetForm();
  }

  submit(): void {
    const titleValue = this.title();
    if (!titleValue) return;

    const user = this.authService.user();
    if (!user) return;

    this.ideaService.createIdea(
      this.planId,
      titleValue,
      user.id,
      { id: user.id, name: user.name },
      {
        description: this.description() || undefined,
        address: this.address() || undefined,
        category: this.selectedCategory()
      }
    );

    this.ideaAdded.emit();
    this.close();
  }

  private resetForm(): void {
    this.title.set('');
    this.description.set('');
    this.address.set('');
    this.selectedCategory.set('OVERIG');
  }
}
