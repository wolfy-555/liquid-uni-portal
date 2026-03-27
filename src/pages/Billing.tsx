import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, FileDown, Receipt } from 'lucide-react';
import { studentService } from '@/services/studentService';
import { billingService } from '@/services/billingService';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { SkeletonShimmer } from '@/components/shared/SkeletonShimmer';

const Billing = () => {
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: students } = useQuery({
    queryKey: ['students-billing', studentSearch],
    queryFn: () => studentService.getAll({ search: studentSearch }),
    enabled: studentSearch.length > 0,
  });

  const { data: selectedStudent } = useQuery({
    queryKey: ['student', selectedId],
    queryFn: () => studentService.getById(selectedId!),
    enabled: !!selectedId,
  });

  const { data: billing, isLoading } = useQuery({
    queryKey: ['billing', selectedId],
    queryFn: () => billingService.getByStudent(selectedId!),
    enabled: !!selectedId,
  });

  const totalDue = billing?.filter(b => b.status !== 'paid').reduce((sum, b) => sum + b.amount, 0) ?? 0;

  return (
    <div>
      <motion.div className="mb-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-[42px] font-bold leading-[1.05] tracking-[-1.5px] text-[var(--text-primary)]">Billing</h1>
      </motion.div>

      {/* Student Search */}
      <div className="relative mb-8 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          className="w-full rounded-xl border border-[var(--border-glass)] bg-[var(--bg-surface)] py-2.5 pl-9 pr-3 text-sm outline-none backdrop-blur-xl focus:border-[var(--accent-blue-solid)]"
          placeholder="Search student to view billing..."
          value={studentSearch}
          onChange={e => { setStudentSearch(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
        />
        {showDropdown && students && students.length > 0 && (
          <div className="absolute z-20 mt-1 w-full rounded-xl border border-[var(--border-glass)] bg-white shadow-lg max-h-48 overflow-y-auto">
            {students.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelectedId(s.id); setStudentSearch(s.name); setShowDropdown(false); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--bg-surface)] text-left"
              >
                <span className="font-medium text-[var(--text-primary)]">{s.name}</span>
                <span className="font-mono text-xs text-[var(--text-muted)]">{s.studentCode}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {!selectedId ? (
        <EmptyState icon={Receipt} title="Select a student" description="Search for a student above to view their billing records." />
      ) : isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <SkeletonShimmer key={i} className="h-14" />)}</div>
      ) : (
        <motion.div className="glass-surface overflow-hidden" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-glass)] px-6 py-5">
            <div>
              <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">{selectedStudent?.name}</h2>
              <p className="text-sm text-[var(--text-muted)]">{selectedStudent?.studentCode} · Academic Year 2024–25</p>
            </div>
            <button className="flex items-center gap-2 rounded-xl border border-[var(--border-glass)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]">
              <FileDown size={14} /> Download PDF
            </button>
          </div>

          {/* Line Items */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-glass)]">
                <th className="px-6 py-3 text-left font-medium text-[var(--text-secondary)]">Description</th>
                <th className="px-6 py-3 text-right font-medium text-[var(--text-secondary)]">Amount</th>
                <th className="px-6 py-3 text-left font-medium text-[var(--text-secondary)]">Due Date</th>
                <th className="px-6 py-3 text-left font-medium text-[var(--text-secondary)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {billing?.map(b => (
                <tr key={b.id} className="border-b border-[var(--border-glass)] hover:bg-[rgba(0,132,255,0.03)]">
                  <td className="px-6 py-4 text-[var(--text-primary)]">{b.description}</td>
                  <td className="px-6 py-4 text-right font-mono text-[var(--text-primary)]">${b.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">{new Date(b.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[var(--border-glass)] px-6 py-5">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Total Outstanding</span>
            <span className="font-display text-3xl font-bold text-[var(--text-primary)]">${totalDue.toLocaleString()}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Billing;
