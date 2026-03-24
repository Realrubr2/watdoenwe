// @ts-ignore
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import type { 
  PlanMode, 
  PlanStatus, 
  ActivityCategory, 
  IdeaCategory, 
  AvailabilityStatus 
} from './types';

export const DB_PATH = 'dev.db';

export let db: Database.Database | null = null;

export async function initDb(): Promise<void> {
  db = new Database(DB_PATH);
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      is_guest INTEGER NOT NULL DEFAULT 1,
      guest_token TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT
    );
    
    CREATE INDEX IF NOT EXISTS idx_users_guest_token ON users(guest_token);
    
    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      mode TEXT NOT NULL,
      status TEXT NOT NULL,
      host_id TEXT NOT NULL,
      share_token TEXT,
      date TEXT,
      activity_name TEXT,
      activity_location TEXT,
      description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      FOREIGN KEY (host_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS plan_participants (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (plan_id) REFERENCES plans(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_pp_plan ON plan_participants(plan_id);
    CREATE INDEX IF NOT EXISTS idx_pp_user ON plan_participants(user_id);
    
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT,
      start_time TEXT,
      end_time TEXT,
      description TEXT,
      is_fixed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      FOREIGN KEY (plan_id) REFERENCES plans(id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_activity_plan ON activities(plan_id);
    
    CREATE TABLE IF NOT EXISTS ideas (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      FOREIGN KEY (plan_id) REFERENCES plans(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_idea_plan ON ideas(plan_id);
    CREATE INDEX IF NOT EXISTS idx_idea_user ON ideas(user_id);
    
    CREATE TABLE IF NOT EXISTS date_slots (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT,
      end_time TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      FOREIGN KEY (plan_id) REFERENCES plans(id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_date_slot_plan ON date_slots(plan_id);
    
    CREATE TABLE IF NOT EXISTS availability (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      date_slot_id TEXT,
      status TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      FOREIGN KEY (plan_id) REFERENCES plans(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (date_slot_id) REFERENCES date_slots(id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_avail_plan ON availability(plan_id);
    CREATE INDEX IF NOT EXISTS idx_avail_user ON availability(user_id);
    CREATE INDEX IF NOT EXISTS idx_avail_slot ON availability(date_slot_id);
    
    CREATE TABLE IF NOT EXISTS votes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      idea_id TEXT NOT NULL,
      value INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (idea_id) REFERENCES ideas(id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_vote_user ON votes(user_id);
    CREATE INDEX IF NOT EXISTS idx_vote_idea ON votes(idea_id);
    
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      owner_name TEXT NOT NULL,
      participants TEXT NOT NULL,
      plan_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      FOREIGN KEY (plan_id) REFERENCES plans(id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_session_plan ON sessions(plan_id);
  `);
  
  // Migration: Add share_token column if it doesn't exist (for existing databases)
  try {
    db!.exec('ALTER TABLE plans ADD COLUMN share_token TEXT');
  } catch (e: any) {
    // Column may already exist, ignore error
  }
  
  console.log('SQLite database initialized and synced.');
  
  // Seed initial data if no users exist
  await seedIfEmpty();
}

async function seedIfEmpty(): Promise<void> {
  const userCount = db!.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) return;
  
  console.log('Seeding initial data...');
  
  const now = new Date().toISOString();
  
  // Seed users
  const janId = uuidv4();
  const marieId = uuidv4();
  const pieterId = uuidv4();
  
  db!.prepare(`
    INSERT INTO users (id, name, email, is_guest, guest_token, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(janId, 'Jan Jansen', null, 1, 'token-001', now);
  
  db!.prepare(`
    INSERT INTO users (id, name, email, is_guest, guest_token, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(marieId, 'Marie de Vries', null, 1, 'token-002', now);
  
  db!.prepare(`
    INSERT INTO users (id, name, email, is_guest, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(pieterId, 'Pieter Smit', null, 0, now);
  
  // Seed plans
  const weekendPlanId = uuidv4();
  const verjaardagPlanId = uuidv4();
  const sportPlanId = uuidv4();
  
  db!.prepare(`
    INSERT INTO plans (id, name, mode, status, host_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(weekendPlanId, 'Weekendje Weg', 'FLEXIBLE', 'ACTIVE', janId, now);
  
  db!.prepare(`
    INSERT INTO plans (id, name, mode, status, host_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(verjaardagPlanId, 'Verjaardagsfeest', 'FIXED_DATE', 'DRAFT', janId, now);
  
  db!.prepare(`
    INSERT INTO plans (id, name, mode, status, host_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(sportPlanId, 'Sportieve Middag', 'FIXED_ACTIVITY', 'ACTIVE', marieId, now);
  
  // Seed plan participants (hosts)
  db!.prepare(`
    INSERT INTO plan_participants (id, plan_id, user_id, created_at)
    VALUES (?, ?, ?, ?)
  `).run(uuidv4(), weekendPlanId, janId, now);
  
  db!.prepare(`
    INSERT INTO plan_participants (id, plan_id, user_id, created_at)
    VALUES (?, ?, ?, ?)
  `).run(uuidv4(), verjaardagPlanId, janId, now);
  
  db!.prepare(`
    INSERT INTO plan_participants (id, plan_id, user_id, created_at)
    VALUES (?, ?, ?, ?)
  `).run(uuidv4(), sportPlanId, marieId, now);
  
  // Add Marie and Pieter as participants to Weekendje Weg
  db!.prepare(`
    INSERT INTO plan_participants (id, plan_id, user_id, created_at)
    VALUES (?, ?, ?, ?)
  `).run(uuidv4(), weekendPlanId, marieId, now);
  
  db!.prepare(`
    INSERT INTO plan_participants (id, plan_id, user_id, created_at)
    VALUES (?, ?, ?, ?)
  `).run(uuidv4(), weekendPlanId, pieterId, now);
  
  console.log('Initial data seeded successfully.');
}

// User functions
export function getUserByToken(token: string) {
  return db!.prepare('SELECT * FROM users WHERE guest_token = ?').get(token) as any;
}

export function getUserById(id: string) {
  return db!.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
}

export function getAllUsers() {
  return db!.prepare('SELECT * FROM users').all() as any[];
}

// Plan functions
export function getPlans() {
  return db!.prepare(`
    SELECT p.*, u.name as host_name 
    FROM plans p 
    LEFT JOIN users u ON p.host_id = u.id
  `).all() as any[];
}

export function getPlanById(id: string) {
  return db!.prepare(`
    SELECT p.*, u.name as host_name 
    FROM plans p 
    LEFT JOIN users u ON p.host_id = u.id
    WHERE p.id = ?
  `).get(id) as any;
}

export function getPlanByShareToken(shareToken: string) {
  return db!.prepare(`
    SELECT * FROM plans WHERE share_token = ?
  `).get(shareToken) as any;
}

export function getPlanParticipants(planId: string) {
  return db!.prepare(`
    SELECT pp.*, u.name, u.is_guest, u.guest_token
    FROM plan_participants pp
    LEFT JOIN users u ON pp.user_id = u.id
    WHERE pp.plan_id = ?
  `).all(planId) as any[];
}

export function createPlan(data: any) {
  const id = uuidv4();
  const shareToken = uuidv4().substring(0, 8);
  const now = new Date().toISOString();
  db!.prepare(`
    INSERT INTO plans (id, name, mode, status, host_id, share_token, date, activity_name, activity_location, description, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.name, data.mode, data.status, data.hostId, shareToken, data.date, data.activityName, data.activityLocation, data.description, now);
  
  // Add host as participant
  db!.prepare(`
    INSERT INTO plan_participants (id, plan_id, user_id, created_at)
    VALUES (?, ?, ?, ?)
  `).run(uuidv4(), id, data.hostId, now);
  
  return getPlanById(id);
}

export function updatePlan(id: string, data: any) {
  const now = new Date().toISOString();
  db!.prepare(`
    UPDATE plans SET name = ?, mode = ?, status = ?, date = ?, activity_name = ?, activity_location = ?, description = ?, updated_at = ?
    WHERE id = ?
  `).run(data.name, data.mode, data.status, data.date, data.activityName, data.activityLocation, data.description, now, id);
  return getPlanById(id);
}

export function deletePlan(id: string) {
  db!.prepare('DELETE FROM plans WHERE id = ?').run(id);
}

// Activity functions
export function getActivities(planId: string) {
  return db!.prepare('SELECT * FROM activities WHERE plan_id = ?').all(planId) as any[];
}

export function getActivityById(id: string) {
  return db!.prepare('SELECT * FROM activities WHERE id = ?').get(id) as any;
}

export function createActivity(data: any) {
  const id = uuidv4();
  const now = new Date().toISOString();
  db!.prepare(`
    INSERT INTO activities (id, plan_id, name, category, location, start_time, end_time, description, is_fixed, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.planId, data.name, data.category, data.location, data.startTime, data.endTime, data.description, data.isFixed ? 1 : 0, now);
  return getActivityById(id);
}

export function updateActivity(id: string, data: any) {
  const now = new Date().toISOString();
  db!.prepare(`
    UPDATE activities SET name = ?, category = ?, location = ?, start_time = ?, end_time = ?, description = ?, is_fixed = ?, updated_at = ?
    WHERE id = ?
  `).run(data.name, data.category, data.location, data.startTime, data.endTime, data.description, data.isFixed ? 1 : 0, now, id);
  return getActivityById(id);
}

export function deleteActivity(id: string) {
  db!.prepare('DELETE FROM activities WHERE id = ?').run(id);
}

// Idea functions
export function getIdeas(planId: string) {
  return db!.prepare(`
    SELECT i.*, u.name as user_name,
           (SELECT SUM(value) FROM votes WHERE idea_id = i.id) as votes
    FROM ideas i
    LEFT JOIN users u ON i.user_id = u.id
    WHERE i.plan_id = ?
  `).all(planId) as any[];
}

export function getIdeaById(id: string) {
  const idea = db!.prepare(`
    SELECT i.*, u.name as user_name,
           (SELECT SUM(value) FROM votes WHERE idea_id = i.id) as votes
    FROM ideas i
    LEFT JOIN users u ON i.user_id = u.id
    WHERE i.id = ?
  `).get(id) as any;
  return idea;
}

export function createIdea(data: any) {
  const id = uuidv4();
  const now = new Date().toISOString();
  db!.prepare(`
    INSERT INTO ideas (id, plan_id, user_id, name, category, description, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.planId, data.userId, data.name, data.category, data.description, now);
  return getIdeaById(id);
}

export function deleteIdea(id: string) {
  db!.prepare('DELETE FROM votes WHERE idea_id = ?').run(id);
  db!.prepare('DELETE FROM ideas WHERE id = ?').run(id);
}

// Vote functions
export function getVotes(ideaId: string) {
  return db!.prepare('SELECT * FROM votes WHERE idea_id = ?').all(ideaId) as any[];
}

export function getUserVote(userId: string, ideaId: string) {
  return db!.prepare('SELECT * FROM votes WHERE user_id = ? AND idea_id = ?').get(userId, ideaId) as any;
}

export function vote(userId: string, ideaId: string, value: number) {
  const existing = getUserVote(userId, ideaId);
  if (existing) {
    db!.prepare('UPDATE votes SET value = ? WHERE user_id = ? AND idea_id = ?').run(value, userId, ideaId);
  } else {
    db!.prepare('INSERT INTO votes (id, user_id, idea_id, value, created_at) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), userId, ideaId, value, new Date().toISOString());
  }
  return getIdeaById(ideaId);
}

// Date slot functions
export function getDateSlots(planId: string) {
  return db!.prepare('SELECT * FROM date_slots WHERE plan_id = ?').all(planId) as any[];
}

export function createDateSlot(data: any) {
  const id = uuidv4();
  const now = new Date().toISOString();
  db!.prepare(`
    INSERT INTO date_slots (id, plan_id, date, start_time, end_time, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, data.planId, data.date, data.startTime, data.endTime, now);
  return db!.prepare('SELECT * FROM date_slots WHERE id = ?').get(id) as any;
}

export function deleteDateSlot(id: string) {
  db!.prepare('DELETE FROM availability WHERE date_slot_id = ?').run(id);
  db!.prepare('DELETE FROM date_slots WHERE id = ?').run(id);
}

// Availability functions
export function getAvailabilities(planId: string) {
  return db!.prepare(`
    SELECT a.*, u.name as user_name, ds.date, ds.start_time, ds.end_time
    FROM availability a
    LEFT JOIN users u ON a.user_id = u.id
    LEFT JOIN date_slots ds ON a.date_slot_id = ds.id
    WHERE a.plan_id = ?
  `).all(planId) as any[];
}

// Session functions
export function getSessionById(id: string) {
  return db!.prepare('SELECT * FROM sessions WHERE id = ?').get(id) as any;
}

export function createSession(data: any) {
  const id = uuidv4();
  const now = new Date().toISOString();
  const participants = JSON.stringify([data.ownerName]);
  db!.prepare(`
    INSERT INTO sessions (id, owner_name, participants, plan_id, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, data.ownerName, participants, data.planId, now);
  return getSessionById(id);
}

export function addParticipantToSession(sessionId: string, name: string) {
  const now = new Date().toISOString();
  const session = getSessionById(sessionId);
  if (!session) return null;
  
  const participants = JSON.parse(session.participants);
  if (!participants.includes(name)) {
    participants.push(name);
  }
  
  db!.prepare(`
    UPDATE sessions SET participants = ?, updated_at = ?
    WHERE id = ?
  `).run(JSON.stringify(participants), now, sessionId);
  
  return getSessionById(sessionId);
}

export function getUserAvailability(userId: string, planId: string) {
  return db!.prepare(`
    SELECT a.*, ds.date, ds.start_time, ds.end_time
    FROM availability a
    LEFT JOIN date_slots ds ON a.date_slot_id = ds.id
    WHERE a.user_id = ? AND a.plan_id = ?
  `).all(userId, planId) as any[];
}

export function setAvailability(data: any) {
  const now = new Date().toISOString();
  
  // Check if availability exists
  const existing = db!.prepare('SELECT id FROM availability WHERE user_id = ? AND plan_id = ? AND date_slot_id = ?')
    .get(data.userId, data.planId, data.dateSlotId) as any;
  
  if (existing) {
    db!.prepare('UPDATE availability SET status = ?, note = ?, updated_at = ? WHERE id = ?')
      .run(data.status, data.note, now, existing.id);
    return db!.prepare('SELECT * FROM availability WHERE id = ?').get(existing.id) as any;
  } else {
    const id = uuidv4();
    db!.prepare(`
      INSERT INTO availability (id, plan_id, user_id, date_slot_id, status, note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.planId, data.userId, data.dateSlotId, data.status, data.note, now);
    return db!.prepare('SELECT * FROM availability WHERE id = ?').get(id) as any;
  }
}
