import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, BookOpen, GraduationCap, AlertTriangle, UserPlus, Plus, Receipt, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { studentService } from '@/services/studentService';
import { courseService } from '@/services/courseService';
import { facultyService } from '@/services/facultyService';
import { billingService } from '@/services/billingService';
import { activityService } from '@/services/activityService';
import { SkeletonShimmer } from '@/components/shared/SkeletonShimmer';
import { Link } from 'react-router-dom';

const stagger = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.08, duration: 0.35 } });

const StatCard = ({ icon: Icon, label, value, accent = false, span2 = false, loading = false }: any) => (
  <motion.div
    className={`glass-surface glass-card-hover p-6 ${span2 ? 'col-span-2' : ''} ${accent ? 'border-l-4 border-[var(--accent-orange)]' : ''}`}
    {...stagger(0)}
  >
    {loading ? (
      <div className="space-y-3">
        <SkeletonShimmer className="h-4 w-20" />
        <SkeletonShimmer className="h-9 w-24" />
      </div>
    ) : (
      <>
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Icon size={16} className={accent ? 'text-[var(--accent-orange)]' : 'text-[var(--accent-blue-solid)]'} />
          {label}
        </div>
        <p className="mt-2 font-display text-4xl font-bold text-[var(--text-primary)]">{value}</p>
      </>
    )}
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const students = useQuery({ queryKey: ['students-count'], queryFn: () => studentService.getCount() });
  const courses = useQuery({ queryKey: ['courses-count'], queryFn: () => courseService.getActiveCount() });
  const faculty = useQuery({ queryKey: ['faculty-count'], queryFn: () => facultyService.getCount() });
  const overdue = useQuery({ queryKey: ['billing-overdue'], queryFn: () => billingService.getOverdueCount() });
  const activity = useQuery({ queryKey: ['activity'], queryFn: () => activityService.getRecent() });

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const activityIcons: Record<string, any> = { student: Users, course: BookOpen, billing: Receipt, faculty: GraduationCap };

  return (
    <div>
      {/* Hero */}
      <motion.div className="mb-10" {...stagger(0)}>
        <h1 className="font-display text-[56px] font-bold leading-[1.05] tracking-[-2px] text-[var(--text-primary)]">
          Dashboard
        </h1>
        <p className="mt-1 text-lg text-[var(--text-secondary)]">
          Welcome back, {user?.name?.split(' ')[0]}. <span className="text-[var(--text-muted)]">{dateStr}</span>
        </p>
      </motion.div>

      {/* Stat Cards — Bento Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-fade-in">
        <StatCard icon={Users} label="Total Students" value={students.data ?? '—'} span2 loading={students.isLoading} />
        <StatCard icon={BookOpen} label="Active Courses" value={courses.data ?? '—'} loading={courses.isLoading} />
        <StatCard icon={GraduationCap} label="Faculty" value={faculty.data ?? '—'} loading={faculty.isLoading} />
        <StatCard icon={AlertTriangle} label="Billing Due" value={overdue.data ?? '—'} accent loading={overdue.isLoading} />
      </div>

      {/* Bottom row: Activity + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity Feed */}
        <motion.div className="glass-surface p-6 lg:col-span-2" {...stagger(1)}>
          <h2 className="mb-4 font-display text-xl font-bold text-[var(--text-primary)]">Recent Activity</h2>
          {activity.isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <SkeletonShimmer key={i} className="h-12" />)}
            </div>
          ) : (
            <div className="space-y-1">
              {activity.data?.map(item => {
                const Icon = activityIcons[item.type] || Clock;
                return (
                  <div key={item.id} className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[var(--bg-surface)]">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-surface)]">
                      <Icon size={15} className="text-[var(--accent-blue-solid)]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[var(--text-primary)]">{item.message}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div className="glass-surface p-6" {...stagger(2)}>
          <h2 className="mb-4 font-display text-xl font-bold text-[var(--text-primary)]">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Add Student', icon: UserPlus, path: '/students' },
              { label: 'New Course', icon: Plus, path: '/courses' },
              { label: 'View Billing', icon: Receipt, path: '/billing' },
            ].map(action => (
              <Link
                key={action.label}
                to={action.path}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)] glass-surface glass-surface-hover transition-all glass-card-hover"
              >
                <action.icon size={16} className="text-[var(--accent-blue-solid)]" />
                {action.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
