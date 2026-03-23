import 'reflect-metadata';
import { field, fk, id, index, table } from 'sqlite3orm';
import type { PlanMode, PlanStatus, ActivityCategory, IdeaCategory, AvailabilityStatus } from '../types';

// User Model
@table({ name: 'users' })
export class User {
  @id({ name: 'id', dbtype: 'TEXT NOT NULL' })
  id!: string;

  @field({ name: 'name', dbtype: 'TEXT NOT NULL' })
  name!: string;

  @field({ name: 'email', dbtype: 'TEXT' })
  email?: string;

  @field({ name: 'is_guest', dbtype: 'INTEGER NOT NULL DEFAULT 1' })
  isGuest!: number;

  @index('idx_users_guest_token')
  @field({ name: 'guest_token', dbtype: 'TEXT' })
  guestToken?: string;

  @field({ name: 'created_at', dbtype: 'TEXT NOT NULL' })
  createdAt!: string;

  @field({ name: 'updated_at', dbtype: 'TEXT' })
  updatedAt?: string;
}

// Plan Model
@table({ name: 'plans' })
export class Plan {
  @id({ name: 'id', dbtype: 'TEXT NOT NULL' })
  id!: string;

  @field({ name: 'name', dbtype: 'TEXT NOT NULL' })
  name!: string;

  @field({ name: 'mode', dbtype: 'TEXT NOT NULL' })
  mode!: string;

  @field({ name: 'status', dbtype: 'TEXT NOT NULL' })
  status!: string;

  @field({ name: 'host_id', dbtype: 'TEXT NOT NULL' })
  hostId!: string;

  @field({ name: 'date', dbtype: 'TEXT' })
  date?: string;

  @field({ name: 'activity_name', dbtype: 'TEXT' })
  activityName?: string;

  @field({ name: 'activity_location', dbtype: 'TEXT' })
  activityLocation?: string;

  @field({ name: 'description', dbtype: 'TEXT' })
  description?: string;

  @field({ name: 'created_at', dbtype: 'TEXT NOT NULL' })
  createdAt!: string;

  @field({ name: 'updated_at', dbtype: 'TEXT' })
  updatedAt?: string;
}

// PlanParticipant Model
@table({ name: 'plan_participants' })
export class PlanParticipant {
  @id({ name: 'id', dbtype: 'TEXT NOT NULL' })
  id!: string;

  @index('idx_pp_plan')
  @fk('fk_plan_participant_plan', 'plans', 'id')
  @field({ name: 'plan_id', dbtype: 'TEXT NOT NULL' })
  planId!: string;

  @index('idx_pp_user')
  @fk('fk_plan_participant_user', 'users', 'id')
  @field({ name: 'user_id', dbtype: 'TEXT NOT NULL' })
  userId!: string;

  @field({ name: 'created_at', dbtype: 'TEXT NOT NULL' })
  createdAt!: string;
}

// Activity Model
@table({ name: 'activities' })
export class Activity {
  @id({ name: 'id', dbtype: 'TEXT NOT NULL' })
  id!: string;

  @index('idx_activity_plan')
  @fk('fk_activity_plan', 'plans', 'id')
  @field({ name: 'plan_id', dbtype: 'TEXT NOT NULL' })
  planId!: string;

  @field({ name: 'name', dbtype: 'TEXT NOT NULL' })
  name!: string;

  @field({ name: 'category', dbtype: 'TEXT NOT NULL' })
  category!: string;

  @field({ name: 'location', dbtype: 'TEXT' })
  location?: string;

  @field({ name: 'start_time', dbtype: 'TEXT' })
  startTime?: string;

  @field({ name: 'end_time', dbtype: 'TEXT' })
  endTime?: string;

  @field({ name: 'description', dbtype: 'TEXT' })
  description?: string;

  @field({ name: 'is_fixed', dbtype: 'INTEGER NOT NULL DEFAULT 0' })
  isFixed!: number;

  @field({ name: 'created_at', dbtype: 'TEXT NOT NULL' })
  createdAt!: string;

  @field({ name: 'updated_at', dbtype: 'TEXT' })
  updatedAt?: string;
}

// Idea Model
@table({ name: 'ideas' })
export class Idea {
  @id({ name: 'id', dbtype: 'TEXT NOT NULL' })
  id!: string;

