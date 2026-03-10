// ENHANCED DETERMINISTIC MATCHING ENGINE

exports.calculateMatchScore = (candidate, job) => {
  // STAGE 1: HARD FILTERS
  
  // Filter 1: Profile must be public
  if (candidate.visibility === "private") return null;

  // Filter 2: Experience requirement
  if (candidate.experienceYears < job.minExperience) return null;

  // Filter 3: Must-have skills check
  const candidateSkillNames = candidate.skills.map(s => s.name.toLowerCase());
  
  for (let skill of job.mustHaveSkills) {
    if (!candidateSkillNames.includes(skill.toLowerCase())) {
      return null; // Hard rejection
    }
  }

  // STAGE 2: SOFT SCORING (Total: 100 points)

  // 1. SKILL RELEVANCE SCORE (50 points)
  let skillScore = 0;
  
  // Must-have skills (30 points)
  let mustHaveMatches = 0;
  job.mustHaveSkills.forEach(skill => {
    const candidateSkill = candidate.skills.find(s => 
      s.name.toLowerCase() === skill.toLowerCase()
    );
    if (candidateSkill) {
      mustHaveMatches++;
      // Bonus for skill level
      const levelBonus = candidateSkill.level === 'advanced' ? 1.2 : 
                        candidateSkill.level === 'intermediate' ? 1.0 : 0.8;
      skillScore += (30 / job.mustHaveSkills.length) * levelBonus;
    }
  });

  // Good-to-have skills (20 points)
  let goodToHaveMatches = 0;
  if (job.goodToHaveSkills && job.goodToHaveSkills.length > 0) {
    job.goodToHaveSkills.forEach(skill => {
      const candidateSkill = candidate.skills.find(s => 
        s.name.toLowerCase() === skill.toLowerCase()
      );
      if (candidateSkill) {
        goodToHaveMatches++;
        const levelBonus = candidateSkill.level === 'advanced' ? 1.2 : 
                          candidateSkill.level === 'intermediate' ? 1.0 : 0.8;
        skillScore += (20 / job.goodToHaveSkills.length) * levelBonus;
      }
    });
  }

  // Cap skill score at 50
  skillScore = Math.min(skillScore, 50);

  // 2. EXPERIENCE MATCH SCORE (30 points)
  let experienceScore = 0;
  
  if (candidate.experienceYears >= job.minExperience) {
    // Base score for meeting minimum
    experienceScore = 15;
    
    // Bonus for being in optimal range
    if (candidate.experienceYears <= job.maxExperience) {
      experienceScore = 30; // Perfect fit
    } else {
      // Slight penalty for being overqualified, but still positive
      const overQualified = candidate.experienceYears - job.maxExperience;
      experienceScore = Math.max(20, 30 - (overQualified * 2));
    }
  }

  // 3. PROJECT RELEVANCE SCORE (20 points)
  let projectScore = 0;
  
  if (candidate.projects && candidate.projects.length > 0) {
    // Base score for having projects
    projectScore = Math.min(candidate.projects.length * 3, 10);
    
    // Bonus for relevant tech stack
    let techStackMatches = 0;
    const allJobSkills = [...job.mustHaveSkills, ...(job.goodToHaveSkills || [])];
    
    candidate.projects.forEach(project => {
      if (project.techStack && project.techStack.length > 0) {
        project.techStack.forEach(tech => {
          if (allJobSkills.some(skill => 
            skill.toLowerCase().includes(tech.toLowerCase()) || 
            tech.toLowerCase().includes(skill.toLowerCase())
          )) {
            techStackMatches++;
          }
        });
      }
    });
    
    // Add tech stack bonus (up to 10 points)
    projectScore += Math.min(techStackMatches * 2, 10);
  }

  // Cap project score at 20
  projectScore = Math.min(projectScore, 20);

  // FINAL SCORE CALCULATION
  const finalScore = Math.round(skillScore + experienceScore + projectScore);

  return {
    candidateId: candidate._id || candidate.userId,
    finalScore,
    scoreBreakdown: {
      skillScore: Math.round(skillScore),
      experienceScore: Math.round(experienceScore),
      projectScore: Math.round(projectScore)
    },
    matchDetails: {
      mustHaveSkillsMatched: mustHaveMatches,
      totalMustHaveSkills: job.mustHaveSkills.length,
      goodToHaveSkillsMatched: goodToHaveMatches,
      totalGoodToHaveSkills: job.goodToHaveSkills ? job.goodToHaveSkills.length : 0,
      experienceYears: candidate.experienceYears,
      projectCount: candidate.projects ? candidate.projects.length : 0
    }
  };
};

// STAGE 3: RANKING AND TOP N SELECTION
exports.rankCandidates = (candidates, job) => {
  const scoredCandidates = [];
  
  candidates.forEach(candidate => {
    const matchResult = exports.calculateMatchScore(candidate, job);
    if (matchResult) { // Only include candidates who passed hard filters
      scoredCandidates.push({
        ...matchResult,
        candidateProfile: candidate
      });
    }
  });

  // Sort by final score (descending)
  scoredCandidates.sort((a, b) => b.finalScore - a.finalScore);

  // Return only top N candidates
  return scoredCandidates.slice(0, job.topNCandidates || 5);
};
