// src/app/shared/components/page-title/page-title.component.ts
import { Component, Input } from '@angular/core'; // Importamos Input

@Component({
   selector: 'app-page-title',
   standalone: true,
   templateUrl: './page-title.html',
})
export class PageTitleComponent {
  // Decorador @Input() para recibir datos del componente padre
  @Input() title: string = ''; // Valor por defecto vacío
  @Input() subtitle?: string; // Opcional (puede ser undefined)
}
