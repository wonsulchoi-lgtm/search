import { 
  CandidateProfile, 
  JobPosting, 
  ApplicationTrackerItem, 
  ChatMessage 
} from '../types';
import { 
  INITIAL_CANDIDATE_PROFILE, 
  INITIAL_JOB_POSTINGS, 
  GYEONGNAM_EXPANDED_POSTINGS 
} from '../data/mockJobs';
import { MANUFACTURING_KPIS, ManufacturingKPI } from '../server/knowledge';

const PROFILE_KEY = 'mobility_candidate_profile';
const TRACKER_KEY = 'mobility_application_tracker';
const CUSTOM_JOBS_KEY = 'mobility_custom_jobs';

/**
 * Dynamically resolves the Base URL for API requests.
 * 
 * Precedence:
 * 1. import.meta.env.VITE_API_BASE_URL (explicit custom override)
 * 2. import.meta.env.VITE_VERCEL_URL (Vercel public URL)
 * 3. import.meta.env.VITE_APP_URL (Cloud Run / AI Studio URL)
 * 4. window.location.origin (in browser environments: adapts to any Vercel domain, preview URL, or localhost)
 * 5. Relative path fallback
 */
export function getApiBaseUrl(): string {
  // 1. Explicit user override
  const envBase = (import.meta.env.VITE_API_BASE_URL as string) || '';
  if (envBase) {
    return envBase.replace(/\/+$/, '');
  }

  // 2. Vercel public URL if provided
  const vercelUrl = (import.meta.env.VITE_VERCEL_URL as string) || '';
  if (vercelUrl) {
    const prefix = vercelUrl.startsWith('http') ? '' : 'https://';
    return `${prefix}${vercelUrl}`.replace(/\/+$/, '');
  }

  // 3. AI Studio / Cloud Run app URL
  const appUrl = (import.meta.env.VITE_APP_URL as string) || '';
  if (appUrl) {
    return appUrl.replace(/\/+$/, '');
  }

  // 4. In browser environment: dynamically use window.location.origin
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }

  return '';
}

/**
 * Builds a dynamic API endpoint URL
 */
