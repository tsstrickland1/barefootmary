import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
}

function getPlanFromPriceId(priceId: string): "descender" | "patron" | "free" {
  if (priceId === process.env.STRIPE_PRICE_DESCENDER) return "descender";
  if (priceId === process.env.STRIPE_PRICE_PATRON) return "patron";
  return "free";
}

function getStatusFromStripe(
  stripeStatus: string
): "active" | "canceled" | "past_due" {
  if (stripeStatus === "active") return "active";
  if (stripeStatus === "canceled") return "canceled";
  return "past_due"; // past_due, unpaid, incomplete, etc.
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

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Only handle subscription checkouts
      if (session.mode !== "subscription") break;

      const supabaseUserId = session.metadata?.supabase_user_id;
      if (!supabaseUserId) break;

      const stripeCustomerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;

      const stripeSubscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (!stripeSubscriptionId || !stripeCustomerId) break;

      // Fetch the full subscription to get price/plan and period end
      const subscription = await stripe.subscriptions.retrieve(
        stripeSubscriptionId
      );
      const priceId = subscription.items.data[0]?.price.id ?? "";
      const plan = getPlanFromPriceId(priceId);
      const currentPeriodEnd = new Date(
        subscription.current_period_end * 1000
      ).toISOString();

      await supabase.from("subscribers").upsert(
        {
          user_id: supabaseUserId,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
          plan,
          status: "active",
          current_period_end: currentPeriodEnd,
        },
        { onConflict: "user_id" }
      );

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;

      const priceId = subscription.items.data[0]?.price.id ?? "";
      const plan = getPlanFromPriceId(priceId);
      const status = getStatusFromStripe(subscription.status);
      const currentPeriodEnd = new Date(
        subscription.current_period_end * 1000
      ).toISOString();

      await supabase
        .from("subscribers")
        .update({ plan, status, current_period_end: currentPeriodEnd })
        .eq("stripe_subscription_id", subscription.id);

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from("subscribers")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", subscription.id);

      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
