// Mock Availability Routes - Development version with in-memory data
import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { 
  mockDateSlots, 
  mockAvailabilities,
  mockUsers,
  getMockDateSlotsByPlanId, 
  createMockDateSlot,
  createMockAvailability
} from '../mocks/data';

const availability = new Hono<{ Variables: { user: any } }>();

// Middleware to get user from token (simplified for mock)
availability.use('*', async (c, next) => {
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

// GET /availability/dates - Get all date slots for a plan
availability.get('/dates', async (c) => {
  const planId = c.req.query('planId');
  
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  const dateSlots = getMockDateSlotsByPlanId(planId);
  
  return c.json({ dateSlots });
});

// POST /availability/dates - Create a new date slot
availability.post('/dates', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { date, planId } = body;

  if (!date) {
    return c.json({ error: 'Date is required' }, 400);
  }

  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  const newDateSlot = createMockDateSlot(date, planId);
  mockDateSlots.push(newDateSlot);

  return c.json(newDateSlot, 201);
});

// GET /availability - Get all availabilities for a plan
availability.get('/', async (c) => {
  const planId = c.req.query('planId');
  
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  // Get all availabilities for this plan's date slots
  const planDateSlots = getMockDateSlotsByPlanId(planId);
  const dateSlotIds = planDateSlots.map(ds => ds.id);
  
  const availabilities = mockAvailabilities.filter(a => 
    dateSlotIds.includes(a.dateSlotId)
  );
  
  return c.json({ availabilities });
});

// POST /availability/:dateSlotId - Mark availability for a date slot
availability.post('/:dateSlotId', async (c) => {
  const user = c.get('user');
  const dateSlotId = c.req.param('dateSlotId');
  const planId = c.req.query('planId');
  const body = await c.req.json();
  const { status } = body;
  
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  if (!status || !['AVAILABLE', 'MAYBE', 'UNAVAILABLE'].includes(status)) {
    return c.json({ error: 'Valid status is required (AVAILABLE, MAYBE, UNAVAILABLE)' }, 400);
  }

  // Check if date slot exists
  const dateSlot = mockDateSlots.find(ds => ds.id === dateSlotId);
  if (!dateSlot) {
    return c.json({ error: 'Date slot not found' }, 404);
  }

  // Remove existing availability for this user and date slot
  const existingIndex = mockAvailabilities.findIndex(
    a => a.dateSlotId === dateSlotId && a.userId === user.id
  );
  
  if (existingIndex !== -1) {
    mockAvailabilities.splice(existingIndex, 1);
  }

  const newAvailability = createMockAvailability(dateSlotId, planId, user.id, status);
  mockAvailabilities.push(newAvailability);

  return c.json(newAvailability, 201);
});

export default availability;