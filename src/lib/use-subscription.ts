import { useState, useEffect, useCallback } from 'react';
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

  const fetchSubscription = useCallback(async () => {
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
  }, [user, session]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('subscription_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Subscription updated:', payload);
          fetchSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchSubscription]);

  const hasActiveSubscription =
    (subscription?.status === 'active' || subscription?.status === 'trialing') &&
    subscription?.plan !== 'free' &&
    subscription?.stripe_subscription_id != null;

  return { subscription, loading, hasActiveSubscription, refetch: fetchSubscription };
}
