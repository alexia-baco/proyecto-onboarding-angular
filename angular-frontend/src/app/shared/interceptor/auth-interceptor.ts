import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../services/auth-store';
import { ToastService } from '../services/toast-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectamos las herramientas que necesitamos
  const store = inject(AuthStore);
  const router = inject(Router);
  const toast = inject(ToastService);

  // 1. Añadimos el token a la petición si existe (lo que ya tenías)
  const token = store.token();
  let authReq = req;
  
  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  // 2. Enviamos la petición y estamos "a la escucha" de errores
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // LOGOUT TÉCNICO: Si el backend nos da un 401 (No Autorizado)
      if (error.status === 401) {
        store.clearSession(); // Borramos la sesión
        toast.error('Tu sesión ha expirado. Vuelve a iniciar sesión.'); // Mostramos el toast
        router.navigateByUrl('/login'); // Redirigimos al login
      }
      
      // Devolvemos el error para que siga su camino si hace falta
      return throwError(() => error);
    })
  );
};