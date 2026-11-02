import React, { useState } from 'react';
import { JobPosting } from '../types';
import { 
  ExternalLink, 
  Sparkles, 
  Flame, 
  Clock, 
  AlertTriangle, 
  HelpCircle, 
  MapPin, 
  Building, 
  Eye, 
  CheckCircle,
  FileEdit,
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid
} from 'lucide-react';

interface JobTableProps {
  jobs: JobPosting[];
  onSelectJob: (job: JobPosting) => void;
  onOpenCoverLetter: (job: JobPosting) => void;
  onOpenInterview: (job: JobPosting) => void;
}

export const JobTable: React.FC<JobTableProps> = ({
  jobs,
  onSelectJob,
  onOpenCoverLetter,
  onOpenInterview,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'imminent' | 'highScore' | 'busan' | 'ulsan' | 'gyeongbuk'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredJobs = jobs.filter((job) => {
    if (activeFilter === 'new') return job.isNew;
    if (activeFilter === 'imminent') return job.isDeadlineImminent;
    if (activeFilter === 'highScore') return job.fitScore >= 80;
    if (activeFilter === 'busan') return job.workLocation.region.includes('부산');
    if (activeFilter === 'ulsan') return job.workLocation.region.includes('울산');
    if (activeFilter === 'gyeongbuk') return job.workLocation.region.includes('경상북도');
    return true;
  });

  const getScoreBadgeClass = (score: number) => {
    if (score >= 90) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    if (score >= 80) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (score >= 70) return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return '최우선 지원';
    if (score >= 80) return '적극 지원';
    if (score >= 70) return '지원 검토';
    return '조건 조정/보완';
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Table Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              S-2. 맞춤형 채용공고 리스트
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">적합도(100점) 순 정렬</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-0.5">
            미래모빌리티 신입 생산관리 맞춤 공고 TOP {filteredJobs.length}
          </h3>
        </div>

        {/* View Switch & Quick Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center rounded-lg bg-slate-800/80 p-1 border border-slate-700/80 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${
                activeFilter === 'all' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              전체 ({jobs.length})
            </button>
            <button
              onClick={() => setActiveFilter('new')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 font-medium ${
                activeFilter === 'new' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3 h-3 text-cyan-400" />
              신규 24h
            </button>
            <button
              onClick={() => setActiveFilter('imminent')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 font-medium ${
                activeFilter === 'imminent' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3 h-3 text-amber-400" />
              마감임박
            </button>
            <button
              onClick={() => setActiveFilter('highScore')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${
                activeFilter === 'highScore' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              80점 이상
            </button>
          </div>

          {/* Region Sub-filter */}
          <div className="flex items-center rounded-lg bg-slate-800/80 p-1 border border-slate-700/80 text-xs">
            <button
              onClick={() => setActiveFilter('ulsan')}
              className={`px-2 py-1 rounded-md transition ${activeFilter === 'ulsan' ? 'bg-slate-700 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              울산
            </button>
            <button
              onClick={() => setActiveFilter('gyeongbuk')}
              className={`px-2 py-1 rounded-md transition ${activeFilter === 'gyeongbuk' ? 'bg-slate-700 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              경북
            </button>
            <button
              onClick={() => setActiveFilter('busan')}
              className={`px-2 py-1 rounded-md transition ${activeFilter === 'busan' ? 'bg-slate-700 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              부산
            </button>
          </div>

          {/* Table vs Grid Switch */}
          <div className="flex items-center rounded-lg bg-slate-800/80 p-1 border border-slate-700/80">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md ${viewMode === 'table' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="테이블 뷰"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="카드 그리드 뷰"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* S-2 Main Table View */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium tracking-wide">
                <th className="py-3 px-3.5 text-center w-12">순위</th>
                <th className="py-3 px-3.5">기업명 / 산업</th>
                <th className="py-3 px-3.5 min-w-[200px]">채용 직무</th>
                <th className="py-3 px-3.5">지역</th>
                <th className="py-3 px-3.5">경력 / 학력</th>
                <th className="py-3 px-3.5 min-w-[130px]">연봉</th>
                <th className="py-3 px-3.5 min-w-[110px]">마감일</th>
                <th className="py-3 px-3.5 text-center min-w-[95px]">적합도</th>
                <th className="py-3 px-3.5 text-center min-w-[140px]">액션 및 지원</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300">
              {filteredJobs.map((job) => (
                <tr 
                  key={job.id} 
                  className="hover:bg-slate-800/40 transition group cursor-pointer"
                  onClick={() => onSelectJob(job)}
                >
                  {/* Rank */}
                  <td className="py-3.5 px-3.5 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                      job.rank === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      job.rank === 2 ? 'bg-slate-300/20 text-slate-200 border border-slate-400/40' :
                      job.rank === 3 ? 'bg-amber-700/20 text-amber-500 border border-amber-600/40' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {job.rank}
                    </span>
                  </td>

                  {/* Company & Industry */}
                  <td className="py-3.5 px-3.5">
                    <div className="font-semibold text-white group-hover:text-cyan-300 transition flex items-center gap-1.5">
                      {job.companyName}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {job.industry}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {job.employmentType}
                      </span>
                    </div>
                  </td>

                  {/* Job Title */}
                  <td className="py-3.5 px-3.5">
                    <div className="font-medium text-slate-100 line-clamp-1 group-hover:text-cyan-200">
                      {job.jobTitle}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                        job.jobCategory.includes('핵심') ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50' :
                        job.jobCategory.includes('연관') ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {job.jobCategory}
                      </span>
                      {job.isQualificationWarning && (
                        <span className="text-amber-400 flex items-center gap-0.5 text-[10px]" title={job.degreeCheckNote}>
                          <AlertTriangle className="w-3 h-3" />
                          자격 주의
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <div className="font-medium text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.workLocation.region.replace('광역시', '').replace('경상북도', '경북').replace('경상남도', '경남')}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {job.workLocation.district}
                    </div>
                  </td>

                  {/* Career & Degree requirement */}
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/40 text-[11px] font-medium">
                      {job.experienceRequirement}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1 max-w-[120px] truncate" title={job.degreeCheckNote}>
                      {job.educationRequirement.split('(')[0]}
                    </div>
                  </td>

                  {/* Salary */}
                  <td className="py-3.5 px-3.5">
                    {job.isSalaryUnspecified ? (
                      <span className="inline-flex items-center text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded text-[11px] border border-slate-700" title="공식 공고상 연봉 미공개 (추정 금지 원칙)">
                        <HelpCircle className="w-3 h-3 mr-1 text-slate-400" />
                        미공개 (내규)
                      </span>
                    ) : job.isSalaryBelowTarget ? (
                      <div>
                        <div className="font-semibold text-amber-300 text-xs">
                          {job.salary}
                        </div>
                        <span className="text-[10px] text-amber-400/90 bg-amber-950/60 px-1 rounded border border-amber-800/40">
                          조건 조정 검토
                        </span>
                      </div>
                    ) : (
                      <div className="font-semibold text-emerald-300 text-xs">
                        {job.salary}
                      </div>
                    )}
                  </td>

                  {/* Deadline & Badges */}
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <div className="font-medium text-slate-200">
                      ~ {job.deadline.slice(5)}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {job.isNew && (
                        <span className="inline-flex items-center text-[10px] px-1.5 py-0.2 rounded font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                          <Flame className="w-2.5 h-2.5 mr-0.5 text-cyan-400" />
                          신규
                        </span>
                      )}
                      {job.isDeadlineImminent && (
                        <span className="inline-flex items-center text-[10px] px-1.5 py-0.2 rounded font-semibold bg-amber-950 text-amber-300 border border-amber-800 animate-pulse">
                          <Clock className="w-2.5 h-2.5 mr-0.5 text-amber-400" />
                          마감임박
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Fit Score */}
                  <td className="py-3.5 px-3.5 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className={`px-2.5 py-1 rounded-lg font-black text-sm border ${getScoreBadgeClass(job.fitScore)}`}>
                        {job.fitScore}점
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {getScoreLabel(job.fitScore)}
                      </span>
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-3.5 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Deep dive detail button */}
                      <button
                        onClick={() => onSelectJob(job)}
                        className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1 text-[11px]"
                        title="공고 상세 분석 및 RTSC 전략 보기"
                      >
                        <Eye className="w-3 h-3 text-cyan-400" />
                        분석
                      </button>

                      {/* AI Tailoring button */}
                      <button
                        onClick={() => onOpenCoverLetter(job)}
                        className="px-2 py-1 rounded-md bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition flex items-center gap-1 text-[11px]"
                        title="지원자의 1차사 데이터 경험 기반 이력서/자소서 생성"
                      >
                        <FileEdit className="w-3 h-3 text-cyan-400" />
                        자소서
                      </button>

                      {/* Direct Apply link */}
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition"
                        title={`${job.officialSource} 직접 지원 링크 열기`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid Card Mode */
        <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onSelectJob(job)}
              className="bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/60 hover:border-cyan-500/50 rounded-xl p-4 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center">
                      {job.rank}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">{job.companyName}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getScoreBadgeClass(job.fitScore)}`}>
                    {job.fitScore}점
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm line-clamp-2 mb-2">
                  {job.jobTitle}
                </h4>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{job.workLocation.fullAddress}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">연봉:</span>
                    <span className="font-semibold text-emerald-400">{job.salary}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">마감:</span>
                    <span className="text-amber-300">{job.deadline}</span>
                  </div>
                </div>

                {job.isQualificationWarning && (
                  <div className="mt-2.5 p-2 rounded bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-300 flex items-start gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{job.degreeCheckNote}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onSelectJob(job)}
                  className="w-full py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-medium text-slate-200 transition"
                >
                  심층 전략 보기
                </button>
                <a
                  href={job.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition flex items-center gap-1"
                >
                  <span>지원</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verification Footer Note */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span>* 지원 URL은 각 기업의 공식 채용 포털 및 고용24/사람인 공식 등록 링크입니다.</span>
        <span>정렬 기준: 직무연관성(30) + 전공학력(20) + 자격충족(20) + 지역(15) + 연봉(15)</span>
      </div>
    </div>
  );
};
