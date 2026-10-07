# AI Forward Deployed Engineer — Landing Page + Payments

Monorepo for the **AI Forward Deployed Engineer** program landing page and its
**₹99 Razorpay** unlock flow. The Razorpay integration mirrors the companion
**Deploy** project's payment flow (create order → checkout → verify signature),
trimmed to a standalone payment (no accounts/login).

```
.
├── frontend/   # Next.js 16 marketing landing page (the existing site)
└── backend/    # Express API for Razorpay create-order / verify (+ mock mode)
```

## How the payment works

1. A visitor clicks **"Unlock FDE for ₹99"** in the offer popup.
2. The frontend calls the backend `POST /api/payments/create-order`.
3. **Razorpay Checkout** opens with that order (the key *secret* never leaves the backend).
4. On payment, the frontend calls `POST /api/payments/verify`; the backend checks
   the Razorpay signature and confirms the unlock.

> **Mock mode:** with no Razorpay keys set, the backend simulates the whole flow
> so it works end-to-end before you add keys. No money moves.

## Run it

Two terminals (or use the Claude Code launch configs `frontend` / `backend`):

```bash
# Terminal 1 — backend (http://localhost:5001)
cd backend
npm install
npm run dev

# Terminal 2 — frontend (http://localhost:3000)
cd frontend
npm install
npm run dev
```

Open <http://localhost:3000>, click an "Unlock"/"Apply" CTA → **Unlock FDE for ₹99**.

## Testing with real Razorpay (test keys)

1. Get **Test Mode** keys from the [Razorpay dashboard](https://dashboard.razorpay.com)
   (Settings → API Keys).
2. Put them in `backend/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
   ```
3. Restart the backend and pay with a test card (e.g. `4111 1111 1111 1111`).

See [`backend/README.md`](backend/README.md) for the full payment/API reference and
[`frontend/README.md`](frontend/README.md) for the Next.js app.

## Price

₹99 lives in two places:

- **Server (source of truth):** `COURSE_PRICE=9900` paise in `backend/.env`.
- **Display:** `program.platformPrice` in `frontend/src/content/program.ts`.
