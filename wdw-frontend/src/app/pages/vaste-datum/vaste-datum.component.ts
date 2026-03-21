import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/layout/header/header.component';
import { MobileNavComponent } from '../../components/layout/mobile-nav/mobile-nav.component';
import { ActivityService, AuthService } from '../../services';

@Component({
  selector: 'app-vaste-datum',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, MobileNavComponent],
  templateUrl: './vaste-datum.component.html'
})
export class VasteDatumComponent {
  newActivityTitle = signal('');
  showAddModal = false;

  activities = computed(() => this.activityService.allActivities());

  constructor(
    private activityService: ActivityService,
    private authService: AuthService
  ) {}

  addActivity(): void {
    const title = this.newActivityTitle();
    if (!title) return;

    const user = this.authService.user();
    if (!user) return;

    this.activityService.createActivity(
      'demo-plan',
      title,
      user.id,
      { category: 'OVERIG' }
    );

    this.newActivityTitle.set('');
  }
}
