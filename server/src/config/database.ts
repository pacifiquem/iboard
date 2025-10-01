import { createClient } from '@supabase/supabase-js';
import logger from './logger';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  logger.error('Missing Supabase configuration. Please check your environment variables.');
  process.exit(1);
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  }
);

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const testConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('ideas')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      logger.error('Database connection test failed:', error);
      return false;
    }
    
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection test error:', error);
    return false;
  }
};

export interface Idea {
  id: string;
  text: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  updated_at: string;
}
