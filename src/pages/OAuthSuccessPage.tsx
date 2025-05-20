
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const OAuthSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading } = useAuth();
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      toast({
        title: 'Authentication Failed',
        description: 'Could not retrieve authentication token',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    
    // Store token in local storage
    localStorage.setItem('skillsync_token', token);
    
    toast({
      title: 'Authentication Successful',
      description: 'You have been successfully authenticated',
    });
    
    // Redirect to dashboard
    navigate('/dashboard');
  }, [navigate, searchParams]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-skillsync-background">
      <Loader className="w-12 h-12 animate-spin text-skillsync-primary mb-4" />
      <h1 className="text-2xl font-bold mb-2">Processing Authentication</h1>
      <p className="text-muted-foreground">Please wait while we complete your sign in...</p>
    </div>
  );
};

export default OAuthSuccessPage;
