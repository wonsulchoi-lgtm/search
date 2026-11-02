import React, { useState, useEffect } from 'react';
import { JobPosting, CandidateProfile } from '../types';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  FileText, 
  Briefcase, 
  Building2, 
  Loader2, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { apiService } from '../services/apiService';

interface CoverLetterModalProps {
  job: JobPosting | null;
  profile: CandidateProfile;
  onClose: () => void;
}

export const CoverLetterModal: React.FC<CoverLetterModalProps> = ({
  job,
  profile,
  onClose,
}) => {
  const [resumeBullets, setResumeBullets] = useState<string[]>([]);
  const [coverLetterParagraph, setCoverLetterParagraph] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedParagraph, setCopiedParagraph] = useState<boolean>(false);

  useEffect(() => {
    if (!job) return;

    let isMounted = true;
    const generateTailoredContent = async () => {
      setIsLoading(true);
      try {
        const data = await apiService.generateCoverLetter(job);
        if (isMounted) {
          setResumeBullets(data.resumeBullets || job.strategyAnalysis.resumeHighlightPoints);
          setCoverLetterParagraph(data.coverLetterParagraph || '');
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setResumeBullets(job.strategyAnalysis.resumeHighlightPoints);
          setCoverLetterParagraph(
            `[1차 협력사 공정 데이터 실무로 입증된 생산관리 역량]\n저는 자동차시스템공학과 석사과정을 수료하며 차량 구조 전반에 대한 엔지니어링 이해도를 탄탄히 다졌습니다. 특히 자동차 1차 협력사에서 공정관리 데이터 관련 업무를 수행하며 라인 가동률(OEE) 분석, 병목 공정 추적, 일일 생산 실적 마감 프로세스를 직접 다뤘습니다. ${job.companyName}의 ${job.jobTitle} 직무에서 이러한 실무 경험을 바탕으로 오차 없는 납기 관리와 생산성 최적화에 즉시 기여하겠습니다.`
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    generateTailoredContent();

    return () => {
      isMounted = false;
    };
  }, [job]);

  if (!job) return null;

  const copyToClipboard = (text: string, type: 'bullet' | 'paragraph', index?: number) => {
    navigator.clipboard.writeText(text);
    if (type === 'bullet' && index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCopiedParagraph(true);
      setTimeout(() => setCopiedParagraph(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                맞춤형 이력서 불릿 & 자소서 단락 생성
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

        {/* Modal Body */}
        <div className="p-5 space-y-5 text-xs text-slate-300">
          
          {/* Candidate Experience Context Pill */}
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-200">
                지원자 핵심 매칭 조건 반영:
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                자동차시스템공학 (석사수료) + 1차 협력사 공정관리 데이터 실무 경험을 {job.companyName}의 주요 제품({job.companyOverview.mainProducts}) 및 제조 특성에 정밀 연결했습니다.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
              <p className="text-slate-400 text-xs">
                공고 직무와 지원자 공정 데이터 경험을 분석하여 최적의 문항을 생성 중입니다...
              </p>
            </div>
          ) : (
            <>
              {/* Section 1: Resume Bullet Points */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>이력서 [경력 및 직무역량] 추천 불릿 포인트 (3개)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">클릭하여 개별 복사</span>
                </div>

                <div className="space-y-2">
                  {resumeBullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="group bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 rounded-xl p-3 flex items-start justify-between gap-3 transition"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded bg-cyan-950 text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-cyan-800/50">
                          {idx + 1}
                        </span>
                        <p className="text-slate-200 leading-relaxed text-[11px]">
                          {bullet}
                        </p>
                      </div>

                      <button
                        onClick={() => copyToClipboard(bullet, 'bullet', idx)}
                        className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-medium transition flex items-center gap-1 shrink-0"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300">복사됨</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-400" />
                            <span>복사</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Cover Letter Paragraph Draft */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                    <span>자기소개서 [지원동기 및 직무 강점] 초안</span>
                  </h4>
                  <button
                    onClick={() => copyToClipboard(coverLetterParagraph, 'paragraph')}
                    className="px-2.5 py-1 rounded bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700 text-[11px] font-medium transition flex items-center gap-1"
                  >
                    {copiedParagraph ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">전체 복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-indigo-400" />
                        <span>전체 단락 복사</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-slate-200 whitespace-pre-line leading-relaxed text-[11px] shadow-inner font-mono">
                  {coverLetterParagraph}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            * 복사 후 지원 기업의 세부 양식에 맞추어 숫자를 가다듬어 사용하세요.
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
