// src/app/shared/services/auth-service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

type LoginPayload = { email: string; password: string };
type RegisterPayload = { email: string; password: string; nombre?: string };
type LoginResponse = { token: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private API = '/api'; // base URL con proxy para evitar CORS

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/login`, payload).pipe(
      tap((res) => localStorage.setItem('token', res.token))
    );
  }

  register(payload: RegisterPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API}/auth/register`, payload);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}

/*Explicación línea por línea (para arrancar sin base)

- `import { inject, Injectable } from '@angular/core';`
  - `Injectable` marca la clase para poder inyectarla como dependencia en otros sitios.
  - `inject` permite obtener dependencias sin usar constructor.
- `import { HttpClient } from '@angular/common/http';`
  - Cliente HTTP de Angular para hacer peticiones REST.
- `import { Observable, tap } from 'rxjs';`
  - `Observable` es el tipo asíncrono que devuelve `HttpClient`.
  - `tap` ejecuta efectos secundarios (guardar token) sin modificar la respuesta.
- `type LoginPayload`, `RegisterPayload`, `LoginResponse`
  - Tipos para documentar y tipar el body de envío y la respuesta del login.
- `@Injectable({ providedIn: 'root' })`
  - Hace el servicio singleton y disponible en toda la app sin declararlo en un módulo.
- `private http = inject(HttpClient);`
  - Obtiene una instancia de `HttpClient` para usarla dentro del servicio.
- `private API = 'http://localhost:8000/api'; // con proxy, usa '/api'`
  - URL base de la API. Si configuras un proxy de Angular en dev, usa `'/api'` para evitar CORS.
- `login(payload: LoginPayload)`
  - `POST /api/login` con email y password. Con `tap` guarda el `token` JWT en `localStorage`.
- `register(payload: RegisterPayload)`
  - `POST /api/auth/register` para crear usuario; devuelve un mensaje de confirmación.
- `getToken()` y `logout()`
  - Acceso rápido al token guardado y método para limpiar sesión. */
