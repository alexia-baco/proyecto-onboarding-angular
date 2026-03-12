import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth-service';
import { AuthStore } from '../../../shared/services/auth-store';
import { ToastService } from '../../../shared/services/toast-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-component.html',
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private store: AuthStore,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Aquí creamos las reglas del formulario: email válido y contraseña obligatoria
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    // Si el formulario no cumple las reglas, no hacemos nada
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    
    // 1. Llamamos al backend para hacer login
    this.auth.login(this.form.getRawValue() as any).subscribe({
      next: (res) => {
        // 2. Si hay éxito, guardamos el token
        this.store.setSession(res.token);
        
        // 3. Inmediatamente pedimos los datos del usuario (roles, email)
        this.auth.me().subscribe({
          next: (user) => {
            this.store.setUser(user);
            this.toast.success('Sesión iniciada');
            
            // 4. Si es admin lo mandamos a /admin, si no, a /tasks
            const isAdmin = user.roles?.includes('ROLE_ADMIN');
            this.router.navigateByUrl(isAdmin ? '/admin' : '/tasks');
          },
          error: () => {
            this.toast.success('Sesión iniciada');
            this.router.navigateByUrl('/tasks');
          },
        });
      },
      error: () => {
        // Si el usuario o contraseña están mal, sacamos el aviso rojo
        this.toast.error('Credenciales inválidas');
        this.loading = false;
      },
    });
  }
}