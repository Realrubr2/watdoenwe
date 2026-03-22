import { Hono } from 'hono';
import { describeRoute, validator } from 'hono-openapi';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../db';
import { authMiddleware } from '../middleware';

const plans = new Hono<{ Variables: { user: any } }>();

const PlanSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  mode: z.enum(['FIXED_DATE', 'FIXED_ACTIVITY', 'FLEXIBLE']),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED']),
  hostId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

plans.use('*', authMiddleware);

plans.get('/', async (c) => {
  const user = c.get('user');
  
  const result = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: { 
      ':pk': `USER#${user.id}`,
      ':sk': 'PLAN#'
    },
  }));

  return c.json({ plans: result.Items || [] });
});

plans.post(
  '/',
  describeRoute({
    tags: ['Plans'],
    summary: 'Create a new plan',
  }),
  validator('json', z.object({ name: z.string().min(1), mode: z.enum(['FIXED_DATE', 'FIXED_ACTIVITY', 'FLEXIBLE']) })),
  async (c) => {
    const user = c.get('user');
    const { name, mode } = c.req.valid('json');
    const planId = uuidv4();
    const now = new Date().toISOString();

    const plan = {
      PK: `PLAN#${planId}`,
      SK: 'METADATA',
      id: planId,
      name,
      mode,
      status: 'DRAFT',
      hostId: user.id,
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: plan }));
    await docClient.send(new PutCommand({ 
      TableName: TABLE_NAME, 
      Item: {
        PK: `USER#${user.id}`,
        SK: `PLAN#${planId}`,
        planId,
        role: 'HOST'
      } 
    }));

    return c.json(plan, 201);
  }
);

plans.get('/:id', async (c) => {
  const planId = c.req.param('id');
  
  const result = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: { ':pk': `PLAN#${planId}` },
  }));

  if (!result.Items || result.Items.length === 0) {
    return c.json({ error: 'Plan not found' }, 404);
  }

  const plan = result.Items.find((item: any) => item.SK === 'METADATA');
  const participants = result.Items.filter((item: any) => item.SK.startsWith('USER#'));

  return c.json({ plan, participants });
});

export default plans;
