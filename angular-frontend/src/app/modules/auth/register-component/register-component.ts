import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth-service';
import { ToastService } from '../../../shared/services/toast-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-component.html',
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Reglas: email válido y contraseña de mínimo 6 letras
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombre: [''],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    
    // Llamamos al backend para registrar al usuario
    this.auth.register(this.form.getRawValue() as any).subscribe({
      next: () => {
        // Si sale bien, aviso verde y nos vamos al login
        this.toast.success('Usuario registrado. Inicia sesión');
        this.router.navigateByUrl('/login');
      },
      error: () => {
        // Si sale mal, aviso rojo
        this.toast.error('No se pudo registrar');
        this.loading = false;
      },
    });
  }
}