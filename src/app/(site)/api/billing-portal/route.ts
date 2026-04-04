import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/login", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000")
    );
  }

  const { data: subscriber } = await supabase
    .from("subscribers")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  if (!subscriber?.stripe_customer_id) {
    return NextResponse.redirect(
      new URL("/account", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000")
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });

  const session = await stripe.billingPortal.sessions.create({
    customer: subscriber.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/account`,
  });

  return NextResponse.redirect(session.url);
}
