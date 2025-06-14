import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { stripe } from "../_shared/stripe.ts";
import {
  STRIPE_PRICE_IDS,
  SUBSCRIPTION_CONSTANTS,
} from "../_shared/constants.ts";

// Define response headers with CORS support
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle OPTIONS request for CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  try {
    // Get request body
    const { user_id, email } = await req.json();

    // Validate required parameters
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: user_id" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Check if user already has an active subscription
    const { data: existingSubscription, error: subscriptionError } =
      await supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq("user_id", user_id)
        .eq("status", "active")
        .maybeSingle();

    if (subscriptionError) {
      console.error("Error checking existing subscription:", subscriptionError);
      return new Response(
        JSON.stringify({ error: "Failed to check existing subscription" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    if (existingSubscription) {
      return new Response(
        JSON.stringify({
          message: "User already has an active subscription",
          subscription: existingSubscription,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    // Calculate trial end date (7 days from now)
    const trialEndDate = new Date();
    trialEndDate.setDate(
      trialEndDate.getDate() + SUBSCRIPTION_CONSTANTS.FREEMIUM_TRIAL_DAYS,
    );

    // Create a customer in Stripe
    const customer = await stripe.customers.create({
      email,
      metadata: {
        user_id,
      },
    });

    // Create a subscription with trial period
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: STRIPE_PRICE_IDS.FREEMIUM_owner }],
      trial_end: Math.floor(trialEndDate.getTime() / 1000), // Convert to Unix timestamp
      metadata: {
        user_id,
      },
    });

    // Store subscription in database
    const { data: subscriptionData, error: createError } = await supabaseAdmin
      .from("subscriptions")
      .insert({
        user_id,
        stripe_customer_id: customer.id,
        stripe_subscription_id: subscription.id,
        price_id: STRIPE_PRICE_IDS.FREEMIUM_owner,
        status: subscription.status,
        current_period_start: new Date(
          subscription.current_period_start * 1000,
        ).toISOString(),
        current_period_end: new Date(
          subscription.current_period_end * 1000,
        ).toISOString(),
        trial_start: subscription.trial_start
          ? new Date(subscription.trial_start * 1000).toISOString()
          : null,
        trial_end: subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating subscription record:", createError);
      return new Response(
        JSON.stringify({ error: "Failed to create subscription record" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Create trial period record
    const { data: trialPeriod, error: trialError } = await supabaseAdmin
      .from("trial_periods")
      .insert({
        user_id,
        subscription_id: subscription.id,
        start_date: new Date().toISOString(),
        end_date: trialEndDate.toISOString(),
        status: "active",
      })
      .select()
      .single();

    if (trialError) {
      console.error("Error creating trial period record:", trialError);
      // Continue even if trial period record creation fails
    }

    return new Response(
      JSON.stringify({
        message: "Freemium subscription created successfully",
        subscription: subscriptionData,
        trial_period: trialPeriod || null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error creating freemium subscription:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
