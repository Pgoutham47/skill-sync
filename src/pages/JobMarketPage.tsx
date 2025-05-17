
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader, Info, Check, AlertTriangle, ChevronRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Sector
} from 'recharts';

// Sample data for job market analysis
interface MarketSkill {
  id: string;
  name: string;
  demandScore: number; // 1-100
  userScore: number | null; // 1-100, null if user doesn't have the skill
  gap: number; // Calculated from demand - user score
  category: string;
  trending: boolean;
}

const jobRoles = [
  'Full Stack Developer',
  'Data Scientist',
  'UX Designer',
  'DevOps Engineer',
  'Product Manager',
  'AI/ML Engineer',
];

const regions = [
  'North America',
  'Europe',
  'Asia Pacific',
  'Global',
];

// Sample market skills data
const marketSkillsData: MarketSkill[] = [
  {
    id: '1',
    name: 'JavaScript',
    demandScore: 90,
    userScore: 85,
    gap: 5,
    category: 'Programming',
    trending: true
  },
  {
    id: '2',
    name: 'React',
    demandScore: 85,
    userScore: 72,
    gap: 13,
    category: 'Programming',
    trending: true
  },
  {
    id: '3',
    name: 'Python',
    demandScore: 80,
    userScore: 65,
    gap: 15,
    category: 'Programming',
    trending: true
  },
  {
    id: '4',
    name: 'UX Design',
    demandScore: 75,
    userScore: 35,
    gap: 40,
    category: 'Design',
    trending: false
  },
  {
    id: '5',
    name: 'Data Analysis',
    demandScore: 85,
    userScore: 40,
    gap: 45,
    category: 'Data Science',
    trending: true
  },
  {
    id: '6',
    name: 'Node.js',
    demandScore: 80,
    userScore: 60,
    gap: 20,
    category: 'Programming',
    trending: false
  },
  {
    id: '7',
    name: 'Cloud Services (AWS)',
    demandScore: 95,
    userScore: null,
    gap: 95,
    category: 'DevOps',
    trending: true
  },
  {
    id: '8',
    name: 'Docker',
    demandScore: 85,
    userScore: 30,
    gap: 55,
    category: 'DevOps',
    trending: true
  },
  {
    id: '9',
    name: 'Kubernetes',
    demandScore: 80,
    userScore: null,
    gap: 80,
    category: 'DevOps',
    trending: true
  },
  {
    id: '10',
    name: 'TypeScript',
    demandScore: 85,
    userScore: null,
    gap: 85,
    category: 'Programming',
    trending: true
  },
];

const getGapSeverity = (gap: number) => {
  if (gap >= 60) return 'High';
  if (gap >= 30) return 'Medium';
  return 'Low';
};

const getGapColor = (gap: number) => {
  if (gap >= 60) return '#ef4444'; // red
  if (gap >= 30) return '#f59e0b'; // amber
  return '#22c55e'; // green
};

