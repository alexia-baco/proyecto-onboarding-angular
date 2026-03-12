import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthStore } from '../../../shared/services/auth-store';
import { AdminUsersApiService } from '../../../shared/services/admin-users.service';
import { ToastService } from '../../../shared/services/toast-service';
import { AdminUser } from '../../../shared/interfaces/admin';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  // ¡Importante! Añadimos ReactiveFormsModule para poder usar nuestro formulario
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-component.html',
})
export class AdminDashboardComponent implements OnInit {
  // Inyectamos todas nuestras herramientas
  public readonly store = inject(AuthStore);
  private adminService = inject(AdminUsersApiService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  // Variables para guardar los datos en pantalla
  users: AdminUser[] = [];
  createForm!: FormGroup;
  searchQuery = '';
  tempPasswordMessage: string | null = null; // Para mostrar la contraseña temporal

  ngOnInit() {
    // 1. Preparamos el formulario de crear usuario (como hicimos en el registro)
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombre: [''],
      // Por defecto, le damos el rol de usuario normal
      roles: [['ROLE_USER']], 
    });

    // 2. Nada más arrancar la pantalla, cargamos la lista de usuarios
    this.loadUsers();
  }

  // --- MÉTODOS DEL CRUD ---

  // Cargar usuarios (si hay algo en searchQuery, buscará por eso)
  loadUsers() {
    this.adminService.getUsers(this.searchQuery).subscribe({
      next: (data) => this.users = data,
      error: () => this.toast.error('Error al cargar la lista de usuarios'),
    });
  }

  // Cuando escribimos en el buscador y le damos al botón
  onSearch(event: Event) {
    event.preventDefault(); // Evita que la página recargue
    this.loadUsers();
  }

  // Actualizar la variable de búsqueda mientras escribimos
  updateSearchQuery(event: any) {
    this.searchQuery = event.target.value;
  }

  // Crear un usuario nuevo
  onCreateUser() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    // Convertimos el valor del select de roles en un array
    const formValue = this.createForm.value;
    const payload = { ...formValue, roles: [formValue.roles] };

    this.adminService.createUser(payload).subscribe({
      next: () => {
        this.toast.success('Usuario creado correctamente');
        // Limpiamos el formulario y volvems a cargar la lista para ver al nuevo
        this.createForm.reset({ roles: 'ROLE_USER' });
        this.loadUsers();
      },
      error: () => this.toast.error('No se pudo crear el usuario'),
    });
  }

  // Resetear la contraseña
  onResetPassword(id: number) {
    // Confirmación simple para no borrar por accidente
    if (!confirm('¿Seguro que quieres resetear esta contraseña?')) return;

    this.tempPasswordMessage = null; // Limpiamos el mensaje anterior si lo había

    this.adminService.resetPassword(id).subscribe({
      next: (res) => {
        this.toast.success('Contraseña reseteada con éxito');
        // El backend nos devuelve la nueva contraseña, ¡la enseñamos en pantalla!
        this.tempPasswordMessage = res.password 
          ? `Nueva contraseña temporal: ${res.password}` 
          : 'Contraseña reseteada (revisa tu email)';
      },
      error: () => this.toast.error('Error al resetear la contraseña'),
    });
  }
}