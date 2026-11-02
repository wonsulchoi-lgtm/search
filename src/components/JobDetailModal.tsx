import React from 'react';
import { JobPosting, CandidateProfile } from '../types';
import { 
  X, 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  Sparkles, 
  TrendingUp, 
  FileEdit, 
  CheckCircle2, 
  AlertTriangle, 
  Bookmark,
  ShieldCheck,
  Award
} from 'lucide-react';

interface JobDetailModalProps {
  job: JobPosting | null;
  profile: CandidateProfile;
  onClose: () => void;
  onOpenCoverLetter: (job: JobPosting) => void;
  onOpenInterview: (job: JobPosting) => void;
  onToggleTrack: (job: JobPosting) => void;
  isBookmarked: boolean;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  profile,
  onClose,
  onOpenCoverLetter,
  onOpenInterview,
  onToggleTrack,
  isBookmarked,
}) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded font-black text-xs bg-cyan-950 text-cyan-300 border border-cyan-800">
              추천 {job.rank}위 • {job.fitScore}점
            </span>
            <span className="text-xs text-slate-400">
              {job.industry} • {job.jobCategory}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleTrack(job)}
              className={`p-1.5 rounded-lg border text-xs transition flex items-center gap-1 ${
                isBookmarked 
                  ? 'bg-amber-950 text-amber-300 border-amber-800' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="지원 관심 공고로 저장"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? '관심 저장됨' : '관심 등록'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-6 text-xs text-slate-300">
          
          {/* Main Title Banner */}
          <div>
            <h2 className="text-xl font-bold text-white">
              {job.companyName}
            </h2>
            <h3 className="text-sm font-semibold text-cyan-300 mt-1">
              {job.jobTitle}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-slate-400 text-xs">
              <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/60">
                <span className="block text-[10px] text-slate-500">근무 지역</span>
                <span className="font-semibold text-slate-200">{job.workLocation.region} {job.workLocation.district}</span>
              </div>
              <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/60">
                <span className="block text-[10px] text-slate-500">연봉 조건</span>
                <span className="font-semibold text-emerald-400">{job.salary}</span>
              </div>
              <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/60">
                <span className="block text-[10px] text-slate-500">경력 및 학력</span>
                <span className="font-semibold text-slate-200">{job.experienceRequirement} • 대졸이상</span>
              </div>
              <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/60">
                <span className="block text-[10px] text-slate-500">접수 마감</span>
                <span className="font-semibold text-amber-300">{job.deadline}</span>
              </div>
            </div>
          </div>

          {/* RTSC Degree Check Note */}
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-cyan-300 font-semibold block mb-0.5">
                석사수료 학력 및 지원 자격 검증 결과:
              </strong>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {job.degreeCheckNote}
              </p>
            </div>
          </div>

          {/* 100-Point Score Breakdown */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>개인 적합도 세부 배점 ({job.fitScore} / 100점)</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                {job.fitCategory}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">직무 경험 (30)</div>
                <div className="text-sm font-bold text-cyan-400 mt-0.5">{job.scoreBreakdown.experienceMatch}점</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">전공·학력 (20)</div>
                <div className="text-sm font-bold text-blue-400 mt-0.5">{job.scoreBreakdown.educationMatch}점</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">신입·필수자격 (20)</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">{job.scoreBreakdown.qualificationMatch}점</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">지역 일치 (15)</div>
                <div className="text-sm font-bold text-indigo-400 mt-0.5">{job.scoreBreakdown.locationMatch}점</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">연봉·근무조건 (15)</div>
                <div className="text-sm font-bold text-amber-400 mt-0.5">{job.scoreBreakdown.salaryConditions}점</div>
              </div>
            </div>
          </div>

          {/* Job Details & Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
              <h4 className="font-bold text-slate-200 mb-2">핵심 담당 업무</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside">
                {job.jobDetails.mainTasks.map((task, idx) => (
                  <li key={idx} className="leading-relaxed">{task}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
              <h4 className="font-bold text-slate-200 mb-2">자격요건 및 우대사항</h4>
              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="text-slate-400 font-semibold block">지원 요건:</span>
                  <ul className="list-disc list-inside text-slate-300">
                    {job.jobDetails.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block mt-1">우대사항:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {job.jobDetails.preferredQualifications.map((p, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-300 text-[10px]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Advantages */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-2.5">
            <h4 className="font-bold text-slate-200">지원자 맞춤 경쟁력 분석</h4>
            <div className="text-[11px] space-y-2">
              <p>
                <strong className="text-cyan-300">전공 연계성:</strong> {job.strategyAnalysis.automotiveMajorAdvantage}
              </p>
              <p>
                <strong className="text-emerald-300">1차사 데이터 실무 연계:</strong> {job.strategyAnalysis.tier1DataExpAdvantage}
              </p>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenCoverLetter(job);
              }}
              className="px-3 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <FileEdit className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI 자소서 문항 작성</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenInterview(job);
              }}
              className="px-3 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>모의 면접 질문</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              닫기
            </button>
            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
            >
              <span>공식 사이트 접수</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
