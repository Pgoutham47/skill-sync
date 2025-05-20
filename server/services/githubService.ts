
import axios from 'axios';
import { Skill } from '../../generated/prisma';

// GitHub API base URL
const GITHUB_API_URL = 'https://api.github.com';

/**
 * Extract skills from GitHub profile and repositories
 */
export const extractSkillsFromGithub = async (username: string): Promise<Partial<Skill>[]> => {
  try {
    // Get user profile
    const userResponse = await axios.get(`${GITHUB_API_URL}/users/${username}`);
    const user = userResponse.data;
    
    // Get user repositories
    const reposResponse = await axios.get(`${GITHUB_API_URL}/users/${username}/repos?sort=updated&per_page=100`);
    const repos = reposResponse.data;
    
    // Extract languages used in repositories
    const languageMap: Record<string, number> = {};
    const languagePromises = repos.slice(0, 10).map(async (repo: any) => {
      try {
        const langResponse = await axios.get(repo.languages_url);
        const languages = langResponse.data;
        
        // Add language bytes to the map
        Object.entries(languages).forEach(([lang, bytes]: [string, any]) => {
          if (!languageMap[lang]) {
            languageMap[lang] = 0;
          }
          languageMap[lang] += bytes;
        });
      } catch (error) {
        console.error(`Error fetching languages for repo ${repo.name}:`, error);
      }
    });
    
    await Promise.all(languagePromises);
    
    // Convert languages to skills with levels based on usage
    const totalBytes = Object.values(languageMap).reduce((sum: number, bytes: any) => sum + bytes, 0);
    const skills: Partial<Skill>[] = Object.entries(languageMap)
      .filter(([_, bytes]) => bytes > 0)
      .map(([language, bytes]: [string, any]) => {
        const percentage = (bytes / totalBytes) * 100;
        let level: string;
        let levelScore: number;
        
        if (percentage > 30) {
          level = 'Advanced';
          levelScore = 75 + (percentage - 30) / 2; // 75-95
        } else if (percentage > 10) {
          level = 'Intermediate';
          levelScore = 40 + (percentage - 10) * 2; // 40-75
        } else {
          level = 'Beginner';
          levelScore = 20 + percentage * 2; // 20-40
        }
        
        return {
          name: language,
          level,
          levelScore: Math.min(Math.round(levelScore), 100),
          source: 'github',
          category: 'Programming',
          verified: true,
          description: `Extracted from GitHub repositories. Used in ${
            repos.filter((repo: any) => 
              repo.language === language
            ).length
          } repositories.`
        };
      });
    
    // Add additional skills based on repository topics
    const topicSkills: Record<string, number> = {};
    
    repos.forEach((repo: any) => {
      if (repo.topics && repo.topics.length) {
        repo.topics.forEach((topic: string) => {
          // Normalize topic to skill name (e.g., 'machine-learning' to 'Machine Learning')
          const skillName = topic
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            
          if (!topicSkills[skillName]) {
            topicSkills[skillName] = 0;
          }
          topicSkills[skillName]++;
        });
      }
    });
    
    // Convert topics to skills
    Object.entries(topicSkills).forEach(([topic, count]) => {
      // Avoid duplicating programming languages
      if (Object.keys(languageMap).includes(topic)) {
        return;
      }
      
      let category = 'Other';
      let levelScore = 0;
      
      // Determine category based on topic
      if (['React', 'Vue', 'Angular', 'Frontend', 'Backend', 'Fullstack'].includes(topic)) {
        category = 'Programming';
      } else if (['Machine Learning', 'Data Science', 'Analytics', 'Big Data'].includes(topic)) {
        category = 'Data Science';
      } else if (['Kubernetes', 'Docker', 'CI/CD', 'DevOps'].includes(topic)) {
        category = 'DevOps';
      } else if (['Design', 'UI', 'UX'].includes(topic)) {
        category = 'Design';
      }
      
      // Determine level based on repository count
      if (count >= 5) {
        levelScore = 75; // Advanced
      } else if (count >= 2) {
        levelScore = 50; // Intermediate
      } else {
        levelScore = 30; // Beginner
      }
      
      skills.push({
        name: topic,
        level: levelScore >= 75 ? 'Advanced' : levelScore >= 40 ? 'Intermediate' : 'Beginner',
        levelScore,
        source: 'github',
        category,
        verified: true,
        description: `Used in ${count} GitHub repositories as a topic.`
      });
    });
    
    return skills;
  } catch (error) {
    console.error('Error extracting skills from GitHub:', error);
    throw error;
  }
};

/**
 * Extract GitHub username from URL
 */
export const extractGithubUsername = (githubUrl: string): string | null => {
  try {
    const url = new URL(githubUrl);
    if (url.hostname !== 'github.com') {
      return null;
    }
    
    // Extract username from path (e.g., github.com/username)
    const pathParts = url.pathname.split('/').filter(Boolean);
    return pathParts.length > 0 ? pathParts[0] : null;
  } catch (error) {
    return null;
  }
};
