
import { Request, Response } from 'express';
import prisma from '../config/database';
import type { ProfileUpdateData } from '../types';
import { extractGithubUsername, extractSkillsFromGithub } from '../services/githubService';
import { v4 as uuidv4 } from 'uuid';

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving profile',
    });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const profileData: ProfileUpdateData = req.body;

    // If GitHub URL changed, extract skills
    let githubSkills = [];
    if (profileData.githubUrl) {
      try {
        const username = extractGithubUsername(profileData.githubUrl);
        if (username) {
          githubSkills = await extractSkillsFromGithub(username);
        }
      } catch (error) {
        console.error('GitHub skills extraction error:', error);
        // Continue with profile update even if GitHub extraction fails
      }
    }

    // Update or create profile
    const profile = await prisma.profile.upsert({
      where: { userId: req.user.id },
      update: profileData,
      create: {
        userId: req.user.id,
        ...profileData,
        additionalSkills: profileData.additionalSkills || [],
      },
    });

    // If GitHub skills were extracted, create a new skill set
    if (githubSkills.length > 0) {
      const skillSet = await prisma.skillSet.create({
        data: {
          userId: req.user.id,
        },
      });

      await prisma.skill.createMany({
        data: githubSkills.map((skill: any) => ({
          id: uuidv4(),
          name: skill.name,
          level: skill.level,
          levelScore: skill.levelScore,
          source: skill.source,
          category: skill.category,
          verified: skill.verified || false,
          description: skill.description,
          skillSetId: skillSet.id,
        })),
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
      skillsExtracted: githubSkills.length > 0,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
    });
  }
};

// Get user skill assessments
export const getUserSkills = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const skillSets = await prisma.skillSet.findMany({
      where: { userId: req.user.id },
      include: {
        skills: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // If no skill sets found, return empty array
    if (skillSets.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // Return the most recent skill set
    const latestSkillSet = skillSets[0];
    
    res.status(200).json({
      success: true,
      data: latestSkillSet.skills,
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving skills',
    });
  }
};

// Create or update skills for a user
export const createSkillAssessment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const { skills } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid skills data',
      });
    }

    // Create a new skill set
    const skillSet = await prisma.skillSet.create({
      data: {
        userId: req.user.id,
      },
    });

    // Create skills within the skill set
    const createdSkills = await prisma.skill.createMany({
      data: skills.map((skill: any) => ({
        name: skill.name,
        level: skill.level,
        levelScore: skill.levelScore,
        source: skill.source,
        category: skill.category,
        verified: skill.verified || false,
        description: skill.description,
        skillSetId: skillSet.id,
      })),
    });

    res.status(201).json({
      success: true,
      message: `Created ${createdSkills.count} skills for user`,
      data: {
        skillSetId: skillSet.id,
      },
    });
  } catch (error) {
    console.error('Create skill assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating skill assessment',
    });
  }
};

// Get learning paths
export const getLearningPaths = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const learningPaths = await prisma.learningPath.findMany({
      where: { userId: req.user.id },
      include: {
        resources: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: learningPaths,
    });
  } catch (error) {
    console.error('Get learning paths error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving learning paths',
    });
  }
};

// Create a learning path
export const createLearningPath = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const { title, description, targetJob, resources } = req.body;

    if (!title || !resources || !Array.isArray(resources)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and resources',
      });
    }

    const learningPath = await prisma.learningPath.create({
      data: {
        userId: req.user.id,
        title,
        description,
        targetJob,
        resources: {
          createMany: {
            data: resources.map((resource: any) => ({
              title: resource.title,
              url: resource.url,
              type: resource.type,
              platform: resource.platform || null,
              description: resource.description || null,
              skillsAddressed: resource.skillsAddressed || [],
            })),
          },
        },
      },
      include: {
        resources: true,
      },
    });

    res.status(201).json({
      success: true,
      data: learningPath,
    });
  } catch (error) {
    console.error('Create learning path error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating learning path',
    });
  }
};
