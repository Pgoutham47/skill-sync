
import express from 'express';
import { uploadFile, getFileUrl } from '../controllers/uploadController';
import { protect } from '../middleware/auth';
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const router = express.Router();

// All routes are protected
router.use(protect);

// File upload route
router.post('/', upload.single('file'), uploadFile);

// Get file URL by ID
router.get('/:fileId', getFileUrl);

export default router;
