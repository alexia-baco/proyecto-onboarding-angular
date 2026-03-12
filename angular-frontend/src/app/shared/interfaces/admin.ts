// src/app/shared/interfaces/admin.ts

// Así es como nos devuelve el backend a los usuarios de la lista
export interface AdminUser {
  id: number;
  email: string;
  nombre?: string;
  roles: string[];
}

// Estos son los datos que enviaremos para crear un usuario nuevo
export interface CreateUserPayload {
  email: string;
  password?: string;
  nombre?: string;
  roles: string[];
}

// Así será la respuesta del backend cuando reseteemos una contraseña
export interface ResetPasswordResponse {
  message?: string;
  password?: string; // Aquí vendrá la contraseña temporal
}