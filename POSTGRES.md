# Fix: "cannot connect to Postgres: connect ECONNREFUSED 127.0.0.1:5432"

That error means **PostgreSQL is not running** on your machine. Start it, then try the admin again.

## Option 1: Docker (recommended)

**1. Start Postgres**

From the project root (`gcf-refresh-2026`):

```bash
npm run db:start
```

Or without npm:

```bash
docker compose -f docker-compose.postgres.yml up -d
```

**2. Wait a few seconds** for Postgres to be ready (about 5–10 seconds).

**3. Check the connection**

```bash
npm run check:db
```

You should see "✓ Yes" for the port and "✓ Connected" for the database.

**4. Start the app**

```bash
npm run dev
```

Then open http://localhost:3000/admin.

---

## Option 2: Postgres installed locally

If you use **Homebrew** (macOS):

```bash
brew services start postgresql@16
# or
brew services start postgresql
```

If you use **Postgres.app** (macOS): open the app and start the server.

Then in `.env` set `DATABASE_URI` to your real user, password, and database (use a database name with **underscores**, not hyphens). Run `npm run check:db` to verify.

---

## If you don't have Docker

1. Install Docker: https://docs.docker.com/get-docker/
2. Start Docker Desktop (or the Docker daemon).
3. In the project folder run: `npm run db:start`
4. Wait ~10 seconds, then run: `npm run check:db`
5. Then: `npm run dev`

---

## Stop Postgres (Docker)

When you're done working:

```bash
npm run db:stop
```

Data is kept in a Docker volume. Run `npm run db:start` again next time.
