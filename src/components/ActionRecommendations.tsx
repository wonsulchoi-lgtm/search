import React from 'react';
import { JobPosting, DeltaReport } from '../types';
import { 
  Send, 
  HelpCircle, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight,
  Flame,
  Check
} from 'lucide-react';

interface ActionRecommendationsProps {
  jobs: JobPosting[];
  onSelectJob: (job: JobPosting) => void;
  onOpenCoverLetter: (job: JobPosting) => void;
}

export const ActionRecommendations: React.FC<ActionRecommendationsProps> = ({
  jobs,
  onSelectJob,
  onOpenCoverLetter,
}) => {
  const groupA = jobs.filter((j) => j.fitCategory === 'A. 즉시 지원 추천');
  const groupB = jobs.filter((j) => j.fitCategory === 'B. 검토 후 지원');
  const groupC = jobs.filter((j) => j.fitCategory === 'C. 경력 전환 및 역량 확장');

  const deltaData: DeltaReport = {
    newOpenings: [
      '현대모비스 울산공장 - 전동화 PE/배터리팩 생산관리 신입 (24h 신규)',
      'HL만도 경주/울산 - 샤시 전동화 IDB/EPS 생산운영 및 공정관리 (24h 신규)',
      '일지테크 경주/경산 - 현대차 EV 차체 경량화 생산기획 신입 (24h 신규)',
    ],
    imminentDeadlines: [
      '에스엘(SL) 경산본사 - 미래모빌리티 램프/전장 생산관리 신입 (2026-11-04 마감, 3일 이내)',
    ],
    closedOpenings: [],
    modifiedOpenings: [],
    duplicateCount: 7,
  };

  return (
    <div className="space-y-6">
      
      {/* S-5 Section: 3 Action Groups */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
          <Send className="w-4 h-4 text-cyan-400" />
          <span>S-5. 오늘의 전략적 지원 권고 3단계 분류</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-4">
          합격 가능성 및 조건 충족도에 따른 포트폴리오별 지원 로드맵
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Group A: 즉시 지원 추천 */}
          <div className="bg-cyan-950/20 border border-cyan-800/50 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-900 text-cyan-200 border border-cyan-700">
                  A. 즉시 지원 추천
                </span>
                <span className="text-xs font-bold text-cyan-400">{groupA.length}개사</span>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                접수 중이며 자격 충족 및 적합도가 높아 즉시 이력서와 자소서를 접수할 최우선 기업
              </p>

              <div className="space-y-2">
                {groupA.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => onSelectJob(job)}
                    className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-white font-semibold">{job.companyName.split('(')[0]}</strong>
                      <span className="text-cyan-400 font-bold">{job.fitScore}점</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {job.jobTitle}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>{job.workLocation.district} • {job.salary}</span>
                      <span className="text-amber-400">~{job.deadline.slice(5)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-cyan-900/40 text-[11px] text-cyan-300">
              * 에스엘(SL)은 3일 이내 마감이므로 최우선 서류 작성 요망
            </div>
          </div>

          {/* Group B: 검토 후 지원 */}
          <div className="bg-amber-950/20 border border-amber-800/50 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-900 text-amber-200 border border-amber-700">
                  B. 검토 후 지원
                </span>
                <span className="text-xs font-bold text-amber-400">{groupB.length}개사</span>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                연봉 미공개 또는 희망 연봉(4,000만 원) 소폭 미달(조건 조정 검토) 기업
              </p>

              <div className="space-y-2">
                {groupB.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => onSelectJob(job)}
                    className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-white font-semibold">{job.companyName.split('(')[0]}</strong>
                      <span className="text-amber-400 font-bold">{job.fitScore}점</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {job.jobTitle}
                    </div>
                    <div className="text-[10px] text-amber-400/90 mt-1 flex items-center justify-between">
                      <span>{job.salary}</span>
                      <span>검토 요망</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-amber-900/40 text-[11px] text-amber-300">
              * 아진산업(3,900만 원)은 1차사 실무 경력 축적에 매우 유리
            </div>
          </div>

          {/* Group C: 경력 전환 및 역량 확장 */}
          <div className="bg-indigo-950/20 border border-indigo-800/50 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-900 text-indigo-200 border border-indigo-700">
                  C. 경력 전환 및 역량 확장
                </span>
                <span className="text-xs font-bold text-indigo-400">{groupC.length}개사</span>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                생산관리와 밀접하나 배터리 셀 제조 등 추가 도메인 지식이 요구되는 확장 공고
              </p>

              <div className="space-y-2">
                {groupC.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => onSelectJob(job)}
                    className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-white font-semibold">{job.companyName.split('(')[0]}</strong>
                      <span className="text-indigo-400 font-bold">{job.fitScore}점</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {job.jobTitle}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {job.degreeCheckNote.slice(0, 36)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-indigo-900/40 text-[11px] text-indigo-300">
              * 석사 우대 문구 주의: 석사수료임을 정확히 명시할 것
            </div>
          </div>

        </div>
      </div>

      {/* S-6 Section: Day-to-Day Delta Comparison */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>S-6. 전날 대비 변화 분석 (Search Delta)</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              최근 24시간 변동 추적 및 이전 공고 이력 비교
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            동일 기업 중복 제거 완료 ({deltaData.duplicateCount}건)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
          {/* New Registrations */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 font-bold text-cyan-400 mb-2">
              <Flame className="w-4 h-4" />
              <span>신규 등록 공고 (최근 24시간)</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              {deltaData.newOpenings.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Imminent Deadlines */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-2">
              <Clock className="w-4 h-4" />
              <span>마감 임박 공고 (D-3 이내)</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              {deltaData.imminentDeadlines.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};