const JobMarketPage = () => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('Full Stack Developer');
  const [region, setRegion] = useState('Global');
  const [marketSkills, setMarketSkills] = useState<MarketSkill[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setMarketSkills(marketSkillsData);
      setLoading(false);
    }, 1000);
  }, []);

  // Effect to refetch data when filters change
  useEffect(() => {
    setLoading(true);
    // Simulate API call with new filters
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [role, region]);

  // Prepare data for charts
  const barChartData = marketSkills
    .filter(skill => skill.userScore !== null)
    .map(skill => ({
      name: skill.name,
      'Market Demand': skill.demandScore,
      'Your Skills': skill.userScore,
    }));

  const pieChartData = [
    {
      name: 'High Gap',
      value: marketSkills.filter(skill => skill.gap >= 60).length,
      color: '#ef4444',
    },
    {
      name: 'Medium Gap',
      value: marketSkills.filter(skill => skill.gap >= 30 && skill.gap < 60).length,
      color: '#f59e0b',
    },
    {
      name: 'Low Gap',
      value: marketSkills.filter(skill => skill.gap < 30).length,
      color: '#22c55e',
    },
  ];

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#333" className="text-sm">
          {payload.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" fill="#333" className="text-lg font-semibold">
          {value}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#999" className="text-xs">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  const missingSkills = marketSkills.filter(skill => skill.userScore === null);
  const gapSkills = marketSkills
    .filter(skill => skill.userScore !== null && skill.gap > 0)
    .sort((a, b) => b.gap - a.gap);

  if (loading) {
    return (
      <div className="flex-center h-64">
        <div className="flex flex-col items-center">
          <Loader className="animate-spin h-8 w-8 text-skillsync-primary mb-2" />
          <p className="text-muted-foreground">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Market Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Compare your skills with current job market demands and identify opportunities.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <Label htmlFor="role">Job Role</Label>
          <Select 
            value={role} 
            onValueChange={setRole}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Select job role" />
            </SelectTrigger>
            <SelectContent>
              {jobRoles.map(jobRole => (
                <SelectItem key={jobRole} value={jobRole}>{jobRole}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/2">
          <Label htmlFor="region">Region</Label>
          <Select 
            value={region} 
            onValueChange={setRegion}
          >
            <SelectTrigger id="region">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(regionOption => (
                <SelectItem key={regionOption} value={regionOption}>{regionOption}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Skills vs. Market Demand</CardTitle>
            <CardDescription>
              Comparison of your skill levels against market requirements for {role}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Market Demand" fill="#2563eb" name="Market Demand" />
                  <Bar dataKey="Your Skills" fill="#10b981" name="Your Skills" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Skill Gap Distribution</CardTitle>
            <CardDescription>
              Breakdown of your skill gaps by severity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col space-y-2 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm">High Gap (60%+): {pieChartData[0].value} skills</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                <span className="text-sm">Medium Gap (30-59%): {pieChartData[1].value} skills</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">Low Gap (0-29%): {pieChartData[2].value} skills</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Missing Skills</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <CardDescription>
              Important skills for {role} that are not found in your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {missingSkills.length === 0 ? (
              <p className="text-sm text-center py-4 text-muted-foreground">
                No missing skills detected. Great job!
              </p>
            ) : (
              <ul className="space-y-2">
                {missingSkills.map(skill => (
                  <li key={skill.id} className="flex items-center justify-between p-2 rounded-md border">
                    <div>
                      <p className="font-medium">
                        {skill.name}
                        {skill.trending && (
                          <Badge className="ml-2 bg-blue-500" variant="secondary">Trending</Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{skill.category}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold py-0.5 px-2 rounded-full bg-red-100 text-red-700">
                        {skill.demandScore}% Demand
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Top Skill Gaps</CardTitle>
              <Info className="h-5 w-5 text-skillsync-tertiary" />
            </div>
            <CardDescription>
              Skills you have that need improvement to meet market demand
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {gapSkills.length === 0 ? (
              <p className="text-sm text-center py-4 text-muted-foreground">
                No significant skill gaps detected. Keep up the good work!
              </p>
            ) : (
              <ul className="space-y-2">
                {gapSkills.slice(0, 5).map(skill => (
                  <li key={skill.id} className="flex items-center justify-between p-2 rounded-md border">
                    <div>
                      <p className="font-medium">{skill.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{skill.category}</p>
                        <Badge variant="outline" className={`
                          text-xs border-none ${
                            getGapSeverity(skill.gap) === 'High' ? 'bg-red-100 text-red-700' :
                            getGapSeverity(skill.gap) === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                          }
                        `}>
                          {getGapSeverity(skill.gap)} Gap
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getGapColor(skill.gap) }}></div>
                      <span>{skill.gap}% Gap</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-skillsync-primary/5 border-skillsync-primary/20">
        <CardHeader>
          <CardTitle className="text-skillsync-primary">Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-skillsync-primary/20 flex items-center justify-center">
                  <Check className="h-5 w-5 text-skillsync-primary" />
                </div>
              </div>
              <div>
                <p className="font-medium">View detailed skill gaps</p>
                <p className="text-sm text-muted-foreground">
                  Check the Skill Gap Dashboard for a complete analysis of your skill gaps
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-skillsync-primary/20 flex items-center justify-center">
                  <Check className="h-5 w-5 text-skillsync-primary" />
                </div>
              </div>
              <div>
                <p className="font-medium">Generate a personalized learning path</p>
                <p className="text-sm text-muted-foreground">
                  Get recommendations for courses and resources to improve your skills
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-skillsync-primary/20 flex items-center justify-center">
                  <Check className="h-5 w-5 text-skillsync-primary" />
                </div>
              </div>
              <div>
                <p className="font-medium">Update your profile regularly</p>
                <p className="text-sm text-muted-foreground">
                  Keep your skill assessment current as you learn new skills
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button asChild>
            <Link to="/skill-gap" className="flex items-center gap-1">
              View Skill Gap Dashboard <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default JobMarketPage;
