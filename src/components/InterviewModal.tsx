import React, { useState, useEffect } from 'react';
import { JobPosting, CandidateProfile } from '../types';
import { 
  X, 
  HelpCircle, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Loader2, 
  Copy, 
  Check, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import { apiService } from '../services/apiService';

interface InterviewModalProps {
  job: JobPosting | null;
  profile: CandidateProfile;
  onClose: () => void;
}

interface QuestionItem {
  question: string;
  intent: string;
  recommendedAnswer: string;
}

export const InterviewModal: React.FC<InterviewModalProps> = ({
  job,
  profile,
  onClose,
}) => {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!job) return;

    let isMounted = true;
    const fetchInterviewQuestions = async () => {
      setIsLoading(true);
      try {
        const data = await apiService.generateInterview(job);
        if (isMounted && Array.isArray(data)) {
          setQuestions(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchInterviewQuestions();

    return () => {
      isMounted = false;
    };
  }, [job]);

  if (!job) return null;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                생산관리 실전 면접 시뮬레이션 & 모범 답변 전략
              </h3>
              <p className="text-xs text-slate-400">
                {job.companyName} • {job.jobTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-slate-300 text-[11px] leading-relaxed">
              제조업 면접관은 <strong className="text-white">"1차 협력사 공정 데이터 경험이 실제로 라인 가동과 납기에 어떻게 연결되었는지"</strong>와 <strong className="text-white">"석사수료 후 생산관리 직무에 지원한 뚜렷한 동기"</strong>를 가장 날카롭게 검증합니다.
            </p>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              <p className="text-slate-400 text-xs">
                {job.companyName} 맞춤형 핵심 면접 질문을 추출 중입니다...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-700/80 rounded-xl overflow-hidden bg-slate-800/40 transition"
                  >
                    <div
                      onClick={() => setExpandedIndex(isExpanded ? -1 : idx)}
                      className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/80 transition"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          Q{idx + 1}
                        </span>
                        <h4 className="font-bold text-white text-xs sm:text-sm">
                          {q.question}
                        </h4>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </div>

                    {isExpanded && (
                      <div className="p-4 border-t border-slate-700/60 bg-slate-900/60 space-y-3">
                        <div>
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                            면접관의 평가 의도
                          </span>
                          <p className="text-slate-300 text-[11px] bg-slate-800/60 p-2.5 rounded border border-slate-700/50">
                            {q.intent}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                              추천 합격 답변 가이드 (1차사 데이터 경험 연계)
                            </span>
                            <button
                              onClick={() => handleCopy(q.recommendedAnswer, idx)}
                              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition"
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-300">복사됨</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-slate-400" />
                                  <span>답변 가이드 복사</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-slate-200 text-[11px] leading-relaxed bg-slate-950/80 p-3 rounded-lg border border-slate-800 font-sans">
                            {q.recommendedAnswer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            * 20년 경력 헤드헌터의 제조업 실무 면접 기준 데이터입니다.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
