// Mock Ideas Routes - Development version with in-memory data
import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { 
  mockIdeas, 
  mockUsers,
  getMockIdeasByPlanId, 
  createMockIdea 
} from '../mocks/data';

const ideas = new Hono<{ Variables: { user: any } }>();

// Middleware to get user from token (simplified for mock)
ideas.use('*', async (c, next) => {
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

// GET /ideas - Get all ideas for a plan
ideas.get('/', async (c) => {
  const planId = c.req.query('planId');
  
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  const planIdeas = getMockIdeasByPlanId(planId);
  
  return c.json({ ideas: planIdeas });
});

// POST /ideas - Create a new idea
ideas.post('/', async (c) => {
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

  const newIdea = createMockIdea({
    title,
    description,
    address,
    link,
    category,
    imageUrl,
    planId,
  }, user.id);
  
  mockIdeas.push(newIdea);

  return c.json(newIdea, 201);
});

// DELETE /ideas/:id - Delete an idea
ideas.delete('/:id', async (c) => {
  const ideaId = c.req.param('id');
  const planId = c.req.query('planId');
  
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  const index = mockIdeas.findIndex(
    (i) => i.id === ideaId && i.planId === planId
  );

  if (index === -1) {
    return c.json({ error: 'Idea not found' }, 404);
  }

  mockIdeas.splice(index, 1);

  return c.json({ success: true });
});

export default ideas;