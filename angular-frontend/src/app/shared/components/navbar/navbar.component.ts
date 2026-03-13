import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthStore } from '../../services/auth-store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  public store = inject(AuthStore);
  private router = inject(Router);

  // Acción de logout exacta que pide el ejercicio
  logout() {
    this.store.clearSession();
    this.router.navigateByUrl('/');
  }
}