// API Configuration - Development and Production URLs
export const API_CONFIG = {
  // Development: Local backend server
  // Production: Would be your deployed API URL
  baseUrl: 'http://localhost:3000',
  
  // API version prefix (if needed)
  apiPrefix: '/api',
  
  // Endpoints
  endpoints: {
    auth: {
      guest: '/auth/guest',
      verify: '/auth/verify',
      me: '/auth/me',
    },
    plans: {
      list: '/plans',
      get: (id: string) => `/plans/${id}`,
      create: '/plans',
    },
    activities: {
      list: '/activities',
      create: '/activities',
      delete: (id: string) => `/activities/${id}`,
    },
    ideas: {
      list: '/ideas',
      create: '/ideas',
      delete: (id: string) => `/ideas/${id}`,
    },
    availability: {
      dates: '/availability/dates',
      list: '/availability',
      set: (dateSlotId: string) => `/availability/${dateSlotId}`,
    },
  },
};

// Helper to build full URL
export const buildUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseUrl}${endpoint}`;
};
