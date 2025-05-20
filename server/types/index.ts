
import { User, Profile, Skill, SkillSet, LearningPath } from '../../generated/prisma';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

export interface ProfileUpdateData {
  resumeUrl?: string;
  transcriptUrl?: string;
  githubUrl?: string;
  additionalSkills?: string[];
}

export interface SkillAssessmentResult {
  skills: Partial<Skill>[];
}

export interface SkillGapAnalysis {
  currentSkills: Partial<Skill>[];
  gapSkills: {
    name: string;
    category: string;
    urgency: 'High' | 'Medium' | 'Low';
    currentLevel: number;
    targetLevel: number;
    gap: number;
    relevantJobs: string[];
    description: string;
  }[];
}

export interface LearningPathData {
  title: string;
  description?: string;
  targetJob?: string;
  resources: {
    title: string;
    url: string;
    type: string;
    platform?: string;
    description?: string;
    skillsAddressed: string[];
  }[];
}

export interface ApiError extends Error {
  statusCode?: number;
}
