export const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export const formatadorData = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatarData(valor?: string | Date | null) {
  if (!valor) return '—';
  return formatadorData.format(new Date(valor));
}

export function paraInputDate(valor?: string | Date | null) {
  if (!valor) return '';
  return new Date(valor).toISOString().slice(0, 10);
}
