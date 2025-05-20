
import { userAPI } from '@/utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export type LearningResource = {
  title: string;
  url: string;
  type: string;
  platform?: string;
  description?: string;
  skillsAddressed: string[];
};

export type LearningPath = {
  id?: string;
  title: string;
  description?: string;
  targetJob?: string;
  resources: LearningResource[];
};

export const useLearningPaths = () => {
  const queryClient = useQueryClient();
  
  // Fetch learning paths
  const { data: learningPaths = [], isLoading, error } = useQuery({
    queryKey: ['learningPaths'],
    queryFn: async () => {
      const response = await userAPI.getLearningPaths();
      return response.data.data || [];
    },
  });

  // Create learning path
  const createPathMutation = useMutation({
    mutationFn: async (pathData: LearningPath) => {
      const response = await userAPI.createLearningPath(pathData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningPaths'] });
      toast({
        title: "Learning Path Created",
        description: "Your learning path has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.response?.data?.message || "Failed to create learning path. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createLearningPath = (pathData: LearningPath) => {
    return createPathMutation.mutate(pathData);
  };

  return {
    learningPaths,
    isLoading,
    error,
    createLearningPath,
    isCreating: createPathMutation.isPending,
  };
};
