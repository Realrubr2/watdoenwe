// Mock Auth Routes - Development version with in-memory data
import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { 
  mockUsers, 
  getMockUserByToken, 
  createMockUser 
} from '../mocks/data';

const auth = new Hono();

// POST /guest - Create a new guest session
auth.post('/guest', async (c) => {
  const body = await c.req.json();
  const { name } = body;
  
  if (!name || name.length < 1) {
    return c.json({ error: 'Name is required' }, 400);
  }

  const newUser = createMockUser(name);
  mockUsers.push(newUser);

  return c.json({ user: newUser, token: newUser.guestToken }, 201);
});

// POST /verify - Verify a guest token
auth.post('/verify', async (c) => {
  const body = await c.req.json();
  const { token } = body;

  if (!token) {
    return c.json({ error: 'Token is required' }, 400);
  }

  const user = getMockUserByToken(token);
  
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
  const user = getMockUserByToken(token);
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  return c.json({ user });
});

export default auth;