# Quick Fix: Email Verification Not Sending

## Immediate Solution

**The verification codes are being generated but not sent via email yet.** Here's how to get codes right now:

### Method 1: Check Browser Console (Development)

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Register a new account
4. Look for a message like: `📧 Verification code for your@email.com : 1234`
5. Use that 4-digit code on the verification page

### Method 2: Check Supabase Database

1. Go to your Supabase Dashboard
2. Navigate to **Table Editor** > **auth.users**
3. Find your user by email
4. Check the `raw_user_meta_data` column
5. Look for `verification_code` field

## Set Up Proper Email Sending

### Step 1: Create Database Table

Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires ON verification_codes(expires_at);
```

### Step 2: Set Up Email Service

**Option A: Use Resend (Easiest)**

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Create Supabase Edge Function (see `docs/EMAIL_VERIFICATION_SETUP.md`)

**Option B: Use Supabase Email (Built-in)**

1. Go to Supabase Dashboard > Settings > Auth
2. Configure SMTP settings
3. Update the email sending function

### Step 3: Update Code

The code is already set up to use the `verification_codes` table. Once you:
1. Create the table (Step 1)
2. Set up email sending (Step 2)

The emails will start sending automatically!

## Current Status

✅ Code generation: Working
✅ Code storage: Working (in user metadata, will use DB table when created)
❌ Email sending: Not implemented yet (codes logged to console)

## For Testing Right Now

**Just check the browser console** - the code is logged there for development!

