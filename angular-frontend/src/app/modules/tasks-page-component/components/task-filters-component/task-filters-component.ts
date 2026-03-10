// src/app/modules/tasks-page-component/components/task-filters-component/task-filters-component.ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaskFilters } from '../../../../shared/interfaces/tasks';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-filters-component.html',
})
export class TaskFiltersComponent implements OnInit {
  form!: FormGroup;
  @Output() apply = new EventEmitter<TaskFilters & { fechaDesde?: string | null; fechaHasta?: string | null }>();
  @Output() reset = new EventEmitter<void>();
  
  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      texto: [''],
      estado: [''], // '', 'pendiente', 'en progreso', 'completada'
      mostrarSoloPendientes: [false],
      fechaDesde: [null], // YYYY-MM-DD
      fechaHasta: [null], // YYYY-MM-DD
    });
  }
  
  onApply(): void {
    const v = this.form.value;
    // Construimos los filtros mínimos que entiende la API: q y estado
    const filters: TaskFilters = {
      q: v.texto?.trim() || undefined,
      estado: v.mostrarSoloPendientes ? 'pendiente' : (v.estado || undefined),
    };
    // Emitimos también el rango de fechas para filtrado local opcional
    this.apply.emit({ ...filters, fechaDesde: v.fechaDesde || null, fechaHasta: v.fechaHasta || null });
  }

  onReset(): void {
    this.form.reset({ texto: '', estado: '', mostrarSoloPendientes: false, fechaDesde: null, fechaHasta: null });
    this.reset.emit();
  }
}

