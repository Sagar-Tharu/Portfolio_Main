import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, Home, User, Code2, Briefcase, Layers, Mail, Award, Trophy } from 'lucide-react';

const sections = [
  { key: 'hero'          as const, label: 'Hero Section',             icon: Home,     description: 'Main landing section with your name and title' },
  { key: 'about'         as const, label: 'About Section',            icon: User,     description: 'Your bio, image, and highlights' },
  { key: 'skills'        as const, label: 'Skills Section',           icon: Code2,    description: 'Technical skills and proficiencies' },
  { key: 'projects'      as const, label: 'Projects Section',         icon: Layers,   description: 'Your portfolio projects' },
  { key: 'experience'    as const, label: 'Experience Section',       icon: Briefcase,description: 'Work experience and education' },
  { key: 'certifications'as const, label: 'Certifications Section',   icon: Award,    description: 'Your certifications and credentials' },
  { key: 'achievements'  as const, label: 'Achievements Section',     icon: Trophy,   description: 'Awards, hackathons, and accomplishments' },
  { key: 'contact'       as const, label: 'Contact Section',          icon: Mail,     description: 'Contact form and information' },
];

export function SectionVisibilityEditor() {
  const { data, updateSectionVisibility } = usePortfolio();
  const [formData, setFormData] = useState(data.sectionVisibility);

  const handleToggle = (key: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSectionVisibility(formData);
  };

  const toggleAll = (value: boolean) => {
    const newVisibility = Object.keys(formData).reduce((acc, key) => {
      acc[key as keyof typeof formData] = value;
      return acc;
    }, {} as typeof formData);
    setFormData(newVisibility);
  };

  const visibleCount = Object.values(formData).filter(Boolean).length;
  const totalCount = Object.keys(formData).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Section Visibility</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400">
          Control which sections appear on your portfolio
        </p>
      </div>

      <Card className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-gray-900 dark:text-white text-base sm:text-lg">Portfolio Sections</CardTitle>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                {visibleCount} of {totalCount} sections visible
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toggleAll(true)}
                className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 text-xs sm:text-sm"
              >
                <Eye className="w-4 h-4 mr-1" />
                Show All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toggleAll(false)}
                className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 text-xs sm:text-sm"
              >
                <EyeOff className="w-4 h-4 mr-1" />
                Hide All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Section Toggles */}
            <div className="space-y-3">
              {sections.map((section) => {
                const Icon = section.icon;
                const isVisible = formData[section.key];
                
                return (
                  <div
                    key={section.key}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isVisible
                        ? 'border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10'
                        : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isVisible
                            ? 'bg-indigo-100 dark:bg-indigo-500/20'
                            : 'bg-gray-200 dark:bg-slate-800'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            isVisible
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-gray-500 dark:text-slate-500'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Label className={`font-medium text-sm sm:text-base ${
                              isVisible
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-600 dark:text-slate-400'
                            }`}>
                              {section.label}
                            </Label>
                            {isVisible ? (
                              <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-400 dark:text-slate-600 flex-shrink-0" />
                            )}
                          </div>
                          <p className={`text-xs sm:text-sm ${
                            isVisible
                              ? 'text-gray-600 dark:text-slate-400'
                              : 'text-gray-500 dark:text-slate-500'
                          }`}>
                            {section.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={isVisible}
                        onCheckedChange={() => handleToggle(section.key)}
                        className="flex-shrink-0"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Warning */}
            {visibleCount === 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  ⚠️ Warning: All sections are hidden. Your portfolio will appear empty.
                </p>
              </div>
            )}

            {/* Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-400">
                💡 Tip: Hidden sections won't appear in the navigation menu or portfolio display.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button 
                type="submit"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
