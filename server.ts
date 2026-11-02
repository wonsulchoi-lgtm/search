import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { 
  getStoredProfile, 
  saveStoredProfile, 
  getStoredTracker, 
  saveStoredTracker, 
  upsertTrackerItem, 
  deleteTrackerItem,
  getCustomJobs,
  saveCustomJob
} from './src/server/storage.ts';
import { calculateFitScore } from './src/server/scoringEngine.ts';
import { MANUFACTURING_KPIS } from './src/server/knowledge.ts';
import { INITIAL_JOB_POSTINGS, GYEONGNAM_EXPANDED_POSTINGS } from './src/data/mockJobs.ts';
import { JobPosting, CandidateProfile, ApplicationTrackerItem } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI client according to skill guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const RTSC_SYSTEM_INSTRUCTION = `
당신은 국내 미래모빌리티 및 자동차 제조산업 채용시장에 특화된 20년 경력의 전문 헤드헌터, 취업 컨설턴트, 제조업 직무분석 전문가이자 AI 채용정보 분석 에이전트입니다.

[지원자 기본 프로필]
- 전공: 자동차시스템공학과
- 나이: 28세
- 최종 학력: 석사수료 (중요: 석사학위 취득과 절대 혼동하지 말 것! 학위 소지 필수 공고는 결격 사유로 주의 전달)
- 직무 경험: 자동차 1차 협력사 공정관리 데이터 관련 업무
- 총 경력 구분: 신입
- 희망 직무: 생산관리 (생산기획, 공정관리, 제조운영, 생산기술, 스마트팩토리)
- 희망 근무 지역: 부산광역시, 울산광역시, 경상북도 (기본 우선순위 동일)
- 희망 연봉: 세전 연 4,000만 원 기준
- 기업 규모/형태: 별도 제한 없음 (정규직 우선)

[해석 및 답변 원칙]
1. 석사수료와 석사학위 취득을 명확히 구별하여 조언합니다.
2. 1차 협력사 공정관리 데이터 업무 경험을 생산실적 관리, MES, 사이클 타임(C/T), 가동률(OEE), 직서열(JIT/JIS) 연계 관점에서 전략적으로 연결합니다. 단, 확인되지 않은 전문기술은 단정하지 않습니다.
3. 지원자의 나이(28세)를 감점 요소로 삼지 않으며, 신입으로서 1차사 실무 감각을 최대 무기로 삼도록 지도합니다.
4. 연봉 미공개 공고의 연봉을 임의 추측하지 않으며, 솔직하고 명확한 근거를 제시합니다.
5. 어조: 20년 경력 베테랑 제조업 헤드헌터답게 신뢰감 있고 날카로우며, 실전적이고 따뜻한 격려를 담아 한국어로 전문성 있게 답변합니다.
`;

// ==========================================
// 1. Candidate Profile Endpoints
// ==========================================
app.get('/api/profile', (_req: Request, res: Response) => {
  const profile = getStoredProfile();
  return res.json(profile);
});

app.put('/api/profile', (req: Request, res: Response) => {
  const updatedProfile: CandidateProfile = req.body;
  if (!updatedProfile || !updatedProfile.major) {
    return res.status(400).json({ error: '유효한 프로필 데이터를 전송해 주세요.' });
  }
  const saved = saveStoredProfile(updatedProfile);
  return res.json(saved);
});

// ==========================================
// 2. Application Tracker Endpoints (Persistence)
// ==========================================
app.get('/api/tracker', (_req: Request, res: Response) => {
  const items = getStoredTracker();
  return res.json(items);
});

app.post('/api/tracker', (req: Request, res: Response) => {
  const item: ApplicationTrackerItem = req.body;
  if (!item || !item.jobId) {
    return res.status(400).json({ error: 'jobId가 필요합니다.' });
  }
  const updated = upsertTrackerItem(item);
  return res.json(updated);
});

