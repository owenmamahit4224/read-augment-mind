
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { githubService } from '@/services/githubService';
import { Loader2, CheckCircle, XCircle, Github } from 'lucide-react';

const GitHubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setError(`GitHub OAuth error: ${error}`);
        return;
      }

      if (!code) {
        setStatus('error');
        setError('No authorization code received from GitHub');
        return;
      }

      try {
        await githubService.handleOAuthCallback(code);
        setStatus('success');
        
        // Redirect to settings after a brief delay
        setTimeout(() => {
          navigate('/?tab=settings');
        }, 2000);
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const handleRetry = () => {
    navigate('/?tab=settings');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <Github className="h-8 w-8" />
            </div>
          </div>
          <CardTitle>GitHub Authentication</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Processing your GitHub authentication...'}
            {status === 'success' && 'Successfully connected to GitHub!'}
            {status === 'error' && 'Authentication failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Connecting to GitHub...</span>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>Authentication successful!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You will be redirected to the settings page shortly.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span>Authentication failed</span>
              </div>
              {error && (
                <p className="text-sm text-muted-foreground p-3 bg-red-50 rounded border border-red-200">
                  {error}
                </p>
              )}
              <Button onClick={handleRetry} variant="outline" className="w-full">
                Return to Settings
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GitHubCallback;
