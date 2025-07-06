
export const config = {
  github: {
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '',
  },
} as const;

export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;
