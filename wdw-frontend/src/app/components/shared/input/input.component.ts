import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="w-full">
      @if (label) {
        <label [for]="inputId" class="form-label">{{ label }}</label>
      }
      <div class="relative">
        @if (icon) {
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">{{ icon }}</span>
        }
        @if (multiline) {
          <textarea
            [id]="inputId"
            [placeholder]="placeholder"
            [disabled]="disabled"
            [rows]="rows"
            [(ngModel)]="value"
            (ngModelChange)="onInputChange($event)"
            (blur)="onTouched()"
            [class]="textareaClasses"
          ></textarea>
        } @else {
          <input
            [type]="type"
            [id]="inputId"
            [placeholder]="placeholder"
            [disabled]="disabled"
            [(ngModel)]="value"
            (ngModelChange)="onInputChange($event)"
            (blur)="onTouched()"
            [class]="inputClasses"
          />
        }
      </div>
      @if (hint) {
        <p class="mt-1.5 text-xs text-on-surface-variant">{{ hint }}</p>
      }
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text';
  @Input() icon?: string;
  @Input() hint?: string;
  @Input() disabled = false;
  @Input() multiline = false;
  @Input() rows = 3;
  @Input() inputId = `input-${Math.random().toString(36).substring(2, 9)}`;

  @Output() valueChange = new EventEmitter<string>();

  value = '';

  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(value: string): void {
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  get inputClasses(): string {
    const base = 'input-field';
    const iconPadding = this.icon ? 'pl-12' : '';
    return `${base} ${iconPadding}`.trim();
  }

  get textareaClasses(): string {
    return 'textarea-field';
  }
}
