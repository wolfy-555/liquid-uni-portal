import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { courseService } from '@/services/courseService';
import { SkeletonShimmer } from '@/components/shared/SkeletonShimmer';

const Catalogue = () => {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses-catalogue'],
    queryFn: () => courseService.getAll(),
  });

  const grouped = courses?.reduce((acc, c) => {
    (acc[c.semester] = acc[c.semester] || []).push(c);
    return acc;
  }, {} as Record<string, typeof courses>) || {};

  return (
    <div>
      <motion.div className="mb-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-[42px] font-bold leading-[1.05] tracking-[-1.5px] text-[var(--text-primary)]">Course Catalogue</h1>
        <p className="mt-1 text-[var(--text-secondary)]">Complete listing of all courses by semester</p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <SkeletonShimmer key={i} className="h-16" />)}
        </div>
      ) : (
        Object.entries(grouped).map(([semester, items]) => (
          <motion.div key={semester} className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-4 flex items-center gap-4">
              <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">{semester}</h2>
              <div className="h-px flex-1 bg-[var(--border-glass)]" />
            </div>
            <div className="space-y-0">
              {items!.map((c, i) => (
                <div
                  key={c.id}
                  className={`flex items-center gap-6 px-4 py-4 ${i % 2 === 0 ? 'bg-[rgba(0,132,255,0.02)]' : ''} rounded-lg`}
                >
                  <span className="w-20 shrink-0 font-mono text-sm text-[var(--text-muted)]">{c.code}</span>
                  <div className="flex-1">
                    <p className="font-display text-base font-bold text-[var(--text-primary)]">{c.title}</p>
                  </div>
                  <span className="hidden text-sm text-[var(--text-secondary)] sm:block">{c.facultyName}</span>
                  <span className="w-16 text-right text-sm text-[var(--text-muted)]">{c.credits} cr</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default Catalogue;