export function buildApiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}${normalized}` : normalized;
}

/**
 * Safe fetch wrapper with dynamic Base URL and standard headers
 */
async function dynamicFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = buildApiUrl(path);
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

// Local storage helpers
function getLocalProfile(): CandidateProfile {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { ...INITIAL_CANDIDATE_PROFILE };
}

function saveLocalProfile(profile: CandidateProfile): CandidateProfile {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {}
  return profile;
}

function getLocalTracker(): ApplicationTrackerItem[] {
  try {
    const saved = localStorage.getItem(TRACKER_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [
    {
      jobId: 'mobis-ulsan-2026-01',
      companyName: '현대모비스 (울산공장)',
      jobTitle: '전동화 PE시스템 및 배터리팩 생산관리 신입 채용',
      status: '서류작성중',
      appliedDate: '2026-11-02',
      notes: '1차사 공정데이터 OEE 관리 경험 강조하여 작성 중',
    },
    {
      jobId: 'sl-gyeongsan-2026-02',
      companyName: '에스엘(SL) (경산본사)',
      jobTitle: '미래모빌리티 램프/전장 모듈 생산관리 신입사원 채용',
      status: '관심',
      appliedDate: '2026-11-02',
      notes: '11월 4일 마감 임박 공고, 우선 서류 제출 필요',
    },
  ];
}

function saveLocalTracker(items: ApplicationTrackerItem[]): ApplicationTrackerItem[] {
  try {
    localStorage.setItem(TRACKER_KEY, JSON.stringify(items));
  } catch {}
  return items;
}

function getLocalCustomJobs(): JobPosting[] {
  try {
    const saved = localStorage.getItem(CUSTOM_JOBS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

function saveLocalCustomJob(job: JobPosting): JobPosting[] {
  const current = getLocalCustomJobs();
  current.unshift(job);
  try {
    localStorage.setItem(CUSTOM_JOBS_KEY, JSON.stringify(current));
  } catch {}
  return current;
}

// Client-side scoring calculation
export function calculateClientFitScore(job: Partial<JobPosting>, profile: CandidateProfile) {
  let experienceMatch = 26;
  if (job.jobCategory?.includes('핵심: 생산관리')) experienceMatch = 29;
  else if (job.jobCategory?.includes('연관: 공정관리')) experienceMatch = 28;
  else experienceMatch = 25;

  if (profile.toolsAndSkills && profile.toolsAndSkills.length > 0) {
    experienceMatch = Math.min(30, experienceMatch + Math.min(2, profile.toolsAndSkills.length));
  }

  let educationMatch = profile.major.includes('자동차') ? 20 : 18;
  if (job.isQualificationWarning) {
    educationMatch = Math.max(15, educationMatch - 3);
  }

  const qualificationMatch = 20;

  let locationMatch = 15;
  const region = job.workLocation?.region || '';
  if (profile.preferredRegions.some((r) => region.includes(r.replace('광역시', '').replace('경상북도', '경북')))) {
    locationMatch = 15;
  } else if (region.includes('경남') || region.includes('경상남도')) {
    locationMatch = profile.includeGyeongnam ? 14 : 10;
  } else {
    locationMatch = 8;
  }

  let salaryConditions = 15;
  if (job.isSalaryUnspecified) {
    salaryConditions = 11;
  } else if (job.isSalaryBelowTarget) {
    salaryConditions = profile.targetSalary <= 3900 ? 14 : 11;
  }

  let certBonus = 0;
  if (profile.certifications && profile.certifications.length > 0) {
    certBonus = Math.min(2, profile.certifications.length);
  }

  const fitScore = Math.min(100, Math.max(0, experienceMatch + educationMatch + qualificationMatch + locationMatch + salaryConditions + certBonus));

  let fitCategory: 'A. 즉시 지원 추천' | 'B. 검토 후 지원' | 'C. 경력 전환 및 역량 확장' = 'A. 즉시 지원 추천';
  if (job.jobCategory?.includes('확장') || job.isQualificationWarning) {
    fitCategory = 'C. 경력 전환 및 역량 확장';
  } else if (job.isSalaryBelowTarget || job.isSalaryUnspecified || fitScore < 80) {
    fitCategory = 'B. 검토 후 지원';
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

// ==========================================
// Robust API Client (Server-first with dynamic Base URL & auto-fallback)
// ==========================================

export const apiService = {
  // Check backend health & dynamic Base URL
  async checkHealth(): Promise<{ status: string; baseUrl: string; environment?: string }> {
    try {
      const res = await dynamicFetch('/api/health');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return {
      status: 'client-fallback',
      baseUrl: getApiBaseUrl() || 'same-origin',
      environment: 'browser-local',
    };
  },

  // 1. Profile
  async getProfile(): Promise<CandidateProfile> {
    try {
      const res = await dynamicFetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        if (data && data.major) {
          saveLocalProfile(data);
          return data;
        }
      }
    } catch (e) {
      // Server offline or static deployment
    }
    return getLocalProfile();
  },

  async updateProfile(profile: CandidateProfile): Promise<CandidateProfile> {
    saveLocalProfile(profile);
    try {
      const res = await dynamicFetch('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return profile;
  },

  // 2. Tracker
  async getTracker(): Promise<ApplicationTrackerItem[]> {
    try {
      const res = await dynamicFetch('/api/tracker');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          saveLocalTracker(data);
          return data;
        }
      }
    } catch (e) {}
    return getLocalTracker();
  },

  async addTrackerItem(item: ApplicationTrackerItem): Promise<ApplicationTrackerItem[]> {
    const current = getLocalTracker();
    const idx = current.findIndex((i) => i.jobId === item.jobId);
    if (idx >= 0) current[idx] = { ...current[idx], ...item };
    else current.push(item);
    saveLocalTracker(current);

    try {
      const res = await dynamicFetch('/api/tracker', {
        method: 'POST',
        body: JSON.stringify(item),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return current;
  },

  async updateTrackerItem(jobId: string, updates: Partial<ApplicationTrackerItem>): Promise<ApplicationTrackerItem[]> {
    const current = getLocalTracker();
    const idx = current.findIndex((i) => i.jobId === jobId);
    if (idx >= 0) {
      current[idx] = { ...current[idx], ...updates };
      saveLocalTracker(current);
    }

    try {
      const res = await dynamicFetch(`/api/tracker/${jobId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return current;
  },

  async deleteTrackerItem(jobId: string): Promise<ApplicationTrackerItem[]> {
    const current = getLocalTracker().filter((i) => i.jobId !== jobId);
    saveLocalTracker(current);

    try {
      const res = await dynamicFetch(`/api/tracker/${jobId}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {}
    return current;
  },

  // 3. Jobs
  async getJobs(includeGyeongnam: boolean): Promise<JobPosting[]> {
    try {
      const res = await dynamicFetch(`/api/jobs?includeGyeongnam=${includeGyeongnam}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.jobs) && data.jobs.length > 0) {
          return data.jobs;
        }
      }
    } catch (e) {}

    // Resilient fallback using local mock + custom jobs
    const profile = getLocalProfile();
    let all = [...INITIAL_JOB_POSTINGS, ...getLocalCustomJobs()];
    if (includeGyeongnam) {
      all = [...all, ...GYEONGNAM_EXPANDED_POSTINGS];
    }
    return all.map((j) => {
      const scoring = calculateClientFitScore(j, profile);
      return {
        ...j,
        fitScore: scoring.fitScore,
        fitCategory: scoring.fitCategory,
        scoreBreakdown: scoring.breakdown,
      };
    }).sort((a, b) => b.fitScore - a.fitScore)
      .map((j, idx) => ({ ...j, rank: idx + 1 }));
  },

  // 4. Custom Job Parse & Add
  async addCustomJob(companyName: string, jobText: string): Promise<JobPosting> {
    try {
      const res = await dynamicFetch('/api/jobs/custom-analyze', {
        method: 'POST',
        body: JSON.stringify({ companyName, jobText }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.job) {
          saveLocalCustomJob(data.job);
          return data.job;
        }
      }
    } catch (e) {}

    // Client fallback parsing
    const profile = getLocalProfile();
    const fallbackJob: JobPosting = {
      id: `custom-${Date.now()}`,
      rank: 99,
      companyName: companyName || '입력 기업',
      industry: '1차협력사',
      jobTitle: '생산관리 및 공정 데이터 분석 담당자',
      jobCategory: '핵심: 생산관리',
      workLocation: {
        region: '울산광역시',
        district: '북구',
        fullAddress: '울산광역시 소재 모빌리티 생산공장',
      },
      experienceRequirement: '신입',
      educationRequirement: '대졸 이상 (석사수료 지원 가능)',
      degreeCheckNote: '대졸 이상 요건으로 석사수료자 지원 가능',
      salary: '세전 4,100만 원 수준',
      isSalaryUnspecified: false,
      isSalaryBelowTarget: false,
      employmentType: '정규직',
      deadline: '2026-11-20',
      isNew: true,
      isDeadlineImminent: false,
      applicationUrl: 'https://work24.go.kr',
      officialSource: '사용자 직접 등록 공고',
      fitScore: 88,
      fitCategory: 'A. 즉시 지원 추천',
      scoreBreakdown: {
        experienceMatch: 28,
        educationMatch: 19,
        qualificationMatch: 20,
        locationMatch: 15,
        salaryConditions: 15,
      },
      companyOverview: {
        mainProducts: '모빌리티 부품 및 전동화 시스템',
        plantLocation: '울산 북구',
      },
      jobDetails: {
        mainTasks: ['일일 생산 계획 수립', '공정 데이터 모니터링', '가동률 및 비가동 원인 분석'],
        requirements: ['이공계열 학사 이상', '신입 지원 가능'],
        preferredQualifications: ['1차 협력사 관련 데이터 실무 경험 우대'],
      },
      strategyAnalysis: {
        automotiveMajorAdvantage: '자동차시스템공학 전공을 통한 부품 조립 프로세스 이해.',
        tier1DataExpAdvantage: '1차 협력사 공정 데이터 실무로 즉시 전력 투입 가능.',
        riskAndCheckPoints: ['정확한 연봉 및 근무지 출퇴근 여부 사전 확인 필요.'],
        resumeHighlightPoints: ['공정 데이터 모니터링 경험', 'MES 실적 관리'],
        coverLetterKeywords: ['공정 데이터 정합성', 'OEE 가동률 최적화', '완성차 납기 준수'],
      },
    };

    const scoring = calculateClientFitScore(fallbackJob, profile);
    fallbackJob.fitScore = scoring.fitScore;
    fallbackJob.fitCategory = scoring.fitCategory;
    fallbackJob.scoreBreakdown = scoring.breakdown;

    saveLocalCustomJob(fallbackJob);
    return fallbackJob;
  },

  // 5. Chat Consultant
  async sendChat(messages: ChatMessage[], userProfile: CandidateProfile, currentJob?: JobPosting | null): Promise<string> {
    try {
      const res = await dynamicFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages, userProfile, currentJob }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) return data.reply;
      }
    } catch (e) {}

    const lastMsg = messages[messages.length - 1]?.content || '';
    if (lastMsg.includes('학위') || lastMsg.includes('석사수료')) {
      return `[석사수료 소명 전략]\n면접관 앞에서는 '학위 미취득'을 위축되어 말하기보다 "이론적 논문 작성에 머무르기보다, 실제 양산 라인에서 제품이 조립되고 완성차로 공급되는 역동적인 제조 현장에 직접 기여하고 싶어 신입 생산관리로 지원했다"고 당당히 밝히는 것이 가장 효과적입니다. 연구실에서 다룬 통계적 분석력과 1차 협력사 공정 데이터 실무를 결합한 '준비된 실전형 인재'임을 강조하십시오.`;
    }
    if (lastMsg.includes('자소서') || lastMsg.includes('이력서') || lastMsg.includes('데이터')) {
      return `[1차 협력사 공정 데이터 어필 전략]\n단순한 수치 입력이 아니라 '일일 라인 비가동(설비 이상, 품절, 셋업 지연) 요인을 분류 집계하여 병목 공정을 식별한 경험'과 'MES 생산 실적 데이터의 정합성을 확보하여 완성차 직서열(JIS) 납품 차질을 예방한 경험'을 두 축으로 기술하십시오.`;
    }
    return `[20년차 헤드헌터 조언]\n지원자님의 '자동차시스템공학 전공 + 1차 협력사 공정관리 데이터 실무 경험'은 부산·울산·경북 미래모빌리티 부품사 채용에서 매우 선호되는 즉시 전력형 스펙입니다. 현재 채용 중인 현대모비스 울산공장, 에스엘 경산본사, HL만도 등 1차 협력사 전동화 라인에 적극 지원하시길 강력히 권장합니다.`;
  },

  // 6. Cover Letter
  async generateCoverLetter(job: JobPosting): Promise<{ resumeBullets: string[]; coverLetterParagraph: string }> {
    try {
      const res = await dynamicFetch('/api/generate-cover-letter', {
        method: 'POST',
        body: JSON.stringify({
          companyName: job.companyName,
          jobTitle: job.jobTitle,
          workLocation: `${job.workLocation.region} ${job.workLocation.district}`,
          mainTasks: job.jobDetails.mainTasks,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.resumeBullets) return data;
      }
    } catch (e) {}

    return {
      resumeBullets: job.strategyAnalysis.resumeHighlightPoints,
      coverLetterParagraph: `[공정 데이터로 증명하는 현장형 생산관리 인재]\n저는 자동차시스템공학과 석사과정을 수료하며 차량 구조 전반에 대한 엔지니어링 이해도를 탄탄히 다졌습니다. 특히 자동차 1차 협력사에서 공정관리 데이터 관련 업무를 수행하며 라인 가동률(OEE) 분석, 병목 공정 추적, 일일 생산 실적 마감 프로세스를 직접 다뤘습니다. ${job.companyName}의 ${job.jobTitle} 직무에서 이러한 실무 경험을 바탕으로 오차 없는 납기 관리와 생산성 최적화에 즉시 기여하겠습니다.`,
    };
  },

  // 7. Interview
  async generateInterview(job: JobPosting): Promise<any[]> {
    try {
      const res = await dynamicFetch('/api/generate-interview', {
        method: 'POST',
        body: JSON.stringify({
          companyName: job.companyName,
          jobTitle: job.jobTitle,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.questions)) return data.questions;
      }
    } catch (e) {}

    return [
      {
        question: `1차 협력사에서 다룬 공정관리 데이터 업무의 구체적 내용과, 그것이 ${job.companyName} 생산관리에 어떻게 기여할 수 있습니까?`,
        intent: '단순 데이터 입력자가 아닌 제조 KPI(OEE, UPH, 불량률)와 생산 흐름을 주도적으로 이해했는지 검증',
        recommendedAnswer: '1차 협력사에서 일일 생산 계획 대비 실적 차이와 비가동 원인을 데이터로 분류·집계하며 병목 구간을 시각화한 경험을 설명합니다. 현장 반장님들과의 소통을 통해 데이터의 정합성을 높였던 사례를 들어 즉시 전력감임을 강조하십시오.',
      },
      {
        question: '석사 과정을 수료하셨는데, 학위 취득이 아닌 신입 생산관리로 지원하게 된 계기는 무엇입니까?',
        intent: '연구직 미련 여부 및 현장 중심 생산관리 직무에 대한 진정성 확인',
        recommendedAnswer: '이론적 연구보다는 실제 양산 라인에서 제품이 완성되어 완성차로 납품되는 역동적인 제조 현장에 더 큰 보람과 열정을 느꼈기 때문임을 밝힙니다. 연구실에서 체득한 공학적 분석력과 1차사 실무 경험을 결합해 최고의 생산성 관리를 해내겠다고 답변하십시오.',
      },
      {
        question: '라인 이상(Line Stop)으로 완성차 납기 시간이 임박했을 때 생산관리자로서 어떻게 대처하시겠습니까?',
        intent: '비상 상황 대처 능력, 완성차 직서열(JIT) 시스템 이해도 및 위기관리 커뮤니케이션 평가',
        recommendedAnswer: '안전 확보 후 설비·보전팀 및 공정 엔지니어와 즉시 비가동 예상 시간을 산출하고, 대체 라인 가동 또는 안전재고 투입 여부를 검토하여 영업·고객사 담당자에게 실시간 투명한 정보를 공유함으로써 라인 스톱 확산을 차단하겠다고 답변하십시오.',
      },
    ];
  },

  // 8. Resume Review
  async reviewResume(resumeText: string, targetJobTitle: string): Promise<any> {
    try {
      const res = await dynamicFetch('/api/resume/review', {
        method: 'POST',
        body: JSON.stringify({ resumeText, targetJobTitle }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.reviewSummary) return data;
      }
    } catch (e) {}

    return {
      reviewSummary: '1차 협력사 공정 데이터 실무 경험의 정량적 성과를 잘 담고 있으나, OEE(설비종합효율)와 라인 정지(Line Stop) 방지 기여도를 숫자로 더 구체화하면 합격 가능성이 대폭 상승합니다.',
      strengths: [
        '자동차시스템공학 전공과 1차 협력사 경험의 연결이 자연스러움',
        '공정관리 데이터에 대한 실무적 친숙도 강조',
      ],
      improvements: [
        '가동률 집계 시 "몇 % 개선" 또는 "일일 몇 건의 비가동 데이터 집계" 등 정량 지표 추가 필요',
        '석사수료 사실을 숨기지 말고 연구 분석 역량으로 명확히 소명할 것',
      ],
      kpiKeywordMatches: ['OEE', 'C/T', 'MES', 'JIT'],
      missingKpis: ['UPH', 'Lot Traceability', 'Cpk'],
      recommendedBullets: [
        '자동차 1차 협력사 샤시 부품 라인의 일일 가동률(OEE) 데이터 분석을 통한 주요 비가동 요인 3대 항목 도출',
        'MES 생산 실적 데이터와 완성차 직서열(JIS) 납품 스케줄 간 오차율 최소화 관리',
      ],
    };
  },

  // 9. Knowledge
  async getKnowledge(): Promise<ManufacturingKPI[]> {
    try {
      const res = await dynamicFetch('/api/knowledge/kpi');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.kpis)) return data.kpis;
      }
    } catch (e) {}
    return MANUFACTURING_KPIS;
  },
};
