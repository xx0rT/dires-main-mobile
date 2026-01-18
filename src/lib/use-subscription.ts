import { useState, useEffect } from 'react';
import { useAuth } from './auth-context';

interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'free_trial' | 'monthly' | 'lifetime';
  status: 'active' | 'cancelled' | 'expired' | 'trialing';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${user.id}&select=*`,
          {
            headers: {
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setSubscription(data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [user]);

  const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trialing';

  return { subscription, loading, hasActiveSubscription };
}
