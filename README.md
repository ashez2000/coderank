# coderank (airtribe capstone project)

Coderank is a simple backend code evaluation platform.
It enables users to create code snippets in various languages and evaluate the code snippet.

# Run locally

> Docker and NodeJS is required

> NOTE: Issues in docker-compose.yml (docker-compose up wont work)

## Run manually

1. Start eval server

```bash
cd eval
npm install
npm start # or npm run dev
```

2. Start postgres in docker or locally

3. Start main server

```bash
cd server
npm install
npm start # or npm run dev
```

## REST API endpoints

### auth

- POST /api/auth/register
- POST /api/auth/login

### code snippets

- GET /api/snippets
- GET /api/snippets/{id}
- GET /api/snippets/{id}/submissions
- POST /api/snippets
- POST /api/snippets/{id}/eval
- PUT /api/snippets/{id}
- DELETE /api/snippets/{id}
