# Pastebin Lite
A minimal Pastebin-like application where users can create text pastes and share a link to view them. Pastes can optionally expire based on time-to-live (TTL) or maximum view count.

## Features
- Create a paste with arbitrary text
- Shareable URL to view a paste
- Optional TTL-based expiry
- Optional view-count limit
- Deterministic time support for testing
- Serverless-safe persistence

## Tech Stack
- Next.js (App Router)
- Node.js
- MongoDB Atlas
- Mongoose
- Vercel (deployment)

## API Endpoints
### Health Check
GET /api/healthz
```
{ "ok": true }
```
### Create Paste
POST /api/pastes
```
{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}
```
### Fetch Paste (API)
GET /api/pastes/:id
```
{
  "content": "string",
  "remaining_views": 4,
  "expires_at": "ISO-8601 timestamp or null"
}
```
### View Paste (HTML)
GET /p/:id
Returns an HTML page rendering the paste content safely.

## Persistence Layer
MongoDB Atlas is used as the persistence layer. It ensures data survives across requests and is suitable for serverless deployments.
### Deterministic Testing
If the environment variable TEST_MODE=1 is set, the application uses the request header:
```
x-test-now-ms: <milliseconds since epoch>
```
as the current time for expiry logic.

## Running Locally
1. Install dependencies:
```
npm install
```
2. Create .env.local:
```
MONGODB_URI=<your_mongodb_connection_string>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```
3. Start the dev server:
```
npm run dev
```
Open:
```
http://localhost:3000
```
## Notes
- No secrets are committed to the repository
- No global mutable state is used
- Designed to pass automated evaluation tests