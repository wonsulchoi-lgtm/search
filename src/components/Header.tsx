import React from 'react';
import { 
  Briefcase, 
  UserCheck, 
  RefreshCw, 
  FileText, 
  Settings, 
  PlusCircle, 
  FileCheck2,
  BookOpen
} from 'lucide-react';
import { CandidateProfile } from '../types';

interface HeaderProps {
  profile: CandidateProfile;
  onOpenProfile: () => void;
  onExportReport: () => void;
  onRefreshData: () => void;
  onOpenAddJob: () => void;
  onOpenResumeReview: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenProfile,
  onExportReport,
  onRefreshData,
  onOpenAddJob,
  onOpenResumeReview,
  isRefreshing,
}) => {
  const now = new Date();
  const dateStr = `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일`;

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Agent Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  미래모빌리티 생산관리 취업 지원 AI 에이전트
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                    Full-Stack RTSC
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{dateStr} 아침 08:00 KST 기준 브리핑</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400 font-medium">부산·울산·경북 미래차 제조 전문</span>
              </p>
            </div>
          </div>

          {/* Action Tools & Profile Pill */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Custom Job Add Button */}
            <button
              onClick={onOpenAddJob}
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/70 transition"
              title="새로운 채용공고를 붙여넣어 백엔드 100점 분석"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1 text-cyan-400" />
              <span>공고 직접 등록</span>
            </button>

            {/* Resume AI Review Button */}
            <button
              onClick={onOpenResumeReview}
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium text-indigo-300 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/70 transition"
              title="이력서 제조 KPI 매칭 진단 및 첨삭"
            >
              <FileCheck2 className="w-3.5 h-3.5 mr-1 text-indigo-400" />
              <span>이력서 첨삭</span>
            </button>

            {/* Candidate Fixed Profile Pill */}
            <div 
              onClick={onOpenProfile}
              role="button"
              className="group flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 cursor-pointer transition-all"
            >
              <div className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
                28
              </div>
              <div className="text-left text-xs">
                <div className="font-semibold text-slate-200 group-hover:text-cyan-300 flex items-center gap-1">
                  {profile.major} 
                  <span className="text-[11px] font-normal text-amber-400 bg-amber-950/70 px-1 py-0.2 rounded border border-amber-800/50">
                    석사수료
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span>1차사 공정데이터</span>
                  <span>•</span>
                  <span>희망 {profile.targetSalary}만 원</span>
                </div>
              </div>
              <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 ml-1" />
            </div>

            {/* Sync / Refresh Button */}
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
              title="백엔드 공고 및 지표 동기화"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isRefreshing ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
              {isRefreshing ? '동기화 중' : '새로고침'}
            </button>

            {/* Report Export Button */}
            <button
              onClick={onExportReport}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-sm shadow-blue-500/20 transition"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              보고서 복사
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
