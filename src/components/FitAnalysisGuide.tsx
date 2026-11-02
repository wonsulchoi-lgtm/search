import React from 'react';
import { Target, CheckCircle, ShieldCheck, AlertCircle, BarChart3, Info } from 'lucide-react';

export const FitAnalysisGuide: React.FC = () => {
  const criteria = [
    {
      category: '직무 경험 연관성',
      weight: 30,
      description: '자동차 1차 협력사 공정관리 데이터 업무를 생산실적 관리, MES, 사이클 타임, 라인 가동률(OEE) 분석과 실질적으로 연계할 수 있는 정도',
      color: 'bg-cyan-500',
    },
    {
      category: '전공·학력 적합성',
      weight: 20,
      description: '자동차시스템공학과 전공 연관성 및 석사수료 학력 인정 여부 (석사수료 vs 학위 취득 구별)',
      color: 'bg-blue-500',
    },
    {
      category: '신입 지원 및 필수 자격 충족도',
      weight: 20,
      description: '신입 및 경력무관 지원 가능 여부, 필수 법적/공학 지원 자격 결격 사유 유무',
      color: 'bg-emerald-500',
    },
    {
      category: '지역 일치도',
      weight: 15,
      description: '부산광역시, 울산광역시, 경상북도 내 산업단지 위치 일치성 (경남 확장 시 가산)',
      color: 'bg-indigo-500',
    },
    {
      category: '연봉 및 근무조건 일치도',
      weight: 15,
      description: '세전 4,000만 원 이상 충족 여부 및 정규직 고용 형태 (연봉 미공개는 별도 표기 및 잠정 반영)',
      color: 'bg-amber-500',
    },
  ];

  const gradeTiers = [
    { range: '90 ~ 100점', tier: '최우선 지원', desc: '직무·전공·지역·연봉이 완벽 부합하며 즉시 서류 접수 권장', badge: 'bg-cyan-950 text-cyan-300 border-cyan-800' },
    { range: '80 ~ 89점', tier: '적극 지원', desc: '핵심 요건이 충족되며 1차사 데이터 경험을 강력히 소구할 수 있는 기업', badge: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
    { range: '70 ~ 79점', tier: '지원 검토', desc: '생산기술 결합 또는 연봉 미공개 등으로 일부 조건 확인 필요', badge: 'bg-blue-950 text-blue-300 border-blue-800' },
    { range: '60 ~ 69점', tier: '조건 확인 / 역량 보완', desc: '희망 연봉 4,000만 원 소폭 미달 또는 추가 기술 요구', badge: 'bg-amber-950 text-amber-300 border-amber-800' },
    { range: '60점 미만', tier: '추천 우선순위 낮음', desc: '경력 요구 또는 지역/직무 불일치', badge: 'bg-rose-950 text-rose-300 border-rose-800' },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>S-3. 개인 적합도 평가 체계 (100점 기준)</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            객관적 직무 정합성 정량 평가 모델
          </h3>
        </div>
      </div>

      {/* 5-Criteria Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {criteria.map((item, idx) => (
          <div key={idx} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-300">{item.category}</span>
                <span className="text-sm font-black text-white">{item.weight}점</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-1.5 mb-2.5 overflow-hidden">
                <div className={`h-full ${item.color}`} style={{ width: '100%' }} />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Evaluation Range & Interpretation Grid */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
        <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>점수 구간별 전략적 액션 가이드</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {gradeTiers.map((tier, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800/80 rounded-lg p-2.5 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white">{tier.range}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold border ${tier.badge}`}>
                  {tier.tier}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                {tier.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Interpretation Notice */}
      <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300/90 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-amber-200">평가 점수 해석 필수 원칙:</strong>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            이 점수는 공개된 채용공고의 자격요건과 지원자의 프로필(자동차시스템공학, 석사수료, 1차 협력사 공정관리 데이터 업무)을 비교 분석한 <span className="text-slate-200 font-semibold">참고용 직무 적합도 지표</span>이며, 실제 기업의 서류 합격 확률을 보증하는 수치가 아닙니다.
            미확인 정보가 존재하는 경우 잠정 점수로 제시하며, 필수 요건(예: 특정 면허 필수 등) 불충족 시 점수와 무관하게 '지원 자격 미충족'으로 표기됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};
