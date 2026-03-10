// src/app/shared/services/toast-service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  timeout?: number; // ms
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private subject = new Subject<Toast>();
  toasts$: Observable<Toast> = this.subject.asObservable();

  success(message: string, timeout = 3000): void {
    this.emit('success', message, timeout);
  }

  error(message: string, timeout = 4000): void {
    this.emit('error', message, timeout);
  }

  info(message: string, timeout = 3000): void {
    this.emit('info', message, timeout);
  }

  warning(message: string, timeout = 3000): void {
    this.emit('warning', message, timeout);
  }

 private emit(type: ToastType, message: string, timeout: number): void {
    this.subject.next({ id: Date.now(), type, message, timeout });
  }
}
