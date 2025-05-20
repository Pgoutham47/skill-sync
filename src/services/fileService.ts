
import api from '@/utils/api';

export type UploadFileResponse = {
  fileId: string;
  fileUrl: string;
};

export const uploadFile = async (
  file: File, 
  fileType: 'resume' | 'transcript' | 'document' | 'image'
): Promise<UploadFileResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileType', fileType);

  const response = await api.post(`/upload/${fileType}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getFileUrl = async (fileId: string): Promise<string> => {
  const response = await api.get(`/upload/${fileId}`);
  return response.data.url;
};
