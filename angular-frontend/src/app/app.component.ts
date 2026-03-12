import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast-component/toast-component';
import { AuthStore } from './shared/services/auth-store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private readonly authStore: AuthStore) {
    // Si hay un token guardado...
    if (this.authStore.token()) {
      this.authStore.loadMe().subscribe({
        // ...y el servidor nos da error al pedir los datos (ej: token caducado)
        // borramos la sesión entera para evitar que la app se quede "atascada"
        error: () => this.authStore.clearSession(),
      });
    }
  }
}