import { Routes } from '@angular/router';
// Importamos la página de tareas
import { TasksPageComponent } from './modules/tasks-page-component/tasks-page-component';

export const routes: Routes = [
  // Cuando escriban /tasks, mostramos el componente de tareas
  { path: 'tasks', component: TasksPageComponent },
  
  // Si entran a la raíz (localhost:4200 o 35979 sin nada más), los mandamos a /tasks
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  
  // Si escriben una ruta que no existe, los mandamos también a /tasks por defecto
  { path: '**', redirectTo: 'tasks' }
];