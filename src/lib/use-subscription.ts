import { useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { supabase } from './supabase';

interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

export function useSubscription() {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      if (!user || !session) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching subscription:', error);
        } else if (data) {
          setSubscription(data);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [user, session]);

  const hasActiveSubscription =
    (subscription?.status === 'active' || subscription?.status === 'trialing') &&
    subscription?.plan !== 'free' &&
    subscription?.stripe_subscription_id != null;

  return { subscription, loading, hasActiveSubscription };
}
