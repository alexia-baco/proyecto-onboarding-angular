import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// ¡Fíjate! Aquí hemos puesto la ruta exacta hacia el archivo que creaste antes
import { Task, TaskFilters, TaskPayload } from '../../../shared/interfaces/tasks';

@Injectable({ providedIn: 'root' })
export class TaskApiService {
  private readonly http = inject(HttpClient);
  
  // Usamos '/api' para aprovechar el proxy y evitar el error CORS
  private readonly API = '/api'; 

  private authOptions(extra?: { params?: HttpParams }) {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return { ...(extra ?? {}), headers } as { params?: HttpParams; headers?: any };
  }

  getTasks(filters?: TaskFilters): Observable<Task[]> {
    let params = new HttpParams();
    if (filters?.q) params = params.set('q', filters.q);
    if (filters?.estado) {
      const estadoApi = filters.estado === 'en progreso' ? 'en_progreso' : filters.estado;
      params = params.set('estado', estadoApi);
    }
    // opcional en dev mientras no haya auth
    params = params.set('usuarioId', 1);
    
    return this.http.get<Task[]>(`${this.API}/tasks`, this.authOptions({ params }));
  }

  createTask(payload: TaskPayload): Observable<Task> {
    const body = {
      ...payload,
      estado: payload.estado === 'en progreso' ? 'en_progreso' : payload.estado,
    };
    return this.http.post<Task>(`${this.API}/tasks`, body, this.authOptions());
  }

  updateTask(id: number, payload: TaskPayload): Observable<Task> {
    const body = {
      ...payload,
      estado: payload.estado === 'en progreso' ? 'en_progreso' : payload.estado,
    };
    return this.http.put<Task>(`${this.API}/tasks/${id}`, body, this.authOptions());
  }

  updateTaskStatus(id: number, status: Task['estado']): Observable<Task> {
    const estado = status === 'en progreso' ? 'en_progreso' : status;
    return this.http.patch<Task>(`${this.API}/tasks/${id}/status`, { estado }, this.authOptions());
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/tasks/${id}`, this.authOptions());
  }
}