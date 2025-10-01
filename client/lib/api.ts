const API_BASE_URL = window.location.origin === 'http://localhost:3000' ? 'http://localhost:3001/api' : 'https://iboard.onrender.com/api';
export interface Idea {
  id: string;
  text: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
  details?: string;
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.details && Array.isArray(errorData.details)) {
        errorMessage = errorData.details.map((detail: any) => detail.msg).join(', ');
      }
      
      if (response.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
      } else if (response.status >= 500) {
        errorMessage = 'Server is temporarily unavailable. Please try again later.';
      } else if (response.status === 404) {
        errorMessage = 'The requested resource was not found.';
      }
      
      throw new ApiError(errorMessage, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

export const ideaService = {
  async getAll(): Promise<Idea[]> {
    const response = await apiRequest<ApiResponse<Idea[]>>('/ideas');
    return response.data;
  },

  async getById(id: string): Promise<Idea> {
    const response = await apiRequest<ApiResponse<Idea>>(`/ideas/${id}`);
    return response.data;
  },

  async create(text: string): Promise<Idea> {
    const response = await apiRequest<ApiResponse<Idea>>('/ideas', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return response.data;
  },

  async upvote(id: string): Promise<void> {
    await apiRequest<ApiResponse<null>>('/ideas/upvote', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },

  async downvote(id: string): Promise<void> {
    await apiRequest<ApiResponse<null>>('/ideas/downvote', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },

  async getStats(): Promise<any> {
    const response = await apiRequest<ApiResponse<any>>('/ideas/stats');
    return response.data;
  },
};
export { ApiError };
