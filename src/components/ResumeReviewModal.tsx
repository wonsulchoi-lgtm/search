import React, { useState } from 'react';
import { 
  X, 
  FileCheck2, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  Loader2,
  TrendingUp,
  Tag
} from 'lucide-react';

interface ResumeReviewModalProps {
  onClose: () => void;
}

interface ReviewResult {
  reviewSummary: string;
  strengths: string[];
  improvements: string[];
  kpiKeywordMatches: string[];
  missingKpis: string[];
  recommendedBullets: string[];
}

export const ResumeReviewModal: React.FC<ResumeReviewModalProps> = ({ onClose }) => {
  const [resumeText, setResumeText] = useState(
    `[주요 경력 및 실무 경험]\n- 자동차 1차 협력사 공정관리 데이터 관련 업무 수행\n- 일일 생산 라인 실적 모니터링 및 비가동 요인 일일 집계\n- 차체/샤시 부품 생산 계획 대비 달성률 관리 및 MES 데이터 입력\n\n[학력 및 전공]\n- 자동차시스템공학과 석사과정 수료\n- 차량 동역학 및 전동화 파워트레인 조립 구조 프로젝트 수행`
  );
  const [targetJobTitle, setTargetJobTitle] = useState('현대모비스 / 에스엘 생산관리 신입');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [copiedBulletIdx, setCopiedBulletIdx] = useState<number | null>(null);

  const handleReview = async () => {
    if (!resumeText.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/resume/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetJobTitle }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                AI 이력서 첨삭 & 제조 KPI 매칭 진단기
              </h3>
              <p className="text-xs text-slate-400">
                20년 경력 헤드헌터의 제조업 직무분석 기반 이력서 진단
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

        {/* Body */}
        <div className="p-5 space-y-4 text-xs text-slate-300">
          
          <div>
            <label className="block text-slate-400 font-medium mb-1">
              목표 직무 / 지원 기업군
            </label>
            <input
              type="text"
              value={targetJobTitle}
              onChange={(e) => setTargetJobTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">
              이력서 / 경력기술서 초안 붙여넣기
            </label>
            <textarea
              rows={6}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="본인의 이력서 경력기술서나 경험 기술 문항을 붙여넣으세요..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <button
            onClick={handleReview}
            disabled={isLoading || !resumeText.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>제조업 공정관리 KPI 매칭을 진단하는 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>전문 헤드헌터 AI 진단 및 첨삭 받기</span>
              </>
            )}
          </button>

          {/* Results Pane */}
          {result && (
            <div className="mt-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/80 space-y-4 animate-fade-in">
              
              {/* Summary */}
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  총평 진단
                </span>
                <p className="text-slate-200 text-xs bg-slate-900/80 p-3 rounded-lg border border-slate-700/60 leading-relaxed">
                  {result.reviewSummary}
                </p>
              </div>

              {/* KPI Keywords Match & Missing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-bold text-emerald-400 block mb-1.5 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    반영된 제조 핵심 키워드
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {result.kpiKeywordMatches.map((k, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-semibold border border-emerald-800/50">
                        #{k}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-bold text-amber-400 block mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    추가 추천 제조 KPI (가점 요소)
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {result.missingKpis.map((k, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-semibold border border-amber-800/50">
                        +{k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="font-semibold text-slate-300 block mb-1">돋보이는 강점:</span>
                  <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                    {result.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-slate-300 block mb-1">개선 권고사항:</span>
                  <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                    {result.improvements.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Bullets */}
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  1차 협력사 데이터 경험을 극대화한 추천 이력서 문장
                </span>
                <div className="space-y-2">
                  {result.recommendedBullets.map((b, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900 p-2.5 rounded-lg border border-slate-700/60 flex items-start justify-between gap-2"
                    >
                      <p className="text-[11px] text-slate-200 leading-relaxed">
                        {b}
                      </p>
                      <button
                        onClick={() => handleCopyBullet(b, idx)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium transition flex items-center gap-1 shrink-0"
                      >
                        {copiedBulletIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>복사됨</span>
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

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
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
