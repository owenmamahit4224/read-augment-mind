
interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
}

interface GitHubGist {
  id: string;
  description: string;
  public: boolean;
  files: {
    [filename: string]: {
      content: string;
      truncated: boolean;
    };
  };
  created_at: string;
  updated_at: string;
}

interface GitHubAuthState {
  isAuthenticated: boolean;
  user: GitHubUser | null;
  accessToken: string | null;
}

export class GitHubService {
  private static readonly REDIRECT_URI = `${window.location.origin}/auth/github/callback`;
  private static readonly SCOPES = 'gist';
  private static readonly GIST_FILENAME = 'reading-app-data.json';
  private static readonly GIST_DESCRIPTION = 'Reading Augmentation App - User Data Backup';

  private accessToken: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('github_access_token');
  }

  // OAuth flow
  public initiateOAuth(): void {
    // Get client ID from environment or use placeholder
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || 'your_github_client_id';
    
    if (clientId === 'your_github_client_id') {
      console.warn('GitHub Client ID not configured. Please set VITE_GITHUB_CLIENT_ID environment variable.');
    }

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(GitHubService.REDIRECT_URI)}&scope=${GitHubService.SCOPES}`;
    window.location.href = authUrl;
  }

  public async handleOAuthCallback(code: string): Promise<GitHubAuthState> {
    try {
      console.log('OAuth code received:', code);
      
      // Use our Vercel function for token exchange
      const response = await fetch('/api/auth/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'OAuth exchange failed');
      }

      const data = await response.json();
      
      // Store the access token
      this.setAccessToken(data.access_token);
      
      return {
        isAuthenticated: true,
        user: data.user,
        accessToken: data.access_token,
      };
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      throw error;
    }
  }

  public async getCurrentUser(): Promise<GitHubUser | null> {
    if (!this.accessToken) return null;

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching GitHub user:', error);
      return null;
    }
  }

  public async createOrUpdateDataGist(data: any): Promise<string> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with GitHub');
    }

    try {
      const existingGistId = localStorage.getItem('github_data_gist_id');
      const gistData = {
        description: GitHubService.GIST_DESCRIPTION,
        public: false,
        files: {
          [GitHubService.GIST_FILENAME]: {
            content: JSON.stringify(data, null, 2)
          }
        }
      };

      let response;
      if (existingGistId) {
        // Update existing gist
        response = await fetch(`https://api.github.com/gists/${existingGistId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(gistData),
        });
      } else {
        // Create new gist
        response = await fetch('https://api.github.com/gists', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(gistData),
        });
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const gist: GitHubGist = await response.json();
      localStorage.setItem('github_data_gist_id', gist.id);
      return gist.id;
    } catch (error) {
      console.error('Error creating/updating GitHub gist:', error);
      throw error;
    }
  }

  public async fetchDataFromGist(): Promise<any | null> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with GitHub');
    }

    const gistId = localStorage.getItem('github_data_gist_id');
    if (!gistId) {
      return null;
    }

    try {
      const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Gist not found, clear the stored ID
          localStorage.removeItem('github_data_gist_id');
          return null;
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const gist: GitHubGist = await response.json();
      const fileContent = gist.files[GitHubService.GIST_FILENAME]?.content;
      
      if (fileContent) {
        return JSON.parse(fileContent);
      }

      return null;
    } catch (error) {
      console.error('Error fetching data from GitHub gist:', error);
      throw error;
    }
  }

  public async deleteDataGist(): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with GitHub');
    }

    const gistId = localStorage.getItem('github_data_gist_id');
    if (!gistId) {
      return;
    }

    try {
      const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (response.ok) {
        localStorage.removeItem('github_data_gist_id');
      }
    } catch (error) {
      console.error('Error deleting GitHub gist:', error);
      throw error;
    }
  }

  public setAccessToken(token: string): void {
    this.accessToken = token;
    localStorage.setItem('github_access_token', token);
  }

  public clearAuth(): void {
    this.accessToken = null;
    localStorage.removeItem('github_access_token');
    localStorage.removeItem('github_data_gist_id');
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

export const githubService = new GitHubService();
