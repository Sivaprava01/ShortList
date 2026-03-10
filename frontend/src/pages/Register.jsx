import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash, HiOutlineUserCircle } from 'react-icons/hi2';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Shortlist</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600">Get started with Shortlist</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                    role === 'candidate'
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <HiOutlineUserCircle className={`w-8 h-8 mx-auto mb-2 ${role === 'candidate' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <div className={`text-sm font-semibold ${role === 'candidate' ? 'text-indigo-600' : 'text-gray-900'}`}>Candidate</div>
                  <div className="text-xs text-gray-600 mt-1">Looking for jobs</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                    role === 'recruiter'
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <HiOutlineUserCircle className={`w-8 h-8 mx-auto mb-2 ${role === 'recruiter' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <div className={`text-sm font-semibold ${role === 'recruiter' ? 'text-indigo-600' : 'text-gray-900'}`}>Recruiter</div>
                  <div className="text-xs text-gray-600 mt-1">Hiring talent</div>
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

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
