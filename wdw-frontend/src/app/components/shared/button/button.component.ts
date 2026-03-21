import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="onClick.emit($event)"
    >
      @if (loading) {
        <span class="material-symbols-outlined animate-spin">progress_activity</span>
      }
      @if (icon && !loading) {
        <span class="material-symbols-outlined" [class]="iconSizeClass">{{ icon }}</span>
      }
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() icon?: string;
  @Input() offsetShadow = false;

  @Output() onClick = new EventEmitter<Event>();

  get buttonClasses(): string {
    const base = 'inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-200 rounded';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-primary text-on-primary hover:shadow-lg hover:scale-[1.02] active:scale-95 active:shadow-sm',
      secondary: 'bg-surface-container-high text-on-surface border border-outline-variant hover:bg-surface-container-highest hover:border-outline active:scale-95',
      outline: 'bg-transparent text-primary border-2 border-primary hover:bg-primary/10 active:scale-95',
      ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-primary active:scale-95',
      icon: 'p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-primary active:scale-90'
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-4 py-2 text-xs gap-1.5',
      md: 'px-6 py-3 text-sm gap-2',
      lg: 'px-8 py-4 text-base gap-3'
    };

    const iconSizes: Record<ButtonSize, string> = {
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-2xl'
    };

    const classes = [
      base,
      variants[this.variant],
      this.variant !== 'icon' ? sizes[this.size] : '',
      this.fullWidth ? 'w-full' : '',
      this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      this.offsetShadow ? 'btn-offset-shadow' : ''
    ];

    return classes.filter(Boolean).join(' ');
  }

  get iconSizeClass(): string {
    const sizes: Record<ButtonSize, string> = {
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-2xl'
    };
    return sizes[this.size];
  }
}
