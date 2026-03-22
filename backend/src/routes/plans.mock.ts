// Mock Plans Routes - Development version with in-memory data
import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { 
  mockPlans, 
  mockUsers,
  getMockPlansByUserId, 
  getMockPlanById,
  createMockPlan 
} from '../mocks/data';

const plans = new Hono<{ Variables: { user: any } }>();

// Middleware to get user from token (simplified for mock)
plans.use('*', async (c, next) => {
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

// GET /plans - Get all plans for current user
plans.get('/', async (c) => {
  const user = c.get('user');
  const userPlans = getMockPlansByUserId(user.id);
  
  return c.json({ plans: userPlans });
});

// POST /plans - Create a new plan
plans.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { name, mode } = body;

  if (!name || name.length < 1) {
    return c.json({ error: 'Name is required' }, 400);
  }

  if (!mode || !['FIXED_DATE', 'FIXED_ACTIVITY', 'FLEXIBLE'].includes(mode)) {
    return c.json({ error: 'Valid mode is required (FIXED_DATE, FIXED_ACTIVITY, FLEXIBLE)' }, 400);
  }

  const newPlan = createMockPlan(name, mode, user.id);
  mockPlans.push(newPlan);

  return c.json(newPlan, 201);
});

// GET /plans/:id - Get a specific plan with participants
plans.get('/:id', async (c) => {
  const planId = c.req.param('id');
  const plan = getMockPlanById(planId);

  if (!plan) {
    return c.json({ error: 'Plan not found' }, 404);
  }

  // In mock, we just return the plan (no participants for now)
  return c.json({ plan, participants: [] });
});

export default plans;