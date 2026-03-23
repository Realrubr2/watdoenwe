// Mock Ideas Routes - Development version with SQLite
import { Hono } from 'hono';
import {
  getUserByToken,
  getIdeas,
  createIdea,
  deleteIdea,
  vote
} from '../db-sqlite';

const ideas = new Hono<{ Variables: { user: any } }>();

ideas.use('*', async (c, next) => {
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

// GET /ideas - Get all ideas for a plan
ideas.get('/', async (c) => {
  const planId = c.req.query('planId');
  
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  const planIdeas = getIdeas(planId);
  
  return c.json({ ideas: planIdeas });
});

// POST /ideas - Create a new idea
ideas.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { name, description, category, planId } = body;

  if (!name || name.length < 1) {
    return c.json({ error: 'Name is required' }, 400);
  }

  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  if (!category || !['ETEN', 'CULTUUR', 'SPORT', 'OVERIG'].includes(category)) {
    return c.json({ error: 'Valid category is required (ETEN, CULTUUR, SPORT, OVERIG)' }, 400);
  }

  const newIdea = createIdea({
    name,
    description,
    category,
    planId,
    userId: user.id,
  });

  return c.json(newIdea, 201);
});

// POST /ideas/:id/vote - Vote for an idea
ideas.post('/:id/vote', async (c) => {
  const user = c.get('user');
  const ideaId = c.req.param('id');
  const body = await c.req.json();
  const { value } = body;

  if (!value || ![1, -1].includes(value)) {
    return c.json({ error: 'Value must be 1 or -1' }, 400);
  }

  const updatedIdea = vote(user.id, ideaId, value);

  return c.json(updatedIdea);
});

// DELETE /ideas/:id - Delete an idea
ideas.delete('/:id', async (c) => {
  const ideaId = c.req.param('id');
  
  deleteIdea(ideaId);

  return c.json({ success: true });
});

export default ideas;
