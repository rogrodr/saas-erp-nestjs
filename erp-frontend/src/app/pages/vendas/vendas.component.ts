import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-vendas',
  standalone: true,
  imports: [CardModule],
  templateUrl: './vendas.component.html',
  styleUrl: './vendas.component.css',
})
export class VendasComponent {}
