// Mock data for development - simulates DynamoDB responses
import { v4 as uuidv4 } from 'uuid';

// Generate timestamps
const now = new Date().toISOString();
const yesterday = new Date(Date.now() - 86400000).toISOString();
const tomorrow = new Date(Date.now() + 86400000).toISOString();
const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString();

// Mock Users
export const mockUsers = [
  {
    PK: 'USER#user-001',
    SK: 'METADATA',
    id: 'user-001',
    name: 'Jan Jansen',
    isGuest: true,
    guestToken: 'token-001',
    createdAt: now,
    updatedAt: now,
    GSI1PK: 'TOKEN#token-001',
    GSI1SK: 'USER',
  },
  {
    PK: 'USER#user-002',
    SK: 'METADATA',
    id: 'user-002',
    name: 'Marie de Vries',
    isGuest: true,
    guestToken: 'token-002',
    createdAt: now,
    updatedAt: now,
    GSI1PK: 'TOKEN#token-002',
    GSI1SK: 'USER',
  },
  {
    PK: 'USER#user-003',
    SK: 'METADATA',
    id: 'user-003',
    name: 'Pieter Smit',
    isGuest: false,
    createdAt: yesterday,
    updatedAt: now,
  },
];

// Mock Plans
export const mockPlans = [
  {
    PK: 'PLAN#plan-001',
    SK: 'METADATA',
    id: 'plan-001',
    name: 'Weekendje Weg',
    mode: 'FLEXIBLE',
    status: 'ACTIVE',
    hostId: 'user-001',
    createdAt: yesterday,
    updatedAt: now,
  },
  {
    PK: 'PLAN#plan-002',
    SK: 'METADATA',
    id: 'plan-002',
    name: 'Verjaardagsfeest',
    mode: 'FIXED_DATE',
    status: 'DRAFT',
    hostId: 'user-001',
    createdAt: now,
    updatedAt: now,
  },
  {
    PK: 'PLAN#plan-003',
    SK: 'METADATA',
    id: 'plan-003',
    name: 'Sportieve Middag',
    mode: 'FIXED_ACTIVITY',
    status: 'ACTIVE',
    hostId: 'user-002',
    createdAt: yesterday,
    updatedAt: now,
  },
];

// Mock Activities
export const mockActivities = [
  {
    PK: 'PLAN#plan-001',
    SK: 'ACTIVITY#activity-001',
    id: 'activity-001',
    title: 'Picknick in het Park',
    description: 'Lekker eten en drinken in het Vondelpark',
    address: 'Vondelpark 1, Amsterdam',
    link: 'https://example.com/picknick',
    category: 'ETEN',
    planId: 'plan-001',
    createdBy: 'user-001',
    imageUrl: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=400',
    votes: 5,
    createdAt: yesterday,
  },
  {
    PK: 'PLAN#plan-001',
    SK: 'ACTIVITY#activity-002',
    id: 'activity-002',
    title: 'Museum Bezoek',
    description: 'Rijksmuseum voor kunst en geschiedenis',
    address: 'Museumstraat 1, Amsterdam',
    link: 'https://www.rijksmuseum.nl',
    category: 'CULTUUR',
    planId: 'plan-001',
    createdBy: 'user-002',
    imageUrl: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400',
    votes: 3,
    createdAt: now,
  },
  {
    PK: 'PLAN#plan-001',
    SK: 'ACTIVITY#activity-003',
    id: 'activity-003',
    title: 'Hardlopen in het Bos',
    description: 'Verfrissende loop door het Amsterdamse Bos',
    address: 'Amsterdamse Bos, Amstelveen',
    category: 'SPORT',
    planId: 'plan-001',
    createdBy: 'user-001',
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400',
    votes: 2,
    createdAt: now,
  },
  {
    PK: 'PLAN#plan-003',
    SK: 'ACTIVITY#activity-004',
    id: 'activity-004',
    title: 'Tennis Match',
    description: 'Dubbelspel tennisbanen',
    address: 'Sportpark Middenmeer, Amsterdam',
    category: 'SPORT',
    planId: 'plan-003',
    createdBy: 'user-002',
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400',
    votes: 4,
    createdAt: yesterday,
  },
];

// Mock Ideas
export const mockIdeas = [
  {
    PK: 'PLAN#plan-001',
    SK: 'IDEA#idea-001',
    id: 'idea-001',
    title: 'Italiaans Restaurant',
    description: 'Authentieke Italiaanse keuken in de Jordaan',
    address: 'Jordaan, Amsterdam',
    link: 'https://example.com/italiaans',
    category: 'ETEN',
    planId: 'plan-001',
    createdBy: 'user-001',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    votes: 8,
    createdAt: yesterday,
  },
  {
    PK: 'PLAN#plan-001',
    SK: 'IDEA#idea-002',
    id: 'idea-002',
    title: 'Concert in de Arena',
    description: 'Grote concerten in de Ziggo Dome',
    address: 'Ziggo Dome, Amsterdam',
    link: 'https://www.ziggodome.nl',
    category: 'CULTUUR',
    planId: 'plan-001',
    createdBy: 'user-002',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
    votes: 6,
    createdAt: now,
  },
  {
    PK: 'PLAN#plan-001',
    SK: 'IDEA#idea-003',
    id: 'idea-003',
    title: 'Kajakken op de Amstel',
    description: 'Avontuurlijke tocht over de Amstel',
    address: 'Amstel, Amsterdam',
    category: 'SPORT',
    planId: 'plan-001',
    createdBy: 'user-001',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
    votes: 4,
    createdAt: now,
  },
];

