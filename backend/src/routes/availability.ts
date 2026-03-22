import { Hono } from 'hono';
import { describeRoute, validator } from 'hono-openapi';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../db';
import { authMiddleware } from '../middleware';

const availability = new Hono<{ Variables: { user: any } }>();

availability.use('*', authMiddleware);

availability.get('/dates', async (c) => {
  const planId = c.req.query('planId');
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  const result = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: { 
      ':pk': `PLAN#${planId}`,
      ':sk': 'DATESLOT#'
    },
  }));

  return c.json({ dateSlots: result.Items || [] });
});

availability.post(
  '/dates',
  describeRoute({
    tags: ['Availability'],
    summary: 'Create a new date slot',
  }),
  validator('json', z.object({ date: z.string().datetime(), planId: z.string() })),
  async (c) => {
    const { date, planId } = c.req.valid('json');
    const dateSlotId = uuidv4();
    const now = new Date().toISOString();

    const dateSlot = {
      PK: `PLAN#${planId}`,
      SK: `DATESLOT#${dateSlotId}`,
      id: dateSlotId,
      date,
      planId,
      createdAt: now,
    };

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: dateSlot }));

    return c.json(dateSlot, 201);
  }
);

availability.get('/', async (c) => {
  const planId = c.req.query('planId');
  if (!planId) {
    return c.json({ error: 'planId is required' }, 400);
  }

  const result = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: { 
      ':pk': `PLAN#${planId}`,
      ':sk': 'AVAILABILITY#'
    },
  }));

  return c.json({ availabilities: result.Items || [] });
});

availability.post(
  '/:dateSlotId',
  describeRoute({
    tags: ['Availability'],
    summary: 'Mark availability for a date slot',
  }),
  validator('json', z.object({ status: z.enum(['AVAILABLE', 'MAYBE', 'UNAVAILABLE']) })),
  async (c) => {
    const user = c.get('user');
    const dateSlotId = c.req.param('dateSlotId');
    const planId = c.req.query('planId');
    
    if (!planId) {
      return c.json({ error: 'planId is required' }, 400);
    }

    const { status } = c.req.valid('json');
    const availabilityId = uuidv4();
    const now = new Date().toISOString();

    const availability = {
      PK: `PLAN#${planId}`,
      SK: `AVAILABILITY#${dateSlotId}#${user.id}`,
      id: availabilityId,
      userId: user.id,
      dateSlotId,
      status,
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: availability }));

    return c.json(availability);
  }
);

export default availability;