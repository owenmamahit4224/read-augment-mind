
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useGitHubSync } from '@/hooks/useGitHubSync';
import { Github, Cloud, Download, Upload, LogOut, AlertCircle } from 'lucide-react';

const GitHubSync = () => {
  const {
    isAuthenticated,
    user,
    isSyncing,
    lastSyncTime,
    authenticate,
    logout,
    syncToGitHub,
    restoreFromGitHub,
  } = useGitHubSync();

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            GitHub Sync
          </CardTitle>
          <CardDescription>
            Backup your reading data to GitHub Gists for safe keeping and sync across devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-blue-800 font-medium">
                Setup Required
              </p>
              <p className="text-sm text-blue-700">
                This feature requires a GitHub OAuth app to be configured. In a production environment, 
                you would need to set up GitHub OAuth credentials and a backend service to handle the token exchange.
              </p>
            </div>
          </div>
          
          <Button 
            onClick={authenticate} 
            className="w-full"
            disabled
          >
            <Github className="h-4 w-4 mr-2" />
            Connect GitHub Account (Demo Mode)
          </Button>
          
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>What gets synced:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Saved articles and their content</li>
              <li>Vocabulary entries and definitions</li>
              <li>Study list items and notes</li>
              <li>Knowledge profile and learning progress</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          GitHub Sync
        </CardTitle>
        <CardDescription>
          Your data is automatically backed up to a private GitHub Gist.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar_url} alt={user?.name || user?.login} />
            <AvatarFallback>
              {(user?.name || user?.login || '').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{user?.name || user?.login}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            <Cloud className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        </div>

        <Separator />

        {/* Sync Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Last Sync</span>
            <span className="text-sm text-muted-foreground">
              {lastSyncTime ? lastSyncTime.toLocaleString() : 'Never'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={syncToGitHub} 
              disabled={isSyncing}
              variant="default"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isSyncing ? 'Syncing...' : 'Backup Now'}
            </Button>
            
            <Button 
              onClick={restoreFromGitHub} 
              disabled={isSyncing}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              {isSyncing ? 'Loading...' : 'Restore Data'}
            </Button>
          </div>

          <Button 
            onClick={logout} 
            variant="ghost" 
            size="sm"
            className="w-full text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect GitHub
          </Button>
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/50 rounded">
          <p><strong>Privacy:</strong> Your data is stored in a private GitHub Gist that only you can access.</p>
          <p><strong>Security:</strong> Data is stored in JSON format and can be manually downloaded from GitHub.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GitHubSync;