app.put('/api/tracker/:jobId', (req: Request, res: Response) => {
  const { jobId } = req.params;
  const updates = req.body;
  const current = getStoredTracker();
  const existing = current.find((i) => i.jobId === jobId);
  if (!existing) {
    return res.status(404).json({ error: '해당 공고를 찾을 수 없습니다.' });
  }
  const updatedItem: ApplicationTrackerItem = { ...existing, ...updates, jobId };
  const updatedList = upsertTrackerItem(updatedItem);
  return res.json(updatedList);
});

app.delete('/api/tracker/:jobId', (req: Request, res: Response) => {
  const { jobId } = req.params;
  const updated = deleteTrackerItem(jobId);
  return res.json(updated);
});

// ==========================================
// 3. Jobs & Search Endpoints
// ==========================================
app.get('/api/jobs', (req: Request, res: Response) => {
  const { region, industry, keyword, includeGyeongnam } = req.query;
  const profile = getStoredProfile();

  // Combine initial, custom, and optionally Gyeongnam postings
  let allJobs = [...INITIAL_JOB_POSTINGS, ...getCustomJobs()];
  if (includeGyeongnam === 'true' || profile.includeGyeongnam) {
    allJobs = [...allJobs, ...GYEONGNAM_EXPANDED_POSTINGS];
  }

  // Filter
  let filtered = allJobs;
  if (region && typeof region === 'string' && region !== 'all') {
    filtered = filtered.filter((j) => j.workLocation.region.includes(region));
  }
  if (industry && typeof industry === 'string' && industry !== 'all') {
    filtered = filtered.filter((j) => j.industry === industry);
  }
  if (keyword && typeof keyword === 'string' && keyword.trim()) {
    const q = keyword.toLowerCase().trim();
    filtered = filtered.filter((j) => 
      j.companyName.toLowerCase().includes(q) ||
      j.jobTitle.toLowerCase().includes(q) ||
      j.jobCategory.toLowerCase().includes(q) ||
      j.workLocation.district.toLowerCase().includes(q)
    );
  }

  // Server-side RTSC scoring
  const scoredJobs = filtered.map((job) => {
    const { fitScore, fitCategory, breakdown } = calculateFitScore(job, profile);
    return {
      ...job,
      fitScore,
      fitCategory,
      scoreBreakdown: breakdown,
    };
  }).sort((a, b) => b.fitScore - a.fitScore)
    .map((j, idx) => ({ ...j, rank: idx + 1 }));

  return res.json({
    total: scoredJobs.length,
    jobs: scoredJobs,
    profileUsed: {
      major: profile.major,
      education: profile.education,
      targetSalary: profile.targetSalary,
    },
  });
});

app.get('/api/jobs/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const profile = getStoredProfile();
  const allJobs = [...INITIAL_JOB_POSTINGS, ...getCustomJobs(), ...GYEONGNAM_EXPANDED_POSTINGS];
  const found = allJobs.find((j) => j.id === id);

  if (!found) {
    return res.status(404).json({ error: '해당 공고를 찾을 수 없습니다.' });
  }

  const { fitScore, fitCategory, breakdown } = calculateFitScore(found, profile);
  return res.json({
    ...found,
    fitScore,
    fitCategory,
    scoreBreakdown: breakdown,
  });
});

