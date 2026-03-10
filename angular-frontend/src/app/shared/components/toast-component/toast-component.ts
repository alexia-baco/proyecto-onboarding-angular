// src/app/shared/components/toast-component/toast-component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Toast, ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-component.html',
})
export class ToastComponent {
  toasts: Toast[] = [];

  constructor(private readonly toast: ToastService) {
    this.toast.toasts$.subscribe((t) => {
      this.toasts.push(t);
      const ttl = t.timeout ?? 3000;
      setTimeout(() => this.dismiss(t.id), ttl);
    });
  }

  dismiss(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}
