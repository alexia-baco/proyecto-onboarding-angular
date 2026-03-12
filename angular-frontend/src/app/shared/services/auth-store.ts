import { Injectable, computed, signal } from '@angular/core';
import { AuthenticatedUser } from '../interfaces/auth';
import { AuthService } from './auth-service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  // Le decimos que busque la palabra 'token' en el almacenamiento de tu navegador
  private readonly storageKey = 'token';
  
  // Aquí definimos las "Señales" (variables reactivas)
  readonly token = signal<string | null>(null);
  readonly user = signal<AuthenticatedUser | null>(null);
  
  // Estas señales son "calculadas". Si hay token, isLoggedIn es true automáticamente.
  readonly isLoggedIn = computed(() => !!this.token());
  readonly isAdmin = computed(() => this.user()?.roles?.includes('ROLE_ADMIN') ?? false);

  constructor(private readonly authApi: AuthService) {
    // Al nacer este servicio, mira si ya tenías un token guardado de antes
    const fromStorage = localStorage.getItem(this.storageKey);
    if (fromStorage) this.token.set(fromStorage);
  }

  // Función para guardar el token cuando inicies sesión
  setSession(token: string): void {
    this.token.set(token);
    localStorage.setItem(this.storageKey, token);
  }

  // Función para guardar tus datos (email, roles)
  setUser(user: AuthenticatedUser | null): void {
    this.user.set(user);
  }

  // Función para cerrar sesión (borra todo)
  clearSession(): void {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem(this.storageKey);
  }

  // Función para ir al backend a pedir tus datos de usuario usando el token
  loadMe() {
    return this.authApi.me().pipe(tap((u) => this.user.set(u)));
  }
}