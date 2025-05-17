
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader, Book, Clock, Calendar, ExternalLink, Download, RefreshCcw } from 'lucide-react';

// Sample data for learning path
interface LearningResource {
  id: string;
  name: string;
  provider: string;
  providerLogo: string;
  skillId: string;
  skillName: string;
  skillCategory: string;
  skillUrgency: 'High' | 'Medium' | 'Low';
  estimatedHours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'Course' | 'Tutorial' | 'Project' | 'Book' | 'Video';
  url: string;
  description: string;
  completed: boolean;
}

const sampleLearningPath: LearningResource[] = [
  {
    id: '1',
    name: 'AWS Certified Cloud Practitioner',
    provider: 'AWS Training',
    providerLogo: 'https://www.svgrepo.com/show/331300/aws.svg',
    skillId: '1',
    skillName: 'Cloud Services (AWS)',
    skillCategory: 'Technical',
    skillUrgency: 'High',
    estimatedHours: 20,
    difficulty: 'Beginner',
    type: 'Course',
    url: 'https://aws.amazon.com/training/course-descriptions/cloud-practitioner-essentials/',
    description: 'Fundamental AWS Cloud concepts, services, security, architecture, pricing, and support.',
    completed: false
  },
  {
    id: '2',
    name: 'Kubernetes for Absolute Beginners',
    provider: 'Udemy',
    providerLogo: 'https://www.svgrepo.com/show/354200/udemy-icon.svg',
    skillId: '2',
    skillName: 'Kubernetes',
    skillCategory: 'Technical',
    skillUrgency: 'High',
    estimatedHours: 15,
    difficulty: 'Beginner',
    type: 'Course',
    url: 'https://www.udemy.com/course/learn-kubernetes/',
    description: 'Learn Kubernetes concepts and how to deploy applications to a Kubernetes cluster.',
    completed: false
  },
  {
    id: '3',
    name: 'TypeScript Handbook',
    provider: 'TypeScript',
    providerLogo: 'https://www.svgrepo.com/show/354478/typescript-icon.svg',
    skillId: '3',
    skillName: 'TypeScript',
    skillCategory: 'Technical',
    skillUrgency: 'Medium',
    estimatedHours: 10,
    difficulty: 'Intermediate',
    type: 'Tutorial',
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    description: 'The official TypeScript documentation covering all language features.',
    completed: false
  },
  {
    id: '4',
    name: 'Python for Data Analysis',
    provider: 'Coursera',
    providerLogo: 'https://www.svgrepo.com/show/306500/coursera.svg',
    skillId: '4',
    skillName: 'Data Analysis',
    skillCategory: 'Technical',
    skillUrgency: 'Medium',
    estimatedHours: 25,
    difficulty: 'Intermediate',
    type: 'Course',
    url: 'https://www.coursera.org/learn/python-data-analysis',
    description: 'Learn to use Python for data manipulation, analysis, and visualization.',
    completed: false
  },
  {
    id: '5',
    name: 'Docker Crash Course',
    provider: 'YouTube',
    providerLogo: 'https://www.svgrepo.com/show/354597/youtube.svg',
    skillId: '5',
    skillName: 'Docker',
    skillCategory: 'Technical',
    skillUrgency: 'Medium',
    estimatedHours: 3,
    difficulty: 'Beginner',
    type: 'Video',
    url: 'https://www.youtube.com/watch?v=pTFZFxd4hOI',
    description: 'Quick introduction to Docker concepts and basic commands.',
    completed: true
  },
  {
    id: '6',
    name: 'Build a Docker Application Project',
    provider: 'GitHub',
    providerLogo: 'https://www.svgrepo.com/show/512317/github-142.svg',
    skillId: '5',
    skillName: 'Docker',
    skillCategory: 'Technical',
    skillUrgency: 'Medium',
    estimatedHours: 8,
    difficulty: 'Intermediate',
    type: 'Project',
    url: 'https://github.com/docker/getting-started',
    description: 'Hands-on project to containerize an application using Docker.',
    completed: false
  },
  {
    id: '7',
    name: 'UX Design Fundamentals',
    provider: 'Udacity',
    providerLogo: 'https://www.svgrepo.com/show/354571/udacity.svg',
    skillId: '6',
    skillName: 'UX Design',
    skillCategory: 'Technical',
    skillUrgency: 'Low',
    estimatedHours: 30,
    difficulty: 'Beginner',
    type: 'Course',
    url: 'https://www.udacity.com/course/ux-design-for-mobile-developers--ud849',
    description: 'Learn the fundamentals of UX design including user research and prototyping.',
    completed: false
  },
  {
    id: '8',
    name: 'Project Management Professional (PMP) Prep',
    provider: 'LinkedIn Learning',
    providerLogo: 'https://www.svgrepo.com/show/448234/linkedin.svg',
    skillId: '7',
    skillName: 'Project Management',
    skillCategory: 'Soft Skills',
    skillUrgency: 'Medium',
    estimatedHours: 35,
    difficulty: 'Advanced',
    type: 'Course',
    url: 'https://www.linkedin.com/learning/cert-prep-project-management-professional-pmp',
    description: 'Preparation for the PMP certification covering all project management knowledge areas.',
    completed: false
  },
  {
    id: '9',
    name: 'Effective Communication Skills',
    provider: 'Coursera',
    providerLogo: 'https://www.svgrepo.com/show/306500/coursera.svg',
    skillId: '8',
    skillName: 'Communication',
    skillCategory: 'Soft Skills',
    skillUrgency: 'Low',
    estimatedHours: 15,
    difficulty: 'Beginner',
    type: 'Course',
    url: 'https://www.coursera.org/learn/effective-communication',
    description: 'Improve verbal, written, and interpersonal communication skills for the workplace.',
    completed: false
  }
];

const LearningPathPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [learningPath, setLearningPath] = useState<LearningResource[]>([]);
  const [filter, setFilter] = useState('all');
  const [timeFrame, setTimeFrame] = useState('3-months');
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLearningPath(sampleLearningPath);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRegeneratePath = () => {
    setRegenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setRegenerating(false);
      toast({
        title: "Learning path updated",
        description: `Your learning path has been adjusted for a ${timeFrame} timeframe.`,
      });
    }, 1500);
  };

  const handleToggleComplete = (resourceId: string) => {
    setLearningPath(prev => 
      prev.map(resource => 
        resource.id === resourceId 
          ? { ...resource, completed: !resource.completed } 
          : resource
      )
    );
  };

  const filteredResources = learningPath.filter(resource => {
    if (filter === 'all') return true;
    if (filter === 'technical') return resource.skillCategory === 'Technical';
    if (filter === 'soft-skills') return resource.skillCategory === 'Soft Skills';
    if (filter === 'completed') return resource.completed;
    if (filter === 'in-progress') return !resource.completed;
    if (filter === 'high-priority') return resource.skillUrgency === 'High';
    return true;
  });

  const countByFilter = (filterType: string) => {
    if (filterType === 'all') return learningPath.length;
    if (filterType === 'technical') return learningPath.filter(r => r.skillCategory === 'Technical').length;
    if (filterType === 'soft-skills') return learningPath.filter(r => r.skillCategory === 'Soft Skills').length;
    if (filterType === 'completed') return learningPath.filter(r => r.completed).length;
    if (filterType === 'in-progress') return learningPath.filter(r => !r.completed).length;
    if (filterType === 'high-priority') return learningPath.filter(r => r.skillUrgency === 'High').length;
    return 0;
  };

  const totalHours = filteredResources.reduce((sum, resource) => sum + resource.estimatedHours, 0);
  const completedHours = filteredResources
    .filter(resource => resource.completed)
    .reduce((sum, resource) => sum + resource.estimatedHours, 0);
  
  const completionPercentage = totalHours > 0 
    ? Math.round((completedHours / totalHours) * 100) 
    : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-700 bg-green-50';
      case 'Intermediate':
        return 'text-blue-700 bg-blue-50';
      case 'Advanced':
        return 'text-purple-700 bg-purple-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Course':
        return <Book className="h-5 w-5" />;
      case 'Video':
        return <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 000-1.69L9.54 5.98A.998.998 0 008 6.82z"></path></svg>;
      case 'Book':
        return <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 4H3a1 1 0 00-1 1v14a1 1 0 001 1h18a1 1 0 001-1V5a1 1 0 00-1-1zm-1 14H4V6h16v12z"></path><path d="M9.5 8.5h5a.5.5 0 000-1h-5a.5.5 0 000 1zM14.5 10h-5a.5.5 0 000 1h5a.5.5 0 000-1zM9.5 13.5h5a.5.5 0 000-1h-5a.5.5 0 000 1z"></path></svg>;
      case 'Project':
        return <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"></path></svg>;
      case 'Tutorial':
        return <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h6v2H9V4zm9 16H6V8h12v12z"></path><path d="M9.5 17h5a.5.5 0 000-1h-5a.5.5 0 000 1zM9.5 14h5a.5.5 0 000-1h-5a.5.5 0 000 1zM9.5 11h5a.5.5 0 000-1h-5a.5.5 0 000 1z"></path></svg>;
      default:
        return <Book className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex-center h-64">
        <div className="flex flex-col items-center">
          <Loader className="animate-spin h-8 w-8 text-skillsync-primary mb-2" />
          <p className="text-muted-foreground">Generating your personalized learning path...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning Path</h1>
        <p className="text-muted-foreground mt-2">
          Your personalized roadmap to develop the skills you need for career success.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion</span>
                  <span>{completionPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-skillsync-primary rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{completedHours} hours completed</span>
                  <span>{totalHours} hours total</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-1/2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Time Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Label htmlFor="timeframe" className="mr-2">Adjust for</Label>
                <Select 
                  value={timeFrame} 
                  onValueChange={setTimeFrame}
                >
                  <SelectTrigger id="timeframe" className="w-40">
                    <SelectValue placeholder="Select time frame" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-month">1 Month</SelectItem>
                    <SelectItem value="3-months">3 Months</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="1-year">1 Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRegeneratePath}
                  disabled={regenerating}
                  className="ml-2"
                >
                  {regenerating ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="all">All ({countByFilter('all')})</TabsTrigger>
          <TabsTrigger value="technical">Technical ({countByFilter('technical')})</TabsTrigger>
          <TabsTrigger value="soft-skills">Soft Skills ({countByFilter('soft-skills')})</TabsTrigger>
          <TabsTrigger value="high-priority">High Priority ({countByFilter('high-priority')})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({countByFilter('in-progress')})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({countByFilter('completed')})</TabsTrigger>
        </TabsList>
        
        <TabsContent value={filter}>
          <div className="relative mt-6">
            <div className="absolute top-0 bottom-0 left-10 w-0.5 bg-gray-200"></div>
            {filteredResources.map((resource, index) => (
              <div key={resource.id} className="relative mb-6 pl-20">
                <div className="absolute left-9 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white border-4 border-skillsync-primary z-10"></div>
                
                <Card className={`${resource.completed ? 'bg-gray-50 border-gray-200' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <Checkbox 
                          id={`complete-${resource.id}`}
                          checked={resource.completed} 
                          onCheckedChange={() => handleToggleComplete(resource.id)}
                          className="mt-1"
                        />
                        <div>
                          <CardTitle className={`${resource.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {resource.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Badge variant="secondary" className="flex gap-1 items-center">
                              {getTypeIcon(resource.type)} {resource.type}
                            </Badge>
                            <span>•</span>
                            <Badge className={`${getDifficultyColor(resource.difficulty)}`}>
                              {resource.difficulty}
                            </Badge>
                            {resource.skillUrgency === 'High' && (
                              <>
                                <span>•</span>
                                <Badge variant="destructive">High Priority</Badge>
                              </>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{resource.estimatedHours} hours</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className={`text-sm ${resource.completed ? 'text-muted-foreground' : ''}`}>
                        {resource.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex items-center gap-1">
                          <img 
                            src={resource.providerLogo} 
                            alt={resource.provider} 
                            className="h-5 w-5"
                          />
                          <span className="text-sm">{resource.provider}</span>
                        </div>
                        
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <span>For skill:</span>
                          <Badge variant="outline">
                            {resource.skillName}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className={`border-t ${resource.completed ? 'border-gray-200' : ''}`}>
                    <Button asChild variant="outline" size="sm" className="gap-1">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        Go to Resource
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between">
        <Button asChild variant="outline">
          <Link to="/skill-gap">
            Back to Skill Gaps
          </Link>
        </Button>
        <Button variant="outline" className="gap-1">
          <Download className="h-4 w-4" />
          Export Learning Path
        </Button>
      </div>
    </div>
  );
};

export default LearningPathPage;
