
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader, Edit, Download, Check, AlertTriangle, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Sample data for skill assessment
interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  source: 'resume' | 'github' | 'transcript' | 'user';
  category: 'Programming' | 'Design' | 'Data Science' | 'DevOps' | 'Soft Skills' | 'Other';
  levelScore: number; // 1-100
  verified: boolean;
  description?: string;
}

const skillData: Skill[] = [
  {
    id: '1',
    name: 'JavaScript',
    level: 'Advanced',
    source: 'github',
    category: 'Programming',
    levelScore: 85,
    verified: true,
    description: 'Proficient in modern JavaScript, including ES6+ features and asynchronous programming.'
  },
  {
    id: '2',
    name: 'React',
    level: 'Intermediate',
    source: 'github',
    category: 'Programming',
    levelScore: 72,
    verified: true,
    description: 'Experience building single-page applications with React and related libraries.'
  },
  {
    id: '3',
    name: 'Python',
    level: 'Intermediate',
    source: 'resume',
    category: 'Programming',
    levelScore: 65,
    verified: true,
    description: 'Used for data analysis and backend development.'
  },
  {
    id: '4',
    name: 'UX Design',
    level: 'Beginner',
    source: 'resume',
    category: 'Design',
    levelScore: 35,
    verified: false,
    description: 'Basic understanding of user experience design principles.'
  },
  {
    id: '5',
    name: 'Data Analysis',
    level: 'Beginner',
    source: 'transcript',
    category: 'Data Science',
    levelScore: 40,
    verified: true,
    description: 'Coursework in statistics and data analysis.'
  },
  {
    id: '6',
    name: 'Node.js',
    level: 'Intermediate',
    source: 'github',
    category: 'Programming',
    levelScore: 60,
    verified: true,
    description: 'Experience developing RESTful APIs and backend services.'
  },
  {
    id: '7',
    name: 'Project Management',
    level: 'Intermediate',
    source: 'resume',
    category: 'Soft Skills',
    levelScore: 70,
    verified: false,
    description: 'Experience managing small to medium-sized projects.'
  },
  {
    id: '8',
    name: 'Docker',
    level: 'Beginner',
    source: 'github',
    category: 'DevOps',
    levelScore: 30,
    verified: true,
    description: 'Basic usage of Docker for containerization.'
  }
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner':
      return 'bg-yellow-500';
    case 'Intermediate':
      return 'bg-blue-500';
    case 'Advanced':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'github':
      return <span className="text-xs font-mono">GitHub</span>;
    case 'resume':
      return <span className="text-xs font-mono">Resume</span>;
    case 'transcript':
      return <span className="text-xs font-mono">Academic</span>;
    case 'user':
      return <span className="text-xs font-mono">User</span>;
    default:
      return null;
  }
};

const SkillAssessmentPage = () => {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filter, setFilter] = useState('all');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setSkills(skillData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredSkills = skills.filter(skill => {
    if (showVerifiedOnly && !skill.verified) return false;
    if (filter === 'all') return true;
    return skill.category.toLowerCase() === filter.toLowerCase();
  });

  const categoryCount = (category: string) => {
    return skills.filter(skill => 
      skill.category.toLowerCase() === category.toLowerCase() &&
      (!showVerifiedOnly || skill.verified)
    ).length;
  };

  const renderSkillLevel = (levelScore: number) => {
    let level = '';
    let color = '';
    
    if (levelScore < 40) {
      level = 'Beginner';
      color = 'bg-yellow-500';
    } else if (levelScore < 75) {
      level = 'Intermediate';
      color = 'bg-blue-500';
    } else {
      level = 'Advanced';
      color = 'bg-green-500';
    }
    
    return (
      <div className="space-y-1 w-full max-w-[150px]">
        <div className="flex justify-between items-center text-xs">
          <span>{level}</span>
          <span>{levelScore}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`${color} h-2 rounded-full`} style={{ width: `${levelScore}%` }}></div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex-center h-64">
        <div className="flex flex-col items-center">
          <Loader className="animate-spin h-8 w-8 text-skillsync-primary mb-2" />
          <p className="text-muted-foreground">Loading skill assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skill Assessment</h1>
        <p className="text-muted-foreground mt-2">
          Review the skills our AI identified from your profile data.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="flex items-center space-x-2">
            <Switch 
              id="verified" 
              checked={showVerifiedOnly} 
              onCheckedChange={setShowVerifiedOnly} 
            />
            <Label htmlFor="verified">Show verified skills only</Label>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''} found
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Edit className="h-4 w-4" />
            <span>Edit Skills</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
        <TabsList className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7">
          <TabsTrigger value="all">All ({skills.length})</TabsTrigger>
          <TabsTrigger value="programming">Programming ({categoryCount('programming')})</TabsTrigger>
          <TabsTrigger value="data science">Data Science ({categoryCount('data science')})</TabsTrigger>
          <TabsTrigger value="design">Design ({categoryCount('design')})</TabsTrigger>
          <TabsTrigger value="devops">DevOps ({categoryCount('devops')})</TabsTrigger>
          <TabsTrigger value="soft skills">Soft Skills ({categoryCount('soft skills')})</TabsTrigger>
          <TabsTrigger value="other">Other ({categoryCount('other')})</TabsTrigger>
        </TabsList>
        
        <TabsContent value={filter}>
          {filteredSkills.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">No skills found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {showVerifiedOnly 
                    ? "No verified skills found in this category. Try disabling the verified filter."
                    : "No skills found in this category. Try uploading more profile data."}
                </p>
                <Button asChild size="sm">
                  <Link to="/profile-builder">Upload More Data</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
              {filteredSkills.map(skill => (
                <Card key={skill.id} className="overflow-hidden">
                  <div className={`h-1 ${getLevelColor(skill.level)}`} />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {skill.name}
                          {skill.verified && (
                            <Check className="h-4 w-4 text-skillsync-secondary" />
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          {getSourceIcon(skill.source)}
                          <Badge variant="outline" className="text-xs capitalize">
                            {skill.category}
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= skill.levelScore / 20 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {skill.description || 'No description available.'}
                    </p>
                    {renderSkillLevel(skill.levelScore)}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between">
        <Button asChild variant="outline">
          <Link to="/profile-builder">
            Update Profile
          </Link>
        </Button>
        <Button asChild>
          <Link to="/skill-gap">
            View Skill Gaps
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SkillAssessmentPage;
