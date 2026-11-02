import React from 'react';
import { ApplicationTrackerItem, JobPosting } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Bookmark, 
  Trash2, 
  Building2, 
  Calendar,
  Send
} from 'lucide-react';

interface ApplicationTrackerProps {
  trackerItems: ApplicationTrackerItem[];
  jobs: JobPosting[];
  onUpdateStatus: (jobId: string, newStatus: ApplicationTrackerItem['status']) => void;
  onRemoveItem: (jobId: string) => void;
  onSelectJob: (job: JobPosting) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  trackerItems,
  jobs,
  onUpdateStatus,
  onRemoveItem,
  onSelectJob,
}) => {
  const statuses: ApplicationTrackerItem['status'][] = [
    '관심',
    '서류작성중',
    '지원완료',
    '서류합격',
    '면접대기',
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-cyan-400" />
            <span>나의 모빌리티 지원 관리 파이프라인 ({trackerItems.length}개)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            관심 공고 등록부터 서류 접수, 면접 일정까지 원클릭으로 상태를 관리합니다.
          </p>
        </div>
      </div>

      {trackerItems.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-500">
          <Bookmark className="w-8 h-8 mx-auto text-slate-700 mb-2" />
          <p>아직 등록된 관심/지원 공고가 없습니다.</p>
          <p className="mt-1 text-slate-600">공고 리스트에서 [분석]을 누른 뒤 [관심 등록]을 클릭해 보세요.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {trackerItems.map((item) => {
            const job = jobs.find((j) => j.id === item.jobId);
            return (
              <div
                key={item.jobId}
                className="bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => job && onSelectJob(job)}
                >
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-xs sm:text-sm font-semibold hover:text-cyan-300 transition">
                      {item.companyName}
                    </strong>
                    {job && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {job.fitScore}점
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {item.jobTitle}
                  </div>
                  {job && (
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span>{job.workLocation.region} {job.workLocation.district}</span>
                      <span>•</span>
                      <span>마감: {job.deadline}</span>
                    </div>
                  )}
                </div>

                {/* Status selector & Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={item.status}
                    onChange={(e) => onUpdateStatus(item.jobId, e.target.value as ApplicationTrackerItem['status'])}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-medium focus:outline-none focus:border-cyan-500"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  {job && (
                    <a
                      href={job.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
                      title="채용 사이트 열기"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    onClick={() => onRemoveItem(item.jobId)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-700/60 transition"
                    title="트래커에서 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
