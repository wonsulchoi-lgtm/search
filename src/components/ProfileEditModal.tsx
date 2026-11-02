import React, { useState } from 'react';
import { CandidateProfile } from '../types';
import { 
  X, 
  UserCheck, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  MapPin, 
  DollarSign, 
  Briefcase,
  GraduationCap,
  Save,
  RotateCcw
} from 'lucide-react';
import { INITIAL_CANDIDATE_PROFILE } from '../data/mockJobs';

interface ProfileEditModalProps {
  profile: CandidateProfile;
  onSave: (updated: CandidateProfile) => void;
  onClose: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  profile,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<CandidateProfile>({ ...profile });
  const [certInput, setCertInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const handleAddCert = () => {
    if (certInput.trim() && !formData.certifications.includes(certInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, certInput.trim()],
      }));
      setCertInput('');
    }
  };

  const handleRemoveCert = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== name),
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.toolsAndSkills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        toolsAndSkills: [...prev.toolsAndSkills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      toolsAndSkills: prev.toolsAndSkills.filter((s) => s !== name),
    }));
  };

  const handleResetToDefault = () => {
    setFormData({ ...INITIAL_CANDIDATE_PROFILE });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                지원자 기본 프로필 설정 (RTSC T-1)
              </h3>
              <p className="text-xs text-slate-400">
                수정 시 실시간으로 공고 적합도 및 추천 우선순위가 재계산됩니다.
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          {/* Strict Rule 1: Master's Degree Status Notice */}
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-amber-200">프로필 해석 원칙 #1 (석사수료 vs 학위 취득):</strong>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                현재 프로필은 <span className="text-amber-300 font-bold">'석사수료'</span> 상태로 고정되어 있습니다. 학위 취득이 필수인 공고에 자격 충족으로 임의 간주하지 않으며, 실무에서는 연구 분석력을 겸비한 신입으로 포지셔닝합니다.
              </p>
            </div>
          </div>

          {/* Grid fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Major */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">전공</label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Age & Career Status */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">나이 및 구분</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
                <span className="text-slate-400">세 (신입 지원)</span>
              </div>
            </div>

            {/* Experience */}
            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-medium mb-1">직무 경험</label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Target Job */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">희망 직무</label>
              <input
                type="text"
                value={formData.targetJob}
                onChange={(e) => setFormData({ ...formData, targetJob: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Target Salary */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">희망 연봉 (세전 기준)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="100"
                  value={formData.targetSalary}
                  onChange={(e) => setFormData({ ...formData, targetSalary: Number(e.target.value) })}
                  className="w-28 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
                <span className="text-slate-400">만 원 / 연</span>
              </div>
            </div>

          </div>

          {/* Region settings */}
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">희망 근무 지역</label>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                부산광역시
              </span>
              <span className="px-3 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                울산광역시
              </span>
              <span className="px-3 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                경상북도
              </span>
              <label className="flex items-center gap-1.5 ml-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={formData.includeGyeongnam}
                  onChange={(e) => setFormData({ ...formData, includeGyeongnam: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>경상남도(양산·창원·김해) 포함</span>
              </label>
            </div>
          </div>

          {/* Additional Certifications */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">보유 자격증 (선택)</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                placeholder="예: 일반기계기사, 품질경영기사, CPIM"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleAddCert}
                className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition"
              >
                추가
              </button>
            </div>
            {formData.certifications.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {formData.certifications.map((c) => (
                  <span key={c} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                    <span>{c}</span>
                    <button type="button" onClick={() => handleRemoveCert(c)} className="text-slate-400 hover:text-rose-400">×</button>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[11px] text-slate-500">현재 입력된 자격증 없음 (원칙 6: 미입력이어도 역량 없다고 단정하지 않음)</span>
            )}
          </div>

          {/* Tools / Skills */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">보유 기술 및 데이터 분석 툴 (선택)</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="예: Minitab, Excel VBA, SQL, MES 기초"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition"
              >
                추가
              </button>
            </div>
            {formData.toolsAndSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {formData.toolsAndSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                    <span>{s}</span>
                    <button type="button" onClick={() => handleRemoveSkill(s)} className="text-slate-400 hover:text-rose-400">×</button>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[11px] text-slate-500">현재 입력된 툴 없음</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3 py-2 rounded-xl text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>기본 프로필로 초기화</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>프로필 저장 및 재계산</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
