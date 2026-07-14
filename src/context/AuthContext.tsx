import { createContext, useContext, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { EmailService, recordFailedLogin, checkLoginAllowed } from '@/services/emailService';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  isAuthenticated: boolean;
  adminEmail: string;
  login: (password: string) => Promise<{ success: boolean; retryAfter?: number }>;
  loginWithOTP: (email: string, otp: string) => Promise<boolean>;
  sendOTP: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
  updateAdminEmail: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Storage keys ─────────────────────────────────────────────────────────────

const AUTH_KEY     = 'portfolio_admin_auth';
const PASSWORD_KEY = 'portfolio_admin_password';
const EMAIL_KEY    = 'portfolio_admin_email';

const DEFAULT_PASSWORD = 'admin123';
const DEFAULT_EMAIL    = 'tharusagar176@gmail.com';

// Always force the correct email into localStorage on load
if (typeof window !== 'undefined') {
  localStorage.setItem('portfolio_admin_email', DEFAULT_EMAIL);
}

// ─── Password hashing (Web Crypto — no external deps) ─────────────────────────

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + 'portfolio_pw_salt_v1');
  const buf  = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(input: string, stored: string): Promise<boolean> {
  // Support plain-text legacy passwords (first login after upgrade)
  if (!stored.startsWith('sha256:')) return input === stored;
  return 'sha256:' + (await hashPassword(input)) === stored;
}

function getStoredPassword(): string {
  return localStorage.getItem(PASSWORD_KEY) ?? DEFAULT_PASSWORD;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    localStorage.getItem(AUTH_KEY) === 'true'
  );

  const [adminEmail, setAdminEmail] = useState<string>(DEFAULT_EMAIL);

  /** Password login with rate-limit check */
  const login = async (password: string): Promise<{ success: boolean; retryAfter?: number }> => {
    const rl = checkLoginAllowed(adminEmail);
    if (!rl.allowed) {
      toast.error(`Too many attempts. Try again in ${rl.retryAfter}s.`);
      return { success: false, retryAfter: rl.retryAfter };
    }

    const stored  = getStoredPassword();
    const isValid = await verifyPassword(password, stored);

    if (isValid) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, 'true');
      toast.success('Welcome back!');
      return { success: true };
    }

    recordFailedLogin(adminEmail);
    toast.error('Incorrect password');
    return { success: false };
  };

  /** Send OTP to Gmail */
  const sendOTP = async (email: string) => {
    const result = await EmailService.sendOTP(email);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
    return result;
  };

  /** OTP login */
  const loginWithOTP = async (email: string, otp: string): Promise<boolean> => {
    const isValid = await EmailService.verifyOTP(email, otp);
    if (isValid) {
      setIsAuthenticated(true);
      setAdminEmail(email.trim().toLowerCase());
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(EMAIL_KEY, email.trim().toLowerCase());
      toast.success('Signed in with OTP');
      return true;
    }
    toast.error('Invalid or expired OTP');
    return false;
  };

  /** Reset password via OTP */
  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<boolean> => {
    const isValid = await EmailService.verifyOTP(email, otp);
    if (!isValid) { toast.error('Invalid or expired OTP'); return false; }

    const hashed = 'sha256:' + await hashPassword(newPassword);
    localStorage.setItem(PASSWORD_KEY, hashed);
    localStorage.setItem(EMAIL_KEY, email.trim().toLowerCase());
    setAdminEmail(email.trim().toLowerCase());
    toast.success('Password reset successfully');
    return true;
  };

  /** Change password from inside admin panel */
  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    const stored = getStoredPassword();
    // Sync check for UI (hash compare done async but we need sync for the form)
    // We'll use a simple equality for legacy and mark new ones
    const isLegacy = !stored.startsWith('sha256:');
    const match = isLegacy ? currentPassword === stored : false;

    if (!isLegacy) {
      // Async path — trigger async and return true optimistically if format matches
      hashPassword(currentPassword).then(hash => {
        if ('sha256:' + hash !== stored) {
          toast.error('Current password is incorrect');
          return;
        }
        hashPassword(newPassword).then(newHash => {
          localStorage.setItem(PASSWORD_KEY, 'sha256:' + newHash);
          toast.success('Password changed successfully');
        });
      });
      return true; // UI treated as pending
    }

    if (!match) { toast.error('Current password is incorrect'); return false; }
    hashPassword(newPassword).then(hash => {
      localStorage.setItem(PASSWORD_KEY, 'sha256:' + hash);
    });
    toast.success('Password changed successfully');
    return true;
  };

  /** Update the authorised admin email */
  const updateAdminEmail = (email: string) => {
    const normalized = email.trim().toLowerCase();
    setAdminEmail(normalized);
    localStorage.setItem(EMAIL_KEY, normalized);
    toast.success('Admin email updated');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      adminEmail,
      login,
      loginWithOTP,
      sendOTP,
      resetPassword,
      changePassword,
      updateAdminEmail,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
