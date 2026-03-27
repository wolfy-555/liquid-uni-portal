import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Plus, MoreVertical, Edit, Trash2, Users } from 'lucide-react';
import { studentService } from '@/services/studentService';
import { Student } from '@/services/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { SlideDrawer } from '@/components/shared/SlideDrawer';
import { FloatingLabelInput } from '@/components/shared/FloatingLabelInput';
import { EmptyState } from '@/components/shared/EmptyState';
import { TableSkeleton } from '@/components/shared/SkeletonShimmer';

const Students = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const [form, setForm] = useState({ name: '', email: '', studentCode: '', course: '', year: '1', status: 'active' as Student['status'] });

  const { data: students, isLoading } = useQuery({
    queryKey: ['students', search, statusFilter],
    queryFn: () => studentService.getAll({ search, status: statusFilter }),
  });

  const createMut = useMutation({
    mutationFn: (data: Omit<Student, 'id'>) => studentService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['students'] }); closeDrawer(); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) => studentService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['students'] }); closeDrawer(); },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => studentService.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['students'] }); setDeleteId(null); },
  });

  const closeDrawer = () => { setDrawerOpen(false); setEditing(null); setForm({ name: '', email: '', studentCode: '', course: '', year: '1', status: 'active' }); };

  const openEdit = (s: Student) => {
    setEditing(s);
    setForm({ name: s.name, email: s.email, studentCode: s.studentCode, course: s.course, year: String(s.year), status: s.status });
    setDrawerOpen(true);
    setMenuOpen(null);
  };

  const handleSubmit = () => {
    const payload = { ...form, year: parseInt(form.year) };
    if (editing) updateMut.mutate({ id: editing.id, data: payload });
    else createMut.mutate(payload as Omit<Student, 'id'>);
  };

  return (
    <div>
      <motion.div className="mb-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-[42px] font-bold leading-[1.05] tracking-[-1.5px] text-[var(--text-primary)]">Students</h1>
      </motion.div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            className="w-full rounded-xl border border-[var(--border-glass)] bg-[var(--bg-surface)] py-2.5 pl-9 pr-3 text-sm outline-none backdrop-blur-xl transition-all focus:border-[var(--accent-blue-solid)] focus:ring-2 focus:ring-[var(--accent-blue-solid)]/20"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="rounded-xl border border-[var(--border-glass)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm backdrop-blur-xl outline-none"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="probation">Probation</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          onClick={() => { closeDrawer(); setDrawerOpen(true); }}
          className="glass-cta flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
        >
          <Plus size={16} /> Add Student
        </button>
      </div>

      {/* Table */}
      <div className="glass-surface overflow-hidden">
        {isLoading ? (
          <div className="p-6"><TableSkeleton rows={6} cols={5} /></div>
        ) : !students?.length ? (
          <EmptyState icon={Users} title="No students found" description="Adjust your filters or add a new student." action={{ label: 'Add Student', onClick: () => setDrawerOpen(true) }} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-glass)]">
                  <th className="px-6 py-3 text-left font-medium text-[var(--text-secondary)]">Name</th>
                  <th className="px-6 py-3 text-left font-medium text-[var(--text-secondary)]">Student ID</th>
                  <th className="px-6 py-3 text-left font-medium text-[var(--text-secondary)]">Course</th>
                  <th className="px-6 py-3 text-left font-medium text-[var(--text-secondary)]">Status</th>
                  <th className="px-6 py-3 text-right font-medium text-[var(--text-secondary)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr
                    key={s.id}
                    className="border-b border-[var(--border-glass)] transition-colors hover:bg-[rgba(0,132,255,0.03)]"
                    style={{ animation: `staggerFadeIn 0.35s ease-out ${Math.min(i * 0.06, 0.4)}s forwards`, opacity: 0 }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-blue)]/10 text-xs font-bold text-[var(--accent-blue-solid)]">
                          {s.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{s.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">Year {s.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-[var(--text-secondary)]">{s.studentCode}</td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">{s.course}</td>
                    <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setMenuOpen(menuOpen === s.id ? null : s.id)}
                          className="rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-surface)]"
                          aria-label="Actions"
                        >
                          <MoreVertical size={16} className="text-[var(--text-muted)]" />
                        </button>
                        {menuOpen === s.id && (
                          <div className="absolute right-0 z-20 mt-1 w-36 rounded-xl border border-[var(--border-glass)] bg-white py-1 shadow-lg">
                            <button onClick={() => openEdit(s)} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-surface)]">
                              <Edit size={14} /> Edit
                            </button>
                            <button onClick={() => { setDeleteId(s.id); setMenuOpen(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Drawer */}
      <SlideDrawer open={drawerOpen} onClose={closeDrawer} title={editing ? 'Edit Student' : 'Add Student'}>
        <div className="space-y-5">
          <FloatingLabelInput id="s-name" label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <FloatingLabelInput id="s-email" label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <FloatingLabelInput id="s-code" label="Student Code" value={form.studentCode} onChange={e => setForm(f => ({ ...f, studentCode: e.target.value }))} />
          <FloatingLabelInput id="s-course" label="Course" value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Year</label>
              <select value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} className="w-full rounded-xl border border-[var(--border-glass)] px-3 py-3 text-sm outline-none focus:border-[var(--accent-blue-solid)]">
                {[1,2,3,4].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Student['status'] }))} className="w-full rounded-xl border border-[var(--border-glass)] px-3 py-3 text-sm outline-none focus:border-[var(--accent-blue-solid)]">
                <option value="active">Active</option>
                <option value="probation">Probation</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={createMut.isPending || updateMut.isPending} className="glass-cta mt-4 w-full py-3 text-sm font-semibold disabled:opacity-60">
            {editing ? 'Update Student' : 'Create Student'}
          </button>
        </div>
      </SlideDrawer>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <motion.div className="glass-surface w-full max-w-sm p-6" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">Delete Student</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">This action cannot be undone. Are you sure?</p>
            <div className="mt-5 flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="rounded-xl px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]">Cancel</button>
              <button onClick={() => deleteMut.mutate(deleteId)} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Students;
