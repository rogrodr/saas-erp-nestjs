import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RotaProtegida } from './routes/RotaProtegida';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { RecuperarSenha } from './pages/RecuperarSenha';
import { Dashboard } from './pages/Dashboard';
import { Vendas } from './pages/Vendas';
import { Compras } from './pages/Compras';
import { Produtos } from './pages/Produtos';
import { Estoque } from './pages/Estoque';
import { Clientes } from './pages/Clientes';
import { Fornecedores } from './pages/Fornecedores';
import { ContasReceber } from './pages/ContasReceber';
import { ContasPagar } from './pages/ContasPagar';
import { Usuarios } from './pages/Usuarios';
import { Empresa } from './pages/Empresa';
import { Auditoria } from './pages/Auditoria';
import { HistoricoPrecos } from './pages/HistoricoPrecos';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />

          <Route
            element={
              <RotaProtegida>
                <DashboardLayout />
              </RotaProtegida>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/vendas" element={<Vendas />} />
            <Route path="/compras" element={<Compras />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/contas-receber" element={<ContasReceber />} />
            <Route path="/contas-pagar" element={<ContasPagar />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/empresa" element={<Empresa />} />
            <Route path="/auditoria" element={<Auditoria />} />
            <Route path="/historico-precos" element={<HistoricoPrecos />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
