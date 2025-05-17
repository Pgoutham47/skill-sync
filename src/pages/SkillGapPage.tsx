
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Loader, AlertTriangle, Book, Briefcase, ArrowUpRight } from 'lucide-react';

// Sample data for skill gaps
interface SkillGap {
  id: string;
  name: string;
  category: 'Technical' | 'Soft Skills';
  urgency: 'High' | 'Medium' | 'Low';
  currentLevel: number; // 0-100
  targetLevel: number; // 0-100
  gap: number; // targetLevel - currentLevel
  relevantJobs: string[];
  description: string;
}

const skillGapData: SkillGap[] = [
  {
    id: '1',
    name: 'Cloud Services (AWS)',
    category: 'Technical',
    urgency: 'High',
    currentLevel: 0,
    targetLevel: 80,
    gap: 80,
    relevantJobs: ['Full Stack Developer', 'DevOps Engineer', 'Backend Developer'],
    description: 'Knowledge of AWS services like EC2, S3, Lambda, and CloudFormation is essential for cloud-based application development.'
  },
  {
    id: '2',
    name: 'Kubernetes',
    category: 'Technical',
    urgency: 'High',
    currentLevel: 0,
    targetLevel: 75,
    gap: 75,
    relevantJobs: ['DevOps Engineer', 'Cloud Architect', 'Site Reliability Engineer'],
    description: 'Orchestration tool for containerized applications, critical for modern deployments.'
  },
  {
    id: '3',
    name: 'TypeScript',
    category: 'Technical',
    urgency: 'Medium',
    currentLevel: 0,
    targetLevel: 80,
    gap: 80,
    relevantJobs: ['Frontend Developer', 'Full Stack Developer', 'JavaScript Developer'],
    description: 'Strongly typed programming language that builds on JavaScript with static type definitions.'
  },
  {
    id: '4',
    name: 'Data Analysis',
    category: 'Technical',
    urgency: 'Medium',
    currentLevel: 40,
    targetLevel: 85,
    gap: 45,
    relevantJobs: ['Data Scientist', 'Data Analyst', 'Business Intelligence Developer'],
    description: 'Ability to interpret complex data and draw insights using tools like Python, R, and SQL.'
  },
  {
    id: '5',
    name: 'Docker',
    category: 'Technical',
    urgency: 'Medium',
    currentLevel: 30,
    targetLevel: 85,
    gap: 55,
    relevantJobs: ['DevOps Engineer', 'Full Stack Developer', 'Backend Developer'],
    description: 'Containerization platform to build, share, and run applications in isolated environments.'
  },
  {
    id: '6',
    name: 'UX Design',
    category: 'Technical',
    urgency: 'Low',
    currentLevel: 35,
    targetLevel: 75,
    gap: 40,
    relevantJobs: ['Frontend Developer', 'UI/UX Designer', 'Web Designer'],
    description: 'Design principles focused on creating intuitive and accessible user experiences.'
  },
  {
    id: '7',
    name: 'Project Management',
    category: 'Soft Skills',
    urgency: 'Medium',
    currentLevel: 60,
    targetLevel: 85,
    gap: 25,
    relevantJobs: ['Tech Lead', 'Product Manager', 'Project Manager'],
    description: 'Ability to coordinate teams, manage timelines, and deliver projects efficiently.'
  },
  {
    id: '8',
    name: 'Communication',
    category: 'Soft Skills',
    urgency: 'Low',
    currentLevel: 70,
    targetLevel: 90,
    gap: 20,
    relevantJobs: ['Team Lead', 'Product Manager', 'Customer Success'],
    description: 'Clear and effective verbal and written communication skills crucial for team collaboration.'
  }
];

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'High':
      return 'bg-red-500';
    case 'Medium':
      return 'bg-amber-500';
    case 'Low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getUrgencyTextColor = (urgency: string) => {
  switch (urgency) {
    case 'High':
      return 'text-red-700 bg-red-50';
    case 'Medium':
      return 'text-amber-700 bg-amber-50';
    case 'Low':
      return 'text-green-700 bg-green-50';
    default:
      return 'text-gray-700 bg-gray-50';
  }
};

