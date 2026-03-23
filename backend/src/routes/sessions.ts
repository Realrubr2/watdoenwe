import { Hono } from 'hono';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { createSession, getSessionById, addParticipantToSession, getPlanById, getActivities, getIdeas, getDateSlots, getAvailabilities } from '../db-sqlite';

const sessions = new Hono();

// Validation schemas
const CreateSessionSchema = z.object({
  ownerName: z.string().min(1, 'Owner name is required'),
  planId: z.string().optional(),
});

const JoinSessionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

// Helper to parse session with participants array
function parseSession(session: any) {
  if (!session) return null;
  return {
    ...session,
    participants: JSON.parse(session.participants || '[]'),
  };
}

// POST /api/sessions - Create a new session
sessions.post('/', async (c) => {
  const body = await c.req.json();
  
  // Validate input
  const result = CreateSessionSchema.safeParse(body);
  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400);
  }
  
  const { ownerName, planId } = result.data;
  
  // Create session (planId is optional - use null if not provided)
  const session = createSession({
    ownerName,
    planId: planId || null,
  });
  
  const parsedSession = parseSession(session);
  const shareUrl = `/join/${parsedSession.id}?inviter=${encodeURIComponent(ownerName)}`;
  
  return c.json({
    session: parsedSession,
    shareUrl,
  }, 201);
});

// GET /api/sessions/:id - Get session with associated plan data
sessions.get('/:id', async (c) => {
  const sessionId = c.req.param('id');
  
  const session = getSessionById(sessionId);
  if (!session) {
    return c.json({ error: 'Session not found' }, 404);
  }
  
  const parsedSession = parseSession(session);
  
  // Fetch associated plan data if planId exists
  let plan = null;
  let activities: any[] = [];
  let ideas: any[] = [];
  let dateSlots: any[] = [];
  let availabilities: any[] = [];
  
  if (session.plan_id) {
    plan = getPlanById(session.plan_id);
    if (plan) {
      activities = getActivities(session.plan_id);
      ideas = getIdeas(session.plan_id);
      dateSlots = getDateSlots(session.plan_id);
      availabilities = getAvailabilities(session.plan_id);
    }
  }
  
  return c.json({
    session: parsedSession,
    plan,
    activities,
    ideas,
    dateSlots,
    availabilities,
  });
});

// PATCH /api/sessions/:id/join - Join a session
sessions.patch('/:id/join', async (c) => {
  const sessionId = c.req.param('id');
  
  const body = await c.req.json();
  
  // Validate input
  const result = JoinSessionSchema.safeParse(body);
  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400);
  }
  
  const { name } = result.data;
  
  // Check if session exists
  const existingSession = getSessionById(sessionId);
  if (!existingSession) {
    return c.json({ error: 'Session not found' }, 404);
  }
  
  // Add participant
  const session = addParticipantToSession(sessionId, name);
  const parsedSession = parseSession(session);
  
  return c.json({ session: parsedSession });
});

export default sessions;
