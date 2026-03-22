# API Specification - Wat Doen We?

This document defines the REST API endpoints needed for the "Wat Doen We?" application. The frontend is built with Angular and currently uses localStorage for data persistence. This spec defines the backend API contract to migrate to a proper server-side backend.

---

## Base URL

```
https://api.watdoenwe.nl/v1
```

---

## Authentication

The app supports guest users (no email/password required). Users create a session with just their name.

### Authentication Header

All authenticated requests must include:

```http
Authorization: Bearer <guest_token>
```

---

## Data Models

### User

```typescript
interface User {
  id: string;           // UUID
  name: string;         // Display name
  email?: string;       // Optional email
  isGuest: boolean;     // Always true for now
  guestToken?: string;  // Auth token
  createdAt: Date;
  updatedAt: Date;
}
```

### Plan

```typescript
type PlanMode = 'FIXED_DATE' | 'FIXED_ACTIVITY' | 'FLEXIBLE';
type PlanStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

interface Plan {
  id: string;
  name: string;
  mode: PlanMode;
  status: PlanStatus;
  hostId: string;              // User who created the plan
  date?: Date;                 // For FIXED_DATE mode
  activityName?: string;       // For FIXED_ACTIVITY mode
  activityLocation?: string;   // For FIXED_ACTIVITY mode
  createdAt: Date;
  updatedAt: Date;
}
```

### PlanParticipant

```typescript
interface PlanParticipant {
  id: string;
  planId: string;
  userId: string;
  role: 'HOST' | 'PARTICIPANT' | 'GUEST';
  joinedAt: Date;
}
```

### Activity

```typescript
type ActivityCategory = 'ETEN' | 'CULTUUR' | 'SPORT' | 'OVERIG';

interface Activity {
  id: string;
  title: string;
  description?: string;
  address?: string;
  link?: string;
  category: ActivityCategory;
  planId: string;
  createdBy: string;     // User ID
  imageUrl?: string;
  votes: number;
  hasVoted: boolean;     // Computed field for current user
  createdAt: Date;
}
```

### Idea

```typescript
type IdeaCategory = 'ETEN' | 'CULTUUR' | 'SPORT' | 'OVERIG';

interface Idea {
  id: string;
  title: string;
  description?: string;
  address?: string;
  link?: string;
  category: IdeaCategory;
  planId: string;
  createdBy: string;     // User ID
  createdByUser?: {      // Populated on response
    id: string;
    name: string;
  };
  imageUrl?: string;
  votes: number;
  hasVoted: boolean;     // Computed field for current user
  createdAt: Date;
}
```

### DateSlot & Availability

```typescript
type AvailabilityStatus = 'AVAILABLE' | 'MAYBE' | 'UNAVAILABLE';

interface DateSlot {
  id: string;
  date: Date;        // ISO 8601 date string
  planId: string;
  createdAt: Date;
}

interface Availability {
  id: string;
  userId: string;
  dateSlotId: string;
  status: AvailabilityStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

### Vote

```typescript
interface Vote {
  id: string;
  userId: string;
  activityId?: string;   // One of these must be set
  ideaId?: string;
  createdAt: Date;
}
```

---

## Endpoints

### 1. Authentication

#### POST `/auth/guest`

Create a new guest session.

**Request Body:**

```json
{
  "name": "John Doe"
}
```

**Response (201):**

```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "isGuest": true,
    "createdAt": "2026-03-22T19:00:00Z",
    "updatedAt": "2026-03-22T19:00:00Z"
  },
  "token": "guest_token_here"
}
```

---

#### POST `/auth/verify`

Verify a guest token and return the associated user.

**Request Body:**

```json
{
  "token": "guest_token_here"
}
```

**Response (200):**

```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "isGuest": true,
    "createdAt": "2026-03-22T19:00:00Z",
    "updatedAt": "2026-03-22T19:00:00Z"
  }
}
```

**Response (401):**

```json
{
  "error": "Invalid or expired token"
}
```

---

#### PATCH `/auth/user`

Update current user's name.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "New Name"
}
```

**Response (200):**

