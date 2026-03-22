import { Context, Next } from 'hono';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from './db';

export const authMiddleware = async (c: Context<{ Variables: { user: any } }>, next: Next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const token = authHeader.split(' ')[1];
  
  const result = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: 'GSI1',
    KeyConditionExpression: 'GSI1PK = :token',
    ExpressionAttributeValues: { ':token': `TOKEN#${token}` },
  }));

  if (!result.Items || result.Items.length === 0) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('user', result.Items[0]);
  await next();
};
