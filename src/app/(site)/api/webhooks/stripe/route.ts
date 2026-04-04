import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      // TODO: Create/update subscriber record in Supabase
      // const session = event.data.object as Stripe.Checkout.Session;
      break;
    }
    case "customer.subscription.updated": {
      // TODO: Update subscriber plan/status in Supabase
      // const subscription = event.data.object as Stripe.Subscription;
      break;
    }
    case "customer.subscription.deleted": {
      // TODO: Mark subscriber as canceled in Supabase
      // const subscription = event.data.object as Stripe.Subscription;
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
