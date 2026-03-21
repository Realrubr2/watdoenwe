import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services';

@Component({
  selector: 'app-guest-experience',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guest-experience.component.html'
})
export class GuestExperienceComponent {
  guestName = signal('');
  hostName = 'Jan';
  eventName = 'Weekendje Ardennen';
  hostInitial = 'J';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async enterPlan(): Promise<void> {
    const name = this.guestName();
    if (!name) return;

    await this.authService.createGuestSession(name);
    this.router.navigate(['/dashboard']);
  }
}
