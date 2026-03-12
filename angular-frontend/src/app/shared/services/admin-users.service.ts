// src/app/shared/services/admin-users.service.ts

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminUser, CreateUserPayload, ResetPasswordResponse } from '../interfaces/admin';

@Injectable({ providedIn: 'root' })
export class AdminUsersApiService {
  private http = inject(HttpClient);
  // Usamos el túnel que configuramos antes
  private API = '/api/admin/users';

  // 1. Obtener la lista de usuarios (acepta un parámetro de búsqueda 'q' opcional)
  getUsers(q?: string): Observable<AdminUser[]> {
    let params = new HttpParams();
    if (q) {
      params = params.set('q', q); // Si hay búsqueda, añade ?q=loquesea a la URL
    }
    return this.http.get<AdminUser[]>(this.API, { params });
  }

  // 2. Crear un usuario nuevo
  createUser(payload: CreateUserPayload): Observable<AdminUser> {
    return this.http.post<AdminUser>(this.API, payload);
  }

  // 3. Resetear la contraseña de un usuario usando su ID
  resetPassword(id: number): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(`${this.API}/${id}/reset-password`, {});
  }
}