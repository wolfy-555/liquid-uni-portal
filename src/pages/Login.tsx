import { useState, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { FloatingLabelInput } from '@/components/shared/FloatingLabelInput';
import { GraduationCap, Loader2 } from 'lucide-react';

const Login = () => {
  const { user, login, isLoading } = useAuth();
  const [email, setEmail] = useState('admin@uniportal.edu');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[var(--bg-primary)]">
      {/* Left panel — ambient glow + branding */}
      <motion.div
        className="relative hidden w-1/2 flex-col justify-center overflow-hidden px-16 lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Glow ellipses */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute rounded-full"
            style={{ width: 520, height: 420, background: '#60B1FF', filter: 'blur(120px)', opacity: 0.55, top: '10%', left: '-10%' }}
          />
          <div
            className="absolute rounded-full"
            style={{ width: 380, height: 320, background: '#319AFF', filter: 'blur(120px)', opacity: 0.35, bottom: '20%', right: '10%' }}
          />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="mb-8 glass-surface inline-flex items-center gap-3 px-5 py-4">
              <GraduationCap size={32} className="text-[var(--accent-blue-solid)]" />
              <span className="font-display text-xl font-bold text-[var(--text-primary)]">UniPortal</span>
            </div>
            <h1 className="font-display text-6xl font-bold leading-[1.05] tracking-[-2px] text-[var(--text-primary)]">
              Welcome<br />back.
            </h1>
            <p className="mt-4 max-w-md text-lg text-[var(--text-secondary)]">
              Your institutional management hub. Access student records, course administration, and billing — all in one place.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right panel — login form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
        >
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <GraduationCap size={28} className="text-[var(--accent-blue-solid)]" />
            <span className="font-display text-xl font-bold">UniPortal</span>
          </div>

          <div className="glass-surface p-8">
            <h2 className="mb-1 font-display text-2xl font-bold text-[var(--text-primary)]">Sign In</h2>
            <p className="mb-6 text-sm text-[var(--text-secondary)]">Enter your credentials to continue</p>

            {error && (
              <div className="mb-4 rounded-xl border-l-4 border-[var(--accent-orange)] bg-orange-50 px-4 py-3 text-sm text-orange-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <FloatingLabelInput
                id="email"
                label="Email address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <FloatingLabelInput
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="glass-cta flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold disabled:opacity-60"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
              Demo: any email + password works
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
