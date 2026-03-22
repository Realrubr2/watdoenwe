import { Hono } from 'hono';
import { describeRoute, validator } from 'hono-openapi';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../db';
import { authMiddleware } from '../middleware';

const ideas = new Hono<{ Variables: { user: any } }>();

const IdeaSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  address: z.string().optional(),
  link: z.string().optional(),
  category: z.enum(['ETEN', 'CULTUUR', 'SPORT', 'OVERIG']),
  planId: z.string().uuid(),
  createdBy: z.string().uuid(),
  imageUrl: z.string().optional(),
  votes: z.number().int(),
  createdAt: z.string().datetime(),
});

ideas.use('*', authMiddleware);

ideas.get('/', async (c) => {
  const planId = c.req.query('planId');
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  const result = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: { 
      ':pk': `PLAN#${planId}`,
      ':sk': 'IDEA#'
    },
  }));

  return c.json({ ideas: result.Items || [] });
});

ideas.post(
  '/',
  describeRoute({
    tags: ['Ideas'],
    summary: 'Create a new idea',
  }),
  validator('json', z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    address: z.string().optional(),
    link: z.string().optional(),
    category: z.enum(['ETEN', 'CULTUUR', 'SPORT', 'OVERIG']),
    imageUrl: z.string().optional(),
    planId: z.string().uuid(),
  })),
  async (c) => {
    const user = c.get('user');
    const { title, description, address, link, category, imageUrl, planId } = c.req.valid('json');
    const ideaId = uuidv4();
    const now = new Date().toISOString();

    const idea = {
      PK: `PLAN#${planId}`,
      SK: `IDEA#${ideaId}`,
      id: ideaId,
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

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: idea }));

    return c.json(idea, 201);
  }
);

ideas.delete('/:id', async (c) => {
  const ideaId = c.req.param('id');
  const planId = c.req.query('planId');
  
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  await docClient.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `PLAN#${planId}`,
      SK: `IDEA#${ideaId}`,
    },
  }));

  return c.json({ success: true });
});

export default ideas;