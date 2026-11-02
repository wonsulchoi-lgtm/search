import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  TrendingUp, 
  Sparkles, 
  CheckCircle, 
  HelpCircle, 
  Copy, 
  Check, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { MANUFACTURING_KPIS, ManufacturingKPI } from '../server/knowledge';

export const KnowledgeBase: React.FC = () => {
  const [kpis, setKpis] = useState<ManufacturingKPI[]>(MANUFACTURING_KPIS);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeKpi, setActiveKpi] = useState<ManufacturingKPI>(MANUFACTURING_KPIS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/knowledge/kpi')
      .then((res) => res.json())
      .then((data) => {
        if (data.kpis && data.kpis.length > 0) {
          setKpis(data.kpis);
        }
      })
      .catch((err) => console.error('Failed to load KPIs from backend:', err));
  }, []);

  const categories = ['전체', '가동률', '납기/공급망', '생산성', '품질/공정', '현장관리'];

  const filteredKpis = kpis.filter((kpi) => {
    const matchesCat = selectedCategory === '전체' || kpi.category === selectedCategory;
    const matchesSearch = 
      kpi.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kpi.koreanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kpi.formulaOrDefinition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>제조업 핵심 KPI & 면접 합격 용어 사전</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            자동차 1차 협력사 공정 데이터 경험 200% 어필 가이드
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            생산관리 면접관이 반드시 질문하는 제조 KPI 개념과 1차사 실무 데이터 경험을 연결하는 모범 답변 스크립트입니다.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="KPI 검색 (OEE, UPH, JIS...)"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedCategory === cat
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main KPI Explorer: List + Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* KPI Selector List */}
        <div className="lg:col-span-5 space-y-2">
          {filteredKpis.map((kpi) => {
            const isSelected = activeKpi.id === kpi.id;
            return (
              <div
                key={kpi.id}
                onClick={() => setActiveKpi(kpi)}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/20'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-cyan-300 text-sm tracking-wide">
                      {kpi.code}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                      {kpi.category}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-200 mt-0.5 line-clamp-1">
                    {kpi.koreanName}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
              </div>
            );
          })}
        </div>

        {/* Selected KPI Deep Dive Card */}
        <div className="lg:col-span-7 bg-slate-800/30 border border-slate-700/70 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                {activeKpi.category} 핵심 지표
              </span>
              <h4 className="text-xl font-black text-white mt-0.5 flex items-center gap-2">
                {activeKpi.code}
                <span className="text-xs font-normal text-slate-400">
                  ({activeKpi.koreanName})
                </span>
              </h4>
            </div>

            <button
              onClick={() => handleCopy(activeKpi.interviewTalkingPoint, activeKpi.id)}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-medium transition flex items-center gap-1.5"
            >
              {copiedId === activeKpi.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">답변 복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>면접 스크립트 복사</span>
                </>
              )}
            </button>
          </div>

          {/* Definition */}
          <div className="text-xs space-y-1">
            <span className="font-semibold text-slate-300 block">산출 공식 및 정의:</span>
            <p className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-cyan-300 font-mono text-[11px]">
              {activeKpi.formulaOrDefinition}
            </p>
          </div>

          {/* Automotive Importance */}
          <div className="text-xs space-y-1">
            <span className="font-semibold text-slate-300 block">자동차 제조공장에서의 핵심 중요성:</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {activeKpi.importanceInAutomotive}
            </p>
          </div>

          {/* 1st Tier Data Connection */}
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>지원자의 [1차 협력사 공정 데이터 업무]와 연결하는 포인트</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {activeKpi.tier1DataConnection}
            </p>
          </div>

          {/* Interview Answer Script */}
          <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-800/40 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-indigo-300 font-bold text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>실제 면접관 앞 1분 모범 합격 답변 스크립트</span>
              </span>
            </div>
            <p className="text-slate-200 text-[11px] italic bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 leading-relaxed font-sans">
              {activeKpi.interviewTalkingPoint}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
