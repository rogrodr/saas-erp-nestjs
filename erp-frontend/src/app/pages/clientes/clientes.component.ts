import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CardModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
})
export class ClientesComponent {}
