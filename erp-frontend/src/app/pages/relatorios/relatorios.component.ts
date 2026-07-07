import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CardModule],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.css',
})
export class RelatoriosComponent {}
