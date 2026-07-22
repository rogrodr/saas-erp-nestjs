import {
  LayoutDashboard,
  ShoppingCart,
  ShoppingBag,
  Package,
  Boxes,
  Users,
  Truck,
  Wallet,
  CreditCard,
  UserCog,
  Building2,
  ScrollText,
  LineChart,
  FileBarChart,
  type LucideIcon,
} from 'lucide-react';

export interface ItemNavegacao {
  rotulo: string;
  caminho: string;
  icone: LucideIcon;
}

export const itensNavegacao: ItemNavegacao[] = [
  { rotulo: 'Dashboard', caminho: '/', icone: LayoutDashboard },
  { rotulo: 'Vendas', caminho: '/vendas', icone: ShoppingCart },
  { rotulo: 'Compras', caminho: '/compras', icone: ShoppingBag },
  { rotulo: 'Produtos', caminho: '/produtos', icone: Package },
  { rotulo: 'Histórico de Preços', caminho: '/historico-precos', icone: LineChart },
  { rotulo: 'Estoque', caminho: '/estoque', icone: Boxes },
  { rotulo: 'Clientes', caminho: '/clientes', icone: Users },
  { rotulo: 'Fornecedores', caminho: '/fornecedores', icone: Truck },
  { rotulo: 'Contas a Receber', caminho: '/contas-receber', icone: Wallet },
  { rotulo: 'Contas a Pagar', caminho: '/contas-pagar', icone: CreditCard },
  { rotulo: 'Relatório Financeiro', caminho: '/relatorios/financeiro', icone: FileBarChart },
  { rotulo: 'Usuários', caminho: '/usuarios', icone: UserCog },
  { rotulo: 'Empresa', caminho: '/empresa', icone: Building2 },
  { rotulo: 'Auditoria', caminho: '/auditoria', icone: ScrollText },
];
