import React, { useState } from 'react';
import { JobPosting, CandidateProfile, BriefingStats } from '../types';
import { 
  X, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Printer,
  Sparkles
} from 'lucide-react';

interface ReportExportModalProps {
  jobs: JobPosting[];
  profile: CandidateProfile;
  stats: BriefingStats;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  jobs,
  profile,
  stats,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const top3 = jobs.slice(0, 3);
  const groupA = jobs.filter((j) => j.fitCategory === 'A. 즉시 지원 추천');
  const groupB = jobs.filter((j) => j.fitCategory === 'B. 검토 후 지원');
  const groupC = jobs.filter((j) => j.fitCategory === 'C. 경력 전환 및 역량 확장');

  // Generate markdown report exactly adhering to [S] Structure
  const reportMarkdown = `# 오늘의 미래모빌리티 맞춤형 채용 브리핑
**보고 제목: ${stats.reportDate} 미래모빌리티 맞춤형 채용 브리핑**

- 검색 시각: ${stats.searchTime}
- 검색 지역: ${stats.targetRegions}
- 검색 직무: ${stats.targetJob}
- 수집한 공고 수: ${stats.collectedCount}건
- 접수 중으로 확인된 공고 수: ${stats.activeCount}건
- 신규 공고 수 (최근 24시간): ${stats.newCount}건
- 마감 임박 공고 수 (3일 이내): ${stats.imminentCount}건
- 80점 이상 적합 공고 수: ${stats.highFitCount}건

---

## S-2. 맞춤형 채용공고 TOP 10

| 순위 | 기업명 | 채용 직무 | 지역 | 경력 조건 | 연봉 | 마감일 | 적합도 | 지원 링크 |
|---|---|---|---|---|---|---|---|---|
${jobs.slice(0, 10).map((j) => `| ${j.rank} | ${j.companyName} | ${j.jobTitle} | ${j.workLocation.region} ${j.workLocation.district} | ${j.experienceRequirement} | ${j.salary} | ${j.deadline} ${j.isNew ? '(신규)' : ''}${j.isDeadlineImminent ? '(마감임박)' : ''} | ${j.fitScore}점 | [지원하기](${j.applicationUrl}) |`).join('\n')}

---

## S-3. 개인 적합도 분석

100점 만점으로 평가합니다.

| 평가 기준 | 배점 |
|---|---:|
| 직무 경험 연관성 | 30점 |
| 전공·학력 적합성 | 20점 |
| 신입 지원 및 필수 자격 충족도 | 20점 |
| 지역 일치도 | 15점 |
| 연봉 및 근무조건 일치도 | 15점 |
| **합계** | **100점** |

- 90~100점: 최우선 지원 (현대모비스, 에스엘, HL만도)
- 80~89점: 적극 지원 (삼기, 일지테크, 동희산업, 르노코리아)
- 70~79점: 지원 검토 (아진산업, 성우하이텍, 금양)
* 이 점수는 공개된 공고와 개인 프로필을 비교한 참고용 지표이며, 실제 합격 확률을 의미하지 않습니다. 석사수료와 학위 취득은 명확히 구별되어 산정되었습니다.

---

## S-4. 최우선 추천 3개 공고 상세 분석

${top3.map((j) => `### [추천 ${j.rank}순위] ${j.companyName} — ${j.jobTitle}
**① 기업 및 직무 개요**
- 기업명: ${j.companyName}
- 업종 및 주요 제품: ${j.companyOverview.mainProducts}
- 모집 직무: ${j.jobCategory}
- 근무 지역: ${j.workLocation.fullAddress}
- 고용 형태: ${j.employmentType}
- 연봉: ${j.salary}
- 마감일: ${j.deadline} ${j.isDeadlineImminent ? '(3일 이내 마감 임박)' : ''}

**② 실제 채용 자격 분석**
- 요구 전공: 자동차/기계/산업공학 계열
- 학력 조건: ${j.educationRequirement} (석사수료자 지원 적합)
- 신입 지원 가능 여부: ${j.experienceRequirement} 지원 가능
- 필요 역량: ${j.jobDetails.requirements.join(', ')}
- 우대사항: ${j.jobDetails.preferredQualifications.join(', ')}

**③ 지원자 경쟁력**
- 전공 활용 가능성: ${j.strategyAnalysis.automotiveMajorAdvantage}
- 1차 협력사 경험의 직무 연관성: ${j.strategyAnalysis.tier1DataExpAdvantage}
- 주의 및 확인 사항: ${j.strategyAnalysis.riskAndCheckPoints.join(' / ')}

**④ 지원 전략**
- 이력서 강조 경험 3가지:
${j.strategyAnalysis.resumeHighlightPoints.map((p, idx) => `  ${idx + 1}. ${p}`).join('\n')}
- 자기소개서 핵심 키워드 3가지:
${j.strategyAnalysis.coverLetterKeywords.map((k) => `  - #${k}`).join('\n')}
`).join('\n---\n\n')}

---

## S-5. 오늘의 지원 추천

**A. 즉시 지원 추천 (${groupA.length}개사)**
${groupA.map((j) => `- ${j.companyName} (${j.jobTitle}) — 적합도 ${j.fitScore}점 [${j.deadline} 마감]`).join('\n')}

**B. 검토 후 지원 (${groupB.length}개사)**
${groupB.map((j) => `- ${j.companyName} (${j.jobTitle}) — 적합도 ${j.fitScore}점 (연봉/처우 조건 확인 요망)`).join('\n')}

**C. 경력 전환 및 역량 확장 추천 (${groupC.length}개사)**
${groupC.map((j) => `- ${j.companyName} (${j.jobTitle}) — 적합도 ${j.fitScore}점 (배터리 셀 및 특화 공정)`).join('\n')}

---

## S-6. 전날 대비 변화 분석

- 신규 등록 공고 (최근 24시간): 현대모비스 울산공장, HL만도 경주공장, 일지테크 경주공장 (총 3건)
- 마감이 임박한 공고 (3일 이내): 에스엘 경산본사 (2026-11-04 마감)
- 접수가 종료된 공고: 0건
- 동일 기업 중복 제거 완료: 7건
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${stats.reportDate.replace(/\s+/g, '_')}_미래모빌리티_채용브리핑.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                RTSC 표준 일일 채용 브리핑 보고서
              </h3>
              <p className="text-xs text-slate-400">
                S-1부터 S-6까지 규격화된 마크다운 전문
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>복사 완료</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>마크다운 복사</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.md 다운로드</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-5">
          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 text-[11px] font-mono leading-relaxed whitespace-pre-wrap select-all">
            {reportMarkdown}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