```json
{
  "id": "uuid",
  "name": "New Name",
  "isGuest": true,
  "createdAt": "2026-03-22T19:00:00Z",
  "updatedAt": "2026-03-22T19:30:00Z"
}
```

---

### 2. Plans

#### GET `/plans`

Get all plans for the authenticated user (as host or participant).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "plans": [
    {
      "id": "uuid",
      "name": "Weekend Weg",
      "mode": "FLEXIBLE",
      "status": "ACTIVE",
      "hostId": "uuid",
      "createdAt": "2026-03-22T19:00:00Z",
      "updatedAt": "2026-03-22T19:00:00Z"
    }
  ]
}
```

---

#### GET `/plans/:id`

Get a specific plan with all related data.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "plan": {
    "id": "uuid",
    "name": "Weekend Weg",
    "mode": "FLEXIBLE",
    "status": "ACTIVE",
    "hostId": "uuid",
    "date": null,
    "activityName": null,
    "activityLocation": null,
    "createdAt": "2026-03-22T19:00:00Z",
    "updatedAt": "2026-03-22T19:00:00Z"
  },
  "participants": [
    {
      "id": "uuid",
      "userId": "uuid",
      "role": "HOST",
      "joinedAt": "2026-03-22T19:00:00Z",
      "user": {
        "id": "uuid",
        "name": "John Doe"
      }
    }
  ]
}
```

---

#### POST `/plans`

Create a new plan.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "Weekend Weg",
  "mode": "FLEXIBLE"  // or "FIXED_DATE" or "FIXED_ACTIVITY"
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "name": "Weekend Weg",
  "mode": "FLEXIBLE",
  "status": "DRAFT",
  "hostId": "uuid",
  "createdAt": "2026-03-22T19:00:00Z",
  "updatedAt": "2026-03-22T19:00:00Z"
}
```

---

#### PATCH `/plans/:id`

Update a plan.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (all fields optional)

```json
{
  "name": "Updated Name",
  "status": "ACTIVE",
  "date": "2026-04-15",
  "activityName": "Bowlen",
  "activityLocation": "Amsterdam"
}
```

**Response (200):**

```json
{
  "id": "uuid",
  "name": "Updated Name",
  "mode": "FLEXIBLE",
  "status": "ACTIVE",
  "hostId": "uuid",
  "date": "2026-04-15T00:00:00Z",
  "createdAt": "2026-03-22T19:00:00Z",
  "updatedAt": "2026-03-22T19:30:00Z"
}
```

---

#### DELETE `/plans/:id`

Delete a plan (host only).

**Headers:** `Authorization: Bearer <token>`

**Response (204):** No content

---

### 3. Plan Participants

#### POST `/plans/:id/join`

Join a plan as a participant.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "participant": {
    "id": "uuid",
    "planId": "uuid",
    "userId": "uuid",
    "role": "PARTICIPANT",
    "joinedAt": "2026-03-22T19:00:00Z"
  }
}
```

---

#### GET `/plans/:id/participants`

Get all participants of a plan.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "participants": [
    {
      "id": "uuid",
      "userId": "uuid",
      "role": "HOST",
      "joinedAt": "2026-03-22T19:00:00Z",
      "user": {
        "id": "uuid",
        "name": "John Doe"
      }
    }
  ]
}
```

---

### 4. Activities

#### GET `/plans/:id/activities`

Get all activities for a plan.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "activities": [
    {
      "id": "uuid",
      "title": "Pizza eten",
      "description": "Lekker bij Mario",
      "address": "Pizza Street 123",
      "link": "https://mario-pizza.nl",
      "category": "ETEN",
      "planId": "uuid",
      "createdBy": "uuid",
      "imageUrl": "https://example.com/image.jpg",
      "votes": 5,
      "hasVoted": true,
      "createdAt": "2026-03-22T19:00:00Z"
    }
  ]
}
```

---

#### POST `/plans/:id/activities`

