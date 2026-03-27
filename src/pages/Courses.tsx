import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Plus, MoreVertical, Edit, Trash2, BookOpen } from 'lucide-react';
import { courseService } from '@/services/courseService';
import { Course } from '@/services/types';
import { SlideDrawer } from '@/components/shared/SlideDrawer';
import { FloatingLabelInput } from '@/components/shared/FloatingLabelInput';
import { EmptyState } from '@/components/shared/EmptyState';
import { TableSkeleton } from '@/components/shared/SkeletonShimmer';

const Courses = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [form, setForm] = useState({ code: '', title: '', facultyName: '', capacity: '30', semester: 'Fall 2024', credits: '3', enrolled: '0' });

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', search],
    queryFn: () => courseService.getAll({ search }),
  });

  const createMut = useMutation({
    mutationFn: (data: Omit<Course, 'id'>) => courseService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['courses'] }); closeDrawer(); },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => courseService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  });

  const closeDrawer = () => { setDrawerOpen(false); setEditing(null); setForm({ code: '', title: '', facultyName: '', capacity: '30', semester: 'Fall 2024', credits: '3', enrolled: '0' }); };

  const openEdit = (c: Course) => {
    setEditing(c);
    setForm({ code: c.code, title: c.title, facultyName: c.facultyName, capacity: String(c.capacity), semester: c.semester, credits: String(c.credits), enrolled: String(c.enrolled) });
    setDrawerOpen(true);
    setMenuOpen(null);
  };

  const handleSubmit = () => {
    const payload = { ...form, capacity: parseInt(form.capacity), credits: parseInt(form.credits), enrolled: parseInt(form.enrolled) };
    createMut.mutate(payload as Omit<Course, 'id'>);
  };

  return (
    <div>
      <motion.div className="mb-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-[42px] font-bold leading-[1.05] tracking-[-1.5px] text-[var(--text-primary)]">Courses</h1>
      </motion.div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            className="w-full rounded-xl border border-[var(--border-glass)] bg-[var(--bg-surface)] py-2.5 pl-9 pr-3 text-sm outline-none backdrop-blur-xl focus:border-[var(--accent-blue-solid)] focus:ring-2 focus:ring-[var(--accent-blue-solid)]/20"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button onClick={() => { closeDrawer(); setDrawerOpen(true); }} className="glass-cta flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
          <Plus size={16} /> New Course
        </button>
      </div>

      <div className="glass-surface overflow-hidden">
        {isLoading ? (
          <div className="p-6"><TableSkeleton rows={6} cols={5} /></div>
        ) : !courses?.length ? (
          <EmptyState icon={BookOpen} title="No courses found" description="Create a new course to get started." action={{ label: 'New Course', onClick: () => setDrawerOpen(true) }} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-glass)]">
                  <th className="px-6 py-3 text-left font-medium text-[var(--text-secondary)]">Code</th>
                  <th className="px-6 py-3 text-left font-medium text-[var(--text-secondary)]">Title</th>
                  <th className="px-6 py-3 text-left font-medium text-[var(--text-secondary)]">Faculty</th>
                  <th className="px-6 py-3 text-left font-medium text-[var(--text-secondary)]">Enrollment</th>
                  <th className="px-6 py-3 text-right font-medium text-[var(--text-secondary)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c, i) => {
                  const pct = Math.round((c.enrolled / c.capacity) * 100);
                  return (
                    <tr
                      key={c.id}
                      className="border-b border-[var(--border-glass)] transition-colors hover:bg-[rgba(0,132,255,0.03)]"
                      style={{ animation: `staggerFadeIn 0.35s ease-out ${Math.min(i * 0.06, 0.4)}s forwards`, opacity: 0 }}
                    >
                      <td className="px-6 py-4 font-mono text-xs font-medium text-[var(--accent-blue-solid)]">{c.code}</td>
                      <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{c.title}</td>
                      <td className="px-6 py-4 text-[var(--text-secondary)]">{c.facultyName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-24 rounded-full bg-[var(--bg-surface)]">
                            <div className="h-full rounded-full bg-[var(--accent-blue-solid)] transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-[var(--text-muted)]">{c.enrolled}/{c.capacity}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block">
                          <button onClick={() => setMenuOpen(menuOpen === c.id ? null : c.id)} className="rounded-lg p-1.5 hover:bg-[var(--bg-surface)]" aria-label="Actions">
                            <MoreVertical size={16} className="text-[var(--text-muted)]" />
                          </button>
                          {menuOpen === c.id && (
                            <div className="absolute right-0 z-20 mt-1 w-36 rounded-xl border border-[var(--border-glass)] bg-white py-1 shadow-lg">
                              <button onClick={() => openEdit(c)} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-surface)]"><Edit size={14} /> Edit</button>
                              <button onClick={() => { deleteMut.mutate(c.id); setMenuOpen(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 size={14} /> Delete</button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SlideDrawer open={drawerOpen} onClose={closeDrawer} title={editing ? 'Edit Course' : 'New Course'}>
        <div className="space-y-5">
          <FloatingLabelInput id="c-code" label="Course Code" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
          <FloatingLabelInput id="c-title" label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <FloatingLabelInput id="c-faculty" label="Faculty Name" value={form.facultyName} onChange={e => setForm(f => ({ ...f, facultyName: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <FloatingLabelInput id="c-cap" label="Capacity" type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} />
            <FloatingLabelInput id="c-credits" label="Credits" type="number" value={form.credits} onChange={e => setForm(f => ({ ...f, credits: e.target.value }))} />
          </div>
          <FloatingLabelInput id="c-sem" label="Semester" value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value }))} />
          <button onClick={handleSubmit} disabled={createMut.isPending} className="glass-cta mt-4 w-full py-3 text-sm font-semibold disabled:opacity-60">
            {editing ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </SlideDrawer>
    </div>
  );
};

export default Courses;
