import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: "free_trial" | "monthly" | "lifetime";
  status: "active" | "cancelled" | "expired" | "trialing";
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .maybeSingle();

  if (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }

  return data;
}

export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription) return false;

  const now = new Date();
  const periodEnd = new Date(subscription.current_period_end);

  return (
    (subscription.status === "active" || subscription.status === "trialing") &&
    periodEnd > now
  );
}

export function getSubscriptionLabel(subscription: Subscription | null): string {
  if (!subscription) return "No Subscription";

  switch (subscription.plan_type) {
    case "free_trial":
      return "Free Trial";
    case "monthly":
      return "Monthly Plan";
    case "lifetime":
      return "Lifetime Access";
    default:
      return "Unknown Plan";
  }
}

export function getRemainingTrialDays(subscription: Subscription | null): number {
  if (!subscription || subscription.plan_type !== "free_trial") return 0;

  const now = new Date();
  const periodEnd = new Date(subscription.current_period_end);
  const diffTime = periodEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}
