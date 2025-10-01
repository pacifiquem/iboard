import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { supabase, Idea } from '../config/database';
import logger from '../config/logger';

export const createIdeaValidation = [
  body('text')
    .trim()
    .isLength({ min: 1, max: 280 })
    .withMessage('Idea text must be between 1 and 280 characters')
    .escape(),
];

export const upvoteIdeaValidation = [
  body('id')
    .isUUID()
    .withMessage('Invalid idea ID format'),
];

export const downvoteIdeaValidation = [
  body('id')
    .isUUID()
    .withMessage('Invalid idea ID format'),
];

export const getAllIdeas = async (req: Request, res: Response) => {
  try {
    logger.info('Fetching all ideas');
    
    const { data: ideas, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching ideas:', error);
      res.status(500).json({
        error: 'Failed to fetch ideas',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
      return;
    }

    logger.info(`Successfully fetched ${ideas?.length || 0} ideas`);
    res.json({
      success: true,
      data: ideas || [],
      count: ideas?.length || 0,
    });
  } catch (error) {
    logger.error('Unexpected error in getAllIdeas:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

export const getIdeaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        error: 'Idea ID is required',
      });
      return;
    }

    logger.info(`Fetching idea with ID: ${id}`);
    
    const { data: idea, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        logger.warn(`Idea not found: ${id}`);
        res.status(404).json({
          error: 'Idea not found',
        });
        return;
      }
      
      logger.error('Error fetching idea:', error);
      res.status(500).json({
        error: 'Failed to fetch idea',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
      return;
    }

    logger.info(`Successfully fetched idea: ${id}`);
    res.json({
      success: true,
      data: idea,
    });
  } catch (error) {
    logger.error('Unexpected error in getIdeaById:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

export const createIdea = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation errors in createIdea:', errors.array());
      res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
      return;
    }

    const { text } = req.body;
    
    logger.info('Creating new idea', { text: text.substring(0, 50) + '...' });
    
    const { data: idea, error } = await supabase
      .from('ideas')
      .insert([{ text }])
      .select()
      .single();

    if (error) {
      logger.error('Error creating idea:', error);
      res.status(500).json({
        error: 'Failed to create idea',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
      return;
    }

    logger.info(`Successfully created idea: ${idea.id}`);
    res.status(201).json({
      success: true,
      data: idea,
      message: 'Idea created successfully',
    });
  } catch (error) {
    logger.error('Unexpected error in createIdea:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

export const upvoteIdea = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation errors in upvoteIdea:', errors.array());
      res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
      return;
    }

    const { id } = req.body;
    
    logger.info(`Upvoting idea: ${id}`);
    
    const { data, error } = await supabase
      .rpc('increment_upvotes', { idea_id: id });

    if (error) {
      if (error.code === 'P0001') {
        logger.warn(`Idea not found for upvote: ${id}`);
        res.status(404).json({
          error: 'Idea not found',
        });
        return;
      }
      
      logger.error('Error upvoting idea:', error);
      res.status(500).json({
        error: 'Failed to upvote idea',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
      return;
    }

    const { data: updatedIdea, error: fetchError } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      logger.error('Error fetching updated idea:', fetchError);
      res.status(500).json({
        error: 'Upvote successful but failed to fetch updated idea',
      });
      return;
    }

    logger.info(`Successfully upvoted idea: ${id}, new count: ${updatedIdea.upvotes}`);
    res.json({
      success: true,
      data: updatedIdea,
      message: 'Idea upvoted successfully',
    });
  } catch (error) {
    logger.error('Unexpected error in upvoteIdea:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

export const downvoteIdea = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation errors in downvoteIdea:', errors.array());
      res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
      return;
    }

    const { id } = req.body;
    
    logger.info(`Downvoting idea: ${id}`);
    
    const { data, error } = await supabase
      .rpc('increment_downvotes', { idea_id: id });

    if (error) {
      if (error.code === 'P0001') {
        logger.warn(`Idea not found for downvote: ${id}`);
        res.status(404).json({
          error: 'Idea not found',
        });
        return;
      }
      
      logger.error('Error downvoting idea:', error);
      res.status(500).json({
        error: 'Failed to downvote idea',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
      return;
    }

    const { data: updatedIdea, error: fetchError } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      logger.error('Error fetching updated idea:', fetchError);
      res.status(500).json({
        error: 'Downvote successful but failed to fetch updated idea',
      });
      return;
    }

    logger.info(`Successfully downvoted idea: ${id}, new count: ${updatedIdea.downvotes}`);
    res.json({
      success: true,
      data: updatedIdea,
      message: 'Idea downvoted successfully',
    });
  } catch (error) {
    logger.error('Unexpected error in downvoteIdea:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

export const getIdeasStats = async (req: Request, res: Response) => {
  try {
    logger.info('Fetching ideas statistics');
    
    const { data: stats, error } = await supabase
      .rpc('get_ideas_stats');

    if (error) {
      logger.error('Error fetching ideas stats:', error);
      res.status(500).json({
        error: 'Failed to fetch statistics',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
      return;
    }

    logger.info('Successfully fetched ideas statistics');
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Unexpected error in getIdeasStats:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};
