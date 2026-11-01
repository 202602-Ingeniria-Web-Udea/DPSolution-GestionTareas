import { cn } from 'cn';

/**
 * Monograma de marca de DP Solutions — se reutiliza en el header de la
 * landing y en el sidebar para que la identidad visual sea consistente.
 */
export function Logo({ withLabel = true, className }: { withLabel?: boolean; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className='flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground'>
        DP
      </span>
      {withLabel && (
        <span className='truncate text-sm font-semibold group-data-[collapsible=icon]:hidden'>
          Gestión de Tareas
        </span>
      )}
    </div>
  );
}
