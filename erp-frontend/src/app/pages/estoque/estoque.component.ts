import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CardModule],
  templateUrl: './estoque.component.html',
  styleUrl: './estoque.component.css',
})
export class EstoqueComponent {}