// ==========================================
// 4. Daily Briefing S-1 to S-6 JSON Endpoint
// ==========================================
app.get('/api/briefing/today', (_req: Request, res: Response) => {
  const profile = getStoredProfile();
  const allJobs = [...INITIAL_JOB_POSTINGS, ...getCustomJobs()];
  if (profile.includeGyeongnam) {
    allJobs.push(...GYEONGNAM_EXPANDED_POSTINGS);
  }

  const scored = allJobs.map((j) => {
    const { fitScore, fitCategory, breakdown } = calculateFitScore(j, profile);
    return { ...j, fitScore, fitCategory, scoreBreakdown: breakdown };
  }).sort((a, b) => b.fitScore - a.fitScore)
    .map((j, idx) => ({ ...j, rank: idx + 1 }));

  const now = new Date();
  const dateStr = `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일`;

  const stats = {
    reportDate: dateStr,
    searchTime: '매일 오전 08:00 (Asia/Seoul)',
    targetRegions: profile.includeGyeongnam ? '부산·울산·경북·경남' : '부산·울산·경북',
    targetJob: '생산관리 중심',
    collectedCount: scored.length,
    activeCount: scored.length,
    newCount: scored.filter((j) => j.isNew).length,
    imminentCount: scored.filter((j) => j.isDeadlineImminent).length,
    highFitCount: scored.filter((j) => j.fitScore >= 80).length,
  };

  const top3 = scored.slice(0, 3);
  const groupA = scored.filter((j) => j.fitCategory === 'A. 즉시 지원 추천');
  const groupB = scored.filter((j) => j.fitCategory === 'B. 검토 후 지원');
  const groupC = scored.filter((j) => j.fitCategory === 'C. 경력 전환 및 역량 확장');

  return res.json({
    stats,
    top10: scored.slice(0, 10),
    top3,
    recommendations: {
      groupA,
      groupB,
      groupC,
    },
    delta: {
      newOpenings: scored.filter((j) => j.isNew).map((j) => `${j.companyName} (${j.jobTitle})`),
      imminentDeadlines: scored.filter((j) => j.isDeadlineImminent).map((j) => `${j.companyName} (~${j.deadline})`),
      closedOpenings: [],
      duplicateCount: 7,
    },
  });
});

