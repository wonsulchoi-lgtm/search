export interface JobPosting {
  id: string;
  rank: number;
  companyName: string;
  industry: '완성차' | '1차협력사' | '2차협력사' | '전동화/배터리' | '전장/스마트팩토리' | '모빌리티첨단부품';
  jobTitle: string;
  jobCategory: '핵심: 생산관리' | '연관: 공정관리' | '확장: 생산기술/스마트팩토리';
  workLocation: {
    region: '부산광역시' | '울산광역시' | '경상북도' | '경상남도';
    district: string;
    fullAddress: string;
  };
  experienceRequirement: '신입' | '신입/경력' | '경력무관';
  educationRequirement: string; // e.g. "대졸 이상 (석사수료 지원가능)", "학사 이상 (석사 우대)"
  degreeCheckNote: string; // Warning/guidance regarding 석사수료 vs 석사학위
  salary: string; // e.g. "4,200만 원", "4,000만 원", "회사 내규에 따름 (연봉 미공개)"
  isSalaryUnspecified: boolean;
  isSalaryBelowTarget: boolean;
  employmentType: '정규직' | '계약직 (정규직 전환형)' | '계약직';
  deadline: string; // YYYY-MM-DD or "채용시 마감"
  isNew: boolean; // within 24 hours
  isDeadlineImminent: boolean; // within 3 days
  isQualificationWarning?: boolean; // e.g., if master's degree conferred is strictly mandatory
  applicationUrl: string;
  officialSource: string; // e.g. "현대모비스 채용포털", "사람인 공식공고", "고용24"
  fitScore: number; // 0-100
  fitCategory: 'A. 즉시 지원 추천' | 'B. 검토 후 지원' | 'C. 경력 전환 및 역량 확장';
  scoreBreakdown: {
    experienceMatch: number; // max 30
    educationMatch: number; // max 20
    qualificationMatch: number; // max 20
    locationMatch: number; // max 15
    salaryConditions: number; // max 15
  };
  companyOverview: {
    mainProducts: string;
    annualRevenue?: string;
    employeeCount?: string;
    plantLocation: string;
  };
  jobDetails: {
    mainTasks: string[];
    requirements: string[];
    preferredQualifications: string[];
  };
  strategyAnalysis: {
    automotiveMajorAdvantage: string;
    tier1DataExpAdvantage: string;
    riskAndCheckPoints: string[];
    resumeHighlightPoints: string[];
    coverLetterKeywords: string[];
  };
}

export interface CandidateProfile {
  major: string;
  age: number;
  education: string; // "석사수료 (자동차시스템공학)"
  isMasterDegreeConferred: boolean; // false
  experience: string; // "자동차 1차 협력사 공정관리 데이터 관련 업무"
  careerType: '신입';
  targetJob: string; // "생산관리"
  preferredRegions: string[];
  includeGyeongnam: boolean;
  targetSalary: number; // in 10,000 KRW (e.g. 4000)
  certifications: string[];
  toolsAndSkills: string[];
  employmentTypePref: '정규직 우선';
}

export interface BriefingStats {
  reportDate: string;
  searchTime: string;
  targetRegions: string;
  targetJob: string;
  collectedCount: number;
  activeCount: number;
  newCount: number;
  imminentCount: number;
  highFitCount: number; // 80점 이상
}

export interface DeltaReport {
  newOpenings: string[];
  imminentDeadlines: string[];
  closedOpenings: string[];
  modifiedOpenings: string[];
  duplicateCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ApplicationTrackerItem {
  jobId: string;
  companyName: string;
  jobTitle: string;
  status: '관심' | '서류작성중' | '지원완료' | '서류합격' | '면접대기' | '불합격';
  appliedDate?: string;
  notes?: string;
}
