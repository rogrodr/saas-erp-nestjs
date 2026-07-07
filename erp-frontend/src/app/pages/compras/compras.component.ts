import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CardModule],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css',
})
export class ComprasComponent {}
