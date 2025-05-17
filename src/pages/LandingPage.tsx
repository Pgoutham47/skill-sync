
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, BookOpen, FileText } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-white border-b py-4 sticky top-0 z-10 shadow-nav">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-gradient-to-br from-skillsync-primary to-skillsync-tertiary rounded-md" />
            <span className="text-2xl font-bold text-skillsync-dark">
              SkillSync
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="border-skillsync-primary text-skillsync-primary hover:bg-skillsync-primary/10">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-skillsync-primary text-white hover:bg-skillsync-primary/90">
              <Link to="/register">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="bg-gradient-to-br from-skillsync-primary to-skillsync-tertiary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-in">
              AI-Powered Skill Gap Bridge
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 animate-slide-in" style={{ animationDelay: '0.1s' }}>
              Connect your academic experience with industry requirements, 
              and discover personalized learning paths to boost your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <Button asChild size="lg" className="bg-white text-skillsync-primary hover:bg-white/90">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How SkillSync Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-xl">
              <div className="w-16 h-16 bg-skillsync-primary/10 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-skillsync-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Your Profile</h3>
              <p className="text-muted-foreground">
                Upload your resume, transcript, and GitHub link to let our AI analyze your current skills and experience.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-xl">
              <div className="w-16 h-16 bg-skillsync-tertiary/10 rounded-full flex items-center justify-center mb-4">
                <BarChart className="h-8 w-8 text-skillsync-tertiary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Identify Skill Gaps</h3>
              <p className="text-muted-foreground">
                Our AI compares your skills with job market requirements to identify important gaps you need to fill.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-xl">
              <div className="w-16 h-16 bg-skillsync-secondary/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-skillsync-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Learn & Grow</h3>
              <p className="text-muted-foreground">
                Get a personalized learning path with curated resources to help you develop the skills employers need.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/register" className="flex items-center gap-2">
                Create Your Profile <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-skillsync-dark text-white mt-auto pt-10 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between pb-8 border-b border-white/10">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 bg-gradient-to-br from-skillsync-primary to-skillsync-tertiary rounded-md" />
                <span className="text-xl font-bold">
                  SkillSync
                </span>
              </div>
              <p className="text-sm text-white/70 max-w-xs">
                Bridging the gap between academic learning and industry requirements with AI-powered insights.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Platform</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-white/70 hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-sm text-white/70 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-sm text-white/70 hover:text-white">Pricing</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-white/70 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-sm text-white/70 hover:text-white">Guides</a></li>
                  <li><a href="#" className="text-sm text-white/70 hover:text-white">Support</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-white/70 hover:text-white">Privacy</a></li>
                  <li><a href="#" className="text-sm text-white/70 hover:text-white">Terms</a></li>
                  <li><a href="#" className="text-sm text-white/70 hover:text-white">Security</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white/50">
              © {new Date().getFullYear()} SkillSync. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-white/70 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-white">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
