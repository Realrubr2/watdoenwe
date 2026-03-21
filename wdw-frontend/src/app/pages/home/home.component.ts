import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/layout/header/header.component';
import { MobileNavComponent } from '../../components/layout/mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, MobileNavComponent],
  templateUrl: './home.component.html',
  styles: [`
    :host {
      display: block;
      background-color: #fffcf0;
      background-image: radial-gradient(#E1AD01 0.5px, transparent 0.5px);
      background-size: 24px 24px;
      background-attachment: fixed;
    }
  `]
})
export class HomeComponent {}
