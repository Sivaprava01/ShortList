import { useState, useEffect } from 'react';
import { getJourneyFeed, createJourney } from '../../api/axios';
import {
  HiOutlineSparkles,
  HiOutlineRocketLaunch,
  HiOutlineClock,
  HiOutlinePlusCircle,
  HiOutlineXMark
} from 'react-icons/hi2';

function CreateJourneyModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    story: '',
    techStack: '',
    yearsExperience: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.story || !form.yearsExperience) return;

    setSubmitting(true);
    try {
      await createJourney({
        title: form.title,
        story: form.story,
        techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean),
        yearsExperience: Number(form.yearsExperience)
      });
      onCreated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Share Your Journey</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <HiOutlineXMark className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., From Bootcamp to Senior Engineer in 4 Years"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Story</label>
            <textarea
              value={form.story}
              onChange={e => setForm({ ...form, story: e.target.value })}
              placeholder="Share your career journey, lessons learned, advice for others..."
              rows={6}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
              <input
                type="text"
                value={form.techStack}
                onChange={e => setForm({ ...form, techStack: e.target.value })}
                placeholder="React, Node.js, Python"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">Comma separated</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input
                type="number"
                min="0"
                value={form.yearsExperience}
                onChange={e => setForm({ ...form, yearsExperience: e.target.value })}
                placeholder="5"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Publishing...' : 'Publish Journey'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ForYou() {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const fetchFeed = async () => {
    try {
      const res = await getJourneyFeed();
      setJourneys(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeed(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HiOutlineSparkles className="w-7 h-7 text-amber-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">For You</h1>
          </div>
          <p className="text-gray-600 mt-1">Career journeys and inspiration from experienced developers.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 text-sm"
        >
          <HiOutlinePlusCircle className="w-5 h-5" />
          Share Your Journey
        </button>
      </div>

      {journeys.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <HiOutlineRocketLaunch className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No stories yet</h3>
          <p className="text-gray-600">Be the first to share your developer journey and inspire others!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {journeys.map((journey, i) => {
            const isExpanded = expandedId === journey._id;
            return (
              <div
                key={journey._id || i}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {journey.authorId?.email?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{journey.authorId?.email || 'Anonymous'}</div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                        <HiOutlineClock className="w-3 h-3" />
                        {journey.yearsExperience} years experience
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(journey.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{journey.title}</h3>

                {/* Story */}
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {isExpanded
                    ? journey.story
                    : journey.story?.length > 300
                      ? journey.story.substring(0, 300) + '...'
                      : journey.story
                  }
                </p>

                {journey.story?.length > 300 && (
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : journey._id)}
                    className="text-indigo-600 text-sm font-medium mt-2 hover:underline"
                  >
                    {isExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}

                {/* Tech Stack Tags */}
                {journey.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-100">
                    {journey.techStack.map((tech, j) => (
                      <span key={j} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-lg font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <CreateJourneyModal
          onClose={() => setShowCreate(false)}
          onCreated={fetchFeed}
        />
      )}
    </div>
  );
}
