import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Plus, MoreVertical, Edit, Trash2, Users } from 'lucide-react';
import { studentService } from '@/services/studentService';
import { Student } from '@/services/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DeltaBadge } from '@/components/shared/DeltaBadge';
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

  const [form, setForm] = useState({ name: '', email: '', studentCode: '', course: '', year: '1', status: 'active' as Student['status'], type: 'full-time' as Student['type'], gpa: '3.0', attendance: '90' });

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

  const closeDrawer = () => { setDrawerOpen(false); setEditing(null); setForm({ name: '', email: '', studentCode: '', course: '', year: '1', status: 'active', type: 'full-time', gpa: '3.0', attendance: '90' }); };

  const openEdit = (s: Student) => {
    setEditing(s);
    setForm({ name: s.name, email: s.email, studentCode: s.studentCode, course: s.course, year: String(s.year), status: s.status, type: s.type, gpa: String(s.gpa), attendance: String(s.attendance) });
    setDrawerOpen(true);
    setMenuOpen(null);
  };

  const handleSubmit = () => {
    const payload = { ...form, year: parseInt(form.year), gpa: parseFloat(form.gpa), attendance: parseInt(form.attendance) };
    if (editing) updateMut.mutate({ id: editing.id, data: payload });
    else createMut.mutate(payload as Omit<Student, 'id'>);
  };

  return (
    <div>
      <motion.div className="mb-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="section-label mb-3">
          <Users size={12} /> Students
        </div>
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[var(--text-primary)]">Students</h1>
      </motion.div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            className="input-clean pl-9 text-[13px]"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-clean w-auto text-[13px]"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="probation">Probation</option>
          <option value="inactive">Inactive</option>
        </select>
        <button onClick={() => { closeDrawer(); setDrawerOpen(true); }} className="btn-primary">
          <Plus size={14} /> Add Student
        </button>
      </div>

      {/* Table */}
      <div className="card-surface overflow-hidden">
        {isLoading ? (
          <div className="p-5"><TableSkeleton rows={6} cols={6} /></div>
        ) : !students?.length ? (
          <EmptyState icon={Users} title="No students found" description="Adjust your filters or add a new student." action={{ label: 'Add Student', onClick: () => setDrawerOpen(true) }} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border-default)]">
                  <th className="table-header px-5 py-3 text-left">#</th>
                  <th className="table-header px-5 py-3 text-left">Student ID</th>
                  <th className="table-header px-5 py-3 text-left">Name</th>
                  <th className="table-header px-5 py-3 text-left">GPA</th>
                  <th className="table-header px-5 py-3 text-left">Type</th>
                  <th className="table-header px-5 py-3 text-left">Status</th>
                  <th className="table-header px-5 py-3 text-left">Attendance</th>
                  <th className="table-header px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr
                    key={s.id}
                    className="border-b border-[var(--border-subtle)] table-row-alt table-row-hover transition-colors"
                    style={{ animation: `staggerFadeIn 0.25s ease-out ${Math.min(i * 0.04, 0.3)}s forwards`, opacity: 0 }}
                  >
                    <td className="px-5 py-3 text-[var(--text-muted)]">{i + 1}</td>
                    <td className="px-5 py-3 font-mono text-[12px] text-[var(--text-secondary)]">{s.studentCode}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--tag-blue-bg)] text-[10px] font-bold text-[var(--tag-blue-text)]">
                          {s.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{s.name}</p>
                          <p className="text-[11px] text-[var(--text-muted)]">{s.course} · Year {s.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-[12px] font-semibold text-[var(--text-primary)]">{s.gpa.toFixed(1)}</td>
                    <td className="px-5 py-3"><StatusBadge status={s.type} /></td>
                    <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-5 py-3">
                      <DeltaBadge value={s.attendance - 85} suffix="%" />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setMenuOpen(menuOpen === s.id ? null : s.id)}
                          className="rounded-md p-1 transition-colors hover:bg-[var(--page-bg)]"
                          aria-label="Actions"
                        >
                          <MoreVertical size={14} className="text-[var(--text-muted)]" />
                        </button>
                        {menuOpen === s.id && (
                          <div className="absolute right-0 z-20 mt-1 w-32 rounded-lg border border-[var(--border-default)] bg-white py-1 shadow-sm">
                            <button onClick={() => openEdit(s)} className="flex w-full items-center gap-2 px-3 py-1.5 text-[13px] hover:bg-[var(--page-bg)]">
                              <Edit size={13} /> Edit
                            </button>
                            <button onClick={() => { setDeleteId(s.id); setMenuOpen(null); }} className="flex w-full items-center gap-2 px-3 py-1.5 text-[13px] text-[var(--accent-red)] hover:bg-[var(--tag-red-bg)]">
                              <Trash2 size={13} /> Delete
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
        <div className="space-y-4">
          <FloatingLabelInput id="s-name" label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <FloatingLabelInput id="s-email" label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <FloatingLabelInput id="s-code" label="Student Code" value={form.studentCode} onChange={e => setForm(f => ({ ...f, studentCode: e.target.value }))} />
          <FloatingLabelInput id="s-course" label="Course" value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">Year</label>
              <select value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} className="input-clean text-[13px]">
                {[1,2,3,4].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Student['status'] }))} className="input-clean text-[13px]">
                <option value="active">Active</option>
                <option value="probation">Probation</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Student['type'] }))} className="input-clean text-[13px]">
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="exchange">Exchange</option>
              </select>
            </div>
            <FloatingLabelInput id="s-gpa" label="GPA" type="number" value={form.gpa} onChange={e => setForm(f => ({ ...f, gpa: e.target.value }))} />
          </div>
          <button onClick={handleSubmit} disabled={createMut.isPending || updateMut.isPending} className="btn-primary mt-4 w-full justify-center py-2.5 disabled:opacity-50">
            {editing ? 'Update Student' : 'Create Student'}
          </button>
        </div>
      </SlideDrawer>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <motion.div className="card-surface w-full max-w-sm p-6" initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Delete Student</h3>
            <p className="mt-2 text-[13px] text-[var(--text-secondary)]">This action cannot be undone. Are you sure?</p>
            <div className="mt-4 flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="btn-ghost">Cancel</button>
              <button onClick={() => deleteMut.mutate(deleteId)} className="btn-primary bg-[var(--accent-red)]">Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Students;