Create a new activity for a plan.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "title": "Pizza eten",
  "description": "Lekker bij Mario",
  "address": "Pizza Street 123",
  "link": "https://mario-pizza.nl",
  "category": "ETEN",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "title": "Pizza eten",
  "description": "Lekker bij Mario",
  "address": "Pizza Street 123",
  "link": "https://mario-pizza.nl",
  "category": "ETEN",
  "planId": "uuid",
  "createdBy": "uuid",
  "imageUrl": "https://example.com/image.jpg",
  "votes": 0,
  "hasVoted": false,
  "createdAt": "2026-03-22T19:00:00Z"
}
```

---

#### PATCH `/activities/:id`

Update an activity.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (all fields optional)

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "CULTUUR"
}
```

**Response (200):**

```json
{
  "id": "uuid",
  "title": "Updated Title",
  "description": "Updated description",
  "category": "CULTUUR",
  "planId": "uuid",
  "createdBy": "uuid",
  "votes": 0,
  "hasVoted": false,
  "createdAt": "2026-03-22T19:00:00Z"
}
```

---

#### DELETE `/activities/:id`

Delete an activity.

**Headers:** `Authorization: Bearer <token>`

**Response (204):** No content

---

### 5. Ideas (Ideeënmuur)

#### GET `/plans/:id/ideas`

Get all ideas for a plan.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "ideas": [
    {
      "id": "uuid",
      "title": "Naar de film",
      "description": "Nieuwe Marvel film",
      "address": "Cinema City",
      "link": "https://cinema.nl",
      "category": "CULTUUR",
      "planId": "uuid",
      "createdBy": "uuid",
      "createdByUser": {
        "id": "uuid",
        "name": "Jane Doe"
      },
      "imageUrl": "https://example.com/movie.jpg",
      "votes": 3,
      "hasVoted": false,
      "createdAt": "2026-03-22T19:00:00Z"
    }
  ]
}
```

---

#### POST `/plans/:id/ideas`

Create a new idea for a plan.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "title": "Naar de film",
  "description": "Nieuwe Marvel film",
  "address": "Cinema City",
  "link": "https://cinema.nl",
  "category": "CULTUUR",
  "imageUrl": "https://example.com/movie.jpg"
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "title": "Naar de film",
  "description": "Nieuwe Marvel film",
  "address": "Cinema City",
  "link": "https://cinema.nl",
  "category": "CULTUUR",
  "planId": "uuid",
  "createdBy": "uuid",
  "votes": 0,
  "hasVoted": false,
  "createdAt": "2026-03-22T19:00:00Z"
}
```

---

#### PATCH `/ideas/:id`

Update an idea.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (all fields optional)

```json
{
  "title": "Updated Title",
  "category": "SPORT"
}
```

**Response (200):** Updated idea object

---

#### DELETE `/ideas/:id`

Delete an idea.

**Headers:** `Authorization: Bearer <token>`

**Response (204):** No content

---

#### GET `/plans/:id/ideas/winning`

Get the winning idea (most votes) for a plan.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "idea": {
    "id": "uuid",
    "title": "Naar de film",
    "votes": 10,
    ...
  }
}
```

**Response (404):** If no ideas exist

```json
{
  "idea": null
}
```

---

### 6. Votes

#### POST `/activities/:id/vote`

Vote for an activity.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "activity": {
    "id": "uuid",
    "votes": 6,
    "hasVoted": true,
    ...
  }
}
```

---

#### DELETE `/activities/:id/vote`

Remove vote from an activity.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "activity": {
    "id": "uuid",
    "votes": 5,
    "hasVoted": false,
    ...
  }
}
```

---

#### POST `/ideas/:id/vote`

Vote for an idea.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "idea": {
    "id": "uuid",
    "votes": 4,
    "hasVoted": true,
    ...
  }
}
```

---

#### DELETE `/ideas/:id/vote`

Remove vote from an idea.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "idea": {
    "id": "uuid",
    "votes": 3,
    "hasVoted": false,
    ...
  }
}
```

---

### 7. Calendar & Availability

#### GET `/plans/:id/dates`

Get all date slots for a plan.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "dateSlots": [
    {
      "id": "uuid",
      "date": "2026-04-15T00:00:00Z",
      "planId": "uuid",
      "createdAt": "2026-03-22T19:00:00Z"
    }
  ]
}
```