const SkillGapPage = () => {
  const [loading, setLoading] = useState(true);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setSkillGaps(skillGapData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredSkillGaps = skillGaps.filter(gap => {
    if (filter === 'all') return true;
    if (filter === 'technical') return gap.category === 'Technical';
    if (filter === 'soft') return gap.category === 'Soft Skills';
    if (filter === 'high') return gap.urgency === 'High';
    if (filter === 'medium') return gap.urgency === 'Medium';
    if (filter === 'low') return gap.urgency === 'Low';
    return true;
  });

  const countByFilter = (filterType: string) => {
    if (filterType === 'all') return skillGaps.length;
    if (filterType === 'technical') return skillGaps.filter(gap => gap.category === 'Technical').length;
    if (filterType === 'soft') return skillGaps.filter(gap => gap.category === 'Soft Skills').length;
    if (filterType === 'high') return skillGaps.filter(gap => gap.urgency === 'High').length;
    if (filterType === 'medium') return skillGaps.filter(gap => gap.urgency === 'Medium').length;
    if (filterType === 'low') return skillGaps.filter(gap => gap.urgency === 'Low').length;
    return 0;
  };

  if (loading) {
    return (
      <div className="flex-center h-64">
        <div className="flex flex-col items-center">
          <Loader className="animate-spin h-8 w-8 text-skillsync-primary mb-2" />
          <p className="text-muted-foreground">Analyzing your skill gaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skill Gap Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Identify and prioritize skills you need to develop for your career goals.
        </p>
      </div>
      
      {skillGaps.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">No skill gaps found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn't identify any significant skill gaps. Try uploading a more complete profile or exploring different job roles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/profile-builder">Update Profile</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/job-market">Explore Job Market</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  High Urgency
                </CardTitle>
                <CardDescription>Skills that need immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {skillGaps.filter(gap => gap.urgency === 'High').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Medium Urgency
                </CardTitle>
                <CardDescription>Skills to focus on soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {skillGaps.filter(gap => gap.urgency === 'Medium').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-green-500" />
                  Low Urgency
                </CardTitle>
                <CardDescription>Skills to develop over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {skillGaps.filter(gap => gap.urgency === 'Low').length}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
              <TabsList className="grid grid-cols-2 md:grid-cols-6">
                <TabsTrigger value="all">All ({countByFilter('all')})</TabsTrigger>
                <TabsTrigger value="technical">Technical ({countByFilter('technical')})</TabsTrigger>
                <TabsTrigger value="soft">Soft Skills ({countByFilter('soft')})</TabsTrigger>
                <TabsTrigger value="high">High Urgency ({countByFilter('high')})</TabsTrigger>
                <TabsTrigger value="medium">Medium Urgency ({countByFilter('medium')})</TabsTrigger>
                <TabsTrigger value="low">Low Urgency ({countByFilter('low')})</TabsTrigger>
              </TabsList>
              
              <TabsContent value={filter}>
                <div className="grid grid-cols-1 gap-4 mt-6">
                  {filteredSkillGaps.map(gap => (
                    <Card key={gap.id}>
                      <div className={`h-1 ${getUrgencyColor(gap.urgency)}`} />
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {gap.name}
                              <Badge className={`${getUrgencyTextColor(gap.urgency)}`}>
                                {gap.urgency} Urgency
                              </Badge>
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {gap.category}
                            </CardDescription>
                          </div>
                          <Badge variant="outline">
                            {gap.gap}% Gap
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            {gap.description}
                          </p>
                          
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Current Level</span>
                              <span>Target Level</span>
                            </div>
                            <div className="relative pt-4">
                              <Progress 
                                value={gap.currentLevel} 
                                className="h-2 bg-gray-200" 
                              />
                              <div 
                                className="absolute top-0 h-6 border-l-2 border-dashed border-skillsync-primary/70 flex items-center"
                                style={{ left: `${gap.targetLevel}%` }}
                              >
                                <span className="text-xs text-skillsync-primary font-medium ml-1">
                                  {gap.targetLevel}%
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-2">Relevant Job Roles:</p>
                            <div className="flex flex-wrap gap-2">
                              {gap.relevantJobs.map(job => (
                                <Badge key={job} variant="secondary">{job}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t">
                        <Button variant="ghost" size="sm" asChild className="gap-1">
                          <Link to="/job-market">
                            <Briefcase className="h-4 w-4" />
                            <span>Market Demand</span>
                          </Link>
                        </Button>
                        <Button size="sm" asChild className="gap-1">
                          <Link to="/learning-path">
                            <Book className="h-4 w-4" />
                            <span>Learning Resources</span>
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
      
      <div className="flex justify-between">
        <Button asChild variant="outline">
          <Link to="/job-market">
            Back to Job Market
          </Link>
        </Button>
        <Button asChild>
          <Link to="/learning-path" className="flex items-center gap-1">
            Generate Learning Path
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SkillGapPage;
