# Deployment

Two pieces: the **frontend** (Next.js) on **Vercel**, and the **backend** (Express + MongoDB) on **Render**. They talk over HTTPS, so the frontend must know the backend's URL and the backend must allow the frontend's origin (CORS).

```
Browser ──> Vercel (frontend)  ──fetch──>  Render (backend /api)  ──>  MongoDB Atlas
```

---

## 1. Database — MongoDB Atlas (dedicated DB for this project)

You can reuse an existing Atlas **cluster**. The backend **forces its database name to `FDE`** (via `DB_NAME`, default `FDE`) regardless of what the connection string points at, so the app only ever reads/writes the `FDE` database — nothing else on the cluster is touched. Mongo creates `FDE` on the first write.

So you can use the cluster's connection string **as-is** (no need to edit the db path):
```
mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?retryWrites=true&w=majority
```

**Two things to check on a shared/company cluster:**
- **Network Access** must allow the backend host. Render's free tier has no static outbound IP, so you'll typically need to allow `0.0.0.0/0` (anywhere). If company policy forbids that, use a separate cluster or a Render plan with a static IP.
- The **database user** must be allowed to write the new `FDE` database. Safest is a dedicated user with `readWrite` scoped to **only** `FDE` (Atlas → Database Access → Specific Privileges) — then the credentials themselves can't reach any other database.

---

## 2. Backend — Render

Easiest via the included `render.yaml` blueprint:

1. render.com → **New → Blueprint** → select this repo. Render reads `render.yaml` and creates the `fde-landing-backend` web service (root dir `backend`, build `npm install`, start `npm start`).
2. When prompted, fill the secret env vars:
   - `MONGO_URI` = your Atlas string from step 1 (with `/FDE`)
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` = your Razorpay test keys
   - `CLIENT_URL` = your Vercel URL, e.g. `https://fde-landing.vercel.app`
   - `LMS_URL` = optional
   - (`JWT_SECRET` is auto-generated; `NODE_ENV`, `USE_MEMORY_DB=false`, `COURSE_PRICE`, `CURRENCY` come from the blueprint.)
3. Deploy. You get a URL like `https://fde-landing-backend.onrender.com`.
4. Verify: open `https://fde-landing-backend.onrender.com/api/health` → should return `{"status":"ok",...}`.

> Manual alternative (no blueprint): New → Web Service → this repo → Root Directory `backend`, Build `npm install`, Start `npm start`, then add all the env vars above by hand.

**Free-tier note:** the service sleeps after ~15 min idle; the first request after a nap takes ~30–60s to wake.

---

## 3. Frontend — Vercel

1. Project **Settings → Build and Deployment → Root Directory = `frontend`** (already done).
2. **Settings → Environment Variables** → add:
   ```
   NEXT_PUBLIC_API_URL = https://fde-landing-backend.onrender.com/api
   ```
3. **Redeploy** (env vars apply on the next build).

---

## Checklist

- [ ] Atlas: db name `FDE` in the URI, Network Access allows Render, user can write
- [ ] Render: service live, `/api/health` returns ok, all env vars set
- [ ] Vercel: `NEXT_PUBLIC_API_URL` → Render `/api`, redeployed
- [ ] `CLIENT_URL` on Render matches the Vercel domain exactly (CORS)

If signup on the live site still says "Can't reach the server", open the browser devtools **Network** tab — the failing request's URL tells you whether the frontend is still pointing at `localhost` (env var not applied) or the backend is returning a CORS/500 error.
