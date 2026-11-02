import React, { useState } from 'react';
import { JobPosting } from '../types';
import { 
  Award, 
  Building, 
  MapPin, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Sparkles, 
  Briefcase, 
  AlertCircle, 
  TrendingUp, 
  Key, 
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface Top3DeepDiveProps {
  topJobs: JobPosting[];
  onOpenCoverLetter: (job: JobPosting) => void;
  onOpenInterview: (job: JobPosting) => void;
}

export const Top3DeepDive: React.FC<Top3DeepDiveProps> = ({
  topJobs,
  onOpenCoverLetter,
  onOpenInterview,
}) => {
  const [selectedRank, setSelectedRank] = useState<number>(1);
  const activeJob = topJobs.find((j) => j.rank === selectedRank) || topJobs[0];

  if (!activeJob) return null;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl p-5 backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>S-4. 최우선 추천 3개 기업 심층 분석</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            20년 경력 헤드헌터의 공고별 정밀 직무분석 및 합격 전략
          </h3>
        </div>

        {/* Company Selector Tabs */}
        <div className="flex items-center gap-2">
          {topJobs.slice(0, 3).map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedRank(job.rank)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
                selectedRank === job.rank
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-cyan-400 shadow-md shadow-blue-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black/30 flex items-center justify-center text-[10px]">
                {job.rank}
              </span>
              <span>{job.companyName.split('(')[0]}</span>
              <span className="text-[10px] opacity-80">({job.fitScore}점)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dossier Content */}
      <div className="mt-5 space-y-6">
        
        {/* Banner summary for active company */}
        <div className="bg-gradient-to-r from-slate-800/80 via-slate-800/50 to-slate-900/80 border border-slate-700/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold text-xs border border-cyan-800/60">
                추천 {activeJob.rank}순위 • 적합도 {activeJob.fitScore}점
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {activeJob.industry}
              </span>
              {activeJob.isNew && (
                <span className="px-1.5 py-0.2 rounded bg-cyan-900 text-cyan-200 text-[10px] font-bold">
                  24h 신규
                </span>
              )}
              {activeJob.isDeadlineImminent && (
                <span className="px-1.5 py-0.2 rounded bg-amber-900 text-amber-200 text-[10px] font-bold animate-pulse">
                  3일 내 마감
                </span>
              )}
            </div>
            <h4 className="text-lg font-bold text-white">
              {activeJob.companyName} — {activeJob.jobTitle}
            </h4>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{activeJob.workLocation.fullAddress}</span>
              <span className="text-slate-500">•</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-emerald-300 font-semibold">{activeJob.salary}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenCoverLetter(activeJob)}
              className="px-3 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>자소서 문항 생성</span>
            </button>
            <button
              onClick={() => onOpenInterview(activeJob)}
              className="px-3 py-2 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>모의 면접 대비</span>
            </button>
            <a
              href={activeJob.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1"
            >
              <span>공식 지원</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 4-Part Structured Grid Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* ① 기업 및 직무 개요 */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-2.5">
                <Building className="w-4 h-4" />
                <span>① 기업 및 직무 개요</span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">주요 제품 및 사업</span>
                  <span className="text-slate-200 font-medium text-right max-w-[240px]">
                    {activeJob.companyOverview.mainProducts}
                  </span>
                </div>
                {activeJob.companyOverview.annualRevenue && (
                  <div className="flex justify-between py-1 border-b border-slate-700/40">
                    <span className="text-slate-400">기업 규모 / 매출</span>
                    <span className="text-slate-200 font-medium">
                      {activeJob.companyOverview.annualRevenue}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">모집 직무 / 고용형태</span>
                  <span className="text-cyan-300 font-semibold">
                    {activeJob.jobCategory} ({activeJob.employmentType})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">근무 지역</span>
                  <span className="text-slate-200 font-medium">
                    {activeJob.workLocation.region} {activeJob.workLocation.district}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">접수 마감일</span>
                  <span className="text-amber-300 font-bold">
                    {activeJob.deadline} {activeJob.isDeadlineImminent && '(3일 내 마감)'}
                  </span>
                </div>
              </div>

              {/* Main tasks list */}
              <div className="mt-3 pt-3 border-t border-slate-700/60">
                <span className="text-xs font-semibold text-slate-300 block mb-1.5">
                  핵심 수행 업무
                </span>
                <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                  {activeJob.jobDetails.mainTasks.map((task, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ② 실제 채용 자격 분석 */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>② 실제 채용 자격 분석</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">요구 전공</span>
                  <span className="text-slate-200 font-medium">
                    자동차/기계/산업공학 계열
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">학력 자격 요건</span>
                  <span className="text-emerald-300 font-semibold">
                    {activeJob.educationRequirement}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">신입 지원 여부</span>
                  <span className="text-blue-300 font-semibold">
                    신입 지원 가능 (경력 무관 포함)
                  </span>
                </div>
              </div>

              {/* RTSC Degree Check Principle Box */}
              <div className="mt-3 p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/50">
                <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-bold mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                  <span>석사수료 학력 해석 원칙</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {activeJob.degreeCheckNote}
                </p>
              </div>

              {/* Preferred Skills */}
              <div className="mt-3">
                <span className="text-xs font-semibold text-slate-300 block mb-1">
                  우대사항 및 필요역량
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeJob.jobDetails.preferredQualifications.map((p, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 border border-slate-600/50">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ③ 지원자 경쟁력 */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-2.5">
              <TrendingUp className="w-4 h-4" />
              <span>③ 지원자 경쟁력 분석 (전공 & 1차사 경험)</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <strong className="text-cyan-300 block mb-0.5">자동차시스템공학 전공 활용점:</strong>
                <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-700/50">
                  {activeJob.strategyAnalysis.automotiveMajorAdvantage}
                </p>
              </div>

              <div>
                <strong className="text-emerald-300 block mb-0.5">1차 협력사 공정 데이터 업무 강점:</strong>
                <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-700/50">
                  {activeJob.strategyAnalysis.tier1DataExpAdvantage}
                </p>
              </div>

              <div>
                <strong className="text-amber-300 block mb-0.5">부족 또는 사전 확인 필요 자격:</strong>
                <ul className="text-slate-400 text-[11px] space-y-1 list-disc list-inside">
                  {activeJob.strategyAnalysis.riskAndCheckPoints.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ④ 지원 전략 */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2.5">
              <Key className="w-4 h-4" />
              <span>④ 맞춤 지원 전략 (이력서 & 자소서)</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <strong className="text-slate-200 block mb-1">
                  이력서에서 강조할 실무 경험 3가지:
                </strong>
                <ul className="space-y-1.5">
                  {activeJob.strategyAnalysis.resumeHighlightPoints.map((point, idx) => (
                    <li key={idx} className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800 flex items-start gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="text-slate-200 block mb-1">
                  자기소개서 핵심 어필 키워드 3가지:
                </strong>
                <div className="flex flex-wrap gap-1.5">
                  {activeJob.strategyAnalysis.coverLetterKeywords.map((kw, idx) => (
                    <span key={idx} className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/60">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  지원 전 체크: 통근 가능 여부 및 라인 교대 소통 준비
                </span>
                <button
                  onClick={() => onOpenCoverLetter(activeJob)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                >
                  <span>AI 맞춤 문항 생성</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
