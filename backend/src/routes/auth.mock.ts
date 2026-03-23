// Mock Auth Routes - Development version with SQLite
import { Hono } from 'hono';
import {
  getUserByToken
} from '../db-sqlite';

const auth = new Hono();

// POST /guest - Create a new guest session
auth.post('/guest', async (c) => {
  const body = await c.req.json();
  const { name } = body;
  
  if (!name || name.length < 1) {
    return c.json({ error: 'Name is required' }, 400);
  }

  // For now, return an existing user for testing
  const user = getUserByToken('token-001');
  if (!user) {
    return c.json({ error: 'No users found' }, 500);
  }

  return c.json({ user, token: user.guest_token }, 201);
});

// POST /verify - Verify a guest token
auth.post('/verify', async (c) => {
  const body = await c.req.json();
  const { token } = body;

  if (!token) {
    return c.json({ error: 'Token is required' }, 400);
  }

  const user = getUserByToken(token);
  
  if (!user) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  return c.json({ user });
});

// GET /me - Get current user info
auth.get('/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const token = authHeader.split(' ')[1];
  const user = getUserByToken(token);
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  return c.json({ user });
});

export default auth;
