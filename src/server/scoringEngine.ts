import { JobPosting, CandidateProfile } from '../types';

/**
 * Server-side RTSC 100-Point Fit Scoring Engine
 * 
 * Criteria Breakdown:
 * 1. 직무 경험 연관성 (30점)
 * 2. 전공·학력 적합성 (20점)
 * 3. 신입 지원 및 필수 자격 충족도 (20점)
 * 4. 지역 일치도 (15점)
 * 5. 연봉 및 근무조건 일치도 (15점)
 */
export function calculateFitScore(job: Partial<JobPosting>, profile: CandidateProfile): {
  fitScore: number;
  fitCategory: 'A. 즉시 지원 추천' | 'B. 검토 후 지원' | 'C. 경력 전환 및 역량 확장';
  breakdown: {
    experienceMatch: number;
    educationMatch: number;
    qualificationMatch: number;
    locationMatch: number;
    salaryConditions: number;
  };
} {
  // 1. 직무 경험 연관성 (Max 30)
  let experienceMatch = 26;
  if (job.jobCategory?.includes('핵심: 생산관리')) {
    experienceMatch = 29;
  } else if (job.jobCategory?.includes('연관: 공정관리')) {
    experienceMatch = 28;
  } else {
    experienceMatch = 25;
  }

  // Bonus if candidate has extra tools
  if (profile.toolsAndSkills && profile.toolsAndSkills.length > 0) {
    experienceMatch = Math.min(30, experienceMatch + Math.min(2, profile.toolsAndSkills.length));
  }

  // 2. 전공·학력 적합성 (Max 20)
  let educationMatch = 19;
  if (profile.major.includes('자동차')) {
    educationMatch = 20;
  } else if (profile.major.includes('기계') || profile.major.includes('산업')) {
    educationMatch = 18;
  }

  // 석사수료 관련 감점 방지: 석사수료는 정당한 공학 연구 역량으로 평가
  // 단, 공고에서 석사 학위 취득이 필수(의무)인 경우에만 자격 불충족 플래그 처리
  if (job.isQualificationWarning) {
    educationMatch = Math.max(15, educationMatch - 3);
  }

  // 3. 신입 지원 및 필수 자격 충족도 (Max 20)
  let qualificationMatch = 20;
  if (job.experienceRequirement === '신입' || job.experienceRequirement === '경력무관') {
    qualificationMatch = 20;
  } else {
    qualificationMatch = 16;
  }

  // 4. 지역 일치도 (Max 15)
  let locationMatch = 15;
  const region = job.workLocation?.region || '';
  if (profile.preferredRegions.some((r) => region.includes(r.replace('광역시', '').replace('경상북도', '경북')))) {
    locationMatch = 15;
  } else if (region.includes('경남') || region.includes('경상남도')) {
    locationMatch = profile.includeGyeongnam ? 14 : 10;
  } else {
    locationMatch = 8;
  }

  // 5. 연봉 및 근무조건 (Max 15)
  let salaryConditions = 15;
  if (job.isSalaryUnspecified) {
    // 원칙 7: 연봉 미공개는 제외하지 않고 별도 표기, 잠정 점수 부여
    salaryConditions = 11;
  } else if (job.isSalaryBelowTarget) {
    // 4,000만 원 미만
    if (profile.targetSalary <= 3900) {
      salaryConditions = 14;
    } else {
      salaryConditions = 11;
    }
  } else {
    salaryConditions = 15;
  }

  // Extra Certifications Bonus
  let certBonus = 0;
  if (profile.certifications && profile.certifications.length > 0) {
    certBonus = Math.min(2, profile.certifications.length);
  }

  const rawScore = experienceMatch + educationMatch + qualificationMatch + locationMatch + salaryConditions + certBonus;
  const fitScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Categorization
  let fitCategory: 'A. 즉시 지원 추천' | 'B. 검토 후 지원' | 'C. 경력 전환 및 역량 확장' = 'A. 즉시 지원 추천';
  if (job.jobCategory?.includes('확장') || job.isQualificationWarning) {
    fitCategory = 'C. 경력 전환 및 역량 확장';
  } else if (job.isSalaryBelowTarget || job.isSalaryUnspecified || fitScore < 80) {
    fitCategory = 'B. 검토 후 지원';
  } else {
    fitCategory = 'A. 즉시 지원 추천';
  }

  return {
    fitScore,
    fitCategory,
    breakdown: {
      experienceMatch,
      educationMatch,
      qualificationMatch,
      locationMatch,
      salaryConditions,
    },
  };
}
