const statusConfig: Record<string, string> = {
  active: 'tag-green',
  probation: 'tag-orange',
  inactive: 'tag-red',
  paid: 'tag-green',
  pending: 'tag-orange',
  overdue: 'tag-red',
  'full-time': 'tag-blue',
  'part-time': 'tag-orange',
  exchange: 'tag-purple',
  success: 'tag-green',
  failed: 'tag-red',
};

export const StatusBadge = ({ status }: { status: string }) => {
  const cls = statusConfig[status] || 'tag-blue';
  return (
    <span className={`tag-pill ${cls}`}>
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'currentColor' }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
