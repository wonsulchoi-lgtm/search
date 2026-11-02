import { JobPosting, CandidateProfile } from '../types';

export const INITIAL_CANDIDATE_PROFILE: CandidateProfile = {
  major: '자동차시스템공학과',
  age: 28,
  education: '석사수료 (자동차시스템공학)',
  isMasterDegreeConferred: false, // 석사수료 (학위 취득 아님)
  experience: '자동차 1차 협력사 공정관리 데이터 관련 업무',
  careerType: '신입',
  targetJob: '생산관리',
  preferredRegions: ['부산광역시', '울산광역시', '경상북도'],
  includeGyeongnam: false,
  targetSalary: 4000, // 4,000만 원
  certifications: [],
  toolsAndSkills: [],
  employmentTypePref: '정규직 우선',
};

export const INITIAL_JOB_POSTINGS: JobPosting[] = [
  {
    id: 'mobis-ulsan-2026-01',
    rank: 1,
    companyName: '현대모비스 (울산공장)',
    industry: '전동화/배터리',
    jobTitle: '전동화 PE시스템 및 배터리팩 생산관리 신입 채용',
    jobCategory: '핵심: 생산관리',
    workLocation: {
      region: '울산광역시',
      district: '북구',
      fullAddress: '울산광역시 북구 효문동 현대모비스 울산전동화공장',
    },
    experienceRequirement: '신입',
    educationRequirement: '4년제 대졸 이상 (기졸업자 및 석사수료 지원 가능)',
    degreeCheckNote: '대졸 이상 요건으로 석사수료자도 지원 자격 충족 (학위 필수 조항 없음)',
    salary: '세전 4,600만 원 수준 (성과급 별도)',
    isSalaryUnspecified: false,
    isSalaryBelowTarget: false,
    employmentType: '정규직',
    deadline: '2026-11-08',
    isNew: true, // 최근 24시간 이내
    isDeadlineImminent: false,
    applicationUrl: 'https://recruit.hyundaimobis.com',
    officialSource: '현대모비스 공식 채용포털',
    fitScore: 96,
    fitCategory: 'A. 즉시 지원 추천',
    scoreBreakdown: {
      experienceMatch: 30, // 1차사 공정데이터 -> 전동화 라인 실적관리와 최상 연계
      educationMatch: 20, // 자동차시스템공학 전공 100% 일치
      qualificationMatch: 20, // 신입 정규직 지원 요건 완벽 충족
      locationMatch: 15, // 울산 북구 최우선 권역
      salaryConditions: 15, // 4,600만 원으로 희망 연봉 상회
    },
    companyOverview: {
      mainProducts: '전기차 E-GMP 구동모터(PE), 인버터, BSA(배터리팩 시스템)',
      annualRevenue: '59조 2,500억 원 (연결 기준)',
      employeeCount: '약 11,500명',
      plantLocation: '울산광역시 북구 효문동 / 이화산단 전동화 거점',
    },
    jobDetails: {
      mainTasks: [
        '전동화(모터/인버터/배터리팩) 조립 라인 일/주간/월간 생산계획 수립 및 실적 모니터링',
        '생산 진도율 추적 및 공정 이상 발생 시 긴급 납기 대응(Line Stop 최소화)',
        'MES 및 공정 실적 데이터를 활용한 Cycle Time 편차 분석 및 병목 공정 개선',
        '완성차 울산공장 직서열(JIS/JIT) 납품 계획 동기화 및 완성품 재고 회전율 관리',
      ],
      requirements: [
        '학사 이상 (자동차공학, 기계공학, 산업공학 계열 전공자)',
        '2026년 12월부터 정상 근무 가능한 자',
        '제조 현장 교대 근무 조율 및 라인 커뮤니케이션 원활자',
      ],
      preferredQualifications: [
        '자동차 부품사 또는 모빌리티 제조 현장 실습/인턴/데이터 업무 유경험자',
        'MES/ERP 생산정보시스템 활용 경험자 및 공정 데이터 분석 툴 활용 가능자',
        '인근 거주자 (울산/경주/부산 출퇴근 가능자) 우대',
      ],
    },
    strategyAnalysis: {
      automotiveMajorAdvantage: '전기차 전동화 시스템 구조와 차량 서브시스템에 대한 이해도가 높아 현장 반장/엔지니어와의 직서열 생산 논의 시 기술적 소통 비용을 획기적으로 줄일 수 있음.',
      tier1DataExpAdvantage: '1차 협력사에서 다룬 공정관리 데이터는 현대모비스의 엄격한 완성차 납기율(OTD) 및 공정 가동률(OEE) 관리와 직접 맞닿아 있어 즉시 전력감으로 소구가 가능함.',
      riskAndCheckPoints: [
        '석사수료인 점을 명시하되 학위 미취득 이유에 대한 변명보다 연구실 및 데이터 실무에서 쌓은 현장 분석 역량을 전면에 배치할 것.',
        '완성차와의 직서열(JIT) 납품 프레셔를 견딜 수 있는 책임감과 현장 친화력을 어필해야 함.',
      ],
      resumeHighlightPoints: [
        '자동차 1차 협력사 공정 데이터 모니터링을 통한 생산 지연 요인 식별 및 가동률 개선 기여 경험',
        '자동차시스템공학 전공 지식을 기반으로 한 전동화 파워트레인 조립 공정 플로우 이해도',
        '데이터 기반의 일일 생산 실적 집계 및 제조 KPI 추적 프로세스 구축 경험',
      ],
      coverLetterKeywords: ['JIS/JIT 직서열 공급 신뢰성', '공정 데이터 기반 OEE 가동률 최적화', '완성차-협력사 공급망 연계 마인드'],
    },
  },
  {
    id: 'sl-gyeongsan-2026-02',
    rank: 2,
    companyName: '에스엘(SL) (경산본사)',
    industry: '1차협력사',
    jobTitle: '미래모빌리티 램프/전장 모듈 생산관리 신입사원 채용',
    jobCategory: '핵심: 생산관리',
    workLocation: {
      region: '경상북도',
      district: '경산시',
      fullAddress: '경상북도 경산시 진량공단 본사 및 생산공장',
    },
    experienceRequirement: '신입',
    educationRequirement: '4년제 대졸 이상 (전공: 공학계열 우대, 석사수료 지원 가능)',
    degreeCheckNote: '석사수료자 지원 가능 (대졸 이상 요건 충족)',
    salary: '세전 4,300만 원 (성과급 및 복리후생 별도)',
    isSalaryUnspecified: false,
    isSalaryBelowTarget: false,
    employmentType: '정규직',
    deadline: '2026-11-04',
    isNew: false,
    isDeadlineImminent: true, // 3일 이내 마감 임박!
    applicationUrl: 'https://slworld.recruiter.co.kr',
    officialSource: '에스엘 채용 공식 홈페이지',
    fitScore: 94,
    fitCategory: 'A. 즉시 지원 추천',
    scoreBreakdown: {
      experienceMatch: 30, // 1차 협력사 문화 및 공정관리 데이터 완벽 호환
      educationMatch: 20, // 자동차시스템공학 전공 최우대
      qualificationMatch: 20, // 신입 정규직 자격 적합
      locationMatch: 15, // 경북 경산시 (핵심 탐색 지역)
      salaryConditions: 15, // 4,300만 원 (목표 4,000만 원 충족)
    },
    companyOverview: {
      mainProducts: '지능형 헤드램프(IFS), 차량용 전장 모듈, E-Shifter(전자식 변속 레버)',
      annualRevenue: '4조 8,000억 원 수준의 글로벌 1차 협력사',
      employeeCount: '약 4,500명',
      plantLocation: '경북 경산시 진량읍 본사공장 / 대구 연구소',
    },
    jobDetails: {
      mainTasks: [
        'LED 헤드램프 및 전장모듈 자동화 라인 생산 스케줄링 및 CAPA 분석',
        '협력업체 부품 수급 상황 점검 및 사내 생산 라인별 자재 불출 동기화',
        '일일 공정 불량률 및 가동률 데이터 집계, 공정 트렌드 분석 보고',
        '신차 양산(SOP) 일정에 따른 초기 유동수 관리 및 양산 ramp-up 지원',
      ],
      requirements: [
        '자동차/기계/산업/전자공학 관련 전공 학사 이상 학력 소지자',
        '제조 데이터 분석 및 오피스 프로그램(Excel 고급 수식/피벗) 활용 능숙자',
        '적극적인 커뮤니케이션과 협업 태도를 지닌 자',
      ],
      preferredQualifications: [
        '자동차 1차/2차 협력사 생산/공정/품질 데이터 관련 실무 또는 프로젝트 경험자',
        '통계적 공정관리(SPC) 기초 이해자 및 공정능력지수(Cpk) 분석 경험자',
      ],
    },
    strategyAnalysis: {
      automotiveMajorAdvantage: '자동차 부품의 신뢰성 시험 규격과 전장화 시스템 메커니즘을 전공으로 학습하여 램프/전장 부품 조립 불량 원인을 신속하게 이해할 수 있음.',
      tier1DataExpAdvantage: '이미 1차 협력사의 조직 문화와 납기 긴장감, 공정 데이터 흐름을 체득했으므로 입사 후 OJT 기간을 대폭 단축할 수 있는 가장 확실한 무기.',
      riskAndCheckPoints: [
        '마감일(2026-11-04)이 3일 이내로 임박하였으므로 즉시 서류 접수 준비가 필수적임.',
        '진량공단 통근 또는 인근(대구/경산) 거주 계획을 자기소개서에 간략히 언급하면 안정성 측면에서 가점.',
      ],
      resumeHighlightPoints: [
        '1차 협력사 현장에서 일일 공정 데이터를 집계하며 터득한 이상 원인 추적 경험',
        '양산 라인의 병목(Bottleneck) 공정 개선을 위한 생산실적 지표 관리 기여',
        '자동차 부품 특성에 따른 철저한 선입선출(FIFO) 및 재고 관리 마인드',
      ],
      coverLetterKeywords: ['1차 협력사 공정 데이터 실전 감각', '양산 램프업(Ramp-up) 대응력', '공정 트렌드 분석을 통한 불량 예방'],
    },
  },
  {
    id: 'hlmando-gyeongju-2026-03',
    rank: 3,
    companyName: 'HL만도 (경주/울산공장)',
    industry: '모빌리티첨단부품',
    jobTitle: '샤시 전동화(전동브레이크 IDB/EPS) 생산운영 및 공정관리 신입',
    jobCategory: '핵심: 생산관리',
    workLocation: {
      region: '경상북도',
      district: '경주/울산 인접지',
      fullAddress: '경상북도 경주시 외동공단 HL만도 생산공장 (울산 북구 연접)',
    },
    experienceRequirement: '신입',
    educationRequirement: '대졸 이상 (석사수료 지원 가능, 학사 이상 요건)',
    degreeCheckNote: '기본 자격 대졸 이상으로 석사수료자 지원 결격사유 없음',
    salary: '세전 4,500만 원 (인센티브 별도)',
    isSalaryUnspecified: false,
    isSalaryBelowTarget: false,
    employmentType: '정규직',
    deadline: '2026-11-12',
    isNew: true, // 24시간 신규
    isDeadlineImminent: false,
    applicationUrl: 'https://mando.recruiter.co.kr',
    officialSource: 'HL 그룹 채용포털',
    fitScore: 92,
    fitCategory: 'A. 즉시 지원 추천',
    scoreBreakdown: {
      experienceMatch: 29, // 브레이크/조향 정밀 가공 및 전자조립 라인 데이터 연계
      educationMatch: 20, // 자동차시스템공학 전공 적합
      qualificationMatch: 20, // 신입 정규직 지원 요건
      locationMatch: 15, // 경북 경주 외동 (울산 북구 생활권)
      salaryConditions: 15, // 4,500만 원 (희망 연봉 초과 충족)
    },
    companyOverview: {
      mainProducts: '통합형 전동 부스터(IDB), 전자제어 조향장치(EPS), 자율주행 액추에이터',
      annualRevenue: '8조 2,000억 원 글로벌 Tier-1',
      employeeCount: '약 4,000명',
      plantLocation: '경북 경주시 외동읍 구어공단 (울산 호계/매곡 인접)',
    },
    jobDetails: {
      mainTasks: [
        '전동화 브레이크/샤시 부품 라인의 일일 생산 진도 관리 및 가동 분석',
        '공정별 설비 가동 효율(OEE) 및 비가동 사유(설비 고장, 품절, 셋업) 정량 데이터화',
        'ERP 생산지시 발행 및 작업지시서 발행, 완성품 검사 완료 데이터 승인 관리',
        '고객사(현대차/기아/글로벌 OEM) 발주량 변동에 따른 생산 계획 유연 대응',
      ],
      requirements: [
        '자동차공학, 기계공학 등 관련 학사 이상 학위 또는 동등 자격자',
        '생산공정 지표 관리 및 수리적 데이터 분석 감각 보유자',
        '원활한 대인관계 및 부서 간(생산기술/품질/자재) 소통 능력자',
      ],
      preferredQualifications: [
        '자동차 전장 및 전동화 부품 제조 공정 실습 또는 데이터 관리 경험자',
        'Minitab, Excel VBA, SQL 등 데이터 처리 툴 기초 역량 보유자 우대',
      ],
    },
    strategyAnalysis: {
      automotiveMajorAdvantage: '브레이크와 조향 시스템은 차량 주행 안전과 직결되므로 자동차시스템 전공자가 갖는 안전 설계 및 기능 이해도가 생산 현장 품질 의식과 직결됨.',
      tier1DataExpAdvantage: '1차사에서 경험한 데이터 관리 이력은 설비 비가동 요인을 세분화하고 라인 밸런싱을 조율하는 실무적 기반으로 크게 평가받을 수 있음.',
      riskAndCheckPoints: [
        '글로벌 OEM 공급망과 연계되어 높은 품질 기준(Zero Defect)을 강조하므로 자소서에 공정 데이터 누락 방지 및 정밀성을 어필해야 함.',
      ],
      resumeHighlightPoints: [
        '공정 비가동 요인 분석을 통한 비효율 제거 및 생산량 목표 달성 서포트 경험',
        '자동차 안전 부품의 공정 검사 데이터 추적성(Traceability) 관리 중요성 체득',
        '다품종 혼류 생산 라인에서의 자재 수급 및 생산 지시 프로세스 이해',
      ],
      coverLetterKeywords: ['Traceability(공정 추적성) 관리', 'Zero-Defect 생산 철학', '설비 가동 효율(OEE) 극대화'],
    },
  },
  {
    id: 'samkee-gyeongju-2026-04',
    rank: 4,
    companyName: '삼기 (SAMKEE) (경주안강공장)',
    industry: '전동화/배터리',
    jobTitle: '전기차 모터하우징 및 알루미늄 다이캐스팅 생산관리 신입',
    jobCategory: '핵심: 생산관리',
    workLocation: {
      region: '경상북도',
      district: '경주시',
      fullAddress: '경상북도 경주시 안강읍 검단일반산업단지 삼기 경주공장',
    },
    experienceRequirement: '신입',
    educationRequirement: '초대졸 이상 (대졸 및 석사수료 적극 환영)',
    degreeCheckNote: '초대졸/대졸 요건이므로 석사수료자의 학력 조건 전혀 문제 없음',
    salary: '세전 4,100만 원 (신입 초봉 기준)',
    isSalaryUnspecified: false,
    isSalaryBelowTarget: false,
    employmentType: '정규직',
    deadline: '2026-11-15',
    isNew: false,
    isDeadlineImminent: false,
    applicationUrl: 'https://samkee.recruiter.co.kr',
    officialSource: '사람인 / 잡코리아 삼기 공식 채용관',
    fitScore: 88,
    fitCategory: 'A. 즉시 지원 추천',
    scoreBreakdown: {
      experienceMatch: 27,
      educationMatch: 19,
      qualificationMatch: 20,
      locationMatch: 15,
      salaryConditions: 15, // 4,100만 원 (4,000만 원 이상)
    },
    companyOverview: {
      mainProducts: '전기차 전용 알루미늄 다이캐스팅 모터 하우징, 감속기 케이스, 배터리 엔드플레이트',
      annualRevenue: '6,200억 원 규모',
      employeeCount: '약 900명',
      plantLocation: '경북 경주시 안강읍 / 포항 인접',
    },
    jobDetails: {
      mainTasks: [
        '주조(다이캐스팅) 및 정밀 가공 라인의 생산 실적 일일 마감 및 원단위 관리',
        '금형 교체(C/O) 시간 단축 및 라인 가동 계획 편성',
        '현대차 울산공장 및 현대모비스 납품 출하 일정 및 안전재고 일치화',
      ],
      requirements: ['공학계열 전공자', '제조 현장 이해도 및 책임감', '신입 지원자'],
      preferredQualifications: ['자동차 부품사 실무 유경험자', '경주/포항/울산 인근 거주자 우대'],
    },
    strategyAnalysis: {
      automotiveMajorAdvantage: '주조-가공-조립으로 이어지는 파워트레인 부품 특성을 이해하여 생산량 변동 시 유연한 생산 스케줄링 가능.',
      tier1DataExpAdvantage: '공정 데이터 입력의 정확성과 집계 속도가 중요한 중견 1차 협력사에서 실무를 바로 맡을 수 있음.',
      riskAndCheckPoints: ['다이캐스팅 주조 공정 특유의 열악한 현장 환경에 대한 적응력과 현장 소통 의지를 피력할 것.'],
      resumeHighlightPoints: ['공정별 생산 데이터 취합 및 재고 차이(GAP) 0% 달성 노력', '현장 작업자와의 원활한 소통을 통한 실적 데이터 정확도 개선'],
      coverLetterKeywords: ['원단위 실적 관리', '라인 가동 효율(C/O 시간 단축)', '안전재고 최적화'],
    },
  },
  {
    id: 'iljiteck-gyeongju-2026-05',
    rank: 5,
    companyName: '일지테크 (경주/경산공장)',
    industry: '1차협력사',
    jobTitle: '현대차 EV 차체 경량화 부품 생산기획 및 공정관리 신입',
    jobCategory: '연관: 공정관리',
    workLocation: {
      region: '경상북도',
      district: '경주시/경산시',
      fullAddress: '경북 경주시 건천산업단지 및 경산시 남산공단',
    },
    experienceRequirement: '신입',
    educationRequirement: '대졸 이상 (이공계열 전공 우대, 석사수료 가능)',
    degreeCheckNote: '대졸 요건이므로 석사수료로 정상 지원 가능',
    salary: '세전 4,000만 원 (연봉 기준 충족)',
    isSalaryUnspecified: false,
    isSalaryBelowTarget: false,
    employmentType: '정규직',
    deadline: '2026-11-10',
    isNew: true, // 24시간 신규
    isDeadlineImminent: false,
    applicationUrl: 'https://iljiteck.co.kr/recruit',
    officialSource: '일지테크 공식 채용 홈페이지',
    fitScore: 86,
    fitCategory: 'A. 즉시 지원 추천',
    scoreBreakdown: {
      experienceMatch: 28,
      educationMatch: 19,
      qualificationMatch: 20,
      locationMatch: 15,
      salaryConditions: 14, // 4,000만 원 정확히 일치
    },
    companyOverview: {
      mainProducts: '전기차 차체 부품, 핫스탬핑 경량화 부품, 현대차 코나/아이오닉 차체 모듈',
      annualRevenue: '6,500억 원 코스닥 상장 1차 협력사',
      employeeCount: '약 1,100명',
      plantLocation: '경북 경주시 건천읍 / 경북 경산시',
    },
    jobDetails: {
      mainTasks: [
        '프레스/용접 조립 자동화 라인의 생산 실적 관리 및 MES 공정 데이터 모니터링',
        '일일 생산 계획 대비 실적 차이 원인 분석(설비 트러블, 금형 수리 등)',
        '완성차 서열(Sequence) 납품 계획 관리 및 일일 물동량 트래킹',
      ],
      requirements: ['4년제 대졸 이상', '자동차/기계/산업공학 전공', '신입'],
      preferredQualifications: ['자동차 1차 부품사 실습 또는 유사 데이터 업무 경험 우대'],
    },
    strategyAnalysis: {
      automotiveMajorAdvantage: '차체 강판 물성과 핫스탬핑 공정 매커니즘 이해.',
      tier1DataExpAdvantage: '프레스-용접-조립 연계 공정 데이터 흐름 관리 즉시 투입 가능.',
      riskAndCheckPoints: ['차체 프레스 라인의 빠른 템포와 서열 출하 압박에 대처하는 침착성을 강조할 것.'],
      resumeHighlightPoints: ['공정별 실적 집계 및 MES 데이터 정합성 유지 경험', '생산 차질 요인 사전 감지 및 현장 피드백'],
      coverLetterKeywords: ['MES 생산 모니터링', '핫스탬핑 차체 공정', '서열 납기 준수'],
    },
  },
  {
    id: 'donghee-ulsan-2026-06',
    rank: 6,
    companyName: '동희산업 (울산공장)',
    industry: '전동화/배터리',
    jobTitle: '친환경차 배터리팩 케이스 및 서스펜션 공정관리/생산관리 신입',
    jobCategory: '핵심: 생산관리',
    workLocation: {
      region: '울산광역시',
      district: '북구',
      fullAddress: '울산광역시 북구 매곡산업단지 동희산업 울산공장',
    },
    experienceRequirement: '신입',
    educationRequirement: '대졸 이상 (석사수료 가능)',
    degreeCheckNote: '석사수료자 지원 가능',
    salary: '세전 4,150만 원',
    isSalaryUnspecified: false,
    isSalaryBelowTarget: false,
    employmentType: '정규직',
    deadline: '2026-11-09',
    isNew: false,
    isDeadlineImminent: false,
    applicationUrl: 'https://donghee.co.kr',
    officialSource: '동희그룹 채용사이트',
    fitScore: 85,
    fitCategory: 'A. 즉시 지원 추천',
    scoreBreakdown: {
      experienceMatch: 27,
      educationMatch: 18,
      qualificationMatch: 20,
      locationMatch: 15,
      salaryConditions: 15,
    },
    companyOverview: {
      mainProducts: 'EV 배터리팩 케이스(BPC), 연료탱크, 페달, 서스펜션 모듈',
      annualRevenue: '1조 4,000억 원',
      employeeCount: '약 1,800명',
      plantLocation: '울산 북구 매곡동',
    },
    jobDetails: {
      mainTasks: [
        '배터리팩 케이스 조립 라인의 생산 계획 수립 및 가동률 지표 관리',
        '원소재(알루미늄 프로파일) 입고부터 완제품 출하까지의 공정 리드타임 관리',
        '공정별 불량 데이터 통계 분석 및 수율 개선 회의 주관 서포트',
      ],
      requirements: ['학사 이상 졸업(예정)자', '자동차/기계공학 전공', '신입'],
      preferredQualifications: ['울산 거주자', '공정 데이터 분석 경험자'],
    },
    strategyAnalysis: {
      automotiveMajorAdvantage: '샤시 부품 및 배터리 패키징 구조 전공 지식 활용.',
      tier1DataExpAdvantage: '1차사 공정 데이터 업무에서 쌓은 수율 집계 및 원인 분석 역량 즉시 발휘.',
      riskAndCheckPoints: ['배터리팩 케이스의 기밀성(Leak) 시험 데이터 등 특수 품질 요구사항 숙지 필요.'],
      resumeHighlightPoints: ['공정 데이터 기반 수율 관리 및 실적 지표 개선 경험', '울산 지역 생산 거점에 대한 높은 로열티'],
      coverLetterKeywords: ['배터리팩 케이스 기밀 공정', '공정 리드타임 단축', '일일 수율 지표 관리'],
    },
  },
  {
    id: 'renault-busan-2026-07',
    rank: 7,
    companyName: '르노코리아 (부산공장)',
    industry: '완성차',
    jobTitle: '오로라 프로젝트 하이브리드/전기차 제조운영 및 생산관리 신입',
    jobCategory: '핵심: 생산관리',
    workLocation: {
      region: '부산광역시',
      district: '강서구',
      fullAddress: '부산광역시 강서구 르노삼성대로 61 르노코리아 부산공장',
    },
    experienceRequirement: '경력무관', // 신입 지원 가능
    educationRequirement: '학사 이상 (석사수료 지원 가능)',
    degreeCheckNote: '학사 이상 요건으로 석사수료자 지원 적합',
    salary: '세전 4,400만 원 (성과급 별도)',
    isSalaryUnspecified: false,
    isSalaryBelowTarget: false,
    employmentType: '정규직',
    deadline: '2026-11-18',
    isNew: false,
    isDeadlineImminent: false,
    applicationUrl: 'https://renaultkoream.recruiter.co.kr',
    officialSource: '르노코리아 공식 채용페이지',
    fitScore: 84,
    fitCategory: 'A. 즉시 지원 추천',
    scoreBreakdown: {
      experienceMatch: 25, // 완성차는 협력사 관리 및 대규모 조립 위주
      educationMatch: 20, // 자동차시스템공학 전공 완성차 공장에 최우선 부합
      qualificationMatch: 19, // 경력무관 (신입 지원 가능)
      locationMatch: 15, // 부산 강서구
      salaryConditions: 15, // 4,400만 원
    },
    companyOverview: {
      mainProducts: '그랑 콜레오스(오로라1 하이브리드), 아르카나, 폴스타4 위탁생산 및 신규 EV',
      annualRevenue: '3조 5,000억 원 완성차 제조사',
      employeeCount: '약 3,000명',
      plantLocation: '부산광역시 강서구 신호산업단지',
    },
    jobDetails: {
      mainTasks: [
        '혼류 생산 라인(다차종 동시 생산)의 생산 시퀀스 계획 수립 및 피치 타임(Pitch Time) 관리',
        '1차 협력사 부품 입고 동기화 및 라인 스톱 예방 모니터링',
        '생산성 지표(UPH, OEE) 일일 트래킹 및 개선 과제 도출',
      ],
      requirements: ['학사 이상 이공계열', '어학 기준 토익 700점 또는 오픽 IM 이상 (보유시 우대)', '신입/경력무관'],
      preferredQualifications: ['자동차공학 전공자', '혼류 생산 시스템 이해자', '공정 데이터 다뤄본 자'],
    },
    strategyAnalysis: {
      automotiveMajorAdvantage: '완성차 파워트레인 및 차량 종합 시스템 전공 이해를 바탕으로 라인 작업 공수 산정에 능함.',
      tier1DataExpAdvantage: '1차 협력사의 납품 메커니즘을 경험했으므로 반대로 완성차 입장에서 협력사 부품 수급 위험을 예측하고 관리하는 시각 보유.',
      riskAndCheckPoints: ['글로벌 완성차 특성상 어학 성적 요건 및 혼류 생산의 복잡성에 대한 대비 필요.'],
      resumeHighlightPoints: ['협력사-완성차 간 부품 납기 연계에 대한 구조적 이해', '혼류 생산 라인의 가동률 유지를 위한 데이터 분석 역량'],
      coverLetterKeywords: ['혼류 생산 시퀀스 최적화', 'UPH 생산성 관리', '완성차-협력사 상생 수급 마인드'],
    },
  },
  {
    id: 'ajin-gyeongsan-2026-08',
    rank: 8,
    companyName: '아진산업 (경산공장)',
    industry: '1차협력사',
    jobTitle: '전기차 스마트팩토리 공정관리 및 생산실적 데이터 신입',
    jobCategory: '확장: 생산기술/스마트팩토리',
    workLocation: {
      region: '경상북도',
      district: '경산시',
      fullAddress: '경상북도 경산시 진량읍 공단6로 아진산업 본사',
    },
    experienceRequirement: '신입',
    educationRequirement: '초대졸/대졸 (석사수료 지원 가능)',
    degreeCheckNote: '석사수료 지원 결격사유 없음',
    salary: '세전 3,900만 원 (목표 4,000만 원 소폭 하회)',
    isSalaryUnspecified: false,
    isSalaryBelowTarget: true, // 4천 미만 -> 조건 조정 검토 대상!
    employmentType: '정규직',
    deadline: '2026-11-06',
    isNew: false,
    isDeadlineImminent: false,
    applicationUrl: 'https://i-ajin.com/recruit',
    officialSource: '사람인 아진산업 전용 채용관',
    fitScore: 79,
    fitCategory: 'B. 검토 후 지원', // 조건 조정 검토
    scoreBreakdown: {
      experienceMatch: 28, // 공정관리 데이터 경험 매우 우대
      educationMatch: 18,
      qualificationMatch: 20,
      locationMatch: 15, // 경북 경산
      salaryConditions: 11, // 3,900만 원 감점 (조건 조정 검토)
    },
    companyOverview: {
      mainProducts: '현대차/기아 차체 패널, 전기차 서브프레임, 스마트 제조 라인',
      annualRevenue: '7,500억 원 글로벌 1차 협력사',
      employeeCount: '약 1,200명',
      plantLocation: '경북 경산시 진량공단',
    },
    jobDetails: {
      mainTasks: [
        '스마트팩토리 MES 데이터 수집 및 설비 센서 이상치 트래킹',
        '일일 용접/프레스 공정 실적 집계 및 제조 원가 데이터 분석',
        '라인 가동률 저하 요소 피드백 및 공정 개선 활동',
      ],
      requirements: ['대졸 이상 공학계열', '데이터 분석 및 오피스 역량', '신입'],
      preferredQualifications: ['제조 데이터 처리 경험자', '경산/대구 인근 거주자'],
    },
    strategyAnalysis: {
      automotiveMajorAdvantage: '차체 서브프레임 구조 및 동역학적 특성 이해.',
      tier1DataExpAdvantage: '공정관리 데이터 업무 경험이 스마트팩토리 실적 데이터 집계와 일치.',
      riskAndCheckPoints: [
        '연봉이 세전 3,900만 원으로 희망 기준(4,000만 원)에 100만 원 미달하나, 경산 본사의 안정성과 1차사 경력 축적 측면에서 적극 검토할 만함.',
      ],
      resumeHighlightPoints: ['스마트 제조 데이터 연계 공정관리 실무 적용력', '1차 협력사 특유의 일일 생산 마감 대응력'],
      coverLetterKeywords: ['스마트팩토리 MES 실적 관리', '공정 데이터 신뢰성 확보', '제조 원가 절감'],
    },
  },
  {
    id: 'sungwoo-busan-2026-09',
    rank: 9,
    companyName: '성우하이텍 (부산기장/양산공장)',
    industry: '1차협력사',
    jobTitle: '친환경 모빌리티 배터리시스템/차체 생산기술 및 공정관리 신입',
    jobCategory: '확장: 생산기술/스마트팩토리',
    workLocation: {
      region: '부산광역시',
      district: '기장군',
      fullAddress: '부산광역시 기장군 정관읍 / 경남 양산 연접 생산공장',
    },
    experienceRequirement: '신입',
    educationRequirement: '4년제 대졸 이상 (석사수료 지원 가능)',
    degreeCheckNote: '대졸 이상 요건으로 석사수료자 지원 가능',
    salary: '회사 내규에 따름 (연봉 미공개 - 추정 불가)',
    isSalaryUnspecified: true, // 연봉 미공개 (추정 금지 원칙!)
    isSalaryBelowTarget: false,
    employmentType: '정규직',
    deadline: '2026-11-20',
    isNew: false,
    isDeadlineImminent: false,
    applicationUrl: 'https://swhitech.recruiter.co.kr',
    officialSource: '성우하이텍 공식 채용페이지',
    fitScore: 78,
    fitCategory: 'B. 검토 후 지원',
    scoreBreakdown: {
      experienceMatch: 26,
      educationMatch: 19,
      qualificationMatch: 20,
      locationMatch: 15, // 부산 기장
      salaryConditions: 10, // 연봉 미공개에 따른 잠정 배점 (감점 아님, 미확인 표시)
    },
    companyOverview: {
      mainProducts: '배터리 케이스 시스템(BCA), 도어/후드/차체 차세대 경량 복합재',
      annualRevenue: '3조 9,000억 원 글로벌 탑티어 1차 협력사',
      employeeCount: '약 2,300명',
      plantLocation: '부산 기장군 정관 및 경남 양산',
    },
    jobDetails: {
      mainTasks: [
        '차체 및 배터리 시스템 조립 공정 플로우 설계 및 생산 준비',
        '자동화 로봇 라인 사이클 타임(C/T) 측정 및 공정 밸런싱(Line Balancing)',
        '초기 유동수 불량 데이터 집계 및 생산 라인 피드백',
      ],
      requirements: ['기계/자동차/항공/산업공학 등 이공계열 학사 이상', '신입'],
      preferredQualifications: ['CAD/CATIA 기초 및 공정 데이터 분석 경험 우대'],
    },
    strategyAnalysis: {
      automotiveMajorAdvantage: '자동차 차체 구조 및 경량 복합소재 특성 지식 보유.',
      tier1DataExpAdvantage: '1차사 공정 데이터를 다뤄본 실무 감각으로 라인 밸런싱 데이터 해석 용이.',
      riskAndCheckPoints: [
        '공식 공고상 연봉이 "회사 내규에 따름"으로 미공개되어 있으므로 면접 및 최종 처우 협의 단계에서 4,000만 원 충족 여부 확인 필요.',
        '직무가 생산관리와 생산기술이 결합된 형태이므로 현장 엔지니어링 역량 어필 요망.',
      ],
      resumeHighlightPoints: ['공정 데이터 기반의 병목 공정 파악 및 라인 효율화 아이디어 도출', '배터리 케이스 차체 조립 공정 매커니즘 이해'],
      coverLetterKeywords: ['배터리 시스템 공정 밸런싱', '사이클 타임 단축', '1차 협력사 품질 정합성'],
    },
  },
  {
    id: 'kumyang-busan-2026-10',
    rank: 10,
    companyName: '금양 (부산 사상/기장 드림팩토리)',
    industry: '전동화/배터리',
    jobTitle: '원통형 4695 배터리 셀 제조운영 및 MES 공정관리 신입/경력',
    jobCategory: '확장: 생산기술/스마트팩토리',
    workLocation: {
      region: '부산광역시',
      district: '사상구/기장군',
      fullAddress: '부산광역시 사상구 낙동대로 / 기장군 장안읍 드림팩토리2',
    },
    experienceRequirement: '신입/경력',
    educationRequirement: '대졸 이상 (배터리/화학/소재/기계 관련 석사 우대)',
    degreeCheckNote: '⚠️ 우대사항에 "석사 우대"가 명시되어 있으나 "석사수료"이므로 석사 학위 보유자로 표기하지 말 것! (대졸 기본 요건으로 신입 지원 가능)',
    isQualificationWarning: true, // 주의사항 배지
    salary: '세전 4,200만 원 수준',
    isSalaryUnspecified: false,
    isSalaryBelowTarget: false,
    employmentType: '정규직',
    deadline: '2026-11-25',
    isNew: false,
    isDeadlineImminent: false,
    applicationUrl: 'https://kyb.co.kr/recruit',
    officialSource: '사람인 금양 채용공고',
    fitScore: 76,
    fitCategory: 'C. 경력 전환 및 역량 확장',
    scoreBreakdown: {
      experienceMatch: 24, // 자동차 1차 데이터 -> 2차전지 셀 제조로의 도메인 확장
      educationMatch: 17, // 자동차시스템공학 (배터리 시스템과 연계 가능하나 화학/소재 대비 차이)
      qualificationMatch: 17, // 석사 우대 항목에서 수료 상태 정확한 소명 필요
      locationMatch: 15, // 부산 사상/기장
      salaryConditions: 15, // 4,200만 원 (기준 상회)
    },
    companyOverview: {
      mainProducts: '원통형 2170 및 4695 이차전지 셀, 리튬 가공 소재',
      annualRevenue: '이차전지 양산 라인 가동 본격화 기업',
      employeeCount: '약 800명',
      plantLocation: '부산 기장군 장안읍 동남권의과학산단 / 사상공장',
    },
    jobDetails: {
      mainTasks: [
        '배터리 셀 조립/화성(Forming) 공정 생산 운영 및 일일 목표 수량 달성 관리',
        'MES 시스템 기반 배터리 전극/조립 이력 데이터 추적 및 불량 로트(Lot) 분리',
        '제조 현장 작업자 안전 수칙 및 클린룸(Clean Room) 가동 환경 관리',
      ],
      requirements: ['이공계열 학사 이상', '배터리 제조에 관심 있는 신입'],
      preferredQualifications: ['배터리 또는 모빌리티 제조 유경험자', '데이터 관리 툴 활용 우수자'],
    },
    strategyAnalysis: {
      automotiveMajorAdvantage: '완성차 EV 팩에 탑재되는 셀의 작동 환경과 열관리 시스템의 중요성을 자동차시스템 공학적 관점에서 설명 가능.',
      tier1DataExpAdvantage: '자동차 1차사 특유의 엄격한 불량 추적성(Lot Traceability) 데이터 관리 노하우를 배터리 셀 공정에 접목 가능.',
      riskAndCheckPoints: [
        '필수 해석 원칙: 석사 우대 조항에 대해 "석사수료"임을 이력서에 정확히 명시하고 연구 수행 경험을 실무적 데이터 처리 역량으로 치환해 기술할 것.',
      ],
      resumeHighlightPoints: ['제조 공정 Lot Traceability 데이터 관리 및 이력 추적 경험', 'EV 배터리 팩과의 연계를 고려한 배터리 셀 제조 품질 의식'],
      coverLetterKeywords: ['배터리 셀 Lot 추적성', '클린룸 공정 신뢰성', '자동차 1차사 데이터 프로세스'],
    },
  },
];

