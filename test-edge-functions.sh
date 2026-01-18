#!/bin/bash

# Test Edge Functions Script
echo "🧪 Testing Supabase Edge Functions..."
echo "======================================"
echo ""

SUPABASE_URL="https://smcvwjbdrrswbdfidlgz.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtY3Z3amJkcnJzd2JkZmlkbGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NjMyOTAsImV4cCI6MjA4NDMzOTI5MH0.eKBzchnuVPL1U45jACoy3buNUAeBMRrmYsgyQO6DHWE"

# Test 1: AI Chat
echo "1️⃣  Testing ai-chat function..."
RESPONSE=$(curl -s -X POST "$SUPABASE_URL/functions/v1/ai-chat" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"question":"Zdravím"}')
echo "Response: $RESPONSE"
echo ""

# Test 2: Send Verification Code
echo "2️⃣  Testing send-verification-code function..."
RESPONSE=$(curl -s -X POST "$SUPABASE_URL/functions/v1/send-verification-code" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}')
echo "Response: $RESPONSE"
echo ""

# Test 3: Validate Promo Code (requires auth)
echo "3️⃣  Testing validate-promo-code function..."
RESPONSE=$(curl -s -X POST "$SUPABASE_URL/functions/v1/validate-promo-code" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"code":"TEST","planType":"monthly"}')
echo "Response: $RESPONSE"
echo ""

echo "======================================"
echo "✅ Edge function tests completed!"
echo ""
echo "If you see successful responses above, your edge functions are working!"
