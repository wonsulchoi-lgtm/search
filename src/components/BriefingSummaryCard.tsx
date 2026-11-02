import React from 'react';
import { BriefingStats } from '../types';
import { 
  Building2, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Award, 
  MapPin, 
  Target, 
  Info,
  CalendarCheck
} from 'lucide-react';

interface BriefingSummaryCardProps {
  stats: BriefingStats;
  includeGyeongnam: boolean;
  onToggleGyeongnam: () => void;
}

export const BriefingSummaryCard: React.FC<BriefingSummaryCardProps> = ({
  stats,
  includeGyeongnam,
  onToggleGyeongnam,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase">
            <CalendarCheck className="w-4 h-4 text-cyan-400" />
            <span>S-1. 일일 채용 브리핑 보고서</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {stats.reportDate} 미래모빌리티 맞춤형 채용 브리핑
          </h2>
        </div>

        {/* Search Parameter Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>기준: {stats.searchTime}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>지역: {stats.targetRegions}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>직무: {stats.targetJob}</span>
          </div>

          {/* Gyeongnam Expansion Toggle */}
          <button
            onClick={onToggleGyeongnam}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all flex items-center gap-1 ${
              includeGyeongnam
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700 ring-1 ring-cyan-500/30'
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <span>경남권(양산·창원) 확장</span>
            <span className={`w-1.5 h-1.5 rounded-full ${includeGyeongnam ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-4">
        {/* Total Collected */}
        <div className="bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>수집한 공고 수</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {stats.collectedCount}
            <span className="text-xs font-normal text-slate-400 ml-1">건</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>최대 10개 선별</span>
          </div>
        </div>

        {/* Verified Active */}
        <div className="bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>접수 중 확인</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {stats.activeCount}
            <span className="text-xs font-normal text-slate-400 ml-1">건</span>
          </div>
          <div className="text-[11px] text-emerald-500/90 mt-1">
            100% 공식 검증 완료
          </div>
        </div>

        {/* 24h New Openings */}
        <div className="bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-800/50 rounded-xl p-3.5 transition">
          <div className="flex items-center justify-between text-cyan-300 text-xs mb-1">
            <span>24시간 신규 공고</span>
            <Flame className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300">
            {stats.newCount}
            <span className="text-xs font-normal text-slate-400 ml-1">건</span>
          </div>
          <div className="text-[11px] text-cyan-400/80 mt-1">
            우선 지원 추천
          </div>
        </div>

        {/* Deadline Imminent */}
        <div className="bg-amber-950/20 hover:bg-amber-950/40 border border-amber-800/50 rounded-xl p-3.5 transition">
          <div className="flex items-center justify-between text-amber-300 text-xs mb-1">
            <span>마감 임박 (3일 내)</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">
            {stats.imminentCount}
            <span className="text-xs font-normal text-slate-400 ml-1">건</span>
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">
            에스엘 (11/04 마감)
          </div>
        </div>

        {/* 80+ Points High Fit */}
        <div className="bg-indigo-950/30 hover:bg-indigo-950/50 border border-indigo-800/50 rounded-xl p-3.5 transition col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-indigo-300 text-xs mb-1">
            <span>80점 이상 적합 공고</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-300">
            {stats.highFitCount}
            <span className="text-xs font-normal text-slate-400 ml-1">건</span>
          </div>
          <div className="text-[11px] text-indigo-400/80 mt-1">
            최우선 및 적극 지원군
          </div>
        </div>
      </div>

      {/* Operational Policy Guidance Note */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">RTSC 검증 원칙:</strong> 본 시스템은 석사수료와 석사학위 취득을 엄격히 구분하여 검증하며, 1차 협력사 공정관리 데이터 경험을 제조 KPI 및 생산실적 관리 연관성 측면에서 가중 평가합니다. 연봉 미공개 공고는 임의 추정하지 않고 별도 표기합니다.
        </p>
      </div>
    </div>
  );
};
