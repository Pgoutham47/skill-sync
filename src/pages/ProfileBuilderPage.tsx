
import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, FileText, Github, Loader, Upload, X } from 'lucide-react';

interface FileUploadProps {
  fileType: 'resume' | 'transcript';
  icon?: JSX.Element;
  title: string;
  description: string;
  acceptedFormats: string;
  onFileChange: (file: File | null) => void;
  uploadedFile: File | null;
}

const FileUpload = ({ 
  fileType, 
  icon, 
  title, 
  description, 
  acceptedFormats, 
  onFileChange, 
  uploadedFile 
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
        isDragging 
          ? 'border-skillsync-primary bg-skillsync-primary/5' 
          : uploadedFile 
            ? 'border-skillsync-secondary bg-skillsync-secondary/5'
            : 'border-border hover:border-muted-foreground/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center text-center">
        {uploadedFile ? (
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-skillsync-secondary" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">{uploadedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {Math.round(uploadedFile.size / 1024)} KB
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRemoveFile}
              className="flex items-center"
            >
              <X className="h-4 w-4 mr-1" /> Remove {fileType}
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              {icon || <Upload className="h-10 w-10 text-muted-foreground" />}
            </div>
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {description}
            </p>
            
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse files
              </Button>
              <p className="text-xs text-muted-foreground">
                {acceptedFormats}
              </p>
            </div>
          </>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={acceptedFormats.split(',').join(',')}
        />
      </div>
    </div>
  );
};

const SkillTag = ({ skill, onRemove }: { skill: string; onRemove: () => void }) => {
  return (
    <Badge variant="secondary" className="flex items-center gap-1 py-1 px-3">
      {skill}
      <button onClick={onRemove} className="ml-1 rounded-full hover:bg-muted p-0.5">
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
};

const ProfileBuilderPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upload');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setProgress(0);
    
    // Simulate file upload and processing
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            toast({
              title: "Profile data uploaded successfully",
              description: "Your data is being analyzed. Please check the Skill Assessment section.",
            });
            setIsSubmitting(false);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const getCompletionStatus = () => {
    let completed = 0;
    let total = 3; // Resume, transcript, GitHub
    
    if (resumeFile) completed++;
    if (transcriptFile) completed++;
    if (githubUrl) completed++;
    
    return Math.floor((completed / total) * 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Builder</h1>
        <p className="text-muted-foreground mt-2">
          Upload your data to help our AI analyze your skills and create personalized recommendations.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Profile Completion</CardTitle>
          <CardDescription>
            Complete your profile to get more accurate skill assessments and recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Profile completion</span>
              <span className="text-sm font-medium">{getCompletionStatus()}%</span>
            </div>
            <Progress value={getCompletionStatus()} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
            <TabsTrigger value="skills">Additional Skills</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-6 pt-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <FileUpload
                  fileType="resume"
                  icon={<FileText className="h-10 w-10 text-muted-foreground" />}
                  title="Upload Resume"
                  description="Upload your resume in PDF format"
                  acceptedFormats=".pdf,.doc,.docx"
                  onFileChange={setResumeFile}
                  uploadedFile={resumeFile}
                />
              </div>
              
              <div>
                <FileUpload
                  fileType="transcript"
                  icon={<FileText className="h-10 w-10 text-muted-foreground" />}
                  title="Upload Transcript"
                  description="Upload your academic transcript"
                  acceptedFormats=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onFileChange={setTranscriptFile}
                  uploadedFile={transcriptFile}
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('github')}
              >
                Next: GitHub
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="github" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" /> GitHub Profile
                </CardTitle>
                <CardDescription>
                  Link your GitHub profile to analyze your repositories and contributions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="github-url">GitHub Profile URL</Label>
                  <Input
                    id="github-url"
                    placeholder="https://github.com/yourusername"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll analyze your public repositories to identify programming languages and technologies you've used.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('upload')}
              >
                Previous: Upload Files
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('skills')}
              >
                Next: Additional Skills
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="skills" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Additional Skills</CardTitle>
                <CardDescription>
                  Add any skills that might not be captured in your resume or GitHub profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Add a skill (e.g., Python, Project Management)"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleAddSkill}
                    >
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 min-h-[100px] border rounded-md p-3">
                    {skills.length === 0 ? (
                      <p className="text-sm text-muted-foreground w-full text-center my-auto">
                        No additional skills added yet
                      </p>
                    ) : (
                      skills.map((skill) => (
                        <SkillTag 
                          key={skill} 
                          skill={skill} 
                          onRemove={() => handleRemoveSkill(skill)} 
                        />
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t px-6 py-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('github')}
                >
                  Previous: GitHub
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || (!resumeFile && !transcriptFile && !githubUrl && skills.length === 0)}
                  className="space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin h-4 w-4" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Submit Profile</span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
      
      {isSubmitting && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Processing your files</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Our AI is analyzing your profile data. This may take a moment...
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileBuilderPage;
