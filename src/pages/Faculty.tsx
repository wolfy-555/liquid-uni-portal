import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Users as UsersIcon } from 'lucide-react';
import { facultyService } from '@/services/facultyService';
import { EmptyState } from '@/components/shared/EmptyState';
import { SkeletonShimmer } from '@/components/shared/SkeletonShimmer';

const stagger = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: Math.min(i * 0.08, 0.4), duration: 0.35 } });

const Faculty = () => {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('all');

  const { data: faculty, isLoading } = useQuery({
    queryKey: ['faculty', search, dept],
    queryFn: () => facultyService.getAll({ search, department: dept }),
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => facultyService.getDepartments(),
  });

  return (
    <div>
      <motion.div className="mb-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-[42px] font-bold leading-[1.05] tracking-[-1.5px] text-[var(--text-primary)]">Faculty</h1>
      </motion.div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            className="w-full rounded-xl border border-[var(--border-glass)] bg-[var(--bg-surface)] py-2.5 pl-9 pr-3 text-sm outline-none backdrop-blur-xl focus:border-[var(--accent-blue-solid)] focus:ring-2 focus:ring-[var(--accent-blue-solid)]/20"
            placeholder="Search faculty..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="rounded-xl border border-[var(--border-glass)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm backdrop-blur-xl outline-none"
          value={dept}
          onChange={e => setDept(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments?.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <SkeletonShimmer key={i} className="h-52" />)}
        </div>
      ) : !faculty?.length ? (
        <EmptyState icon={UsersIcon} title="No faculty found" description="Adjust your search or filters." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.map((f, i) => (
            <motion.div key={f.id} className="glass-surface glass-card-hover p-6" {...stagger(i)}>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-blue-solid)] to-[var(--accent-glow-soft)] text-lg font-bold text-white">
                  {f.name.split(' ').slice(-1)[0][0]}{f.name.split(' ').slice(-2, -1)[0]?.[0] || ''}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">{f.name}</h3>
                  <span className="inline-block mt-1 rounded-full bg-[var(--bg-surface)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border-glass)]">
                    {f.department}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs font-medium text-[var(--text-muted)] mb-1.5">Assigned Courses</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.courses.map(c => (
                    <span key={c} className="rounded-md bg-[var(--bg-surface)] px-2 py-0.5 font-mono text-xs text-[var(--text-secondary)]">{c}</span>
                  ))}
                </div>
              </div>
              <button className="mt-4 w-full rounded-xl border border-[var(--border-glass)] py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]">
                View Profile
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Faculty;
