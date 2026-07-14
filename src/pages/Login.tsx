import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Lock, Eye, EyeOff, Mail, KeyRound, ArrowLeft, AlertCircle, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isEmailConfigured } from '@/config/emailConfig';

type Mode = 'login' | 'forgot';

/* ── Password strength indicator ─────────────────────────────────────────── */
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters',           ok: password.length >= 8 },
    { label: 'Uppercase letter',                 ok: /[A-Z]/.test(password) },
    { label: 'Lowercase letter',                 ok: /[a-z]/.test(password) },
    { label: 'Number',                           ok: /\d/.test(password) },
    { label: 'Special character (!@#$%^&*…)',    ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const color = score <= 1 ? 'bg-red-500' : score <= 3 ? 'bg-yellow-500' : 'bg-green-500';
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= score ? color : 'bg-gray-200 dark:bg-slate-700'}`} />
        ))}
      </div>
      <ul className="space-y-0.5">
        {checks.map(c => (
          <li key={c.label} className={`text-xs flex items-center gap-1 ${c.ok ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-slate-500'}`}>
            <span>{c.ok ? '✓' : '○'}</span>{c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── OTP input (auto-advancing 6 boxes) ──────────────────────────────────── */
function OTPInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  // Ensure we always have exactly 6 slots (padEnd needs a non-empty pad string)
  const digits = (value + '      ').slice(0, 6).split('');

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[i].trim() && i > 0) {
        // Current slot is empty — move focus back and clear previous
        const arr = [...digits];
        arr[i - 1] = ' ';
        onChange(arr.join('').trimEnd());
        const el = document.getElementById(`otp-${i - 1}`) as HTMLInputElement | null;
        el?.focus();
      } else {
        // Clear current slot
        const arr = [...digits];
        arr[i] = ' ';
        onChange(arr.join('').trimEnd());
      }
      e.preventDefault();
    }
  };

  const handleChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, '').slice(-1);
    if (!digit) return; // ignore non-digit input (handled by handleKey for backspace)
    const arr = [...digits];
    arr[i] = digit;
    onChange(arr.join('').trimEnd());
    if (i < 5) {
      const el = document.getElementById(`otp-${i + 1}`) as HTMLInputElement | null;
      el?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) onChange(pasted);
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <Input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          value={d.trim()}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          maxLength={1}
          className="w-11 h-12 text-center text-xl font-bold bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
        />
      ))}
    </div>
  );
}