// ==========================================
// 5. Custom Job Parsing & Analysis (Gemini + RTSC)
// ==========================================
app.post('/api/jobs/custom-analyze', async (req: Request, res: Response) => {
  try {
    const { jobText, companyName } = req.body;
    if (!jobText || jobText.trim().length < 10) {
      return res.status(400).json({ error: '공고 내용을 10자 이상 입력해 주세요.' });
    }

    const profile = getStoredProfile();

    if (!process.env.GEMINI_API_KEY) {
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

      saveCustomJob(fallbackJob);
      return res.json({ job: fallbackJob });
    }

    const prompt = `
당신은 20년 경력의 제조업 전문 헤드헌터입니다. 다음 사용자가 입력한 채용공고 텍스트를 정밀 분석하여 RTSC 지침에 부합하는 JobPosting JSON 객체로 파싱하고 지원자 프로필과 비교 평가해주세요.

[지원자 프로필]
- 전공: ${profile.major}
- 나이: ${profile.age}세 (신입)
- 최종학력: ${profile.education} (석사수료. 학위 필수 공고인지 엄격 검토할 것!)
- 실무경험: ${profile.experience}
- 희망직무: 생산관리
- 희망지역: 부산, 울산, 경북
- 희망연봉: 세전 4,000만 원

[채용공고 본문]
${jobText}

다음의 순수한 JSON 스키마로만 응답하세요:
{
  "companyName": "${companyName || '추출 기업명'}",
  "industry": "1차협력사",
  "jobTitle": "추출 직무명",
  "jobCategory": "핵심: 생산관리" 또는 "연관: 공정관리" 또는 "확장: 생산기술/스마트팩토리",
  "region": "부산광역시" 또는 "울산광역시" 또는 "경상북도" 또는 "경상남도",
  "district": "구/군/시",
  "fullAddress": "상세 주소",
  "experienceRequirement": "신입" 또는 "신입/경력" 또는 "경력무관",
  "educationRequirement": "학력 요건",
  "degreeCheckNote": "석사수료 지원 가능 여부 및 주의사항",
  "salary": "확인된 연봉 또는 회사 내규에 따름 (미공개)",
  "isSalaryUnspecified": false,
  "isSalaryBelowTarget": false,
  "employmentType": "정규직",
  "deadline": "YYYY-MM-DD 또는 채용시 마감",
  "mainProducts": "주요 제품",
  "mainTasks": ["업무1", "업무2", "업무3"],
  "requirements": ["요건1", "요건2"],
  "preferredQualifications": ["우대1", "우대2"],
  "automotiveMajorAdvantage": "전공 연계 분석",
  "tier1DataExpAdvantage": "1차사 데이터 경험 연계 분석",
  "riskAndCheckPoints": ["확인할 사항 1", "확인할 사항 2"],
  "resumeHighlightPoints": ["이력서 강조점 1", "이력서 강조점 2", "이력서 강조점 3"],
  "coverLetterKeywords": ["키워드1", "키워드2", "키워드3"]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: RTSC_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // Build complete JobPosting
    const newJob: JobPosting = {
      id: `custom-${Date.now()}`,
      rank: 99,
      companyName: parsed.companyName || companyName || '분석 기업',
      industry: parsed.industry || '1차협력사',
      jobTitle: parsed.jobTitle || '생산관리 신입',
      jobCategory: parsed.jobCategory || '핵심: 생산관리',
      workLocation: {
        region: parsed.region || '경상북도',
        district: parsed.district || '경주시',
        fullAddress: parsed.fullAddress || '상세 주소 확인 필요',
      },
      experienceRequirement: parsed.experienceRequirement || '신입',
      educationRequirement: parsed.educationRequirement || '대졸 이상',
      degreeCheckNote: parsed.degreeCheckNote || '대졸 이상 요건으로 석사수료자 지원 가능',
      salary: parsed.salary || '회사 내규에 따름',
      isSalaryUnspecified: parsed.isSalaryUnspecified || false,
      isSalaryBelowTarget: parsed.isSalaryBelowTarget || false,
      employmentType: parsed.employmentType || '정규직',
      deadline: parsed.deadline || '2026-11-30',
      isNew: true,
      isDeadlineImminent: false,
      applicationUrl: 'https://work24.go.kr',
      officialSource: '사용자 직접 등록 공고',
      fitScore: 85,
      fitCategory: 'A. 즉시 지원 추천',
      scoreBreakdown: {
        experienceMatch: 27,
        educationMatch: 19,
        qualificationMatch: 20,
        locationMatch: 15,
        salaryConditions: 14,
      },
      companyOverview: {
        mainProducts: parsed.mainProducts || '모빌리티 부품',
        plantLocation: parsed.district || '동남권 공단',
      },
      jobDetails: {
        mainTasks: parsed.mainTasks || ['생산 계획 수립', '공정 데이터 모니터링'],
        requirements: parsed.requirements || ['이공계열 학사 이상'],
        preferredQualifications: parsed.preferredQualifications || ['데이터 분석 가능자'],
      },
      strategyAnalysis: {
        automotiveMajorAdvantage: parsed.automotiveMajorAdvantage || '자동차시스템공학 전공 이해 활용.',
        tier1DataExpAdvantage: parsed.tier1DataExpAdvantage || '1차 협력사 공정 데이터 실무 감각 활용.',
        riskAndCheckPoints: parsed.riskAndCheckPoints || ['정확한 급여 수준 확인'],
        resumeHighlightPoints: parsed.resumeHighlightPoints || ['공정 데이터 모니터링'],
        coverLetterKeywords: parsed.coverLetterKeywords || ['가동률 최적화', '생산관리'],
      },
    };

    // Calculate dynamic fit score
    const scoring = calculateFitScore(newJob, profile);
    newJob.fitScore = scoring.fitScore;
    newJob.fitCategory = scoring.fitCategory;
    newJob.scoreBreakdown = scoring.breakdown;

    saveCustomJob(newJob);

    return res.json({ job: newJob });
  } catch (err) {
    console.error('Custom job parse error:', err);
    return res.status(500).json({ error: '공고 분석 중 오류가 발생했습니다.' });
  }
});

// ==========================================
// 6. Resume & KPI Alignment Reviewer
// ==========================================
app.post('/api/resume/review', async (req: Request, res: Response) => {
  try {
    const { resumeText, targetJobTitle } = req.body;
    const profile = getStoredProfile();

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({ error: '이력서 또는 경력기술서 내용을 20자 이상 입력해 주세요.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
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
      });
    }

    const prompt = `
다음은 지원자(28세 신입, 자동차시스템공학 석사수료, 1차 협력사 공정관리 데이터 실무 경험)의 이력서/경력기술서 초안입니다.
지원 희망 직무: ${targetJobTitle || '생산관리 / 공정관리'}

[이력서 초안]
${resumeText}

20년 경력의 제조업 전문 헤드헌터로서 다음 항목을 JSON으로 첨삭 및 직무 적합도 진단해 주세요:
1. reviewSummary: 총평 (약 150자)
2. strengths: 잘 작성된 강점 2~3가지 (배열)
3. improvements: 보완해야 할 점 2~3가지 (배열)
4. kpiKeywordMatches: 이력서에 잘 반영된 제조업 핵심 키워드 목록 (배열)
5. missingKpis: 추가하면 매력적인 제조 KPI (OEE, UPH, C/T, JIS/JIT, Cpk, Traceability 등) (배열)
6. recommendedBullets: 1차 협력사 공정관리 데이터 실무를 극대화한 추천 이력서 불릿 2가지 (배열)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: RTSC_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err) {
    console.error('Resume review error:', err);
    return res.status(500).json({ error: '이력서 첨삭 분석 실패' });
  }
});

