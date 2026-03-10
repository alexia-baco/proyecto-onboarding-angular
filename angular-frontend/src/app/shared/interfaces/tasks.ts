export type Estado = 'pendiente' | 'en progreso' | 'completada';

export interface Task {
  id: number;
  titulo: string;
  descripcion?: string | null;
  estado: Estado; // en UI usamos "en progreso"; al API se envía "en_progreso"
  fechaLimite?: string | null; 
  fechaCreacion?: string;      
}

export interface TaskPayload {
  titulo: string;
  descripcion?: string | null;
  estado?: Estado;
  fechaLimite?: string | null; 
}

export interface TaskFilters {
  estado?: Estado;
  q?: string;
}