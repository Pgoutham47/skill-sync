
import express from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  getUserSkills, 
  createSkillAssessment,
  getLearningPaths,
  createLearningPath
} from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

// Skills routes
router.get('/skills', getUserSkills);
router.post('/skills', createSkillAssessment);

// Learning paths routes
router.get('/learning-paths', getLearningPaths);
router.post('/learning-paths', createLearningPath);

export default router;