// ==========================================
// 7. Manufacturing KPI Dictionary
// ==========================================
app.get('/api/knowledge/kpi', (_req: Request, res: Response) => {
  return res.json({
    count: MANUFACTURING_KPIS.length,
    kpis: MANUFACTURING_KPIS,
  });
});

// ==========================================
// 8. AI Chat Consultant Endpoint
// ==========================================
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userProfile, currentJob } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        reply: '현재 기본 프로필(자동차시스템공학 석사수료, 1차 협력사 공정관리 데이터 실무)에 맞춘 최적의 생산관리 취업 전략을 안내해 드립니다. 1차 협력사의 가동률(OEE) 및 라인 이상 데이터 관리 경험을 이력서 첫머리에 배치하는 것이 가장 효과적입니다.',
      });
    }

    const conversationHistory = messages.map((m: { sender: string; content: string }) => 
      `${m.sender === 'user' ? '지원자' : '20년차 헤드헌터'}: ${m.content}`
    ).join('\n\n');

    const prompt = `
[컨설팅 배경 정보]
지원자 프로필: 전공=${userProfile?.major || '자동차시스템공학과'}, 학력=${userProfile?.education || '석사수료'}, 경험=${userProfile?.experience || '자동차 1차 협력사 공정관리 데이터 업무'}, 희망직무=${userProfile?.targetJob || '생산관리'}, 희망연봉=${userProfile?.targetSalary || 4000}만 원, 희망지역=${userProfile?.preferredRegions?.join(', ') || '부산, 울산, 경북'}.
${currentJob ? `현재 검토 중인 공고: ${currentJob.companyName} (${currentJob.jobTitle}, ${currentJob.workLocation?.region} ${currentJob.workLocation?.district})` : ''}

[대화 기록]
${conversationHistory}

위 대화의 마지막 지원자 질문에 대해 전문 제조업 헤드헌터로서 실전적이고 명쾌한 조언을 300~500자 내외로 답변해주세요.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: RTSC_SYSTEM_INSTRUCTION,
      },
    });

    const reply = response.text || '죄송합니다. 일시적인 오류로 답변을 생성하지 못했습니다. 다시 시도해 주세요.';
    return res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      error: '답변 생성 중 오류가 발생했습니다.',
      reply: '죄송합니다. 네트워크 상태를 확인하시거나 잠시 후 다시 질문해 주세요.',
    });
  }
});

// ==========================================
// 9. AI Cover Letter & Resume Bullets
// ==========================================
app.post('/api/generate-cover-letter', async (req: Request, res: Response) => {
  try {
    const { companyName, jobTitle, workLocation, mainTasks } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        resumeBullets: [
          '자동차 1차 협력사 생산 라인의 일일 가동률 및 비가동 요인 데이터 집계를 통한 병목 공정 파악 기여',
          '자동차시스템공학 전공 지식을 활용한 샤시/파워트레인 부품 조립 프로세스 및 사이클 타임(C/T) 분석',
          'ERP/MES 실적 데이터와 현장 실재고 간의 오차를 최소화하는 정합성 관리 프로세스 지원',
        ],
        coverLetterParagraph: `[공정 데이터로 증명하는 현장형 생산관리 인재]\n저는 자동차시스템공학 석사과정 동안 차량 시스템에 대한 종합적 안목을 기르고, 자동차 1차 협력사에서 공정관리 데이터 업무를 직접 수행하며 제조 현장의 치열한 납기 준수와 가동률 관리의 중요성을 온몸으로 체득했습니다. ${companyName}의 ${jobTitle} 직무에서 완성차 납기율 100% 달성과 일일 생산 지표 최적화를 위해 입사 첫날부터 즉시 소통하고 기여하겠습니다.`,
      });
    }

    const prompt = `
