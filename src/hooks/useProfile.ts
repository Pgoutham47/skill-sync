
import { useState } from 'react';
import { userAPI } from '@/utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export type ProfileData = {
  resumeUrl?: string;
  transcriptUrl?: string;
  githubUrl?: string;
  additionalSkills?: string[];
};

export const useProfile = () => {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  
  // Fetch profile data
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await userAPI.getProfile();
      return response.data.data;
    },
  });

  // Update profile
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: ProfileData) => {
      const response = await userAPI.updateProfile(profileData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateProfile = (profileData: ProfileData) => {
    return updateProfileMutation.mutate(profileData);
  };

  // For file uploads (to be implemented with form data)
  const uploadFile = async (file: File, fileType: 'resume' | 'transcript') => {
    setIsUploading(true);
    
    try {
      // Will be implemented with proper file upload endpoint
      // For now, we'll just simulate a successful upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Mock successful upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock URL
      const fileUrl = `https://storage.example.com/${fileType}/${Date.now()}-${file.name}`;
      
      toast({
        title: "File Uploaded",
        description: `Your ${fileType} has been uploaded successfully.`,
      });
      
      return fileUrl;
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || `Failed to upload your ${fileType}.`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    uploadFile,
    isUploading,
  };
};
