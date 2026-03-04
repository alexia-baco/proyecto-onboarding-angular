import { Routes } from '@angular/router';
import { LandingPageComponent } from './modules/landing-page-component/landing-page-component';
import { TasksPageComponent } from './modules/tasks-page-component/tasks-page-component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'tasks', component: TasksPageComponent }
];