# API Conventions

Standards for the Fastify backend API.

---

## URL Structure

```
/api/{resource}                    # Collection (GET list, POST create)
/api/{resource}/:id                # Single item (GET, PUT, DELETE)
/api/{resource}/:id/{sub-resource} # Nested collection
/api/{resource}/:id/{action}       # Actions (POST only)
```

**Examples:**

```
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
GET    /api/projects/:id/requirements
POST   /api/projects/:id/requirements
POST   /api/projects/:id/requirements/generate   # AI action
```

---

## Request Validation

All request bodies and query params are validated with Zod schemas **before** reaching the service layer.

```typescript
// Route definition pattern
fastify.post(
  '/projects',
  {
    schema: { body: projectCreateSchema },
  },
  async (request, reply) => {
    const input = request.body; // already validated
    const result = await projectService.create(input, request.userId);
    return reply.status(201).send(result);
  },
);
```

---

## Response Format

**Success (single item):**

```json
{
  "data": { ... }
}
```

**Success (collection):**

```json
{
  "data": [ ... ],
  "pagination": {
    "cursor": "abc123",
    "hasMore": true
  }
}
```

**Error:**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Project not found"
  }
}
```

---

## Error Codes

| HTTP Status | Error Code         | When                        |
| ----------- | ------------------ | --------------------------- |
| 400         | `VALIDATION_ERROR` | Zod validation failed       |
| 401         | `UNAUTHORIZED`     | Missing or invalid auth     |
| 403         | `FORBIDDEN`        | User lacks permission       |
| 404         | `NOT_FOUND`        | Resource doesn't exist      |
| 409         | `CONFLICT`         | Duplicate or state conflict |
| 500         | `INTERNAL_ERROR`   | Unexpected server error     |

---

## Pagination

Cursor-based pagination for all list endpoints:

```
GET /api/projects?cursor=abc123&limit=20
```

- `cursor`: Opaque string (base64-encoded ID), omitted for first page
- `limit`: Items per page (default 20, max 100)

---

## Authentication

- All routes except `/api/health` require authentication
- Auth is handled by the Fastify auth plugin (JWT verification)
- User ID is available as `request.userId` after auth
- Ownership checks happen in the service layer

---

## Naming Rules

- **URL segments**: kebab-case, plural nouns (`/user-journeys`, not `/userJourneys`)
- **Query params**: camelCase (`?sortBy=createdAt`)
- **Request/response fields**: camelCase (matches TypeScript conventions)
- **AI action endpoints**: POST with verb suffix (`/generate`, `/analyze`, `/prioritize`)