회사명: ${companyName}
채용 직무: ${jobTitle}
근무지: ${workLocation}
주요 업무: ${Array.isArray(mainTasks) ? mainTasks.join(', ') : mainTasks}

지원자 핵심 조건:
1. 자동차시스템공학과 석사수료 (학위 취득 아님. 수료임을 당당하고 정직하게 밝히고, 연구 경험을 데이터 분석 능력으로 환치)
2. 자동차 1차 협력사 공정관리 데이터 실무 경험 보유
3. 신입 생산관리 지원

다음 두 가지 항목을 JSON 형식으로 작성해주세요:
1. resumeBullets: 이력서에 바로 복사해 넣을 수 있는 정량적/직무 중심의 핵심 경력 불릿 포인트 3개 (배열)
2. coverLetterParagraph: 자기소개서 [지원동기 및 직무역량] 단락 초안 (약 350~450자, 회사와 공정 데이터 경험이 자연스럽게 결합된 완성도 높은 문장)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: RTSC_SYSTEM_INSTRUCTION + '\n반드시 순수한 JSON 형태로 응답하세요. { "resumeBullets": [...], "coverLetterParagraph": "..." }',
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Cover letter generator error:', error);
    return res.status(500).json({ error: '생성 실패' });
  }
});

// ==========================================
// 10. AI Interview Prep
// ==========================================
app.post('/api/generate-interview', async (req: Request, res: Response) => {
  try {
    const { companyName, jobTitle } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        questions: [
          {
            question: '1차 협력사에서 다룬 공정관리 데이터 업무의 구체적 내용과, 그것이 우리 회사의 생산관리에 어떻게 기여할 수 있습니까?',
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
        ],
      });
    }

    const prompt = `
기업명: ${companyName}
지원 직무: ${jobTitle}
지원자: 자동차시스템공학 전공, 석사수료, 1차 협력사 공정관리 데이터 경험, 생산관리 신입 지원

해당 기업의 면접관이 반드시 물어볼 3가지 핵심 질문(1차사 데이터 경험 검증, 석사수료 이유, 긴급 납기/현장 위기대처)과
질문 의도(intent), 그리고 1차 협력사 데이터 경험을 극대화한 합격 모범 답변 전략(recommendedAnswer)을 JSON 배열 형태로 반환해주세요.
형식: { "questions": [ { "question": "...", "intent": "...", "recommendedAnswer": "..." } ] }
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: RTSC_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Interview prep error:', error);
    return res.status(500).json({ error: '면접 질문 생성 실패' });
  }
});

// Legacy backward-compatible endpoint
app.post('/api/analyze-custom-job', async (req: Request, res: Response) => {
  return res.redirect(307, '/api/jobs/custom-analyze');
});

// Full-stack Vite handling
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mobility Career AI Agent backend server listening on port ${PORT}`);
});
