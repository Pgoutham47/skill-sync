
import { userAPI } from '@/utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export type Skill = {
  id?: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  source: 'resume' | 'github' | 'transcript' | 'user';
  category: 'Programming' | 'Design' | 'Data Science' | 'DevOps' | 'Soft Skills' | 'Other';
  levelScore: number;
  verified: boolean;
  description?: string;
};

export const useSkills = () => {
  const queryClient = useQueryClient();
  
  // Fetch skills
  const { data: skills = [], isLoading, error } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await userAPI.getSkills();
      return response.data.data || [];
    },
  });

  // Create skill assessment
  const createSkillsMutation = useMutation({
    mutationFn: async (skillsData: { skills: Skill[] }) => {
      const response = await userAPI.createSkillAssessment(skillsData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast({
        title: "Skills Updated",
        description: "Your skills assessment has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update skills. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createSkillAssessment = (skills: Skill[]) => {
    return createSkillsMutation.mutate({ skills });
  };

  return {
    skills,
    isLoading,
    error,
    createSkillAssessment,
    isUpdating: createSkillsMutation.isPending,
  };
};