/* ── Main Login page ─────────────────────────────────────────────────────── */
export function Login() {
  const navigate = useNavigate();
  const { login, loginWithOTP, sendOTP, resetPassword } = useAuth();
  const emailConfigured = isEmailConfigured();

  // Password tab
  const [password, setPassword]         = useState('');
  const [showPw, setShowPw]             = useState(false);
  const [pwLoading, setPwLoading]       = useState(false);
  const [lockout, setLockout]           = useState(0); // seconds

  // OTP tab
  const [otpEmail, setOtpEmail]         = useState('');
  const [otpCode, setOtpCode]           = useState('');
  const [otpSent, setOtpSent]           = useState(false);
  const [otpLoading, setOtpLoading]     = useState(false);

  // Forgot password
  const [mode, setMode]                 = useState<Mode>('login');
  const [fEmail, setFEmail]             = useState('');
  const [fOtp, setFOtp]                 = useState('');
  const [fNewPw, setFNewPw]             = useState('');
  const [fConfirm, setFConfirm]         = useState('');
  const [fLoading, setFLoading]         = useState(false);
  const [showFPw, setShowFPw]           = useState(false);
  const [showFConf, setShowFConf]       = useState(false);
  const [fStep, setFStep]               = useState<'email'|'otp'|'done'>('email');

  // Countdown timer for lockout
  const startLockout = (secs: number) => {
    setLockout(secs);
    const t = setInterval(() => setLockout(p => { if (p <= 1) { clearInterval(t); return 0; } return p-1; }), 1000);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockout > 0) return;
    setPwLoading(true);
    const result = await login(password);
    setPwLoading(false);
    if (result.success) { navigate('/admin'); return; }
    if (result.retryAfter) startLockout(result.retryAfter);
  };

  const handleSendOTP = async () => {
    if (!otpEmail.trim()) return;
    setOtpLoading(true);
    const r = await sendOTP(otpEmail);
    setOtpLoading(false);
    if (r.success) setOtpSent(true);
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) return;
    setOtpLoading(true);
    const ok = await loginWithOTP(otpEmail, otpCode);
    setOtpLoading(false);
    if (ok) navigate('/admin');
    else setOtpCode('');
  };

  const handleSendForgotOTP = async () => {
    if (!fEmail.trim()) return;
    setFLoading(true);
    const r = await sendOTP(fEmail);
    setFLoading(false);
    if (r.success) setFStep('otp');
  };

  const handleResetPw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fNewPw !== fConfirm || fNewPw.length < 8) return;
    setFLoading(true);
    const ok = await resetPassword(fEmail, fOtp, fNewPw);
    setFLoading(false);
    if (ok) setFStep('done');
  };

  const Spinner = () => <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px,rgba(99,102,241,.5) 1px,transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="w-full max-w-md space-y-4 relative z-10">

        {/* EmailJS setup banner */}
        {!emailConfigured && (
          <div className="flex gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>EmailJS not configured</strong> — OTP emails won't be delivered.{' '}
              Add your credentials to <code>.env</code> (see <code>src/config/emailConfig.ts</code>).
              In dev mode the OTP is printed to the browser console.
            </span>
          </div>
        )}

        <Card className="bg-white/90 dark:bg-slate-800/90 border-gray-200 dark:border-slate-700 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center space-y-3 pb-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900 dark:text-white">
                {mode === 'forgot' ? 'Reset Password' : 'Admin Panel'}
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-slate-400 text-sm">
                {mode === 'forgot' ? 'Verify your email to reset' : 'Portfolio Management System'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {/* ── Forgot Password flow ── */}
            {mode === 'forgot' ? (
              <div className="space-y-4">
                <Button type="button" variant="ghost" size="sm"
                  onClick={() => { setMode('login'); setFStep('email'); setFEmail(''); setFOtp(''); setFNewPw(''); setFConfirm(''); }}
                  className="text-gray-500 dark:text-slate-400 -ml-2">
                  <ArrowLeft size={14} className="mr-1" /> Back to login
                </Button>

                {fStep === 'done' ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                      <Shield className="w-7 h-7 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">Password reset!</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">You can now sign in with your new password.</p>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setMode('login'); setFStep('email'); }}>
                      Go to Login
                    </Button>
                  </div>
                ) : fStep === 'email' ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-gray-700 dark:text-slate-300 flex items-center gap-1.5 text-sm"><Mail size={14} />Admin Email</Label>
                      <Input type="email" value={fEmail} onChange={e => setFEmail(e.target.value)} placeholder="your@gmail.com"
                        className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white" />
                      <p className="text-xs text-gray-400 dark:text-slate-500">Must match the authorised admin email</p>
                    </div>
                    <Button onClick={handleSendForgotOTP} disabled={fLoading || !fEmail.trim()}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-5">
                      {fLoading ? <Spinner /> : 'Send OTP to Gmail'}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleResetPw} className="space-y-4">
                    <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-xs text-indigo-700 dark:text-indigo-300">
                      OTP sent to <strong>{fEmail}</strong>. Check your Gmail inbox.
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-gray-700 dark:text-slate-300 flex items-center gap-1.5 text-sm"><KeyRound size={14} />6-digit OTP</Label>
                      <OTPInput value={fOtp} onChange={setFOtp} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-gray-700 dark:text-slate-300 flex items-center gap-1.5 text-sm"><Lock size={14} />New Password</Label>
                      <div className="relative">
                        <Input type={showFPw ? 'text' : 'password'} value={fNewPw} onChange={e => setFNewPw(e.target.value)}
                          placeholder="Minimum 8 characters" className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pr-10" />
                        <button type="button" onClick={() => setShowFPw(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white">
                          {showFPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <PasswordStrength password={fNewPw} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-gray-700 dark:text-slate-300 flex items-center gap-1.5 text-sm"><Lock size={14} />Confirm Password</Label>
                      <div className="relative">
                        <Input type={showFConf ? 'text' : 'password'} value={fConfirm} onChange={e => setFConfirm(e.target.value)}
                          placeholder="Repeat new password" className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pr-10" />
                        <button type="button" onClick={() => setShowFConf(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white">
                          {showFConf ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {fConfirm && fNewPw !== fConfirm && <p className="text-xs text-red-500">Passwords do not match</p>}
                    </div>
                    <Button type="submit" disabled={fLoading || fOtp.length !== 6 || fNewPw.length < 8 || fNewPw !== fConfirm}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-5">
                      {fLoading ? <Spinner /> : 'Reset Password'}
                    </Button>
                    <button type="button" onClick={() => setFStep('email')}
                      className="w-full text-center text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                      Resend OTP
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* ── Login tabs ── */
              <Tabs defaultValue="password">
                <TabsList className="grid grid-cols-2 w-full mb-5 bg-gray-100 dark:bg-slate-900">
                  <TabsTrigger value="password" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-sm">
                    <Lock size={13} className="mr-1.5" />Password
                  </TabsTrigger>
                  <TabsTrigger value="otp" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-sm">
                    <Mail size={13} className="mr-1.5" />Gmail OTP
                  </TabsTrigger>
                </TabsList>

                {/* Password tab */}
                <TabsContent value="password">
                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    {lockout > 0 && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 text-xs">
                        <AlertCircle size={14} /><span>Too many attempts. Try again in <strong>{lockout}s</strong>.</span>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <Label htmlFor="pw" className="text-gray-700 dark:text-slate-300 flex items-center gap-1.5 text-sm"><Lock size={14} />Password</Label>
                      <div className="relative">
                        <Input id="pw" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                          placeholder="Enter admin password" autoComplete="current-password"
                          className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pr-10" required />
                        <button type="button" onClick={() => setShowPw(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white">
                          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" disabled={pwLoading || !password || lockout > 0}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-5">
                      {pwLoading ? <Spinner /> : 'Sign In'}
                    </Button>
                    <button type="button" onClick={() => setMode('forgot')}
                      className="w-full text-center text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                      Forgot Password?
                    </button>
                  </form>
                </TabsContent>

                {/* OTP tab */}
                <TabsContent value="otp">
                  {!otpSent ? (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="otp-email" className="text-gray-700 dark:text-slate-300 flex items-center gap-1.5 text-sm"><Mail size={14} />Gmail Address</Label>
                        <Input id="otp-email" type="email" value={otpEmail} onChange={e => setOtpEmail(e.target.value)}
                          placeholder="your@gmail.com"
                          className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white" />
                        <p className="text-xs text-gray-400 dark:text-slate-500">An OTP will be sent to this Gmail address</p>
                      </div>
                      <Button type="button" onClick={handleSendOTP} disabled={otpLoading || !otpEmail.trim()}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-5">
                        {otpLoading ? <Spinner /> : 'Send OTP to Gmail'}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleOTPLogin} className="space-y-4">
                      <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-xs text-indigo-700 dark:text-indigo-300">
                        OTP sent to <strong>{otpEmail}</strong>. Expires in 5 minutes.
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-slate-300 flex items-center gap-1.5 text-sm justify-center"><KeyRound size={14} />Enter OTP</Label>
                        <OTPInput value={otpCode} onChange={setOtpCode} />
                      </div>
                      <Button type="submit" disabled={otpLoading || otpCode.length !== 6}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-5">
                        {otpLoading ? <Spinner /> : 'Verify & Sign In'}
                      </Button>
                      <button type="button" onClick={() => { setOtpSent(false); setOtpCode(''); }}
                        className="w-full text-center text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                        ← Change email / Resend
                      </button>
                    </form>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
