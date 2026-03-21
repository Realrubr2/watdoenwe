import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/layout/header/header.component';
import { MobileNavComponent } from '../../components/layout/mobile-nav/mobile-nav.component';
import { IdeaService, AuthService } from '../../services';

@Component({
  selector: 'app-ideeenmuur',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HeaderComponent, MobileNavComponent],
  templateUrl: './ideeenmuur.component.html'
})
export class IdeeenmuurComponent {
  newIdeaTitle = signal('');
  showAddModal = false;

  ideas = computed(() => this.ideaService.allIdeas());

  constructor(
    private ideaService: IdeaService,
    private authService: AuthService
  ) {}

  addIdea(): void {
    const title = this.newIdeaTitle();
    if (!title) return;

    const user = this.authService.user();
    if (!user) return;

    this.ideaService.createIdea(
      'demo-plan',
      title,
      user.id,
      { id: user.id, name: user.name },
      { category: 'OVERIG' }
    );

    this.newIdeaTitle.set('');
  }
}
