export interface ManufacturingKPI {
  id: string;
  code: string;
  koreanName: string;
  category: '생산성' | '가동률' | '납기/공급망' | '품질/공정' | '현장관리';
  formulaOrDefinition: string;
  importanceInAutomotive: string;
  tier1DataConnection: string;
  interviewTalkingPoint: string;
}

export const MANUFACTURING_KPIS: ManufacturingKPI[] = [
  {
    id: 'kpi-oee',
    code: 'OEE',
    koreanName: '설비종합효율 (Overall Equipment Effectiveness)',
    category: '가동률',
    formulaOrDefinition: '시간가동률(Availability) × 성능가동률(Performance) × 양품률(Quality)',
    importanceInAutomotive: '자동차 조립 및 전동화 라인의 투자 대비 실제 유효 생산성을 평가하는 핵심 지표로, 글로벌 OEM 및 1차 협력사 표준 KPI.',
    tier1DataConnection: '1차 협력사에서 다룬 설비 정지 시간(라인 비가동), 금형 교체(C/O) 지연, 불량 발생 로트 데이터를 일일 OEE 지표로 집계하고 원인별 파레토 분석을 수행한 경험과 직결.',
    interviewTalkingPoint: '"1차 협력사에서 단순히 실적 수치만 기록한 것이 아니라, 비가동 사유를 설비 고장, 자재 품절, 셋업 지연으로 분류하여 실제 OEE 저하의 80%를 차지하는 핵심 원인을 데이터로 도출해 개선 미팅에 보고한 경험이 있습니다."',
  },
  {
    id: 'kpi-jit-jis',
    code: 'JIS / JIT',
    koreanName: '직서열 납품(JIS) 및 적기 공급(JIT)',
    category: '납기/공급망',
    formulaOrDefinition: 'Just-In-Sequence (완성차 생산 차종/사양 순서대로 납품) & Just-In-Time (필요 시점에 정량 공급)',
    importanceInAutomotive: '현대차·기아 울산/아산공장과 1차 협력사 간 재고를 제로화하고 완성차 조립 라인의 피치 타임에 맞춰 정확한 사양을 공급하는 생명선.',
    tier1DataConnection: '완성차 서열 브로드캐스트 데이터와 사내 조립 라인의 실적 간 갭(GAP)을 모니터링하여 서열 미스 및 서열 지연을 방지한 데이터 추적 경험.',
    interviewTalkingPoint: '"1차 협력사 생산관리의 최우선 가치는 완성차 조립 라인의 서열을 단 1대도 틀어지지 않게 하는 것입니다. 서열 데이터 동기화를 철저히 관리하여 Line Stop 리스크를 사전에 예방하겠습니다."',
  },
  {
    id: 'kpi-ct-takt',
    code: 'C/T vs Takt Time',
    koreanName: '사이클 타임(Cycle Time)과 택트 타임(Takt Time)',
    category: '생산성',
    formulaOrDefinition: 'C/T: 한 작업자가 공정 1주기를 완료하는 데 걸리는 실제 시간 / Takt: 1일 가동시간 ÷ 1일 고객 요구 수량',
    importanceInAutomotive: 'C/T가 Takt Time보다 길면 병목(Bottleneck)이 발생하여 고객사 납기 지연이 일어나고, 너무 짧으면 재고와 유휴 인력이 발생함.',
    tier1DataConnection: '공정별 초시계 측정 또는 센서 로그 데이터를 기반으로 공정 밸런싱(Line Balancing) 편차를 수치화한 경험.',
    interviewTalkingPoint: '"생산관리자는 라인별 C/T의 편차를 줄여 라인 밸런스 효율(LBE)을 극대화해야 합니다. 데이터 분석을 통해 가장 C/T가 길었던 병목 공정을 식별하고 작업 재분배를 지원했던 실무 감각이 있습니다."',
  },
  {
    id: 'kpi-uph',
    code: 'UPH',
    koreanName: '시간당 생산대수 (Units Per Hour)',
    category: '생산성',
    formulaOrDefinition: '실제 완성품 산출량 ÷ 실 가동 시간(Hours)',
    importanceInAutomotive: '일일 목표 생산량 달성 여부를 실시간으로 추적하는 직관적인 생산속도 지표.',
    tier1DataConnection: '매 시간(Hourly) 라인 생산 실적을 취합하여 계획 UPH 대비 미달 시 즉시 현장 이상 요인을 확인하는 피드백 루프 운영.',
    interviewTalkingPoint: '"UPH 미달은 곧 납기 비상으로 직결됩니다. 시간당 진도율 추적을 시스템화하여 교대 시간 전 미달량을 미리 파악하고 만회 잔업이나 라인 속도 조절을 선제적으로 계획할 수 있습니다."',
  },
  {
    id: 'kpi-traceability',
    code: 'Lot Traceability',
    koreanName: '로트 추적성 (제조 이력 추적)',
    category: '품질/공정',
    formulaOrDefinition: '원소재 입고 번호부터 가공-조립-검사-출하까지 바코드/RFID로 일련번호를 연결하여 추적 가능하게 하는 체계',
    importanceInAutomotive: '차량 결함이나 리콜 발생 시 해당 부품이 어느 차종, 어느 생산일자에 투입되었는지 즉시 한정 격리하기 위한 법적·품질 필수 요건.',
    tier1DataConnection: 'MES 시스템 내 바코드 스캔 로그 누락 방지 및 불량 부품의 로트(Lot) 범위 격리 데이터 처리 경험.',
    interviewTalkingPoint: '"품질 문제가 발생했을 때 전체 라인을 세우지 않고 해당 로트만 정밀 격리할 수 있었던 것은 철저한 데이터 추적성 관리 덕분이었습니다. 데이터의 무결성이 품질과 직결됨을 깊이 체득했습니다."',
  },
  {
    id: 'kpi-cpk',
    code: 'Cpk',
    koreanName: '공정능력지수 (Process Capability Index)',
    category: '품질/공정',
    formulaOrDefinition: 'min((USL - μ) / 3σ, (μ - LSL) / 3σ) : 규격 상·하한 대비 공정의 중심치와 산포 안정성 평가',
    importanceInAutomotive: 'Cpk 1.33 이상(4시그마), 전장/안전 부품의 경우 Cpk 1.67 이상을 요구하여 양산 품질 안정성을 정량 보증.',
    tier1DataConnection: '치수 검사 및 토크(Torque) 체결 데이터의 정규분포 및 Cpk 추이를 시각화하여 공정 이상 징후를 사전에 감지.',
    interviewTalkingPoint: '"자동차시스템공학 전공을 통해 Cpk의 통계적 의미를 이해하고 있으며, 1차 협력사에서 수집된 체결력 데이터를 모니터링하여 공정 중심이 이탈하기 전 예방 보전을 유도하는 데이터 기반 관리를 수행했습니다."',
  },
  {
    id: 'kpi-4m1e',
    code: '4M1E',
    koreanName: '생산 5대 변화점 관리 (Man, Machine, Material, Method, Environment)',
    category: '현장관리',
    formulaOrDefinition: '작업자 변경, 설비 수리/변경, 원소재 로트 변경, 작업표준 변경, 환경 변화를 실시간 기록하고 관리하는 기법',
    importanceInAutomotive: '자동차 양산 라인에서 발생하는 불량의 90% 이상이 4M1E 변화점에서 발생하므로, 변경점 초도품 검사(초중종물)가 필수적임.',
    tier1DataConnection: '작업자 교대나 설비 파라미터 변경 시점의 생산 데이터에 플래그를 달아 품질 검사 데이터와 동기화한 경험.',
    interviewTalkingPoint: '"신입 생산관리자로서 매일 현장의 4M 변화점을 가장 먼저 확인하고, 변화 발생 시 초물 검사 데이터가 정상 등록되었는지 확인함으로써 대형 유동 불량을 사전 차단하겠습니다."',
  },
];
