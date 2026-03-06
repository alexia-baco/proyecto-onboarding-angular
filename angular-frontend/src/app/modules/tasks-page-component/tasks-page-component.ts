import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { BackToLandingButtonComponent } from '../../shared/components/back-to-landing-button/back-to-landing-button';
import { PageTitleComponent } from '../../shared/components/page-title/page-title';
import { TaskFormComponent } from './components/task-form-component/task-form-component';

interface Task {
  title: string;
  status: 'pendiente' | 'en progreso' | 'completada';
  dueDate: string | null;
}

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  // FÍJATE: Aquí NO está el TaskFormComponent todavía
  imports: [CommonModule, BackToLandingButtonComponent, PageTitleComponent, TaskFormComponent],
  templateUrl: './tasks-page-component.html' 
})
export class TasksPageComponent {
  
  tasks: Task[] = [
    { title: 'Aprender Angular', status: 'en progreso', dueDate: '2025-11-15' },
    { title: 'Practicar con TypeScript', status: 'pendiente', dueDate: '2025-11-20' },
    { title: 'Estudiar Tailwind', status: 'completada', dueDate: null },
    { title: 'Preparar presentaciones', status: 'pendiente', dueDate: '2025-12-05' },
    { title: 'Revisar pull requests', status: 'en progreso', dueDate: null }
  ];

  onTaskSubmitted(payload: any) {
    console.log("Tarea guardada", payload);
  }
}