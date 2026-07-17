import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';

interface OpcoesRecurso {
  carregarAoMontar?: boolean;
}

export function useRecurso<T extends { id: number | string }>(
  endpoint: string,
  opcoes: OpcoesRecurso = { carregarAoMontar: true },
) {
  const [itens, setItens] = useState<T[]>([]);
  const [carregando, setCarregando] = useState(Boolean(opcoes.carregarAoMontar));
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const { data } = await api.get<T[]>(endpoint);
      setItens(Array.isArray(data) ? data : []);
    } catch (erroRequisicao) {
      setErro(extrairMensagemErro(erroRequisicao));
    } finally {
      setCarregando(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (opcoes.carregarAoMontar) {
      recarregar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  async function criar(payload: Partial<T>) {
    const { data } = await api.post<T>(endpoint, payload);
    setItens((atual) => [data, ...atual]);
    return data;
  }

  async function atualizar(id: number | string, payload: Partial<T>) {
    const { data } = await api.patch<T>(`${endpoint}/${id}`, payload);
    setItens((atual) => atual.map((item) => (item.id === id ? data : item)));
    return data;
  }

  async function remover(id: number | string) {
    await api.delete(`${endpoint}/${id}`);
    setItens((atual) => atual.filter((item) => item.id !== id));
  }

  async function acaoCustomizada(id: number | string, caminho: string) {
    const { data } = await api.patch<T>(`${endpoint}/${id}/${caminho}`);
    setItens((atual) => atual.map((item) => (item.id === id ? data : item)));
    return data;
  }

  return { itens, carregando, erro, recarregar, criar, atualizar, remover, acaoCustomizada, setItens };
}

export function extrairMensagemErro(erro: unknown): string {
  const mensagem = (erro as any)?.response?.data?.message;
  if (Array.isArray(mensagem)) return mensagem[0];
  if (typeof mensagem === 'string') return mensagem;
  return 'Ocorreu um erro ao comunicar com o servidor.';
}
