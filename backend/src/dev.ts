// Development server entry point - uses Node.js server
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import auth from './routes/auth.mock';
import plans from './routes/plans.mock';
import activities from './routes/activities.mock';
import ideas from './routes/ideas.mock';
import availability from './routes/availability.mock';

const app = new Hono();

// CORS middleware for frontend connection
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Mount mock routes
app.route('/auth', auth);
app.route('/plans', plans);
app.route('/activities', activities);
app.route('/ideas', ideas);
app.route('/availability', availability);

// Health check
app.get('/health', (c) => c.json({ status: 'ok', mode: 'development-mock' }));

// Root endpoint
app.get('/', (c) => c.json({ 
  message: 'Wat Doen We API - Development Mode (Mock)',
  endpoints: {
    auth: '/auth',
    plans: '/plans',
    activities: '/activities',
    ideas: '/ideas',
    availability: '/availability',
    health: '/health'
  }
}));

const port = 3000;
console.log(`Server running at http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
