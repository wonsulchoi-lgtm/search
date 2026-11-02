import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CandidateProfile, ApplicationTrackerItem, JobPosting } from '../types';
import { INITIAL_CANDIDATE_PROFILE, INITIAL_JOB_POSTINGS, GYEONGNAM_EXPANDED_POSTINGS } from '../data/mockJobs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const PROFILE_FILE = path.join(DATA_DIR, 'profile.json');
const TRACKER_FILE = path.join(DATA_DIR, 'tracker.json');
const CUSTOM_JOBS_FILE = path.join(DATA_DIR, 'custom_jobs.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 1. Candidate Profile Storage
export function getStoredProfile(): CandidateProfile {
  ensureDataDir();
  if (fs.existsSync(PROFILE_FILE)) {
    try {
      const data = fs.readFileSync(PROFILE_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read profile.json, falling back to initial profile', e);
    }
  }
  return { ...INITIAL_CANDIDATE_PROFILE };
}

export function saveStoredProfile(profile: CandidateProfile): CandidateProfile {
  ensureDataDir();
  fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2), 'utf-8');
  return profile;
}

// 2. Application Tracker Storage
export function getStoredTracker(): ApplicationTrackerItem[] {
  ensureDataDir();
  if (fs.existsSync(TRACKER_FILE)) {
    try {
      const data = fs.readFileSync(TRACKER_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read tracker.json', e);
    }
  }
  // Default sample tracker
  const defaultTracker: ApplicationTrackerItem[] = [
    {
      jobId: 'mobis-ulsan-2026-01',
      companyName: '현대모비스 (울산공장)',
      jobTitle: '전동화 PE시스템 및 배터리팩 생산관리 신입 채용',
      status: '서류작성중',
      appliedDate: '2026-11-02',
      notes: '1차사 공정데이터 OEE 관리 경험 강조하여 작성 중',
    },
    {
      jobId: 'sl-gyeongsan-2026-02',
      companyName: '에스엘(SL) (경산본사)',
      jobTitle: '미래모빌리티 램프/전장 모듈 생산관리 신입사원 채용',
      status: '관심',
      appliedDate: '2026-11-02',
      notes: '11월 4일 마감 임박 공고, 우선 서류 제출 필요',
    },
  ];
  fs.writeFileSync(TRACKER_FILE, JSON.stringify(defaultTracker, null, 2), 'utf-8');
  return defaultTracker;
}

export function saveStoredTracker(items: ApplicationTrackerItem[]): ApplicationTrackerItem[] {
  ensureDataDir();
  fs.writeFileSync(TRACKER_FILE, JSON.stringify(items, null, 2), 'utf-8');
  return items;
}

export function upsertTrackerItem(item: ApplicationTrackerItem): ApplicationTrackerItem[] {
  const current = getStoredTracker();
  const idx = current.findIndex((i) => i.jobId === item.jobId);
  if (idx >= 0) {
    current[idx] = { ...current[idx], ...item };
  } else {
    current.push(item);
  }
  return saveStoredTracker(current);
}

export function deleteTrackerItem(jobId: string): ApplicationTrackerItem[] {
  const current = getStoredTracker();
  const filtered = current.filter((i) => i.jobId !== jobId);
  return saveStoredTracker(filtered);
}

// 3. Custom Jobs Storage
export function getCustomJobs(): JobPosting[] {
  ensureDataDir();
  if (fs.existsSync(CUSTOM_JOBS_FILE)) {
    try {
      const data = fs.readFileSync(CUSTOM_JOBS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read custom_jobs.json', e);
    }
  }
  return [];
}

export function saveCustomJob(job: JobPosting): JobPosting[] {
  const current = getCustomJobs();
  current.unshift(job);
  fs.writeFileSync(CUSTOM_JOBS_FILE, JSON.stringify(current, null, 2), 'utf-8');
  return current;
}
