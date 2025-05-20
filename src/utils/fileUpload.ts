
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

// API base URL from environment variable or default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Upload a file to the server
 * @param file The file to upload
 * @param fileType Type of the file (resume, transcript, etc.)
 * @param onProgress Optional progress callback
 */
export const uploadFile = async (
  file: File, 
  fileType: string,
  onProgress?: (percentage: number) => void
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);

    const token = localStorage.getItem('skillsync_token');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentage);
        }
      }
    });

    return response.data.fileUrl;
  } catch (error: any) {
    toast({
      title: "Upload Failed",
      description: error.response?.data?.message || "Failed to upload file. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Validates a file before upload
 * @param file The file to validate
 * @param allowedTypes Array of allowed MIME types
 * @param maxSizeMB Maximum file size in MB
 */
export const validateFile = (
  file: File,
  allowedTypes: string[],
  maxSizeMB: number = 5
): boolean => {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    toast({
      title: "Invalid File Type",
      description: `Allowed file types: ${allowedTypes.join(', ')}`,
      variant: "destructive",
    });
    return false;
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    toast({
      title: "File Too Large",
      description: `Maximum file size is ${maxSizeMB}MB`,
      variant: "destructive",
    });
    return false;
  }

  return true;
};
