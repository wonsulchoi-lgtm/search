import React, { useState, useMemo, useEffect } from 'react';
import { 
  CandidateProfile, 
  JobPosting, 
  BriefingStats, 
  ApplicationTrackerItem 
} from './types';
import { 
  INITIAL_CANDIDATE_PROFILE, 
  INITIAL_JOB_POSTINGS, 
  GYEONGNAM_EXPANDED_POSTINGS 
} from './data/mockJobs';
import { apiService, calculateClientFitScore } from './services/apiService';
import { Header } from './components/Header';
import { BriefingSummaryCard } from './components/BriefingSummaryCard';
import { JobTable } from './components/JobTable';
import { Top3DeepDive } from './components/Top3DeepDive';
import { FitAnalysisGuide } from './components/FitAnalysisGuide';
import { ActionRecommendations } from './components/ActionRecommendations';
import { ConsultantChat } from './components/ConsultantChat';
import { JobDetailModal } from './components/JobDetailModal';
import { CoverLetterModal } from './components/CoverLetterModal';
import { InterviewModal } from './components/InterviewModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { ReportExportModal } from './components/ReportExportModal';
import { ApplicationTracker } from './components/ApplicationTracker';
import { KnowledgeBase } from './components/KnowledgeBase';
import { ResumeReviewModal } from './components/ResumeReviewModal';
import { CustomJobAddModal } from './components/CustomJobAddModal';
import { 
  Briefcase, 
  Award, 
  Target, 
  MessageSquare, 
  BookmarkCheck, 
  Sparkles, 
  Layers, 
  BookOpen 
} from 'lucide-react';