// Expanded postings for Gyeongnam (양산/창원/김해) if toggled
export const GYEONGNAM_EXPANDED_POSTINGS: JobPosting[] = [
  {
    id: 'gmb-changwon-exp-01',
    rank: 11,
    companyName: '지엠비코리아 (창원공장)',
    industry: '전동화/배터리',
    jobTitle: '친환경차 전동식 워터펌프(EWP) 생산관리 신입',
    jobCategory: '핵심: 생산관리',
    workLocation: {
      region: '경상남도',
      district: '창원시',
      fullAddress: '경상남도 창원시 성산구 정동로 지엠비코리아',
    },
    experienceRequirement: '신입',
    educationRequirement: '대졸 이상 (석사수료 지원 가능)',
    degreeCheckNote: '대졸 이상 요건 충족',
    salary: '세전 4,250만 원',
    isSalaryUnspecified: false,
    isSalaryBelowTarget: false,
    employmentType: '정규직',
    deadline: '2026-11-14',
    isNew: false,
    isDeadlineImminent: false,
    applicationUrl: 'https://gmb.co.kr/recruit',
    officialSource: '지엠비코리아 채용사이트',
    fitScore: 83,
    fitCategory: 'A. 즉시 지원 추천',
    scoreBreakdown: {
      experienceMatch: 26,
      educationMatch: 19,
      qualificationMatch: 20,
      locationMatch: 13, // 경남 확장 지역
      salaryConditions: 15,
    },
    companyOverview: {
      mainProducts: '전동식 워터펌프(EWP), 전동 오일펌프, 친환경차 열관리 밸브',
      annualRevenue: '6,000억 원 코스피 상장 1차 협력사',
      employeeCount: '약 850명',
      plantLocation: '경남 창원 국가산업단지',
    },
    jobDetails: {
      mainTasks: ['열관리 전동 펌프 생산 일정 계획', '모터 조립 라인 가동률 데이터 집계'],
      requirements: ['자동차/기계공학 전공', '신입'],
      preferredQualifications: ['1차 협력사 관련 경험자'],
    },
    strategyAnalysis: {
      automotiveMajorAdvantage: '차량 열관리 시스템 및 전동 워터펌프의 자동차 공학적 메커니즘 이해.',
      tier1DataExpAdvantage: '1차사 공정 데이터 지표 집계 즉시 적용 가능.',
      riskAndCheckPoints: ['경남 창원 근무 가능 여부 확인.'],
      resumeHighlightPoints: ['공정 데이터 기반 가동률 개선 경험', '열관리 전동 부품에 대한 전공 이해도'],
      coverLetterKeywords: ['전동식 워터펌프 생산 계획', '열관리 부품 가동률', '공정 데이터 정합성'],
    },
  },
];