  @index('idx_idea_plan')
  @fk('fk_idea_plan', 'plans', 'id')
  @field({ name: 'plan_id', dbtype: 'TEXT NOT NULL' })
  planId!: string;

  @index('idx_idea_user')
  @fk('fk_idea_user', 'users', 'id')
  @field({ name: 'user_id', dbtype: 'TEXT NOT NULL' })
  userId!: string;

  @field({ name: 'name', dbtype: 'TEXT NOT NULL' })
  name!: string;

  @field({ name: 'category', dbtype: 'TEXT NOT NULL' })
  category!: string;

  @field({ name: 'description', dbtype: 'TEXT' })
  description?: string;

  @field({ name: 'created_at', dbtype: 'TEXT NOT NULL' })
  createdAt!: string;

  @field({ name: 'updated_at', dbtype: 'TEXT' })
  updatedAt?: string;
}

// DateSlot Model
@table({ name: 'date_slots' })
export class DateSlot {
  @id({ name: 'id', dbtype: 'TEXT NOT NULL' })
  id!: string;

  @index('idx_date_slot_plan')
  @fk('fk_date_slot_plan', 'plans', 'id')
  @field({ name: 'plan_id', dbtype: 'TEXT NOT NULL' })
  planId!: string;

  @field({ name: 'date', dbtype: 'TEXT NOT NULL' })
  date!: string;

  @field({ name: 'start_time', dbtype: 'TEXT' })
  startTime?: string;

  @field({ name: 'end_time', dbtype: 'TEXT' })
  endTime?: string;

  @field({ name: 'created_at', dbtype: 'TEXT NOT NULL' })
  createdAt!: string;

  @field({ name: 'updated_at', dbtype: 'TEXT' })
  updatedAt?: string;
}

// Availability Model
@table({ name: 'availability' })
export class Availability {
  @id({ name: 'id', dbtype: 'TEXT NOT NULL' })
  id!: string;

  @index('idx_avail_plan')
  @fk('fk_availability_plan', 'plans', 'id')
  @field({ name: 'plan_id', dbtype: 'TEXT NOT NULL' })
  planId!: string;

  @index('idx_avail_user')
  @fk('fk_availability_user', 'users', 'id')
  @field({ name: 'user_id', dbtype: 'TEXT NOT NULL' })
  userId!: string;

  @index('idx_avail_slot')
  @fk('fk_availability_slot', 'date_slots', 'id')
  @field({ name: 'date_slot_id', dbtype: 'TEXT' })
  dateSlotId?: string;

  @field({ name: 'status', dbtype: 'TEXT NOT NULL' })
  status!: string;

  @field({ name: 'note', dbtype: 'TEXT' })
  note?: string;

  @field({ name: 'created_at', dbtype: 'TEXT NOT NULL' })
  createdAt!: string;

  @field({ name: 'updated_at', dbtype: 'TEXT' })
  updatedAt?: string;
}

// Vote Model
@table({ name: 'votes' })
export class Vote {
  @id({ name: 'id', dbtype: 'TEXT NOT NULL' })
  id!: string;

  @index('idx_vote_user')
  @fk('fk_vote_user', 'users', 'id')
  @field({ name: 'user_id', dbtype: 'TEXT NOT NULL' })
  userId!: string;

  @index('idx_vote_idea')
  @fk('fk_vote_idea', 'ideas', 'id')
  @field({ name: 'idea_id', dbtype: 'TEXT NOT NULL' })
  ideaId!: string;

  @field({ name: 'value', dbtype: 'INTEGER NOT NULL' })
  value!: number;

  @field({ name: 'created_at', dbtype: 'TEXT NOT NULL' })
  createdAt!: string;
}

// Session Model
@table({ name: 'sessions' })
export class Session {
  @id({ name: 'id', dbtype: 'TEXT NOT NULL' })
  id!: string;

  @field({ name: 'owner_name', dbtype: 'TEXT NOT NULL' })
  ownerName!: string;

  @field({ name: 'participants', dbtype: 'TEXT NOT NULL' }) // JSON array of participant names
  participants!: string;

  @index('idx_session_plan')
  @fk('fk_session_plan', 'plans', 'id')
  @field({ name: 'plan_id', dbtype: 'TEXT NOT NULL' })
  planId!: string;

  @field({ name: 'created_at', dbtype: 'TEXT NOT NULL' })
  createdAt!: string;

  @field({ name: 'updated_at', dbtype: 'TEXT' })
  updatedAt?: string;
}
