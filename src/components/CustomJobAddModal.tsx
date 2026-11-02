import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Building,
  FileText
} from 'lucide-react';
import { JobPosting } from '../types';
import { apiService } from '../services/apiService';

interface CustomJobAddModalProps {
  onClose: () => void;
  onJobAdded: (job: JobPosting) => void;
}

export const CustomJobAddModal: React.FC<CustomJobAddModalProps> = ({
  onClose,
  onJobAdded,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [jobText, setJobText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleJobText = `[모집 요강]
회사명: (주)서진오토모티브 경주공장
모집직무: 친환경차 구동계 부품 생산관리/공정운영 신입
근무지: 경북 경주시 외동공단
담당업무:
- 전기차 감속기 및 클러치 라인 일일 생산계획 수립
- MES 공정 실적 데이터 마감 및 가동률 모니터링
- 완성차 납품 직서열(JIT) 출하 일정 동기화
자격요건:
- 대졸 이상 (자동차, 기계, 산업공학 계열 전공자)
- 신입 지원 가능
- 급여: 연봉 세전 4,050만 원 수준 (상여 별도)`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobText.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const job = await apiService.addCustomJob(companyName, jobText);
      onJobAdded(job);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '공고 분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                신규 공고 등록 & 백엔드 RTSC AI 정밀 분석
              </h3>
              <p className="text-xs text-slate-400">
                발견한 채용공고를 붙여넣으면 백엔드에서 100점 적합도를 즉시 산출합니다.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs text-slate-300">
          
          <div>
            <label className="block text-slate-400 font-medium mb-1">
              기업명 (선택)
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="예: 현대케피코, 일진베어링, 서진오토모티브"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-medium">
                채용공고 본문 내용 붙여넣기 (담당업무, 자격요건, 근무지, 연봉 등)
              </label>
              <button
                type="button"
                onClick={() => setJobText(sampleJobText)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300"
              >
                예시 공고 채우기
              </button>
            </div>
            <textarea
              rows={8}
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="고용24, 사람인, 잡코리아 또는 기업 공식 채용 사이트의 공고 내용을 그대로 복사해 붙여넣으세요..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              required
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400 space-y-1">
            <strong className="text-slate-200 block">백엔드 자동 처리 내역:</strong>
            <p>1. 직무/지역/연봉/마감일/학력 요건 추출 및 정규화</p>
            <p>2. 석사수료 학력 지원 적합성 여부 검증 (원칙 1 적용)</p>
            <p>3. RTSC 100점 만점 5대 평가 기준 산출 및 서버 저장</p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || !jobText.trim()}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-md shadow-cyan-500/20 disabled:opacity-40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>백엔드 분석 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>공고 분석 및 목록 추가</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
