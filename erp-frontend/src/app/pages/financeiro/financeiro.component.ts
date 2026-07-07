import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [CardModule],
  templateUrl: './financeiro.component.html',
  styleUrl: './financeiro.component.css',
})
export class FinanceiroComponent {}
