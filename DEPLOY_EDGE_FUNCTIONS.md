# Edge Functions Deployment Instructions

Your edge functions aren't being called because they haven't been deployed to Supabase yet. Follow these steps to deploy them.

## Option 1: Deploy via Supabase CLI (Recommended)

### Step 1: Install Supabase CLI

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows (PowerShell)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or use npm
npm install -g supabase
```

### Step 2: Login to Supabase

```bash
supabase login
```

This will open a browser window. Login with your Supabase account.

### Step 3: Link Your Project

```bash
supabase link --project-ref smcvwjbdrrswbdfidlgz
```

### Step 4: Deploy All Edge Functions

Navigate to your project directory and run:

```bash
# Deploy all functions at once
supabase functions deploy send-verification-code
supabase functions deploy verify-and-create-account
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
supabase functions deploy send-invoice-email
supabase functions deploy send-password-reset-code
supabase functions deploy verify-and-reset-password
supabase functions deploy validate-promo-code
supabase functions deploy ai-chat
```

Or deploy them all with one command:

```bash
for func in send-verification-code verify-and-create-account create-checkout-session stripe-webhook send-invoice-email send-password-reset-code verify-and-reset-password validate-promo-code ai-chat; do
  supabase functions deploy $func --no-verify-jwt
done
```

### Step 5: Set Environment Variables (Secrets)

You'll need to set these secrets for the functions to work:

```bash
# Get your Stripe secret key from: https://dashboard.stripe.com/apikeys
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Optional: Set Resend API key for email sending
# Get from: https://resend.com/api-keys
supabase secrets set RESEND_API_KEY=re_your_resend_api_key
```

**Note**: Without the Resend API key, verification codes will still work but will only be shown in:
- The response to the frontend (visible in browser console)
- Edge function logs

## Option 2: Deploy via Supabase Dashboard

Unfortunately, the Supabase Dashboard doesn't support deploying Edge Functions directly from the UI yet. You must use the Supabase CLI (Option 1).

## Verify Deployment

After deployment, check that your functions are working:

1. Go to: https://supabase.com/dashboard/project/smcvwjbdrrswbdfidlgz/functions

2. You should see all 9 functions listed

3. Click on each function to see its deployment status

4. Try testing:
   - **Sign up**: Go to your app and try creating an account
   - **Checkout**: Click on a pricing plan button
   - Check the "Invocations" tab to see if the functions are being called

## Troubleshooting

### If functions still show 0 invocations:

1. **Check browser console for errors** (F12)
   - Look for CORS errors
   - Look for 404 errors (function not found)
   - Look for 401 errors (authentication issues)

2. **Check Edge Function logs**:
   - Go to each function page
   - Click the "Logs" tab
   - Look for errors

3. **Verify environment variables**:
   ```bash
   supabase secrets list
   ```

4. **Test a function directly**:
   ```bash
   curl -X POST "https://smcvwjbdrrswbdfidlgz.supabase.co/functions/v1/send-verification-code" \
     -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "password": "test123"}'
   ```

### Common Issues:

1. **"Function not found" error**:
   - The function hasn't been deployed yet
   - Run the deployment commands above

2. **"STRIPE_SECRET_KEY is not configured"**:
   - You need to set the Stripe secret key
   - Run: `supabase secrets set STRIPE_SECRET_KEY=sk_test_...`

3. **"Database table doesn't exist"**:
   - Run the database migration first (see DATABASE_SETUP_INSTRUCTIONS.md)

## Quick Start Checklist

- [ ] Install Supabase CLI
- [ ] Login to Supabase (`supabase login`)
- [ ] Link project (`supabase link --project-ref smcvwjbdrrswbdfidlgz`)
- [ ] Run database migration (see DATABASE_SETUP_INSTRUCTIONS.md)
- [ ] Deploy all edge functions (commands above)
- [ ] Set Stripe secret key
- [ ] Test sign up flow
- [ ] Test checkout flow

## Need Help?

If you're still having issues after following these steps, check:

1. Browser console (F12) for frontend errors
2. Supabase Edge Function logs for backend errors
3. Make sure the database migration was run successfully