// Mock Date Slots
export const mockDateSlots = [
  {
    PK: 'PLAN#plan-001',
    SK: 'DATESLOT#dateslot-001',
    id: 'dateslot-001',
    date: tomorrow,
    planId: 'plan-001',
    createdAt: yesterday,
  },
  {
    PK: 'PLAN#plan-001',
    SK: 'DATESLOT#dateslot-002',
    id: 'dateslot-002',
    date: nextWeek,
    planId: 'plan-001',
    createdAt: yesterday,
  },
  {
    PK: 'PLAN#plan-001',
    SK: 'DATESLOT#dateslot-003',
    id: 'dateslot-003',
    date: '2026-04-05T14:00:00.000Z',
    planId: 'plan-001',
    createdAt: now,
  },
];

// Mock Availabilities
export const mockAvailabilities = [
  {
    PK: 'PLAN#plan-001',
    SK: 'AVAILABILITY#dateslot-001#user-001',
    id: 'avail-001',
    userId: 'user-001',
    dateSlotId: 'dateslot-001',
    status: 'AVAILABLE',
    createdAt: yesterday,
  },
  {
    PK: 'PLAN#plan-001',
    SK: 'AVAILABILITY#dateslot-001#user-002',
    id: 'avail-002',
    userId: 'user-002',
    dateSlotId: 'dateslot-001',
    status: 'MAYBE',
    createdAt: now,
  },
  {
    PK: 'PLAN#plan-001',
    SK: 'AVAILABILITY#dateslot-002#user-001',
    id: 'avail-003',
    userId: 'user-001',
    dateSlotId: 'dateslot-002',
    status: 'AVAILABLE',
    createdAt: yesterday,
  },
  {
    PK: 'PLAN#plan-001',
    SK: 'AVAILABILITY#dateslot-002#user-002',
    id: 'avail-004',
    userId: 'user-002',
    dateSlotId: 'dateslot-002',
    status: 'UNAVAILABLE',
    createdAt: now,
  },
];

// Helper functions for mock data
export const getMockUserByToken = (token: string) => {
  return mockUsers.find((u) => u.guestToken === token);
};

export const getMockUserById = (id: string) => {
  return mockUsers.find((u) => u.id === id);
};

export const getMockPlansByUserId = (userId: string) => {
  return mockPlans.filter((p) => p.hostId === userId);
};

export const getMockPlanById = (planId: string) => {
  return mockPlans.find((p) => p.id === planId);
};

export const getMockActivitiesByPlanId = (planId: string) => {
  return mockActivities.filter((a) => a.planId === planId);
};

export const getMockIdeasByPlanId = (planId: string) => {
  return mockIdeas.filter((i) => i.planId === planId);
};

export const getMockDateSlotsByPlanId = (planId: string) => {
  return mockDateSlots.filter((d) => d.planId === planId);
};

export const getMockAvailabilitiesByPlanId = (planId: string) => {
  return mockAvailabilities.filter((a) => a.dateSlotId);
};

// Create new mock data helpers
export const createMockUser = (name: string) => {
  const userId = uuidv4();
  const token = uuidv4();
  return {
    PK: `USER#${userId}`,
    SK: 'METADATA',
    id: userId,
    name,
    isGuest: true,
    guestToken: token,
    createdAt: now,
    updatedAt: now,
    GSI1PK: `TOKEN#${token}`,
    GSI1SK: 'USER',
  };
};

export const createMockPlan = (name: string, mode: string, hostId: string) => {
  const planId = uuidv4();
  return {
    PK: `PLAN#${planId}`,
    SK: 'METADATA',
    id: planId,
    name,
    mode,
    status: 'DRAFT',
    hostId,
    createdAt: now,
    updatedAt: now,
  };
};

export const createMockActivity = (data: any, userId: string) => {
  const activityId = uuidv4();
  return {
    PK: `PLAN#${data.planId}`,
    SK: `ACTIVITY#${activityId}`,
    id: activityId,
    title: data.title,
    description: data.description,
    address: data.address,
    link: data.link,
    category: data.category,
    planId: data.planId,
    createdBy: userId,
    imageUrl: data.imageUrl,
    votes: 0,
    createdAt: now,
  };
};

export const createMockIdea = (data: any, userId: string) => {
  const ideaId = uuidv4();
  return {
    PK: `PLAN#${data.planId}`,
    SK: `IDEA#${ideaId}`,
    id: ideaId,
    title: data.title,
    description: data.description,
    address: data.address,
    link: data.link,
    category: data.category,
    planId: data.planId,
    createdBy: userId,
    imageUrl: data.imageUrl,
    votes: 0,
    createdAt: now,
  };
};

export const createMockDateSlot = (date: string, planId: string) => {
  const dateSlotId = uuidv4();
  return {
    PK: `PLAN#${planId}`,
    SK: `DATESLOT#${dateSlotId}`,
    id: dateSlotId,
    date,
    planId,
    createdAt: now,
  };
};

export const createMockAvailability = (dateSlotId: string, planId: string, userId: string, status: string) => {
  const availabilityId = uuidv4();
  return {
    PK: `PLAN#${planId}`,
    SK: `AVAILABILITY#${dateSlotId}#${userId}`,
    id: availabilityId,
    userId,
    dateSlotId,
    planId,
    status,
    createdAt: now,
  };
};