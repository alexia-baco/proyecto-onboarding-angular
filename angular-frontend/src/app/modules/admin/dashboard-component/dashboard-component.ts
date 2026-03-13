// dashboard-component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// AÑADIDO: Importamos Router
import { Router } from '@angular/router';
import { AuthStore } from '../../../shared/services/auth-store';
import { AdminUsersApiService } from '../../../shared/services/admin-users.service';
import { ToastService } from '../../../shared/services/toast-service';
import { AdminUser } from '../../../shared/interfaces/admin';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-component.html',
})
export class AdminDashboardComponent implements OnInit {
  public readonly store = inject(AuthStore);
  private adminService = inject(AdminUsersApiService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  // AÑADIDO: Inyectamos el Router
  private router = inject(Router);

  users: AdminUser[] = [];
  createForm!: FormGroup;
  searchQuery = '';
  tempPasswordMessage: string | null = null;

  ngOnInit() {
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombre: [''],
      roles: [['ROLE_USER']], 
    });
    this.loadUsers();
  }

  // --- MÉTODO LOGOUT AÑADIDO ---
  logout() {
    this.store.clearSession();
    this.router.navigateByUrl('/');
  }

  // --- RESTO DE MÉTODOS DEL CRUD INTACTOS ---
  loadUsers() {
    this.adminService.getUsers(this.searchQuery).subscribe({
      next: (data) => this.users = data,
      error: () => this.toast.error('Error al cargar la lista de usuarios'),
    });
  }

  onSearch(event: Event) {
    event.preventDefault();
    this.loadUsers();
  }

  updateSearchQuery(event: any) {
    this.searchQuery = event.target.value;
  }

  isSubmitting = false;
  
  onCreateUser() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    
    // AÑADIDO: Bloqueamos el botón justo antes de enviar
    this.isSubmitting = true; 
    
    const formValue = this.createForm.value;
    const payload = { ...formValue, roles: [formValue.roles] };

    this.adminService.createUser(payload).subscribe({
      next: () => {
        this.toast.success('Usuario creado correctamente');
        this.createForm.reset({ roles: 'ROLE_USER' });
        this.loadUsers();
        // AÑADIDO: Desbloqueamos el botón al terminar con éxito
        this.isSubmitting = false; 
      },
      error: () => {
        this.toast.error('No se pudo crear el usuario');
        // AÑADIDO: Desbloqueamos el botón si hay error
        this.isSubmitting = false; 
      },
    });
  }

  onResetPassword(id: number) {
    if (!confirm('¿Seguro que quieres resetear esta contraseña?')) return;
    this.tempPasswordMessage = null;

    this.adminService.resetPassword(id).subscribe({
      next: (res) => {
        this.toast.success('Contraseña reseteada con éxito');
        this.tempPasswordMessage = res.password 
          ? `Nueva contraseña temporal: ${res.password}` 
          : 'Contraseña reseteada (revisa tu email)';
      },
      error: () => this.toast.error('Error al resetear la contraseña'),
    });
  }
}