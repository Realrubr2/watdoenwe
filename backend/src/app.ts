import { Hono } from 'hono/quick';
import { openAPIRouteHandler } from 'hono-openapi';
import auth from './routes/auth';
import plans from './routes/plans';
import activities from './routes/activities';
import ideas from './routes/ideas';
import availability from './routes/availability';

const app = new Hono();

// Mount routes
app.route('/auth', auth);
app.route('/plans', plans);
app.route('/activities', activities);
app.route('/ideas', ideas);
app.route('/availability', availability);

// OpenAPI Docs
app.get(
  '/openapi.json',
  openAPIRouteHandler(app, {
    documentation: {
      info: { title: 'Wat Doen We API', version: '1.0.0' },
      servers: [{ url: '/v1' }],
    },
  })
);

app.get('/docs', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Wat Doen We API Documentation</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
        <script>
          SwaggerUIBundle({ url: "/openapi.json", dom_id: "#swagger-ui" });
        </script>
      </body>
    </html>
  `);
});

export default app;
