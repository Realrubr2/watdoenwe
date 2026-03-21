import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          (click)="closeOnBackdrop && close()"
        ></div>

        <!-- Modal Content -->
        <div [class]="modalClasses" (click)="$event.stopPropagation()">
          <!-- Header -->
          @if (title || showCloseButton) {
            <div class="flex items-start justify-between p-8 pb-0">
              <div>
                @if (title) {
                  <h2 class="text-3xl font-bold tracking-tight">{{ title }}</h2>
                }
                @if (subtitle) {
                  <p class="text-on-surface-variant mt-1">{{ subtitle }}</p>
                }
              </div>
              @if (showCloseButton) {
                <button
                  class="p-2 rounded-full hover:bg-surface-container-high transition-colors"
                  (click)="close()"
                >
                  <span class="material-symbols-outlined text-3xl">close</span>
                </button>
              }
            </div>
          }

          <!-- Body -->
          <div class="p-8">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() showCloseButton = true;
  @Input() closeOnBackdrop = true;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen) {
      this.close();
    }
  }

  close(): void {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.closed.emit();
  }

  get modalClasses(): string {
    const base = 'relative bg-surface-container-lowest shadow-2xl overflow-hidden w-full';

    const sizes: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full h-full'
    };

    return `${base} ${sizes[this.size]}`;
  }
}
