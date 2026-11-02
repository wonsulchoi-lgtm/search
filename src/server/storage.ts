import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CandidateProfile, ApplicationTrackerItem, JobPosting } from '../types';
import { INITIAL_CANDIDATE_PROFILE } from '../data/mockJobs';

// Determine safe storage directory (use /tmp on Vercel or serverless)
function getSafeDataDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return '/tmp/mobility_data';
  }
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.resolve(__dirname, '../../data');
  } catch {
    return '/tmp/mobility_data';
  }
}

const DATA_DIR = getSafeDataDir();
const PROFILE_FILE = path.join(DATA_DIR, 'profile.json');
const TRACKER_FILE = path.join(DATA_DIR, 'tracker.json');
const CUSTOM_JOBS_FILE = path.join(DATA_DIR, 'custom_jobs.json');

// In-memory fallback cache
let memoryProfile: CandidateProfile = { ...INITIAL_CANDIDATE_PROFILE };
let memoryTracker: ApplicationTrackerItem[] = [
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
let memoryCustomJobs: JobPosting[] = [];

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    // Filesystem may be read-only in some serverless environments
  }
}

// 1. Candidate Profile Storage
export function getStoredProfile(): CandidateProfile {
  ensureDataDir();
  try {
    if (fs.existsSync(PROFILE_FILE)) {
      const data = fs.readFileSync(PROFILE_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed && parsed.major) {
        memoryProfile = parsed;
        return parsed;
      }
    }
  } catch (e) {
    // Fall back to memory
  }
  return memoryProfile;
}

export function saveStoredProfile(profile: CandidateProfile): CandidateProfile {
  memoryProfile = profile;
  ensureDataDir();
  try {
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2), 'utf-8');
  } catch (e) {
    // Memory cache remains intact
  }
  return profile;
}

// 2. Application Tracker Storage
export function getStoredTracker(): ApplicationTrackerItem[] {
  ensureDataDir();
  try {
    if (fs.existsSync(TRACKER_FILE)) {
      const data = fs.readFileSync(TRACKER_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        memoryTracker = parsed;
        return parsed;
      }
    }
  } catch (e) {
    // Fall back to memory
  }
  return memoryTracker;
}

export function saveStoredTracker(items: ApplicationTrackerItem[]): ApplicationTrackerItem[] {
  memoryTracker = items;
  ensureDataDir();
  try {
    fs.writeFileSync(TRACKER_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (e) {
    // Memory cache remains intact
  }
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
  try {
    if (fs.existsSync(CUSTOM_JOBS_FILE)) {
      const data = fs.readFileSync(CUSTOM_JOBS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        memoryCustomJobs = parsed;
        return parsed;
      }
    }
  } catch (e) {
    // Fall back to memory
  }
  return memoryCustomJobs;
}

export function saveCustomJob(job: JobPosting): JobPosting[] {
  const current = getCustomJobs();
  current.unshift(job);
  memoryCustomJobs = current;
  ensureDataDir();
  try {
    fs.writeFileSync(CUSTOM_JOBS_FILE, JSON.stringify(current, null, 2), 'utf-8');
  } catch (e) {
    // Memory cache remains intact
  }
  return current;
}
