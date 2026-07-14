/**
 * EmailService — sends real OTP emails via EmailJS (no backend required).
 *
 * SETUP (one-time):
 *  1. Go to https://emailjs.com and create a free account
 *  2. Add a Gmail service  → copy the Service ID
 *  3. Create an Email Template with variables: {{otp}}, {{to_email}}, {{expiry}}
 *     → copy the Template ID
 *  4. Go to Account → Public Key → copy it
 *  5. Open src/config/emailConfig.ts and paste the three values
 */

import emailjs from '@emailjs/browser';
import { getEmailConfig } from '@/config/emailConfig';

export interface EmailResponse {
  success: boolean;
  message: string;
}

// ─── Security helpers (Web Crypto — no external deps) ─────────────────────────

async function hashOTP(otp: string, email: string): Promise<string> {
  const data = new TextEncoder().encode(otp + email + 'portfolio_salt_2024');
  const buf  = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─── Rate limiter (in-memory, per session) ────────────────────────────────────

interface RateLimitEntry { count: number; windowStart: number; lockedUntil: number }
const rateLimitStore = new Map<string, RateLimitEntry>();
const OTP_WINDOW_MS  = 15 * 60 * 1000; // 15 minutes
const OTP_MAX        = 3;              // max OTP requests per window
const LOGIN_MAX      = 5;              // max wrong passwords before lockout
const LOCKOUT_MS     = 30 * 1000;     // 30-second lockout

function checkRateLimit(key: string, max: number): { allowed: boolean; retryAfter?: number } {
  const now   = Date.now();
  const entry = rateLimitStore.get(key) ?? { count: 0, windowStart: now, lockedUntil: 0 };
  if (now < entry.lockedUntil) return { allowed: false, retryAfter: Math.ceil((entry.lockedUntil - now) / 1000) };
  if (now - entry.windowStart > OTP_WINDOW_MS) { entry.count = 0; entry.windowStart = now; }
  entry.count++;
  if (entry.count > max) { entry.lockedUntil = now + LOCKOUT_MS; rateLimitStore.set(key, entry); return { allowed: false, retryAfter: 30 }; }
  rateLimitStore.set(key, entry);
  return { allowed: true };
}

export function recordFailedLogin(email: string) {
  checkRateLimit(`login:${email}`, LOGIN_MAX);
}

export function checkLoginAllowed(email: string): { allowed: boolean; retryAfter?: number } {
  const key   = `login:${email}`;
  const entry = rateLimitStore.get(key);
  if (!entry) return { allowed: true };
  if (Date.now() < entry.lockedUntil) return { allowed: false, retryAfter: Math.ceil((entry.lockedUntil - Date.now()) / 1000) };
  return { allowed: true };
}

// ─── OTP store (hashed, ephemeral) ───────────────────────────────────────────

interface OTPEntry { hash: string; expires: number; attempts: number }
const otpStore = new Map<string, OTPEntry>();
const OTP_TTL  = 5 * 60 * 1000; // 5 minutes
const OTP_MAX_ATTEMPTS = 3;

// ─── EmailService ─────────────────────────────────────────────────────────────

export class EmailService {

  private static generateOTP(): string {
    // Cryptographically random 6-digit OTP
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return String(100000 + (arr[0] % 900000));
  }

  static async sendOTP(email: string): Promise<EmailResponse> {
    const normalizedEmail = email.trim().toLowerCase();

    // Rate limit
    const rl = checkRateLimit(`otp:${normalizedEmail}`, OTP_MAX);
    if (!rl.allowed) {
      return { success: false, message: `Too many requests. Try again in ${rl.retryAfter}s.` };
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { success: false, message: 'Invalid email format.' };
    }

    // Authorised email — hardcoded, never read from localStorage
    const AUTHORISED_EMAIL = 'tharusagar176@gmail.com';
    if (normalizedEmail !== AUTHORISED_EMAIL) {
      return { success: false, message: 'This email is not authorised for admin access.' };
    }

    const otp    = this.generateOTP();
    const hash   = await hashOTP(otp, normalizedEmail);
    const expires = Date.now() + OTP_TTL;
    otpStore.set(normalizedEmail, { hash, expires, attempts: 0 });

    // Send via EmailJS
    const cfg = getEmailConfig();
    if (!cfg.serviceId || !cfg.templateId || !cfg.publicKey) {
      // Config not set — show OTP only in dev console, never on screen
      if (import.meta.env.DEV) console.info(`[DEV ONLY] OTP for ${normalizedEmail}: ${otp}`);
      return { success: true, message: 'OTP sent to your email. (Configure EmailJS to send real emails — see src/config/emailConfig.ts)' };
    }

    try {
      await emailjs.send(
        cfg.serviceId,
        cfg.templateId,
        {
          to_email: normalizedEmail,
          otp,
          expiry: '5 minutes',
          app_name: 'Portfolio Admin',
          reply_to: normalizedEmail,
          user_email: normalizedEmail,
        },
        { publicKey: cfg.publicKey }
      );
      return { success: true, message: `OTP sent to ${normalizedEmail}. Check your inbox.` };
    } catch (err: any) {
      console.error('EmailJS error:', err?.text ?? err?.message ?? err);
      const detail = err?.text ?? err?.message ?? 'Unknown error';
      return { success: false, message: `Email send failed: ${detail}` };
    }
  }

  static async verifyOTP(email: string, otp: string): Promise<boolean> {
    const normalizedEmail = email.trim().toLowerCase();
    const entry = otpStore.get(normalizedEmail);
    if (!entry) return false;
    if (Date.now() > entry.expires) { otpStore.delete(normalizedEmail); return false; }

    entry.attempts++;
    if (entry.attempts > OTP_MAX_ATTEMPTS) {
      otpStore.delete(normalizedEmail);
      return false;
    }

    const hash = await hashOTP(otp.trim(), normalizedEmail);
    if (hash === entry.hash) {
      otpStore.delete(normalizedEmail);
      return true;
    }
    return false;
  }
}

// Periodic cleanup
if (typeof window !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of otpStore.entries()) { if (now > v.expires) otpStore.delete(k); }
  }, 60_000);
}
