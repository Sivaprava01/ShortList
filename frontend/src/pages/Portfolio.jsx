import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProfileById } from '../api/axios';
import {
  HiOutlineWrenchScrewdriver,
  HiOutlineRocketLaunch,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineLink,
  HiOutlineGlobeAlt,
  HiOutlineCodeBracket
} from 'react-icons/hi2';

export default function Portfolio() {
  const { candidateId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileById(candidateId);
        if (!res.data) {
          setError('Profile not found');
        } else {
          setProfile(res.data);
        }
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This portfolio does not exist.'}</p>
          <Link to="/" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <span className="text-3xl sm:text-4xl font-bold">{profile.fullName?.charAt(0) || '?'}</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">{profile.fullName || 'Unnamed'}</h1>
              {profile.headline && (
                <p className="text-lg text-indigo-100 mt-2">{profile.headline}</p>
              )}
              {profile.experienceYears > 0 && (
                <p className="text-sm text-indigo-200 mt-1">{profile.experienceYears} years of experience</p>
              )}
            </div>
          </div>
          {profile.bio && (
            <p className="mt-6 text-indigo-100 leading-relaxed max-w-2xl">{profile.bio}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Skills */}
        {profile.skills?.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineWrenchScrewdriver className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border ${
                    skill.level === 'advanced'
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : skill.level === 'intermediate'
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {skill.name}
                  <span className="ml-1.5 text-xs opacity-60">· {skill.level}</span>
                  {skill.years > 0 && <span className="ml-1 text-xs opacity-60">· {skill.years}yr</span>}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {profile.projects?.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineRocketLaunch className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Projects</h2>
            </div>
            <div className="grid gap-4">
              {profile.projects.map((project, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-sm text-indigo-600 hover:underline shrink-0 ml-4"
                      >
                        <HiOutlineLink className="w-3.5 h-3.5" />
                        View
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{project.description}</p>
                  )}
                  {project.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.techStack.map((tech, j) => (
                        <span key={j} className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-md font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {profile.experience?.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineBriefcase className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Experience</h2>
            </div>
            <div className="space-y-4">
              {profile.experience.map((exp, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                  <p className="text-sm text-indigo-600 font-medium">{exp.company}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{exp.years} years</p>
                  {exp.description && (
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
                  )}
                  {exp.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {exp.techStack.map((tech, j) => (
                        <span key={j} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {profile.education?.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineAcademicCap className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Education</h2>
            </div>
            <div className="space-y-3">
              {profile.education.map((edu, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {edu.year && `Year: ${edu.year}`}
                    {edu.GPA ? ` · GPA: ${edu.GPA}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Links */}
        {(profile.portfolioLinks?.filter(l => l).length > 0 || profile.codingLinks?.filter(l => l).length > 0) && (
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineGlobeAlt className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">Links</h2>
            </div>
            <div className="space-y-2">
              {profile.portfolioLinks?.filter(l => l).map((link, i) => (
                <a
                  key={`p-${i}`}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:underline p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <HiOutlineGlobeAlt className="w-4 h-4" />
                  {link}
                </a>
              ))}
              {profile.codingLinks?.filter(l => l).map((link, i) => (
                <a
                  key={`c-${i}`}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:underline p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <HiOutlineCodeBracket className="w-4 h-4" />
                  {link}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="text-center pt-4 pb-8">
          <p className="text-sm text-gray-400">Built with Shortlist</p>
          <Link to="/" className="text-sm text-indigo-600 hover:underline mt-1 inline-block">
            shortlist.app
          </Link>
        </div>
      </div>
    </div>
  );
}
