import type { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { classesBotaoPrimario } from '../../lib/estilos';

interface PageHeaderProps {
  titulo: string;
  subtitulo?: string;
  rotuloAcao?: string;
  aoClicarAcao?: () => void;
  acaoExtra?: ReactNode;
}

export function PageHeader({ titulo, subtitulo, rotuloAcao, aoClicarAcao, acaoExtra }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">{titulo}</h1>
        {subtitulo && <p className="text-sm text-ink-500">{subtitulo}</p>}
      </div>
      <div className="flex items-center gap-2">
        {acaoExtra}
        {rotuloAcao && aoClicarAcao && (
          <button onClick={aoClicarAcao} className={classesBotaoPrimario}>
            <Plus size={16} />
            {rotuloAcao}
          </button>
        )}
      </div>
    </div>
  );
}
