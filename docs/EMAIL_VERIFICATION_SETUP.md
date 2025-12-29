# Email Verification Setup

## Current Status

The verification code system is set up but **emails are not being sent automatically**. Codes are currently:
- Stored in database (if `verification_codes` table exists)
- Logged to console in development mode
- Stored in user metadata as fallback

## Quick Fix: Check Console for Codes

**In Development:**
1. Open browser console (F12)
2. Register a new account
3. Look for: `📧 Verification code for your@email.com : 1234`
4. Use that code to verify

## Proper Email Setup (Required for Production)

### Option 1: Supabase Edge Function (Recommended)

1. **Create Edge Function:**
```bash
supabase functions new send-verification-email
```

2. **Function Code** (`supabase/functions/send-verification-email/index.ts`):
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const { email, code } = await req.json();
  
  // Use Resend, SendGrid, or Supabase's email service
  // Example with Resend:
  const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
  
  await resend.emails.send({
    from: "noreply@yourdomain.com",
    to: email,
    subject: "Verify your email - LASU Quiz",
    html: `
      <h1>Verify Your Email</h1>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code expires in 10 minutes.</p>
    `,
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

3. **Update `app/lib/supabase/email.ts`:**
```typescript
export async function sendVerificationEmail(email: string, code: string) {
  // Store in database
  await supabase.from("verification_codes").insert({...});
  
  // Call Edge Function
  const { error } = await supabase.functions.invoke("send-verification-email", {
    body: { email, code },
  });
  
  if (error) throw error;
  return { success: true };
}
```

### Option 2: Create Database Table

Create the `verification_codes` table in Supabase:

```sql
CREATE TABLE verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE
);

-- Add index for faster lookups
CREATE INDEX idx_verification_codes_email ON verification_codes(email);
CREATE INDEX idx_verification_codes_expires ON verification_codes(expires_at);

-- Auto-cleanup expired codes (optional)
CREATE OR REPLACE FUNCTION cleanup_expired_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM verification_codes
  WHERE expires_at < NOW() OR used = TRUE;
END;
$$ LANGUAGE plpgsql;
```

### Option 3: Use Supabase Email Templates

1. Go to Supabase Dashboard > Authentication > Email Templates
2. Create custom template for verification code
3. Use Supabase's `auth.sendEmail()` function

## Testing Without Email

For immediate testing:

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Register a new account
   - Code will be logged: `📧 Verification code for email@example.com : 1234`

2. **Check Database:**
   - Go to Supabase Dashboard > Table Editor
   - Check `verification_codes` table
   - Or check `auth.users` table > user_metadata

## Next Steps

1. ✅ **Immediate**: Use console logs for testing
2. ⚠️ **Required**: Set up email sending (Edge Function or email service)
3. ✅ **Recommended**: Create `verification_codes` table
4. ✅ **Production**: Remove console.log statements

## Email Service Options

- **Resend** (Recommended): Easy setup, good free tier
- **SendGrid**: Popular, reliable
- **Supabase Email**: Built-in but limited
- **AWS SES**: Cost-effective for high volume

