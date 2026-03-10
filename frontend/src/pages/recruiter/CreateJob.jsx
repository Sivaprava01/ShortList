import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../../api/axios';
import { HiOutlinePlusCircle, HiOutlineTrash } from 'react-icons/hi2';

export default function CreateJob() {
  const [form, setForm] = useState({
    title: '', description: '',
    mustHaveSkills: [''],
    goodToHaveSkills: [''],
    minExperience: 0, maxExperience: 5,
    location: '',
    topNCandidates: 5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = {
        ...form,
        mustHaveSkills: form.mustHaveSkills.filter(s => s.trim()),
        goodToHaveSkills: form.goodToHaveSkills.filter(s => s.trim()),
      };
      await createJob(data);
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (field) => setForm(f => ({ ...f, [field]: [...f[field], ''] }));
  const removeSkill = (field, i) => setForm(f => ({ ...f, [field]: f[field].filter((_, idx) => idx !== i) }));
  const updateSkill = (field, i, val) => setForm(f => ({ ...f, [field]: f[field].map((s, idx) => idx === i ? val : s) }));

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm";
  const labelClass = "block text-sm font-medium text-gray-900 mb-1.5";

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Create Job</h1>
        <p className="text-[var(--text-secondary)] mt-1">Define the role and let the matching engine find the best candidates.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Job Details</h2>
          <div>
            <label className={labelClass}>Title</label>
            <input className={inputClass} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Senior Frontend Developer" required />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea className={`${inputClass} h-32 resize-none`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the role, responsibilities, and what makes it exciting..." required />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input className={inputClass} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Remote / San Francisco, CA" />
          </div>
        </div>

        {/* Skills */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Required Skills</h2>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">Must-Have Skills</label>
              <button type="button" onClick={() => addSkill('mustHaveSkills')} className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700">
                <HiOutlinePlusCircle className="w-4 h-4" /> Add
              </button>
            </div>
            {form.mustHaveSkills.map((skill, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input className={`${inputClass} flex-1`} value={skill} onChange={e => updateSkill('mustHaveSkills', i, e.target.value)} placeholder="e.g. React" />
                {form.mustHaveSkills.length > 1 && (
                  <button type="button" onClick={() => removeSkill('mustHaveSkills', i)} className="p-2 text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
                )}
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">Good-to-Have Skills</label>
              <button type="button" onClick={() => addSkill('goodToHaveSkills')} className="flex items-center gap-1 text-sm text-[var(--accent)] font-medium hover:underline">
                <HiOutlinePlusCircle className="w-4 h-4" /> Add
              </button>
            </div>
            {form.goodToHaveSkills.map((skill, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input className={`${inputClass} flex-1`} value={skill} onChange={e => updateSkill('goodToHaveSkills', i, e.target.value)} placeholder="e.g. TypeScript" />
                {form.goodToHaveSkills.length > 1 && (
                  <button type="button" onClick={() => removeSkill('goodToHaveSkills', i)} className="p-2 text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Experience & Top N */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Parameters</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Min Experience (yrs)</label>
              <input type="number" min="0" className={inputClass} value={form.minExperience} onChange={e => setForm(f => ({ ...f, minExperience: Number(e.target.value) }))} />
            </div>
            <div>
              <label className={labelClass}>Max Experience (yrs)</label>
              <input type="number" min="0" className={inputClass} value={form.maxExperience} onChange={e => setForm(f => ({ ...f, maxExperience: Number(e.target.value) }))} />
            </div>
            <div>
              <label className={labelClass}>Top N Candidates</label>
              <input type="number" min="1" className={inputClass} value={form.topNCandidates} onChange={e => setForm(f => ({ ...f, topNCandidates: Number(e.target.value) }))} />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Creating...</>
            ) : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
}
