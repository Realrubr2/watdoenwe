import { Hono } from 'hono';
import { describeRoute, validator, resolver } from 'hono-openapi';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../db';

const auth = new Hono();

const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  isGuest: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const ErrorSchema = z.object({
  error: z.string(),
});

auth.post(
  '/guest',
  describeRoute({
    tags: ['Auth'],
    summary: 'Create a new guest session',
    responses: {
      201: {
        description: 'Guest session created',
        content: { 'application/json': { schema: resolver(z.object({ user: UserSchema, token: z.string() })) } },
      },
    },
  }),
  validator('json', z.object({ name: z.string().min(1) })),
  async (c) => {
    const { name } = c.req.valid('json');
    const userId = uuidv4();
    const now = new Date().toISOString();
    const guestToken = uuidv4();

    const user = {
      PK: `USER#${userId}`,
      SK: 'METADATA',
      id: userId,
      name,
      isGuest: true,
      guestToken,
      createdAt: now,
      updatedAt: now,
      GSI1PK: `TOKEN#${guestToken}`,
      GSI1SK: 'USER',
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: user,
    }));

    return c.json({ user, token: guestToken }, 201);
  }
);

auth.post(
  '/verify',
  describeRoute({
    tags: ['Auth'],
    summary: 'Verify a guest token',
    responses: {
      200: { description: 'Token verified', content: { 'application/json': { schema: resolver(z.object({ user: UserSchema })) } } },
      401: { description: 'Invalid token', content: { 'application/json': { schema: resolver(ErrorSchema) } } },
    },
  }),
  validator('json', z.object({ token: z.string() })),
  async (c) => {
    const { token } = c.req.valid('json');

    const result = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :token',
      ExpressionAttributeValues: { ':token': `TOKEN#${token}` },
    }));

    if (!result.Items || result.Items.length === 0) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }

    return c.json({ user: result.Items[0] });
  }
);

export default auth;
