import { Link } from 'react-router-dom';
import { HiOutlineSparkles, HiOutlineCpuChip, HiOutlineChartBar, HiOutlineUsers, HiOutlineArrowRight, HiOutlineCheckCircle } from 'react-icons/hi2';

const features = [
  {
    icon: HiOutlineCpuChip,
    title: 'Deterministic Matching',
    desc: 'Rule-based scoring ensures transparent, reproducible candidate rankings every time.'
  },
  {
    icon: HiOutlineChartBar,
    title: 'Score Breakdown',
    desc: 'See exactly how candidates are scored across skills, experience, and projects.'
  },
  {
    icon: HiOutlineUsers,
    title: 'Top N Selection',
    desc: 'Automatically surface your best candidates with configurable selection limits.'
  },
  {
    icon: HiOutlineSparkles,
    title: 'Smart Profiles',
    desc: 'Structured candidate profiles capture skills, projects, and experience in detail.'
  }
];

const steps = [
  { step: '01', title: 'Create Profile', desc: 'Candidates build structured profiles with skills, projects, and experience.' },
  { step: '02', title: 'Post Jobs', desc: 'Recruiters define roles with must-have skills, experience requirements, and preferences.' },
  { step: '03', title: 'Run Matching', desc: 'The engine scores and ranks candidates using deterministic rules.' },
  { step: '04', title: 'Review Results', desc: 'Rankings with full score breakdowns help you make informed decisions.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-primary">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-primary/80 backdrop-blur-xl border-b border-custom">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-primary">Shortlist</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hidden sm:block text-sm text-secondary hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hidden sm:block text-sm text-secondary hover:text-primary transition-colors">How It Works</a>
            <Link to="/login" className="text-sm font-medium text-secondary hover:text-primary transition-colors">Login</Link>
            <Link to="/register" className="text-sm font-medium px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-all shadow-md shadow-indigo-500/25">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-8 animate-fade-in">
            <HiOutlineSparkles className="w-4 h-4" />
            Deterministic Candidate Matching
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight animate-fade-in delay-100" style={{ animationFillMode: 'both' }}>
            Shortlist
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-indigo-600 mb-4 animate-fade-in delay-200" style={{ animationFillMode: 'both' }}>
            Smarter Resume Matching for Recruiters
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 animate-fade-in delay-300" style={{ animationFillMode: 'both' }}>
            Automatically rank candidates based on skills, experience, and projects using deterministic scoring. Transparent, reproducible, and fair.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-400" style={{ animationFillMode: 'both' }}>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5">
              Get Started
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-gray-900 rounded-xl font-semibold border border-gray-200 hover:border-indigo-300 transition-all hover:-translate-y-0.5">
              Login
            </Link>
          </div>
        </div>

        {/* Gradient orbs */}
        <div className="relative max-w-5xl mx-auto mt-20">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-indigo-100 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-purple-100 rounded-full blur-3xl"></div>
          <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl p-8 sm:p-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { num: '100%', label: 'Deterministic' },
                { num: '3-Part', label: 'Score Breakdown' },
                { num: 'Top N', label: 'Selection' },
                { num: 'Fast', label: 'Matching' },
              ].map((item, i) => (
                <div key={i} className="p-4">
                  <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-1">{item.num}</div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Everything you need for transparent, rule-based candidate matching.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                  <f.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Four simple steps to smarter hiring.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-black text-indigo-100 mb-4">{s.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="font-semibold text-gray-900">Shortlist</span>
          </div>
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Shortlist. Built for smarter hiring.
          </p>
        </div>
      </footer>
    </div>
  );
}
