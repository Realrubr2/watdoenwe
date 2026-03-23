// Mock Availability Routes - Development version with SQLite
import { Hono } from 'hono';
import {
  getUserByToken,
  getDateSlots,
  createDateSlot,
  deleteDateSlot,
  getAvailabilities,
  setAvailability,
  getUserAvailability
} from '../db-sqlite';

const availability = new Hono<{ Variables: { user: any } }>();

availability.use('*', async (c, next) => {
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

// GET /availability/dates - Get all date slots for a plan
availability.get('/dates', async (c) => {
  const planId = c.req.query('planId');
  
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  const dateSlots = getDateSlots(planId);
  
  return c.json({ dateSlots });
});

// POST /availability/dates - Create a new date slot
availability.post('/dates', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { date, planId, startTime, endTime } = body;

  if (!date) {
    return c.json({ error: 'Date is required' }, 400);
  }

  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  const newDateSlot = createDateSlot({
    date,
    planId,
    startTime,
    endTime
  });

  return c.json(newDateSlot, 201);
});

// DELETE /availability/dates/:id - Delete a date slot
availability.delete('/dates/:id', async (c) => {
  const dateSlotId = c.req.param('id');
  
  deleteDateSlot(dateSlotId);

  return c.json({ success: true });
});

// GET /availability - Get all availabilities for a plan
availability.get('/', async (c) => {
  const planId = c.req.query('planId');
  const user = c.get('user');
  
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  const availabilities = getAvailabilities(planId);
  
  return c.json({ availabilities });
});

// GET /availability/me - Get current user's availability for a plan
availability.get('/me', async (c) => {
  const planId = c.req.query('planId');
  const user = c.get('user');
  
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  const userAvailabilities = getUserAvailability(user.id, planId);
  
  return c.json({ availabilities: userAvailabilities });
});

// POST /availability/:dateSlotId - Mark availability for a date slot
availability.post('/:dateSlotId', async (c) => {
  const user = c.get('user');
  const dateSlotId = c.req.param('dateSlotId');
  const planId = c.req.query('planId');
  const body = await c.req.json();
  const { status, note } = body;
  
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  if (!status || !['AVAILABLE', 'MAYBE', 'UNAVAILABLE'].includes(status)) {
    return c.json({ error: 'Valid status is required (AVAILABLE, MAYBE, UNAVAILABLE)' }, 400);
  }

  const newAvailability = setAvailability({
    userId: user.id,
    planId,
    dateSlotId,
    status,
    note
  });

  return c.json(newAvailability, 201);
});

export default availability;
