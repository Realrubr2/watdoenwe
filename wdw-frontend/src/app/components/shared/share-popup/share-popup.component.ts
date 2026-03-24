import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-share-popup',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="'Deel dit plan'"
      subtitle="Nodig vrienden uit om mee te doen"
      size="md"
      (isOpenChange)="onModalClose($event)"
    >
      <div class="share-popup">
        <!-- Share Link Section -->
        <div class="share-popup__section">
          <label class="form-label">Delen via link</label>
          <div class="share-popup__link-box">
            <input
              type="text"
              readonly
              [value]="shareUrl()"
              class="share-popup__link-input"
              #linkInput
            />
            <button
              class="share-popup__copy-btn"
              (click)="copyLink(linkInput)"
              [class.copied]="copied()"
            >
              @if (copied()) {
                <span class="material-symbols-outlined">check</span>
              } @else {
                <span class="material-symbols-outlined">content_copy</span>
              }
            </button>
          </div>
        </div>

        <!-- Social Share Buttons -->
        <div class="share-popup__section">
          <p class="share-popup__label">Of deel direct via:</p>
          <div class="share-popup__social">
            <button class="share-popup__social-btn share-popup__social-btn--whatsapp" (click)="shareViaWhatsApp()">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
            <button class="share-popup__social-btn share-popup__social-btn--email" (click)="shareViaEmail()">
              <span class="material-symbols-outlined">mail</span>
            </button>
            <button class="share-popup__social-btn share-popup__social-btn--sms" (click)="shareViaSms()">
              <span class="material-symbols-outlined">sms</span>
            </button>
          </div>
        </div>
      </div>
    </app-modal>
  `,
  styles: [`
    .share-popup {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .share-popup__section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .share-popup__link-box {
      display: flex;
      gap: 0.5rem;
    }

    .share-popup__link-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid var(--outline-variant, #ccc);
      border-radius: 0.5rem;
      background: var(--surface-container-lowest, #f5f5f5);
      font-size: 0.875rem;
      color: var(--on-surface, #333);
    }

    .share-popup__copy-btn {
      padding: 0.75rem;
      border: none;
      border-radius: 0.5rem;
      background: var(--primary-container, #e0e0e0);
      color: var(--on-primary-container, #333);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .share-popup__copy-btn:hover {
      background: var(--primary, #6200ee);
      color: var(--on-primary, #fff);
    }

    .share-popup__copy-btn.copied {
      background: var(--secondary, #03dac6);
      color: var(--on-secondary, #000);
    }

    .share-popup__qr {
      align-items: center;
    }

    .share-popup__qr-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 2rem;
      background: var(--surface-container-low, #f0f0f0);
      border-radius: 1rem;
    }

    .share-popup__qr-icon {
      font-size: 4rem;
      color: var(--on-surface-variant, #666);
    }

    .share-popup__qr-text {
      font-size: 0.875rem;
      color: var(--on-surface-variant, #666);
    }

    .share-popup__label {
      font-size: 0.875rem;
      color: var(--on-surface-variant, #666);
      margin-bottom: 0.25rem;
    }

    .share-popup__social {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
    }

    .share-popup__social-btn {
      width: 48px;
      height: 48px;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .share-popup__social-btn--whatsapp {
      background: #25D366;
      color: white;
    }

    .share-popup__social-btn--whatsapp:hover {
      background: #128C7E;
    }

    .share-popup__social-btn--email {
      background: var(--surface-container-high, #e0e0e0);
      color: var(--on-surface, #333);
    }

    .share-popup__social-btn--email:hover {
      background: var(--primary, #6200ee);
      color: var(--on-primary, #fff);
    }

    .share-popup__social-btn--sms {
      background: var(--surface-container-high, #e0e0e0);
      color: var(--on-surface, #333);
    }

    .share-popup__social-btn--sms:hover {
      background: var(--primary, #6200ee);
      color: var(--on-primary, #fff);
    }
  `]
})
export class SharePopupComponent {
  @Input() isOpen = false;
  @Input() shareToken = '';
  @Output() isOpenChange = new EventEmitter<boolean>();

  copied = signal(false);

  shareUrl(): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${baseUrl}/gast-ervaring/${this.shareToken}`;
    console.log('[SharePopup] shareToken:', this.shareToken);
    console.log('[SharePopup] generated URL:', url);
    return url;
  }

  copyLink(input: HTMLInputElement): void {
    navigator.clipboard.writeText(this.shareUrl()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  shareViaWhatsApp(): void {
    const text = encodeURIComponent(`Hey! Doe mee met mijn plan: ${this.shareUrl()}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  shareViaEmail(): void {
    const subject = encodeURIComponent('Doe mee met mijn plan!');
    const body = encodeURIComponent(`Hey!\n\nDoe mee met mijn plan via deze link:\n${this.shareUrl()}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  }

  shareViaSms(): void {
    const body = encodeURIComponent(`Hey! Doe mee met mijn plan: ${this.shareUrl()}`);
    window.open(`sms:?body=${body}`, '_blank');
  }

  onModalClose(open: boolean): void {
    this.isOpen = open;
    this.isOpenChange.emit(open);
  }
}