export default function App() {
  // 1. Candidate Profile State
  const [profile, setProfile] = useState<CandidateProfile>(INITIAL_CANDIDATE_PROFILE);

  // 2. Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'top3' | 'scoring' | 'chat' | 'tracker' | 'knowledge'>('overview');

  // 3. Modals State
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<JobPosting | null>(null);
  const [selectedJobForCoverLetter, setSelectedJobForCoverLetter] = useState<JobPosting | null>(null);
  const [selectedJobForInterview, setSelectedJobForInterview] = useState<JobPosting | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isResumeReviewOpen, setIsResumeReviewOpen] = useState(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 4. Jobs & Custom Jobs list
  const [jobList, setJobList] = useState<JobPosting[]>(INITIAL_JOB_POSTINGS);

  // 5. Application Tracker State
  const [trackerItems, setTrackerItems] = useState<ApplicationTrackerItem[]>([]);

  // Load initial profile, jobs, and tracker safely using apiService
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [loadedProfile, loadedTracker, loadedJobs] = await Promise.all([
          apiService.getProfile(),
          apiService.getTracker(),
          apiService.getJobs(profile.includeGyeongnam),
        ]);

        if (isMounted) {
          if (loadedProfile) setProfile(loadedProfile);
          if (loadedTracker) setTrackerItems(loadedTracker);
          if (loadedJobs && loadedJobs.length > 0) setJobList(loadedJobs);
        }
      } catch (err) {
        console.error('Initialization fallback:', err);
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save profile update
  const handleSaveProfile = async (updated: CandidateProfile) => {
    setProfile(updated);
    try {
      await apiService.updateProfile(updated);
      const jobs = await apiService.getJobs(updated.includeGyeongnam);
      if (jobs && jobs.length > 0) setJobList(jobs);
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Gyeongnam region
  const handleToggleGyeongnam = async () => {
    const updated = {
      ...profile,
      includeGyeongnam: !profile.includeGyeongnam,
    };
    await handleSaveProfile(updated);
  };

  // Dynamic re-scoring on client for instant reactivity
  const computedJobs = useMemo(() => {
    let list = [...jobList];
    if (profile.includeGyeongnam && !list.some((j) => j.workLocation.region.includes('경남'))) {
      list = [...list, ...GYEONGNAM_EXPANDED_POSTINGS];
    } else if (!profile.includeGyeongnam) {
      list = list.filter((j) => !j.workLocation.region.includes('경남'));
    }

    return list.map((job) => {
      let score = job.fitScore;
      if (job.isSalaryBelowTarget && profile.targetSalary <= 3900) {
        score += 3;
      }
      if (profile.certifications.length > 0) {
        score = Math.min(100, score + Math.min(3, profile.certifications.length));
      }
      if (profile.toolsAndSkills.length > 0) {
        score = Math.min(100, score + Math.min(2, profile.toolsAndSkills.length));
      }
      return { ...job, fitScore: score };
    }).sort((a, b) => b.fitScore - a.fitScore)
      .map((job, idx) => ({ ...job, rank: idx + 1 }));
  }, [jobList, profile]);

  // S-1 Briefing Stats
  const stats: BriefingStats = useMemo(() => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일`;

    const activeList = computedJobs;
    const newCount = activeList.filter((j) => j.isNew).length;
    const imminentCount = activeList.filter((j) => j.isDeadlineImminent).length;
    const highFitCount = activeList.filter((j) => j.fitScore >= 80).length;

    return {
      reportDate: dateStr,
      searchTime: '매일 오전 08:00 (Asia/Seoul)',
      targetRegions: profile.includeGyeongnam ? '부산·울산·경북·경남' : '부산·울산·경북',
      targetJob: '생산관리 중심',
      collectedCount: activeList.length,
      activeCount: activeList.length,
      newCount,
      imminentCount,
      highFitCount,
    };
  }, [computedJobs, profile.includeGyeongnam]);

  // Handle Refresh from Backend
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [jobs, tracker] = await Promise.all([
        apiService.getJobs(profile.includeGyeongnam),
        apiService.getTracker(),
      ]);
      if (jobs && jobs.length > 0) setJobList(jobs);
      if (tracker) setTrackerItems(tracker);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Tracker CRUD synced with apiService
  const handleToggleTrack = async (job: JobPosting) => {
    const exists = trackerItems.find((item) => item.jobId === job.id);
    if (exists) {
      const updated = await apiService.deleteTrackerItem(job.id);
      setTrackerItems(updated);
    } else {
      const newItem: ApplicationTrackerItem = {
        jobId: job.id,
        companyName: job.companyName,
        jobTitle: job.jobTitle,
        status: '관심',
        appliedDate: new Date().toISOString().split('T')[0],
      };
      const updated = await apiService.addTrackerItem(newItem);
      setTrackerItems(updated);
    }
  };

  const handleUpdateStatus = async (jobId: string, newStatus: ApplicationTrackerItem['status']) => {
    const updated = await apiService.updateTrackerItem(jobId, { status: newStatus });
    setTrackerItems(updated);
  };

  const handleRemoveTrackItem = async (jobId: string) => {
    const updated = await apiService.deleteTrackerItem(jobId);
    setTrackerItems(updated);
  };

  // Add custom job callback
  const handleCustomJobAdded = (newJob: JobPosting) => {
    setJobList((prev) => [newJob, ...prev]);
    setSelectedJobForDetail(newJob);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Header with quick tools */}
      <Header
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onExportReport={() => setIsExportModalOpen(true)}
        onRefreshData={handleRefresh}
        onOpenAddJob={() => setIsAddJobOpen(true)}
        onOpenResumeReview={() => setIsResumeReviewOpen(true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>일일 채용 브리핑 & TOP 10</span>
            </button>

            <button
              onClick={() => setActiveTab('top3')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'top3'
                  ? 'bg-blue-950 text-blue-300 border border-blue-700/80 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-blue-400" />
              <span>TOP 3 심층 전략</span>
            </button>

            <button
              onClick={() => setActiveTab('scoring')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'scoring'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/80 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Target className="w-4 h-4 text-emerald-400" />
              <span>100점 적합도 모델</span>
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'knowledge'
                  ? 'bg-amber-950 text-amber-300 border border-amber-700/80 shadow-sm shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>제조업 KPI 면접사전</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'chat'
                  ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/80 shadow-sm shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>AI 컨설턴트 챗</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping hidden sm:inline" />
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'tracker'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-cyan-400" />
              <span>지원 파이프라인</span>
              {trackerItems.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-600 text-white">
                  {trackerItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab 1: Overview (S-1, S-2, S-5, S-6) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <BriefingSummaryCard
              stats={stats}
              includeGyeongnam={profile.includeGyeongnam}
              onToggleGyeongnam={handleToggleGyeongnam}
            />

            <JobTable
              jobs={computedJobs}
              onSelectJob={(job) => setSelectedJobForDetail(job)}
              onOpenCoverLetter={(job) => setSelectedJobForCoverLetter(job)}
              onOpenInterview={(job) => setSelectedJobForInterview(job)}
            />

            <ActionRecommendations
              jobs={computedJobs}
              onSelectJob={(job) => setSelectedJobForDetail(job)}
              onOpenCoverLetter={(job) => setSelectedJobForCoverLetter(job)}
            />
          </div>
        )}

        {/* Tab 2: S-4 Top 3 Deep Dive */}
        {activeTab === 'top3' && (
          <div className="space-y-6">
            <Top3DeepDive
              topJobs={computedJobs}
              onOpenCoverLetter={(job) => setSelectedJobForCoverLetter(job)}
              onOpenInterview={(job) => setSelectedJobForInterview(job)}
            />
          </div>
        )}

        {/* Tab 3: S-3 100-Point Fit Analysis Model */}
        {activeTab === 'scoring' && (
          <div className="space-y-6">
            <FitAnalysisGuide />
          </div>
        )}

        {/* Tab 4: Manufacturing KPI & Terminology Knowledge Base */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <KnowledgeBase />
          </div>
        )}

        {/* Tab 5: AI Career Consultant Chat */}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            <ConsultantChat
              profile={profile}
              selectedJob={selectedJobForDetail || computedJobs[0]}
            />
          </div>
        )}

        {/* Tab 6: Application Pipeline Tracker */}
        {activeTab === 'tracker' && (
          <div className="space-y-6">
            <ApplicationTracker
              trackerItems={trackerItems}
              jobs={computedJobs}
              onUpdateStatus={handleUpdateStatus}
              onRemoveItem={handleRemoveTrackItem}
              onSelectJob={(job) => setSelectedJobForDetail(job)}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 미래모빌리티 신입 생산관리 취업 지원 AI 에이전트 • Vercel & Cloud Run 상호 호환 아키텍처</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>부산·울산·경북 미래차 제조산업 특화</span>
            <span>•</span>
            <span>공정관리 데이터 실무 & 석사수료 맞춤 분석</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedJobForDetail && (
        <JobDetailModal
          job={selectedJobForDetail}
          profile={profile}
          onClose={() => setSelectedJobForDetail(null)}
          onOpenCoverLetter={(job) => setSelectedJobForCoverLetter(job)}
          onOpenInterview={(job) => setSelectedJobForInterview(job)}
          onToggleTrack={handleToggleTrack}
          isBookmarked={trackerItems.some((i) => i.jobId === selectedJobForDetail.id)}
        />
      )}

      {selectedJobForCoverLetter && (
        <CoverLetterModal
          job={selectedJobForCoverLetter}
          profile={profile}
          onClose={() => setSelectedJobForCoverLetter(null)}
        />
      )}

      {selectedJobForInterview && (
        <InterviewModal
          job={selectedJobForInterview}
          profile={profile}
          onClose={() => setSelectedJobForInterview(null)}
        />
      )}

      {isProfileModalOpen && (
        <ProfileEditModal
          profile={profile}
          onSave={handleSaveProfile}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {isExportModalOpen && (
        <ReportExportModal
          jobs={computedJobs}
          profile={profile}
          stats={stats}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {isResumeReviewOpen && (
        <ResumeReviewModal
          onClose={() => setIsResumeReviewOpen(false)}
        />
      )}

      {isAddJobOpen && (
        <CustomJobAddModal
          onClose={() => setIsAddJobOpen(false)}
          onJobAdded={handleCustomJobAdded}
        />
      )}
    </div>
  );
}
