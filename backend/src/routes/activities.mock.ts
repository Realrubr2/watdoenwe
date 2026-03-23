// Mock Activities Routes - Development version with SQLite
import { Hono } from 'hono';
import {
  getUserByToken,
  getActivities,
  createActivity,
  deleteActivity
} from '../db-sqlite';

const activities = new Hono<{ Variables: { user: any } }>();

activities.use('*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const token = authHeader.split(' ')[1];
  const user = getUserByToken(token);
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('user', user);
  await next();
});

// GET /activities - Get all activities for a plan
activities.get('/', async (c) => {
  const planId = c.req.query('planId');
  
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  const planActivities = getActivities(planId);
  
  return c.json({ activities: planActivities });
});

// POST /activities - Create a new activity
activities.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { name, description, location, category, planId, isFixed } = body;

  if (!name || name.length < 1) {
    return c.json({ error: 'Name is required' }, 400);
  }

  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  if (!category || !['ETEN', 'CULTUUR', 'SPORT', 'OVERIG'].includes(category)) {
    return c.json({ error: 'Valid category is required (ETEN, CULTUUR, SPORT, OVERIG)' }, 400);
  }

  const newActivity = createActivity({
    name,
    description,
    location,
    category,
    planId,
    isFixed: isFixed || false,
  });

  return c.json(newActivity, 201);
});

// DELETE /activities/:id - Delete an activity
activities.delete('/:id', async (c) => {
  const activityId = c.req.param('id');
  
  deleteActivity(activityId);

  return c.json({ success: true });
});

export default activities;
