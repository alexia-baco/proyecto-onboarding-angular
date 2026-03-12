import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../shared/services/auth-store';
import { ToastService } from '../shared/services/toast-service';

export const authGuard: CanActivateFn = () => {
  // Inyectamos las herramientas que necesita el vigilante
  const store = inject(AuthStore);
  const router = inject(Router);
  const toast = inject(ToastService);

  // Si el cerebro (store) dice que estás logueado, pasas (return true)
  if (store.isLoggedIn()) {
    return true;
  }
  
  // Si no, saca el aviso azul y te echa a la página de login
  toast.info('Inicia sesión para continuar');
  return router.createUrlTree(['/login']);
};