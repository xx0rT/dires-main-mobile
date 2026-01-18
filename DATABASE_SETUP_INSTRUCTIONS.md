# Complete Setup Instructions

Your app isn't working because:
1. **Database tables don't exist** - Need to run the SQL migration
2. **Edge functions aren't deployed** - Need to deploy them to Supabase

Follow these steps in order:

---

## STEP 1: Setup Database Tables

### Run the Database Migration

1. Open your Supabase Dashboard SQL Editor:
   **https://supabase.com/dashboard/project/smcvwjbdrrswbdfidlgz/sql/new**

2. Copy the entire contents of the `database-setup.sql` file

3. Paste it into the SQL Editor

4. Click **"Run"** to execute the migration

This will create all necessary tables:
- `profiles` - User profiles
- `email_verification_codes` - For email verification during signup
- `password_reset_requests` - For password reset flow
- `subscriptions` - User subscription management
- `products`, `orders`, `order_items` - E-commerce tables
- `courses`, `course_lessons`, `course_enrollments`, `user_course_progress` - Course management

### Verify Tables Were Created

1. Go to: **https://supabase.com/dashboard/project/smcvwjbdrrswbdfidlgz/editor**

2. You should see all the tables listed in the left sidebar

---

## STEP 2: Deploy Edge Functions

Your edge functions need to be deployed to Supabase. See **DEPLOY_EDGE_FUNCTIONS.md** for detailed instructions.

**Quick commands:**

```bash
# Install Supabase CLI
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref smcvwjbdrrswbdfidlgz

# Deploy all functions
supabase functions deploy send-verification-code --no-verify-jwt
supabase functions deploy verify-and-create-account --no-verify-jwt
supabase functions deploy create-checkout-session --no-verify-jwt
supabase functions deploy stripe-webhook --no-verify-jwt
supabase functions deploy send-invoice-email --no-verify-jwt

# Set Stripe secret key
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
```

**Get your Stripe key**: https://dashboard.stripe.com/apikeys

---

## STEP 3: Test the Features

### Test Email Verification:

1. Go to your signup page
2. Register with an email and password
3. You'll see a green toast notification with a 6-digit code (also in browser console - press F12)
4. Enter the code on the verification page
5. You should be able to login after verification

### Test Stripe Checkout:

1. Go to your landing page pricing section
2. Click on **"Monthly Plan ($30)"** or **"Lifetime Plan ($200)"**
3. It should open Stripe checkout (without requiring login)
4. **Free Trial** requires you to login first

## How It Works

1. **Stripe Checkout**:
   - Monthly/Lifetime plans: No login required, opens Stripe checkout directly
   - Free Trial: Requires login first

2. **Email Verification**:
   - Codes are displayed in green notification (10 seconds)
   - Also visible in browser console (F12)
   - And in Supabase edge function logs

---

## Troubleshooting

If you still have issues after running the migration:

1. **Check Edge Function Logs**:
   - Go to: https://supabase.com/dashboard/project/smcvwjbdrrswbdfidlgz/functions
   - Click on each function to see if they're being called
   - Check the "Logs" tab for any errors

2. **Check Browser Console** (F12):
   - Look for any error messages
   - The verification code should appear here during signup

3. **Verify Database Tables**:
   - Make sure all tables were created successfully
   - Check that RLS policies are enabled

## Need Help?

If you encounter any errors while running the migration or testing the features, let me know the exact error message you see.