---

#### POST `/plans/:id/dates`

Create a new date slot for a plan.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "date": "2026-04-15"
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "date": "2026-04-15T00:00:00Z",
  "planId": "uuid",
  "createdAt": "2026-03-22T19:00:00Z"
}
```

---

#### GET `/plans/:id/availability`

Get all availability entries for a plan.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "availabilities": [
    {
      "id": "uuid",
      "userId": "uuid",
      "dateSlotId": "uuid",
      "status": "AVAILABLE",
      "createdAt": "2026-03-22T19:00:00Z",
      "updatedAt": "2026-03-22T19:00:00Z"
    }
  ]
}
```

---

#### POST `/dates/:id/availability`

Mark availability for a date slot.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "status": "AVAILABLE"  // or "MAYBE" or "UNAVAILABLE"
}
```

**Response (200):**

```json
{
  "availability": {
    "id": "uuid",
    "userId": "uuid",
    "dateSlotId": "uuid",
    "status": "AVAILABLE",
    "createdAt": "2026-03-22T19:00:00Z",
    "updatedAt": "2026-03-22T19:30:00Z"
  }
}
```

---

#### GET `/plans/:id/calendar`

Get calendar data with participant availability for a specific month.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `year` (number): Year (e.g., 2026)
- `month` (number): Month (0-11, e.g., 3 for April)

**Response (200):**

```json
{
  "calendar": {
    "year": 2026,
    "month": 3,
    "days": [
      {
        "date": "2026-04-01T00:00:00Z",
        "dayNumber": 1,
        "isCurrentMonth": true,
        "isToday": false,
        "isWeekend": false,
        "participants": [
          {
            "userId": "uuid",
            "userName": "John",
            "userColor": "rgba(70, 71, 211, 0.3)",
            "status": "AVAILABLE"
          }
        ],
        "availabilityCount": 1,
        "isPerfectMatch": false
      }
    ]
  }
}
```

---

#### GET `/plans/:id/matches`

Get dates with best availability matches.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "matches": [
    {
      "date": "2026-04-15T00:00:00Z",
      "participantCount": 5,
      "totalParticipants": 5,
      "isPerfectMatch": true,
      "participants": [
        {
          "userId": "uuid",
          "userName": "John",
          "userColor": "rgba(70, 71, 211, 0.3)",
          "status": "AVAILABLE"
        }
      ]
    }
  ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}  // Optional additional details
  }
}
```

### Common Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | `BAD_REQUEST` | Invalid request body or parameters |
| 401 | `UNAUTHORIZED` | Missing or invalid authentication |
| 403 | `FORBIDDEN` | Not allowed to perform this action |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource already exists or conflict |
| 422 | `VALIDATION_ERROR` | Validation failed |
| 500 | `INTERNAL_ERROR` | Server error |

---

## WebSocket Events (Future)

For real-time updates, consider implementing WebSocket events:

- `plan:updated` - When plan details change
- `participant:joined` - When someone joins a plan
- `activity:created` - When a new activity is added
- `idea:created` - When a new idea is added
- `vote:changed` - When votes change
- `availability:changed` - When availability is updated

---

## Database Schema Suggestion

### Tables

1. **users** - User accounts
2. **plans** - Plan definitions
3. **plan_participants** - Many-to-many relationship
4. **activities** - Activities for plans
5. **ideas** - Ideas for plans (ideeënmuur)
6. **votes** - Votes for activities/ideas
7. **date_slots** - Available dates for plans
8. **availabilities** - User availability for date slots

---

## Tech Stack Suggestions

Based on the simplicity of this app:

- **Node.js + Express** - API server
- **PostgreSQL** - Database (good JSON support for flexibility)
- **Redis** - Session storage and caching
- **Socket.io** - WebSocket for real-time (optional)
- **JWT** - Token-based authentication

---

## Notes for Frontend Integration

1. Replace `localStorage` with HTTP client calls
2. Add interceptors for the `Authorization` header
3. Handle token expiration (401 responses)
4. Add loading states for API calls
5. Consider optimistic updates for better UX
6. Implement retry logic for failed requests
