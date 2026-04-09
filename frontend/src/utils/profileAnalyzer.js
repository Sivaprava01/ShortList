/**
 * Rule-based profile analyzer.
 * Returns { score: number (0-100), suggestions: string[] }
 */
export function analyzeProfile(profile) {
  if (!profile) return { score: 0, suggestions: ['Complete your profile to get started'] };

  const suggestions = [];
  let score = 0;
  const totalPoints = 100;

  // Full name (15 pts)
  if (profile.fullName?.trim()) {
    score += 15;
  } else {
    suggestions.push('Add your full name to personalize your profile');
  }

  // Headline (10 pts)
  if (profile.headline?.trim()) {
    score += 10;
  } else {
    suggestions.push('Add a professional headline (e.g., "Full-Stack Developer | React & Node.js")');
  }

  // Bio (10 pts)
  if (profile.bio?.trim().length >= 50) {
    score += 10;
  } else if (profile.bio?.trim().length > 0) {
    score += 5;
    suggestions.push('Expand your bio to at least 50 characters to stand out');
  } else {
    suggestions.push('Write a short bio describing your background and goals');
  }

  // Skills (20 pts)
  const skillCount = profile.skills?.length || 0;
  if (skillCount >= 5) {
    score += 20;
  } else if (skillCount >= 3) {
    score += 12;
    suggestions.push(`Add ${5 - skillCount} more skills to strengthen your match score`);
  } else if (skillCount > 0) {
    score += 6;
    suggestions.push('Add at least 5 skills to improve your matching results');
  } else {
    suggestions.push('You have no skills listed — add your top skills now');
  }

  // Projects (20 pts)
  const projects = profile.projects || [];
  if (projects.length >= 2) {
    score += 10;
    // Check description quality
    const weakProjects = projects.filter(p => (p.description?.length || 0) < 60);
    if (weakProjects.length === 0) {
      score += 10;
    } else {
      score += 5;
      suggestions.push(`Improve project descriptions for: ${weakProjects.map(p => p.title || 'Untitled').join(', ')}`);
    }
  } else if (projects.length === 1) {
    score += 8;
    suggestions.push('Add at least 2 projects to demonstrate your work');
  } else {
    suggestions.push('Add your projects — they are a key factor in matching');
  }

  // Experience (10 pts)
  const expYears = profile.experienceYears || 0;
  if (expYears > 0) {
    score += 10;
    const experience = profile.experience || [];
    if (experience.length === 0) {
      suggestions.push('Add detailed work experience entries with company and role info');
    }
  } else {
    suggestions.push('Add your years of experience (even 0 years is fine for freshers)');
  }

  // Education (10 pts)
  const education = profile.education || [];
  const hasEducation = Array.isArray(education)
    ? education.length > 0
    : education?.degree;
  if (hasEducation) {
    score += 10;
  } else {
    suggestions.push('Add your education details (degree, institution, year)');
  }

  // Portfolio / Coding Links (5 pts)
  const hasLinks = (profile.portfolioLinks?.filter(l => l).length || 0) +
                   (profile.codingLinks?.filter(l => l).length || 0);
  if (hasLinks > 0) {
    score += 5;
  } else {
    suggestions.push('Add links to your portfolio, GitHub, or LinkedIn');
  }

  return {
    score: Math.min(score, totalPoints),
    suggestions
  };
}
