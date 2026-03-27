import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { FloatingLabelInput } from '@/components/shared/FloatingLabelInput';
import { Camera } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    department: 'Administration',
  });
  const [notifs, setNotifs] = useState({ email: true, push: false, billing: true });

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';

  return (
    <div>
      <motion.div className="mb-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-[42px] font-bold leading-[1.05] tracking-[-1.5px] text-[var(--text-primary)]">Profile</h1>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left — Avatar */}
        <motion.div className="glass-surface p-8 text-center lg:col-span-1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="group relative mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-blue-solid)] to-[var(--accent-glow-soft)] text-3xl font-bold text-white">
            {initials}
            <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera size={24} className="text-white" />
            </div>
          </div>
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">{user?.name}</h2>
          <span className="mt-1 inline-block rounded-full bg-[var(--accent-blue)]/10 px-3 py-0.5 text-xs font-medium text-[var(--accent-blue-solid)]">
            {user?.role}
          </span>
          <p className="mt-3 text-sm text-[var(--text-muted)]">{user?.email}</p>
        </motion.div>

        {/* Right — Form */}
        <motion.div className="glass-surface p-8 lg:col-span-2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="mb-6 font-display text-xl font-bold text-[var(--text-primary)]">Personal Information</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <FloatingLabelInput id="p-name" label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <FloatingLabelInput id="p-email" label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <FloatingLabelInput id="p-phone" label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <FloatingLabelInput id="p-dept" label="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
          </div>

          {/* Notifications */}
          <h3 className="mb-4 mt-8 font-display text-xl font-bold text-[var(--text-primary)]">Notifications</h3>
          <div className="space-y-3">
            {([
              { key: 'email' as const, label: 'Email Notifications', desc: 'Receive email updates about student activity' },
              { key: 'push' as const, label: 'Push Notifications', desc: 'Browser push notifications for alerts' },
              { key: 'billing' as const, label: 'Billing Alerts', desc: 'Get notified about overdue payments' },
            ]).map(n => (
              <div key={n.key} className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-[var(--bg-surface)]">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{n.label}</p>
                  <p className="text-xs text-[var(--text-muted)]">{n.desc}</p>
                </div>
                <button
                  onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                  className={`relative h-6 w-11 rounded-full transition-colors ${notifs[n.key] ? 'bg-[var(--accent-blue-solid)]' : 'bg-gray-200'}`}
                  role="switch"
                  aria-checked={notifs[n.key]}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifs[n.key] ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>

          <button className="glass-cta mt-8 px-8 py-3 text-sm font-semibold">Save Changes</button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
