// Mock Plans Routes - Development version with SQLite
import { Hono } from 'hono';
import {
  getUserByToken,
  getPlanById,
  getPlanParticipants,
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  getPlanByShareToken
} from '../db-sqlite';

const plans = new Hono<{ Variables: { user: any } }>();

// Public endpoint - get plan by share token (must be before auth middleware)
plans.get('/share/:shareToken', async (c) => {
  const shareToken = c.req.param('shareToken');
  
  const plan = getPlanByShareToken(shareToken);

  if (!plan) {
    return c.json({ error: 'Plan not found' }, 404);
  }

  return c.json({ plan });
});

plans.use('*', async (c, next) => {
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

// GET /plans - Get all plans
plans.get('/', async (c) => {
  const user = c.get('user');
  const allPlans = getPlans();
  
  // Get plans where user is a participant or host
  const userPlanIds = allPlans
    .filter(p => p.host_id === user.id)
    .map(p => p.id);
  
  const participations = getPlans()
    .filter(p => p.host_id !== user.id)
    .filter(p => {
      const participants = getPlanParticipants(p.id);
      return participants.some((pa: any) => pa.user_id === user.id);
    })
    .map(p => p.id);
  
  const userPlans = allPlans.filter(p => 
    userPlanIds.includes(p.id) || participations.includes(p.id)
  );
  
  return c.json({ plans: userPlans });
});

// GET /plans/:id - Get a specific plan
plans.get('/:id', async (c) => {
  const planId = c.req.param('id');
  const plan = getPlanById(planId);
  
  if (!plan) {
    return c.json({ error: 'Plan not found' }, 404);
  }
  
  const participants = getPlanParticipants(planId);
  
  return c.json({ plan: { ...plan, participants } });
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

  const newPlan = createPlan({ name, mode, status: 'DRAFT', hostId: user.id });
  const participants = getPlanParticipants(newPlan.id);
  
  return c.json({ plan: { ...newPlan, participants } }, 201);
});

// PUT /plans/:id - Update a plan
plans.put('/:id', async (c) => {
  const planId = c.req.param('id');
  const body = await c.req.json();
  const user = c.get('user');
  
  const existingPlan = getPlanById(planId);
  if (!existingPlan) {
    return c.json({ error: 'Plan not found' }, 404);
  }
  
  if (existingPlan.host_id !== user.id) {
    return c.json({ error: 'Only the host can update the plan' }, 403);
  }
  
  const updatedPlan = updatePlan(planId, body);
  const participants = getPlanParticipants(planId);
  
  return c.json({ plan: { ...updatedPlan, participants } });
});

// DELETE /plans/:id - Delete a plan
plans.delete('/:id', async (c) => {
  const planId = c.req.param('id');
  const user = c.get('user');
  
  const existingPlan = getPlanById(planId);
  if (!existingPlan) {
    return c.json({ error: 'Plan not found' }, 404);
  }
  
  if (existingPlan.host_id !== user.id) {
    return c.json({ error: 'Only the host can delete the plan' }, 403);
  }
  
  deletePlan(planId);
  
  return c.json({ success: true });
});

export default plans;
