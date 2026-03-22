import { Hono } from 'hono';
import { describeRoute, validator } from 'hono-openapi';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../db';
import { authMiddleware } from '../middleware';

const activities = new Hono<{ Variables: { user: any } }>();

const ActivitySchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  address: z.string().optional(),
  link: z.string().optional(),
  category: z.enum(['ETEN', 'CULTUUR', 'SPORT', 'OVERIG']),
  planId: z.string(),
  createdBy: z.string(),
  imageUrl: z.string().optional(),
  votes: z.number().int(),
  createdAt: z.string().datetime(),
});

activities.use('*', authMiddleware);

activities.get('/', async (c) => {
  const planId = c.req.query('planId');
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  const result = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: { 
      ':pk': `PLAN#${planId}`,
      ':sk': 'ACTIVITY#'
    },
  }));

  return c.json({ activities: result.Items || [] });
});

activities.post(
  '/',
  describeRoute({
    tags: ['Activities'],
    summary: 'Create a new activity',
  }),
  validator('json', z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    address: z.string().optional(),
    link: z.string().optional(),
    category: z.enum(['ETEN', 'CULTUUR', 'SPORT', 'OVERIG']),
    imageUrl: z.string().optional(),
    planId: z.string(),
  })),
  async (c) => {
    const user = c.get('user');
    const { title, description, address, link, category, imageUrl, planId } = c.req.valid('json');
    const activityId = uuidv4();
    const now = new Date().toISOString();

    const activity = {
      PK: `PLAN#${planId}`,
      SK: `ACTIVITY#${activityId}`,
      id: activityId,
      title,
      description,
      address,
      link,
      category,
      planId,
      createdBy: user.id,
      imageUrl,
      votes: 0,
      createdAt: now,
    };

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: activity }));

    return c.json(activity, 201);
  }
);

activities.delete('/:id', async (c) => {
  const activityId = c.req.param('id');
  const planId = c.req.query('planId');
  
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  await docClient.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `PLAN#${planId}`,
      SK: `ACTIVITY#${activityId}`,
    },
  }));

  return c.json({ success: true });
});

export default activities;
