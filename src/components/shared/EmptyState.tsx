import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState = ({ icon: Icon, title, description, action }: Props) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <Icon size={48} className="mb-4 text-[var(--text-muted)]" strokeWidth={1.5} />
    <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-[var(--text-secondary)]">{description}</p>
    {action && (
      <button onClick={action.onClick} className="glass-cta mt-4 px-5 py-2.5 text-sm font-medium">
        {action.label}
      </button>
    )}
  </div>
);
