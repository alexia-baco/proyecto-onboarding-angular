import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast-component/toast-component';
import { AuthStore } from './shared/services/auth-store';
// 1. Importamos la navbar
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. La metemos aquí
  imports: [RouterOutlet, ToastComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private readonly authStore: AuthStore) {
    if (this.authStore.token()) {
      this.authStore.loadMe().subscribe({
        error: () => this.authStore.clearSession(),
      });
    }
  }
}