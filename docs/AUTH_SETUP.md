# Authentication Setup Guide

## Overview

The application now has complete authentication with:
- Email/Password authentication
- OAuth (Google & Apple)
- Email verification with 4-digit code
- Proper role management (all users are students by default)

## Authentication Flow

### Email/Password Registration

1. User fills registration form (name, email, password)
2. Account is created in Supabase Auth
3. 4-digit verification code is generated and stored
4. User is redirected to `/verify-email` page
5. User enters 4-digit code
6. Email is verified and user profile is created
7. User is redirected to login

### OAuth (Google/Apple)

1. User clicks Google or Apple button
2. Redirected to OAuth provider
3. After authentication, redirected to `/auth/callback`
4. User profile is automatically created (OAuth users are pre-verified)
5. User is redirected to appropriate dashboard

### Email/Password Login

1. User enters email and password
2. Supabase authenticates
3. User is redirected to dashboard based on role

## Routes

- `/login` - Login page with OAuth buttons
- `/register` - Registration page with OAuth buttons
- `/verify-email` - Email verification with 4-digit code
- `/auth/callback` - OAuth callback handler

## Supabase Configuration Required

### 1. Enable OAuth Providers

In Supabase Dashboard:
1. Go to Authentication > Providers
2. Enable Google OAuth
   - Add Google Client ID and Secret
   - Set redirect URL: `https://yourdomain.com/auth/callback`
3. Enable Apple OAuth
   - Add Apple Client ID and Secret
   - Set redirect URL: `https://yourdomain.com/auth/callback`

### 2. Email Verification

The app uses custom 4-digit code verification. You need to:

**Option A: Use Supabase Edge Function (Recommended)**
- Create an Edge Function to send verification codes via email
- Update `signUp` function to call the Edge Function

**Option B: Use Email Service**
- Integrate with SendGrid, Resend, or similar
- Update `signUp` function to send emails

**Current Implementation:**
- Verification codes are logged to console in development
- Codes are stored in user metadata (temporary)
- In production, implement proper email sending

### 3. Database Schema

Ensure you have the `user_profiles` table:

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security Notes

1. **Role Assignment**: All new registrations are automatically "student"
   - Admin roles must be assigned manually in database
   - No user can self-register as admin

2. **Email Verification**: Required for email/password users
   - OAuth users are automatically verified
   - Verification codes expire after 10 minutes

3. **OAuth Redirect**: Must match Supabase configuration
   - Update redirect URLs in Supabase dashboard
   - Use environment variable for origin in production

## Implementation Details

### Verification Code Storage

Currently, verification codes are stored in user metadata:
- `verification_code`: 4-digit code
- `verification_code_expires`: Expiration timestamp

**Production Recommendation:**
- Store codes in a separate `verification_codes` table
- Use Supabase Edge Function to send emails
- Implement rate limiting

### OAuth Profile Creation

OAuth users automatically get profiles created because:
- OAuth providers verify emails
- No additional verification needed
- Profile is created in `/auth/callback` route

## Testing

### Development
- Verification codes are logged to console
- Check browser console for codes during registration

### Production
- Implement proper email sending
- Remove console.log statements
- Use environment variables for redirect URLs

## Next Steps

1. **Set up OAuth in Supabase Dashboard**
   - Configure Google OAuth
   - Configure Apple OAuth
   - Add redirect URLs

2. **Implement Email Sending**
   - Create Supabase Edge Function
   - Or integrate email service
   - Update `signUp` function

3. **Production Hardening**
   - Move verification codes to database table
   - Add rate limiting
   - Implement proper error handling
   - Add logging/monitoring

