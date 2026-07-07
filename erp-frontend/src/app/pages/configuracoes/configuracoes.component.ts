import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CardModule],
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.css',
})
export class ConfiguracoesComponent {}
