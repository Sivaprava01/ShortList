import { useState, useEffect } from 'react';
import { getMyProfile, createOrUpdateProfile } from '../../api/axios';
import { HiOutlineCheckCircle, HiOutlinePlusCircle, HiOutlineTrash } from 'react-icons/hi2';

// const [savedSections, setSavedSections] = useState({
//   skills: false,
//   projects: false,
//   experience: false
// });

export default function ProfileBuilder() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    fullName: '', headline: '', bio: '',
    skills: [{ name: '', level: 'beginner', years: 0 }],
    experience: [{ company: '', role: '', years: 0, techStack: [], description: '' }],
    experienceYears: 0,
    projects: [{ title: '', description: '', techStack: [], link: '' }],
    education: [{ degree: '', institution: '', year: '', GPA: '' }],
    portfolioLinks: [''],
    codingLinks: [''],
    resumeUrl: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        if (res.data) {
          setForm({
            fullName: res.data.fullName || '',
            headline: res.data.headline || '',
            bio: res.data.bio || '',
            skills: res.data.skills?.length ? res.data.skills : [{ name: '', level: 'beginner', years: 0 }],
            experience: res.data.experience?.length ? res.data.experience.map(exp => ({
              ...exp, techStack: exp.techStack || []
            })) : [{ company: '', role: '', years: 0, techStack: [], description: '' }],
            experienceYears: res.data.experienceYears || 0,
            projects: res.data.projects?.length ? res.data.projects.map(p => ({
              ...p, techStack: p.techStack || []
            })) : [{ title: '', description: '', techStack: [], link: '' }],
            education: res.data.education?.length ? res.data.education : [{ degree: '', institution: '', year: '', GPA: '' }],
            portfolioLinks: res.data.portfolioLinks?.length ? res.data.portfolioLinks : [''],
            codingLinks: res.data.codingLinks?.length ? res.data.codingLinks : [''],
            resumeUrl: res.data.resumeUrl || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const data = {
        ...form,
        skills: form.skills.filter(s => s.name.trim()),
        experience: form.experience.filter(exp => exp.company.trim() || exp.role.trim()),
        projects: form.projects.filter(p => p.title.trim()),
        education: form.education.filter(edu => edu.degree.trim() || edu.institution.trim()),
        portfolioLinks: form.portfolioLinks.filter(l => l.trim()),
        codingLinks: form.codingLinks.filter(l => l.trim()),
        // Calculate total experience years from experience entries
        experienceYears: form.experience.reduce((total, exp) => total + (exp.years || 0), 0) || form.experienceYears
      };
      await createOrUpdateProfile(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => setForm(f => ({ ...f, skills: [...f.skills, { name: '', level: 'beginner', years: 0 }] }));
  const removeSkill = (i) => setForm(f => ({ ...f, skills: f.skills.filter((_, idx) => idx !== i) }));
  const updateSkill = (i, field, val) => setForm(f => ({ ...f, skills: f.skills.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }));

  const addExperience = () => setForm(f => ({ ...f, experience: [...f.experience, { company: '', role: '', years: 0, techStack: [], description: '' }] }));
  const removeExperience = (i) => setForm(f => ({ ...f, experience: f.experience.filter((_, idx) => idx !== i) }));
  const updateExperience = (i, field, val) => setForm(f => ({ ...f, experience: f.experience.map((exp, idx) => idx === i ? { ...exp, [field]: val } : exp) }));

  const addProject = () => setForm(f => ({ ...f, projects: [...f.projects, { title: '', description: '', techStack: [], link: '' }] }));
  const removeProject = (i) => setForm(f => ({ ...f, projects: f.projects.filter((_, idx) => idx !== i) }));
  const updateProject = (i, field, val) => setForm(f => ({ ...f, projects: f.projects.map((p, idx) => idx === i ? { ...p, [field]: val } : p) }));

  const addEducation = () => setForm(f => ({ ...f, education: [...f.education, { degree: '', institution: '', year: '', GPA: '' }] }));
  const removeEducation = (i) => setForm(f => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }));
  const updateEducation = (i, field, val) => setForm(f => ({ ...f, education: f.education.map((edu, idx) => idx === i ? { ...edu, [field]: val } : edu) }));

  const addLink = (field) => setForm(f => ({ ...f, [field]: [...f[field], ''] }));
  const removeLink = (field, i) => setForm(f => ({ ...f, [field]: f[field].filter((_, idx) => idx !== i) }));
  const updateLink = (field, i, val) => setForm(f => ({ ...f, [field]: f[field].map((l, idx) => idx === i ? val : l) }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const sectionClass = "bg-white rounded-2xl border border-gray-200 p-6 space-y-4";
  const labelClass = "block text-sm font-medium text-gray-900 mb-1.5";
  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm";

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Profile Builder</h1>
          <p className="text-[var(--text-secondary)] mt-1">Build your profile to get matched with jobs.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</>
          ) : saved ? (
            <><HiOutlineCheckCircle className="w-5 h-5" /> Saved!</>
          ) : 'Save Profile'}
        </button>
      </div>

      {/* Basic Info */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Basic Info</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input className={inputClass} value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="John Doe" />
          </div>
          <div>
            <label className={labelClass}>Headline</label>
            <input className={inputClass} value={form.headline} onChange={e => setForm(f => ({ ...f, headline: e.target.value }))} placeholder="Full Stack Developer" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Bio</label>
          <textarea className={`${inputClass} h-24 resize-none`} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell us about yourself..." />
        </div>
      </div>

      {/* Skills */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Skills</h2>
          <button onClick={addSkill} className="flex items-center gap-1 text-sm text-[var(--accent)] font-medium hover:underline">
            <HiOutlinePlusCircle className="w-4 h-4" /> Add Skill
          </button>
        </div>
        {form.skills.map((skill, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="flex-1">
              <label className={labelClass}>Skill Name</label>
              <input className={inputClass} value={skill.name} onChange={e => updateSkill(i, 'name', e.target.value)} placeholder="React" />
            </div>
            <div className="w-full sm:w-40">
              <label className={labelClass}>Level</label>
              <select className={inputClass} value={skill.level} onChange={e => updateSkill(i, 'level', e.target.value)}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="w-full sm:w-28">
              <label className={labelClass}>Years</label>
              <input type="number" min="0" className={inputClass} value={skill.years} onChange={e => updateSkill(i, 'years', Number(e.target.value))} />
            </div>
            {form.skills.length > 1 && (
              <button onClick={() => removeSkill(i)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors">
                <HiOutlineTrash className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Experience */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
          <button onClick={addExperience} className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:underline">
            <HiOutlinePlusCircle className="w-4 h-4" /> Add Experience
          </button>
        </div>
        {form.experience.map((exp, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Experience {i + 1}</span>
              {form.experience.length > 1 && (
                <button onClick={() => removeExperience(i)} className="text-red-500 hover:underline text-sm">Remove</button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Company</label>
                <input className={inputClass} value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} placeholder="Google" />
              </div>
              <div>
                <label className={labelClass}>Role</label>
                <input className={inputClass} value={exp.role} onChange={e => updateExperience(i, 'role', e.target.value)} placeholder="Software Engineer" />
              </div>
            </div>
            <div className="sm:w-32">
              <label className={labelClass}>Years</label>
              <input type="number" min="0" step="0.5" className={inputClass} value={exp.years} onChange={e => updateExperience(i, 'years', Number(e.target.value))} />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea className={`${inputClass} h-20 resize-none`} value={exp.description} onChange={e => updateExperience(i, 'description', e.target.value)} placeholder="What did you accomplish in this role?" />
            </div>
            <div>
              <label className={labelClass}>Tech Stack (comma separated)</label>
              <input className={inputClass} value={exp.techStack.join(', ')} onChange={e => updateExperience(i, 'techStack', e.target.value.split(',').map(s => s.trim()))} placeholder="React, Node.js, MongoDB" />
            </div>
          </div>
        ))}
        <div className="sm:w-48">
          <label className={labelClass}>Total Years (auto-calculated)</label>
          <input type="number" min="0" className={`${inputClass} bg-gray-100`} value={form.experience.reduce((total, exp) => total + (exp.years || 0), 0) || form.experienceYears} onChange={e => setForm(f => ({ ...f, experienceYears: Number(e.target.value) }))} placeholder="Manual override" />
          <p className="text-xs text-gray-500 mt-1">This is auto-calculated from experience entries above</p>
        </div>
      </div>

      {/* Projects */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Projects</h2>
          <button onClick={addProject} className="flex items-center gap-1 text-sm text-[var(--accent)] font-medium hover:underline">
            <HiOutlinePlusCircle className="w-4 h-4" /> Add Project
          </button>
        </div>
        {form.projects.map((project, i) => (
          <div key={i} className="p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Project {i + 1}</span>
              {form.projects.length > 1 && (
                <button onClick={() => removeProject(i)} className="text-red-500 hover:underline text-sm">Remove</button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Title</label>
                <input className={inputClass} value={project.title} onChange={e => updateProject(i, 'title', e.target.value)} placeholder="My Project" />
              </div>
              <div>
                <label className={labelClass}>Link</label>
                <input className={inputClass} value={project.link} onChange={e => updateProject(i, 'link', e.target.value)} placeholder="https://github.com/..." />
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea className={`${inputClass} h-20 resize-none`} value={project.description} onChange={e => updateProject(i, 'description', e.target.value)} placeholder="What does this project do?" />
            </div>
            <div>
              <label className={labelClass}>Tech Stack (comma separated)</label>
              <input className={inputClass} value={project.techStack.join(', ')} onChange={e => updateProject(i, 'techStack', e.target.value.split(',').map(s => s.trim()))} placeholder="React, Node.js, MongoDB" />
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Education</h2>
          <button onClick={addEducation} className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:underline">
            <HiOutlinePlusCircle className="w-4 h-4" /> Add Education
          </button>
        </div>
        {form.education.map((edu, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Education {i + 1}</span>
              {form.education.length > 1 && (
                <button onClick={() => removeEducation(i)} className="text-red-500 hover:underline text-sm">Remove</button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Degree</label>
                <input className={inputClass} value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} placeholder="B.Tech Computer Science" />
              </div>
              <div>
                <label className={labelClass}>Institution</label>
                <input className={inputClass} value={edu.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} placeholder="VNR VJIET" />
              </div>
              <div>
                <label className={labelClass}>Year</label>
                <input type="number" className={inputClass} value={edu.year} onChange={e => updateEducation(i, 'year', e.target.value)} placeholder="2025" />
              </div>
              <div>
                <label className={labelClass}>GPA</label>
                <input type="number" step="0.01" className={inputClass} value={edu.GPA} onChange={e => updateEducation(i, 'GPA', e.target.value)} placeholder="9.0" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Links */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Links</h2>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">Portfolio / GitHub</label>
              <button onClick={() => addLink('portfolioLinks')} className="text-sm text-[var(--accent)] font-medium hover:underline">+ Add</button>
            </div>
            {form.portfolioLinks.map((link, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input className={`${inputClass} flex-1`} value={link} onChange={e => updateLink('portfolioLinks', i, e.target.value)} placeholder="https://github.com/..." />
                {form.portfolioLinks.length > 1 && (
                  <button onClick={() => removeLink('portfolioLinks', i)} className="p-2 text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
                )}
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">Coding Profiles (LeetCode, etc.)</label>
              <button onClick={() => addLink('codingLinks')} className="text-sm text-[var(--accent)] font-medium hover:underline">+ Add</button>
            </div>
            {form.codingLinks.map((link, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input className={`${inputClass} flex-1`} value={link} onChange={e => updateLink('codingLinks', i, e.target.value)} placeholder="https://leetcode.com/..." />
                {form.codingLinks.length > 1 && (
                  <button onClick={() => removeLink('codingLinks', i)} className="p-2 text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resume */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Resume</h2>
        <div>
          <label className={labelClass}>Resume URL</label>
          <input className={inputClass} value={form.resumeUrl} onChange={e => setForm(f => ({ ...f, resumeUrl: e.target.value }))} placeholder="https://drive.google.com/..." />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
