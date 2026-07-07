import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-fornecedores',
  standalone: true,
  imports: [CardModule],
  templateUrl: './fornecedores.component.html',
  styleUrl: './fornecedores.component.css',
})
export class FornecedoresComponent {}
