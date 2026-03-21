import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="avatarClasses" [style.backgroundColor]="color">
      @if (imageUrl) {
        <img [src]="imageUrl" [alt]="name" class="w-full h-full object-cover rounded-full" />
      } @else {
        <span [class]="initialsClasses">{{ initials }}</span>
      }
    </div>
  `
})
export class AvatarComponent {
  @Input() name = '';
  @Input() imageUrl?: string;
  @Input() color?: string;
  @Input() size: AvatarSize = 'md';
  @Input() bordered = true;

  get initials(): string {
    if (!this.name) return '?';
    const parts = this.name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  get avatarClasses(): string {
    const base = 'inline-flex items-center justify-center rounded-full font-bold overflow-hidden';
    const border = this.bordered ? 'border-2 border-surface' : '';

    const sizes: Record<AvatarSize, string> = {
      xs: 'w-6 h-6 text-[10px]',
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg'
    };

    const textColor = this.color ? 'text-white' : 'text-on-primary';

    return `${base} ${border} ${sizes[this.size]} ${textColor}`.trim();
  }

  get initialsClasses(): string {
    return 'select-none';
  }
}

@Component({
  selector: 'app-avatar-group',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  template: `
    <div class="flex" [class]="groupClasses">
      @for (avatar of avatars; track avatar.name; let i = $index) {
        <app-avatar
          [name]="avatar.name"
          [imageUrl]="avatar.imageUrl"
          [color]="avatar.color"
          [size]="size"
          [style.marginLeft]="i > 0 ? '-8px' : '0'"
          [style.zIndex]="avatars.length - i"
        ></app-avatar>
      }
      @if (max && avatars.length > max) {
        <div [class]="overflowClasses">
          +{{ avatars.length - max }}
        </div>
      }
    </div>
  `
})
export class AvatarGroupComponent {
  @Input() avatars: { name: string; imageUrl?: string; color?: string }[] = [];
  @Input() size: AvatarSize = 'md';
  @Input() max?: number;

  get groupClasses(): string {
    return 'items-center';
  }

  get overflowClasses(): string {
    const sizes: Record<AvatarSize, string> = {
      xs: 'w-6 h-6 text-[10px]',
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg'
    };

    return `inline-flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant font-bold border-2 border-surface ${sizes[this.size]}`;
  }
}
