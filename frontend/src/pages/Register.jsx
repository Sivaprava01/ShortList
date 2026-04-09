import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash, HiOutlineUserCircle, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(email, password, role);
      navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl dark:bg-indigo-500/20"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl dark:bg-purple-500/20"></div>
      </div>

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <Logo size="lg" clickable={true} />
            <span className="text-2xl font-bold text-[var(--text-primary)]">Shortlist</span>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Create your account</h1>
          <p className="text-[var(--text-secondary)]">Get started with Shortlist</p>
        </div>

        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Email</label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                    role === 'candidate'
                      ? 'border-indigo-500 bg-indigo-50 shadow-md dark:bg-indigo-500/10'
                      : 'border-[var(--border)] hover:border-indigo-300'
                  }`}
                >
                  <HiOutlineUserCircle className={`w-8 h-8 mx-auto mb-2 ${role === 'candidate' ? 'text-indigo-600 dark:text-indigo-400' : 'text-[var(--text-secondary)]'}`} />
                  <div className={`text-sm font-semibold ${role === 'candidate' ? 'text-indigo-600 dark:text-indigo-400' : 'text-[var(--text-primary)]'}`}>Candidate</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">Looking for jobs</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                    role === 'recruiter'
                      ? 'border-indigo-500 bg-indigo-50 shadow-md dark:bg-indigo-500/10'
                      : 'border-[var(--border)] hover:border-indigo-300'
                  }`}
                >
                  <HiOutlineUserCircle className={`w-8 h-8 mx-auto mb-2 ${role === 'recruiter' ? 'text-indigo-600 dark:text-indigo-400' : 'text-[var(--text-secondary)]'}`} />
                  <div className={`text-sm font-semibold ${role === 'recruiter' ? 'text-indigo-600 dark:text-indigo-400' : 'text-[var(--text-primary)]'}`}>Recruiter</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">Hiring talent</div>
                </button>
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </div>
              ) : 'Register'}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline dark:text-indigo-400">Login</Link>
          </p>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--hover)] hover:text-[var(--text-primary)] transition-all"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
