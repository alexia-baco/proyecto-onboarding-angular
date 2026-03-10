// src/app/modules/tasks-page-component/tasks-page-component.ts
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { BackToLandingButtonComponent } from '../../shared/components/back-to-landing-button/back-to-landing-button';
import { PageTitleComponent } from '../../shared/components/page-title/page-title';
import { TaskFormComponent } from './components/task-form-component/task-form-component';
import { TaskListComponent } from './components/task-list-component/task-list-component';
import { TaskPayload } from '../../shared/interfaces/tasks';
import { TaskApiService } from '../../features/tasks/data/task-api';
import { TaskFiltersComponent } from './components/task-filters-component/task-filters-component';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, BackToLandingButtonComponent, PageTitleComponent, TaskFormComponent, TaskListComponent, TaskFiltersComponent],
  templateUrl: './tasks-page-component.html',
})
export class TasksPageComponent {
  @ViewChild(TaskListComponent) list?: TaskListComponent; // referencia para refrescar la lista

  constructor(private readonly api: TaskApiService) {}

  onFiltersApply(f: { q?: string; estado?: 'pendiente' | 'en progreso' | 'completada'; fechaDesde?: string | null; fechaHasta?: string | null }) {
    // Llama al listado con los filtros que entiende la API (q, estado)
    this.list?.loadTasks({ q: f.q, estado: f.estado });
    // Si quieres filtrar por fechas en cliente, ver paso 5 (opcional)
  }

  onTaskSubmitted(payload: TaskPayload) {
    // 1) Crear en la API
    this.api.createTask(payload).subscribe({
      next: () => {
        // 2) Refrescar la lista
        this.list?.loadTasks();
        // 3) (Ej. 05) Aquí mostrarías un toast de éxito
      },
      error: (err) => {
        console.error('Error al crear la tarea', err);
        // (Ej. 05) Aquí mostrarías un toast de error
      },
    });
  }
}
