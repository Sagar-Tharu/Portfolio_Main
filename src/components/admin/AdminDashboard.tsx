import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Sidebar } from './Sidebar';
import { DashboardOverview } from './DashboardOverview';
import { PersonalEditor } from './PersonalEditor';
import { SocialEditor } from './SocialEditor';
import { AboutEditor } from './AboutEditor';
import { SkillsEditor } from './SkillsEditor';
import { ProjectsEditor } from './ProjectsEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { EducationEditor } from './EducationEditor';
import { CertificationsEditor } from './CertificationsEditor';
import { AchievementsEditor } from './AchievementsEditor';
import { StatusBadgeEditor } from './StatusBadgeEditor';
import { SectionVisibilityEditor } from './SectionVisibilityEditor';
import { ChangePassword } from './ChangePassword';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { AlertTriangle, Download, Upload, RotateCcw } from 'lucide-react';

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [importData, setImportData] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { exportData, importData: importPortfolioData, resetData, data } = usePortfolio();

  const handleExport = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
    toast.success('Portfolio data exported successfully');
  };

  const handleImport = () => {
    if (importData.trim()) {
      importPortfolioData(importData);
      setShowImportDialog(false);
      setImportData('');
    }
  };

  const handleReset = () => {
    resetData();
    setShowResetDialog(false);
  };

  const handlePreview = () => {
    // Get the user's name from portfolio config and create a URL-friendly version
    const userName = data.personal.name.toLowerCase().replace(/\s+/g, '-');
    const previewUrl = `/portfolio/${userName}`;
    
    // Open the portfolio in a new tab
    window.open(previewUrl, '_blank');
    toast.success(`Portfolio preview opened: ${previewUrl}`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'personal':
        return <PersonalEditor />;
      case 'social':
        return <SocialEditor />;
      case 'about':
        return <AboutEditor />;
      case 'skills':
        return <SkillsEditor />;
      case 'projects':
        return <ProjectsEditor />;
      case 'experience':
        return <ExperienceEditor />;
      case 'education':
        return <EducationEditor />;
      case 'certifications':
        return <CertificationsEditor />;
      case 'achievements':
        return <AchievementsEditor />;
      case 'status-badge':
        return <StatusBadgeEditor />;
      case 'visibility':
        return <SectionVisibilityEditor />;
      case 'change-password':
        return <ChangePassword />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onExport={() => setShowExportDialog(true)}
          onImport={() => setShowImportDialog(true)}
          onReset={() => setShowResetDialog(true)}
          onPreview={handlePreview}
          isMobile={false}
          onClose={() => {}}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section);
          setMobileMenuOpen(false);
        }}
        onExport={() => setShowExportDialog(true)}
        onImport={() => setShowImportDialog(true)}
        onReset={() => setShowResetDialog(true)}
        onPreview={handlePreview}
        isMobile={true}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-3 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors active:scale-95 touch-manipulation"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6 text-gray-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2 flex-1 justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">Admin Panel</span>
            </div>
            <div className="w-11"></div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
          {renderContent()}
        </div>
      </main>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Download className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
              Export Portfolio Data
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-slate-400 text-sm">
              Download your portfolio configuration as a JSON file
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-3 sm:p-4 max-h-48 sm:max-h-64 overflow-auto">
            <pre className="text-xs text-gray-700 dark:text-slate-300 whitespace-pre-wrap">
              {exportData()}
            </pre>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowExportDialog(false)} className="w-full sm:w-auto border-gray-300 dark:border-slate-600">
              Cancel
            </Button>
            <Button onClick={handleExport} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
              Import Portfolio Data
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-slate-400 text-sm">
              Paste your portfolio JSON configuration below
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder={`{\n  "personal": {\n    "name": "..."\n  }\n}`}
            rows={8}
            className="bg-gray-100 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white font-mono text-xs sm:text-sm"
          />
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowImportDialog(false)} className="w-full sm:w-auto border-gray-300 dark:border-slate-600">
              Cancel
            </Button>
            <Button 
              onClick={handleImport} 
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
              disabled={!importData.trim()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400 text-base sm:text-lg">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
              Reset to Default
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-slate-400 text-sm">
              This will erase all your custom data and restore the default portfolio configuration. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowResetDialog(false)} className="w-full sm:w-auto border-gray-300 dark:border-slate-600">
              Cancel
            </Button>
            <Button 
              onClick={handleReset} 
              variant="destructive"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
