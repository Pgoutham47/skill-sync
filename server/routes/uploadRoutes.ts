
import express from 'express';
import { uploadFile, getFileUrl } from '../controllers/uploadController';
import { protect } from '../middleware/auth';
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // Default 5MB
  },
});

const router = express.Router();

// All routes are protected
router.use(protect);

// File upload route with file type
router.post('/:fileType', upload.single('file'), uploadFile);

// Get file URL by ID
router.get('/:fileId', getFileUrl);

export default router;
