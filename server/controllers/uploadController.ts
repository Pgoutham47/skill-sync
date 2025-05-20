
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database';

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Handle file upload
export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const fileType = req.body.fileType || 'document';
    const fileExtension = path.extname(req.file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Save file to disk
    fs.writeFileSync(filePath, req.file.buffer);

    // Save file reference to database
    const fileRecord = await prisma.file.create({
      data: {
        userId: req.user.id,
        fileName,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: filePath,
        type: fileType,
      },
    });

    // Update user profile based on file type
    if (fileType === 'resume' || fileType === 'transcript') {
      await prisma.profile.update({
        where: { userId: req.user.id },
        data: {
          ...(fileType === 'resume' ? { resumeUrl: `/api/upload/${fileRecord.id}` } : {}),
          ...(fileType === 'transcript' ? { transcriptUrl: `/api/upload/${fileRecord.id}` } : {}),
        },
      });
    }

    res.status(201).json({
      success: true,
      fileId: fileRecord.id,
      fileUrl: `/api/upload/${fileRecord.id}`,
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during file upload',
    });
  }
};

// Get file URL by ID
export const getFileUrl = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.fileId;
    
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    // Check permission if needed
    if (file.userId !== req.user?.id) {
      // Allow access only if file is public
      if (!file.isPublic) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }
    }

    // Send file
    res.sendFile(file.path);
  } catch (error) {
    console.error('File retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during file retrieval',
    });
  }
};
