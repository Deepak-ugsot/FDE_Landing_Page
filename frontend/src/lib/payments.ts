// Razorpay checkout helpers for the ₹99 unlock. The backend owns the key secret
// and does order creation + signature verification. create-order / verify require
// a logged-in user (bearer token handled by lib/api.ts).

import { api } from "@/lib/api";

const RAZORPAY_SRC = "https://checkout.razorpay.com/v1/checkout.js";

export type PaymentConfig = {
  amount: number; // paise
  currency: string;
  mock: boolean;
  keyId: string | null;
  lmsUrl: string | null;
};

export type CreateOrderResponse = {
  mock: boolean;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string | null;
  name?: string;
  email?: string;
  phone?: string;
};

export type VerifyResponse = {
  message: string;
  user?: { hasPaid: boolean; paidAt?: string | null };
  lmsUrl: string | null;
};

type RazorpaySuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (r: unknown) => void) => void };
  }
}

export const getPaymentConfig = () => api.get<PaymentConfig>("/payments/config", { auth: false });

export const createOrder = () => api.post<CreateOrderResponse>("/payments/create-order");

export const verifyPayment = (payload: Partial<RazorpaySuccess> & { mock?: boolean }) =>
  api.post<VerifyResponse>("/payments/verify", payload);

/** Inject the Razorpay checkout script once; resolves false if it fails to load. */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = RAZORPAY_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export type CheckoutHandlers = {
  onSuccess: (result: VerifyResponse) => void;
  onError: (message: string) => void;
  onDismiss?: () => void;
  /** Fires once the real Razorpay widget is on screen (so a loading overlay can hide). */
  onOpen?: () => void;
};

/**
 * Runs the full checkout: create an order, then either complete the mock flow or
 * open the real Razorpay widget and verify the signature on success.
 */
export async function startCheckout({ onSuccess, onError, onDismiss, onOpen }: CheckoutHandlers) {
  try {
    const order = await createOrder();

    // ---- Mock mode: verify immediately (no real widget) ----
    if (order.mock) {
      const result = await verifyPayment({ razorpay_order_id: order.orderId, mock: true });
      onSuccess(result);
      return;
    }

    // ---- Real Razorpay checkout ----
    const ok = await loadRazorpayScript();
    if (!ok) throw new Error("Could not load the payment gateway. Check your connection.");
    if (!window.Razorpay) throw new Error("Payment gateway unavailable. Please try again.");

    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "AI Forward Deployed Engineer",
      description: "Full FDE platform access",
      order_id: order.orderId,
      prefill: { name: order.name, email: order.email, contact: order.phone },
      theme: { color: "#e6161f" },
      handler: async (resp: unknown) => {
        const r = resp as RazorpaySuccess;
        try {
          const result = await verifyPayment({
            razorpay_order_id: r.razorpay_order_id,
            razorpay_payment_id: r.razorpay_payment_id,
            razorpay_signature: r.razorpay_signature,
          });
          onSuccess(result);
        } catch (err) {
          onError(err instanceof Error ? err.message : "Payment verification failed");
        }
      },
      modal: {
        ondismiss: () => onDismiss?.(),
      },
    });

    rzp.on("payment.failed", (r: unknown) => {
      const desc = (r as { error?: { description?: string } })?.error?.description;
      onError(desc || "Payment failed. Please try again.");
    });

    rzp.open();
    onOpen?.();
  } catch (err) {
    onError(err instanceof Error ? err.message : "Something went wrong starting the payment");
  }
}
