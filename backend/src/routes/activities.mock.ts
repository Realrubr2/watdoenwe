// Mock Activities Routes - Development version with in-memory data
import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { 
  mockActivities, 
  mockUsers,
  getMockActivitiesByPlanId, 
  createMockActivity 
} from '../mocks/data';

const activities = new Hono<{ Variables: { user: any } }>();

// Middleware to get user from token (simplified for mock)
activities.use('*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const token = authHeader.split(' ')[1];
  const user = mockUsers.find((u) => u.guestToken === token);
  
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

  const planActivities = getMockActivitiesByPlanId(planId);
  
  return c.json({ activities: planActivities });
});

// POST /activities - Create a new activity
activities.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { title, description, address, link, category, imageUrl, planId } = body;

  if (!title || title.length < 1) {
    return c.json({ error: 'Title is required' }, 400);
  }

  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  if (!category || !['ETEN', 'CULTUUR', 'SPORT', 'OVERIG'].includes(category)) {
    return c.json({ error: 'Valid category is required (ETEN, CULTUUR, SPORT, OVERIG)' }, 400);
  }

  const newActivity = createMockActivity({
    title,
    description,
    address,
    link,
    category,
    imageUrl,
    planId,
  }, user.id);
  
  mockActivities.push(newActivity);

  return c.json(newActivity, 201);
});

// DELETE /activities/:id - Delete an activity
activities.delete('/:id', async (c) => {
  const activityId = c.req.param('id');
  const planId = c.req.query('planId');
  
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  const index = mockActivities.findIndex(
    (a) => a.id === activityId && a.planId === planId
  );

  if (index === -1) {
    return c.json({ error: 'Activity not found' }, 404);
  }

  mockActivities.splice(index, 1);

  return c.json({ success: true });
});

export default activities;