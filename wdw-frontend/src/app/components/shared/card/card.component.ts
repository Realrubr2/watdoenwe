import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'glass' | 'outlined' | 'elevated';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() hoverable = false;
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() borderLeft = false;

  get cardClasses(): string {
    const base = 'rounded transition-all duration-200';

    const variants: Record<CardVariant, string> = {
      default: 'bg-surface-container-lowest shadow-sm border border-outline-variant/10',
      glass: 'glass-card border border-white/50',
      outlined: 'bg-transparent border border-outline-variant',
      elevated: 'bg-surface-container-lowest shadow-lg'
    };

    const paddings: Record<string, string> = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    };

    const classes = [
      base,
      variants[this.variant],
      paddings[this.padding],
      this.hoverable ? 'hover:shadow-md hover:border-primary/50 hover:-translate-y-1 cursor-pointer' : '',
      this.borderLeft ? 'border-l-4 border-l-primary' : ''
    ];

    return classes.join(' ');
  }
}
