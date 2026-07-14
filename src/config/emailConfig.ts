/**
 * EmailJS Configuration
 * ─────────────────────
 * Fill in your EmailJS credentials to enable real OTP emails.
 *
 * QUICK SETUP (5 minutes):
 *  1. Sign up free at https://emailjs.com
 *  2. "Add New Service" → choose Gmail → authorise your Gmail account
 *     → note the Service ID (e.g. "service_abc123")
 *  3. "Email Templates" → "Create New Template"
 *     Subject:  Your Admin OTP Code
 *     Body (HTML recommended):
 *       <h2>Your OTP Code</h2>
 *       <p>Use this code to access your Portfolio Admin Panel:</p>
 *       <h1 style="letter-spacing:8px;color:#6366f1">{{otp}}</h1>
 *       <p>This code expires in <strong>{{expiry}}</strong>.</p>
 *       <p>If you didn't request this, ignore this email.</p>
 *     "To Email" field: {{to_email}}
 *     → note the Template ID (e.g. "template_xyz789")
 *  4. Account → General → Public Key → copy it
 *  5. Paste the three values below and save.
 */

export interface EmailConfig {
  serviceId:  string;
  templateId: string;
  publicKey:  string;
}

export function getEmailConfig(): EmailConfig {
  return {
    // ↓ Replace these with your real EmailJS values
    serviceId:  import.meta.env.VITE_EMAILJS_SERVICE_ID  ?? '',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '',
    publicKey:  import.meta.env.VITE_EMAILJS_PUBLIC_KEY  ?? '',
  };
}

export function isEmailConfigured(): boolean {
  const cfg = getEmailConfig();
  return Boolean(cfg.serviceId && cfg.templateId && cfg.publicKey);
}
