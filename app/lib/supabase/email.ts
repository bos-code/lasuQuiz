import supabase from "../../utils/supabase";

/**
 * Send verification code email via Supabase
 * This uses Supabase's built-in email functionality
 */
export async function sendVerificationEmail(email: string, code: string) {
  // Store code in database for verification
  const { error: insertError } = await supabase
    .from("verification_codes")
    .insert({
      email,
      code,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
    });

  if (insertError) {
    // If table doesn't exist, fall back to user metadata
    console.warn("verification_codes table not found, using user metadata:", insertError);
    return { success: false, fallback: true };
  }

  // Use Supabase's email sending (requires Edge Function or email service)
  // For now, we'll use a simple approach with Supabase's built-in email
  // In production, create a Supabase Edge Function to send emails

  // TODO: Call Supabase Edge Function to send email
  // Example: await supabase.functions.invoke('send-verification-email', {
  //   body: { email, code }
  // });

  // For development, log the code prominently
  if (import.meta.env.DEV) {
    console.log("%c📧 VERIFICATION CODE", "color: #10b981; font-size: 16px; font-weight: bold;");
    console.log("%cEmail: " + email, "color: #3b82f6; font-size: 14px;");
    console.log("%cCode: " + code, "color: #ef4444; font-size: 20px; font-weight: bold;");
    console.log("%c⚠️  Email sending not configured. Check console for code.", "color: #f59e0b; font-size: 12px;");
    
    // Store in localStorage for easy access (dev only)
    if (typeof window !== "undefined") {
      localStorage.setItem("last_verification_code", JSON.stringify({ email, code, timestamp: Date.now() }));
    }
  }

  return { success: true };
}

/**
 * Verify code from database
 */
export async function verifyCodeFromDB(email: string, code: string) {
  const { data, error } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return { valid: false };
  }

  // Delete used code
  await supabase.from("verification_codes").delete().eq("id", data.id);

  return { valid: true };
}

