import clsx from 'clsx';

interface BadgeProps {
  texto: string;
  tom: 'verde' | 'ambar' | 'vermelho' | 'cinza' | 'azul';
}

const tons: Record<BadgeProps['tom'], string> = {
  verde: 'bg-emerald-100 text-emerald-700',
  ambar: 'bg-amber-100 text-amber-700',
  vermelho: 'bg-red-100 text-red-600',
  cinza: 'bg-ink-100 text-ink-700',
  azul: 'bg-brand-100 text-brand-700',
};

export function Badge({ texto, tom }: BadgeProps) {
  return (
    <span className={clsx('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', tons[tom])}>
      {texto}
    </span>
  );
}
