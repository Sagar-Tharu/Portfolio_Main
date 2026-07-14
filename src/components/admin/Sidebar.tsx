import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';
import { 
  User, 
  Share2, 
  FileText, 
  Code2, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Trophy,
  LogOut,
  LayoutDashboard,
  Download,
  Upload,
  RotateCcw,
  Eye,
  KeyRound,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  onPreview: () => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'social', label: 'Social Links', icon: Share2 },
  { id: 'about', label: 'About', icon: FileText },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'status-badge', label: 'Status Badge', icon: Eye },
  { id: 'visibility', label: 'Section Visibility', icon: Eye },
  { id: 'change-password', label: 'Change Password', icon: KeyRound },
];

function SidebarContent({ 
  activeSection, 
  onSectionChange, 
  onExport, 
  onImport, 
  onReset,
  onPreview,
  isMobile = false
}: Omit<SidebarProps, 'isOpen' | 'onClose'>) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { saveStatus } = usePortfolio();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SaveIndicator = () => {
    if (saveStatus === 'idle') return null;
    if (saveStatus === 'saving') return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/30">
        <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
        <span className="text-xs text-blue-400 font-medium">Saving…</span>
      </div>
    );
    if (saveStatus === 'saved') return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-500/10 border border-green-500/30">
        <CheckCircle2 className="w-3 h-3 text-green-400" />
        <span className="text-xs text-green-400 font-medium">Saved</span>
      </div>
    );
    if (saveStatus === 'error') return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/30">
        <AlertCircle className="w-3 h-3 text-red-400" />
        <span className="text-xs text-red-400 font-medium">Save failed</span>
      </div>
    );
    return null;
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 flex flex-col h-full transition-colors duration-300 overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-gray-900 dark:text-white truncate">Admin Panel</h1>
            <p className="text-xs text-gray-600 dark:text-slate-400 truncate">Portfolio Manager</p>
          </div>
        </div>
        {/* Save status indicator */}
        <div className="mt-3">
          <SaveIndicator />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="py-4">
          {/* Navigation */}
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate text-left">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="px-3 mt-6 pt-6 border-t border-gray-200 dark:border-slate-800 space-y-2">
            <p className="px-3 text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-3">
              Actions
            </p>
            <button
              onClick={onPreview}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
            >
              <Eye className="w-4 h-4 flex-shrink-0" />
              <span className="truncate text-left">Preview Portfolio</span>
            </button>
            <button
              onClick={onExport}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
            >
              <Download className="w-4 h-4 flex-shrink-0" />
              <span className="truncate text-left">Export Data</span>
            </button>
            <button
              onClick={onImport}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
            >
              <Upload className="w-4 h-4 flex-shrink-0" />
              <span className="truncate text-left">Import Data</span>
            </button>
            <button
              onClick={onReset}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            >
              <RotateCcw className="w-4 h-4 flex-shrink-0" />
              <span className="truncate text-left">Reset to Default</span>
            </button>
          </div>

          {/* Extra padding at bottom for mobile scrolling */}
          {isMobile && <div className="h-4"></div>}
        </div>
      </div>

      {/* Footer - Fixed */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between px-3">
          <span className="text-sm text-gray-600 dark:text-slate-400">Theme</span>
          <ThemeToggle />
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}

export function Sidebar(props: SidebarProps) {
  const { isMobile, isOpen, onClose, ...contentProps } = props;

  // Mobile version with Sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
        <SheetContent 
          side="left" 
          className="p-0 w-[280px] sm:w-[320px] flex flex-col"
        >
          <SidebarContent {...contentProps} isMobile={true} />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop version
  return (
    <div className="w-64 border-r border-gray-200 dark:border-slate-800 h-screen">
      <SidebarContent {...contentProps} isMobile={false} />
    </div>
  );
}
