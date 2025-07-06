
import { useState, useEffect, useCallback } from 'react';
import { githubService } from '@/services/githubService';
import { getSavedArticles } from '@/utils/localStorage';
import { getVocabularyEntries } from '@/utils/vocabularyStorage';
import { getStudyListEntries } from '@/utils/studyListStorage';
import { getKnowledgeProfile } from '@/utils/knowledgeProfileStorage';
import { useToast } from '@/hooks/use-toast';

interface SyncData {
  articles: any[];
  vocabulary: any[];
  studyList: any[];
  knowledgeProfile: any;
  timestamp: string;
}

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
}

export const useGitHubSync = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (githubService.isAuthenticated()) {
        setIsAuthenticated(true);
        try {
          const userData = await githubService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          githubService.clearAuth();
          setIsAuthenticated(false);
        }
      }
    };

    checkAuthStatus();
  }, []);

  const authenticate = useCallback(() => {
    githubService.initiateOAuth();
  }, []);

  const logout = useCallback(() => {
    githubService.clearAuth();
    setIsAuthenticated(false);
    setUser(null);
    toast({
      title: "Signed out",
      description: "You have been signed out of GitHub.",
    });
  }, [toast]);

  const collectUserData = useCallback((): SyncData => {
    return {
      articles: getSavedArticles(),
      vocabulary: getVocabularyEntries(),
      studyList: getStudyListEntries(),
      knowledgeProfile: getKnowledgeProfile(),
      timestamp: new Date().toISOString(),
    };
  }, []);

  const syncToGitHub = useCallback(async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to GitHub first.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    try {
      const userData = collectUserData();
      await githubService.createOrUpdateDataGist(userData);
      setLastSyncTime(new Date());
      
      toast({
        title: "Sync successful",
        description: "Your data has been backed up to GitHub Gist.",
      });
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync failed",
        description: "Failed to backup data to GitHub. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [isAuthenticated, collectUserData, toast]);

  const restoreFromGitHub = useCallback(async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to GitHub first.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    try {
      const data = await githubService.fetchDataFromGist();
      if (data) {
        // Note: In a real implementation, you'd want to merge or replace local data
        // For now, we'll just show a success message
        toast({
          title: "Data found",
          description: `Found backup from ${new Date(data.timestamp).toLocaleDateString()}. Restore functionality not yet implemented.`,
        });
      } else {
        toast({
          title: "No backup found",
          description: "No backup data found in your GitHub Gists.",
        });
      }
    } catch (error) {
      console.error('Restore error:', error);
      toast({
        title: "Restore failed",
        description: "Failed to fetch data from GitHub. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [isAuthenticated, toast]);

  return {
    isAuthenticated,
    user,
    isSyncing,
    lastSyncTime,
    authenticate,
    logout,
    syncToGitHub,
    restoreFromGitHub,
  };
};
