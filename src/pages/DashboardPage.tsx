
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, BarChart, BookOpen, FileText, Upload, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  profileCompletion: number;
  skillsIdentified: number;
  skillGaps: number;
  coursesRecommended: number;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    profileCompletion: 0,
    skillsIdentified: 0,
    skillGaps: 0,
    coursesRecommended: 0,
  });

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setStats({
        profileCompletion: 30, // Set to a low value to encourage profile completion
        skillsIdentified: 8,
        skillGaps: 5,
        coursesRecommended: 12,
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground mt-2">
          Track your skills, identify gaps, and discover learning opportunities.
        </p>
      </div>
      
      {/* Profile completion notification */}
      <Card className={`border-l-4 ${stats.profileCompletion < 100 ? 'border-l-skillsync-tertiary' : 'border-l-skillsync-secondary'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Profile</CardTitle>
          <CardDescription>
            Complete your profile to get the most accurate skill assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Profile completion</span>
                <span className="text-sm font-medium">{stats.profileCompletion}%</span>
              </div>
              {loading ? (
                <Skeleton className="h-2 w-full" />
              ) : (
                <Progress value={stats.profileCompletion} className="h-2" />
              )}
            </div>
            <Button asChild size="sm">
              <Link to="/profile-builder" className="whitespace-nowrap">
                {stats.profileCompletion === 0 ? 'Start' : 'Continue'} Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Skills Identified</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <div className="text-2xl font-bold">{stats.skillsIdentified}</div>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/skill-assessment" className="text-xs text-skillsync-primary hover:underline">
              View skill profile →
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Skill Gaps</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <div className="text-2xl font-bold">{stats.skillGaps}</div>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/skill-gap" className="text-xs text-skillsync-primary hover:underline">
              View skill gaps →
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Courses Recommended</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <div className="text-2xl font-bold">{stats.coursesRecommended}</div>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/learning-path" className="text-xs text-skillsync-primary hover:underline">
              View learning path →
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Quick actions */}
      <h2 className="text-xl font-semibold mt-6">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button asChild variant="outline" className="h-auto flex-col items-center justify-center p-6 gap-4">
          <Link to="/profile-builder">
            <Upload className="h-6 w-6 mb-2" />
            <span className="font-medium">Upload Profile Data</span>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto flex-col items-center justify-center p-6 gap-4">
          <Link to="/skill-assessment">
            <FileText className="h-6 w-6 mb-2" />
            <span className="font-medium">View Skill Assessment</span>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto flex-col items-center justify-center p-6 gap-4">
          <Link to="/skill-gap">
            <BarChart className="h-6 w-6 mb-2" />
            <span className="font-medium">Analyze Skill Gaps</span>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto flex-col items-center justify-center p-6 gap-4">
          <Link to="/learning-path">
            <BookOpen className="h-6 w-6 mb-2" />
            <span className="font-medium">Learning Path</span>
          </Link>
        </Button>
      </div>
      
      {/* Next Steps */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            Follow these steps to get the most out of SkillSync
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-skillsync-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-skillsync-primary font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium">Complete your profile</h3>
                <p className="text-muted-foreground text-sm">
                  Upload your resume, transcript, and GitHub profile for AI analysis
                </p>
                <Button asChild size="sm" variant="link" className="p-0 h-auto mt-1">
                  <Link to="/profile-builder" className="flex items-center gap-1">
                    Go to Profile Builder <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-skillsync-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-skillsync-primary font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium">Review your skill assessment</h3>
                <p className="text-muted-foreground text-sm">
                  See the skills our AI identified from your profile and rate your proficiency
                </p>
                <Button asChild size="sm" variant="link" className="p-0 h-auto mt-1">
                  <Link to="/skill-assessment" className="flex items-center gap-1">
                    View Skill Assessment <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-skillsync-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-skillsync-primary font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium">Check your skill gaps</h3>
                <p className="text-muted-foreground text-sm">
                  Compare your skills against industry requirements to identify critical gaps
                </p>
                <Button asChild size="sm" variant="link" className="p-0 h-auto mt-1">
                  <Link to="/skill-gap" className="flex items-center gap-1">
                    Analyze Skill Gaps <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-skillsync-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-skillsync-primary font-bold">4</span>
              </div>
              <div>
                <h3 className="font-medium">Follow your learning path</h3>
                <p className="text-muted-foreground text-sm">
                  Get a personalized roadmap to acquire the skills you need for career success
                </p>
                <Button asChild size="sm" variant="link" className="p-0 h-auto mt-1">
                  <Link to="/learning-path" className="flex items-center gap-1">
                    View Learning Path <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
