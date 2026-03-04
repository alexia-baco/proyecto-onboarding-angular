import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-back-to-landing-button',
  standalone: true, // <-- ¡Esto arregla el NG2012!
  imports: [RouterLink],
  templateUrl: './back-to-landing-button.html' // <-- (Asegúrate de que no tenga el .component)
})
export class BackToLandingButtonComponent { }