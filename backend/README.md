# FDE Landing — Payment Backend

A small Express API that powers the **"Unlock FDE for ₹99"** Razorpay checkout on
the landing page. Modeled on the companion **Deploy** project's payment flow, but
trimmed down: no auth, no database — orders are kept in memory so you can test the
whole flow with zero setup.

## Flow

1. `POST /api/payments/create-order` → creates a Razorpay order (server-side, using
   the key **secret**) and returns the `orderId` + `keyId`.
2. The frontend opens **Razorpay Checkout** with that order.
3. `POST /api/payments/verify` → verifies the `razorpay_signature`
   (HMAC-SHA256 of `order_id|payment_id` with the key secret) and marks the order paid.

### Mock mode
If `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` are **blank**, the server runs in
**mock mode**: it returns a fake order and marks it paid on verify — so the ₹99
flow can be demoed without a Razorpay account. No money moves.

## Run

```bash
cd backend
cp .env.example .env     # already created for you; edit to add keys
npm install
npm run dev              # http://localhost:5001
```

## Testing with Razorpay TEST keys

1. Create an account at <https://dashboard.razorpay.com>.
2. Switch to **Test Mode** and go to **Settings → API Keys → Generate Test Key**.
3. Put the pair into `backend/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Restart the backend. The checkout will now open the real Razorpay widget.
5. Pay with a Razorpay **test card**, e.g. `4111 1111 1111 1111`, any future
   expiry, any CVV, and any OTP on the test page.

> The frontend reads the key id from the server's `create-order` response, so you
> only configure the keys in **one** place (`backend/.env`).

## Environment variables

| Variable              | Description                                                      |
|-----------------------|------------------------------------------------------------------|
| `PORT`                | API port (default **5001**).                                     |
| `NODE_ENV`            | `development` / `production`.                                     |
| `CLIENT_URL`          | Allowed frontend origin(s) for CORS, comma-separated.            |
| `COURSE_PRICE`        | Price in **paise** (`9900` = ₹99).                              |
| `CURRENCY`            | `INR`.                                                            |
| `RAZORPAY_KEY_ID`     | Razorpay key id. **Blank = mock mode.**                         |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret. **Blank = mock mode.**                     |
| `LMS_URL`             | Optional redirect after a successful payment.                    |

## API

Base URL: `http://localhost:5001/api`

| Method | Endpoint                 | Description                          |
|--------|--------------------------|--------------------------------------|
| GET    | `/health`                | Health check                         |
| GET    | `/payments/config`       | Price, currency, mock flag, key id   |
| POST   | `/payments/create-order` | Create a (real/mock) order           |
| POST   | `/payments/verify`       | Verify a payment                     |
| GET    | `/payments/history`      | In-memory list of orders (debug)     |

## Production notes

- Set real `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`, `NODE_ENV=production`, and
  `CLIENT_URL` to your deployed frontend origin.
- Swap the in-memory store (`src/store.js`) for a real database if you need to
  persist orders (see the Deploy project's `Payment` Mongoose model).
- Consider adding a Razorpay **webhook** for server-authoritative payment status.
