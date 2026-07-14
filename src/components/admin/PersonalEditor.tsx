import { useState, useEffect } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Phone, MapPin, Globe, FileText, Upload, Link as LinkIcon, Download, Trash2, Eye, EyeOff } from 'lucide-react';
import type { PersonalInfo } from '@/types/portfolio';

export function PersonalEditor() {
  const { data, updatePersonal } = usePortfolio();
  const [formData, setFormData] = useState<PersonalInfo>(data.personal);
  const [resumeUploadType, setResumeUploadType] = useState<'url' | 'upload'>('url');

  useEffect(() => {
    setFormData(data.personal);
  }, [data.personal]);

  const handleChange = <K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB for PDFs)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Check file type (PDF only)
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleChange('resumeUrl', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadResume = () => {
    if (formData.resumeUrl) {
      if (formData.resumeUrl.startsWith('data:')) {
        // Base64 file - create download link
        const link = document.createElement('a');
        link.href = formData.resumeUrl;
        link.download = `${formData.name.replace(/\s+/g, '_')}_Resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // URL - open in new tab
        window.open(formData.resumeUrl, '_blank');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonal(formData);
  };

  const fields = [
    { key: 'name', label: 'Full Name', icon: User, placeholder: 'John Doe', type: 'text' },
    { key: 'title', label: 'Professional Title', icon: User, placeholder: 'Software Engineer', type: 'text' },
    { key: 'tagline', label: 'Tagline', icon: User, placeholder: 'Your catchy tagline', type: 'text' },
    { key: 'email', label: 'Email Address', icon: Mail, placeholder: 'john@example.com', type: 'email' },
    { key: 'phone', label: 'Phone Number', icon: Phone, placeholder: '+1 (555) 123-4567', type: 'tel' },
    { key: 'location', label: 'Location', icon: MapPin, placeholder: 'San Francisco, CA', type: 'text' },
    { key: 'website', label: 'Personal Website', icon: Globe, placeholder: 'https://johndoe.dev', type: 'url' },
  ] as const;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Personal Information</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400">Update your basic profile information</p>
      </div>

      <Card className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white text-base sm:text-lg">Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {fields.map(({ key, label, icon: Icon, placeholder, type }) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-gray-700 dark:text-slate-300 flex items-center gap-2 text-sm">
                    <Icon className="w-4 h-4" />
                    {label}
                  </Label>
                  <Input
                    id={key}
                    type={type}
                    value={formData[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                    className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 text-sm sm:text-base"
                  />
                </div>
              ))}
            </div>

            {/* Resume Upload Section */}
            <Card className="bg-gray-50 dark:bg-slate-900/50 border-gray-300 dark:border-slate-600">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2 text-base sm:text-lg">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  Resume / CV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Resume Upload Type Tabs */}
                  <Tabs value={resumeUploadType} onValueChange={(v) => setResumeUploadType(v as 'url' | 'upload')}>
                    <TabsList className="grid grid-cols-2 bg-gray-200 dark:bg-slate-800/50 w-full">
                      <TabsTrigger 
                        value="url"
                        className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-sm"
                      >
                        <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Resume URL</span>
                        <span className="sm:hidden">URL</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="upload"
                        className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-sm"
                      >
                        <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Upload PDF</span>
                        <span className="sm:hidden">Upload</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* URL Input Tab */}
                    <TabsContent value="url" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="resume-url" className="text-gray-700 dark:text-slate-300 text-sm">
                          Resume URL
                        </Label>
                        <Input
                          id="resume-url"
                          type="url"
                          value={formData.resumeUrl.startsWith('data:') ? '' : formData.resumeUrl}
                          onChange={(e) => handleChange('resumeUrl', e.target.value)}
                          placeholder="https://example.com/your-resume.pdf"
                          className="bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 text-sm"
                        />
                        <p className="text-xs text-gray-500 dark:text-slate-500">
                          Enter a direct link to your resume (PDF, Google Drive, Dropbox, etc.)
                        </p>
                      </div>
                    </TabsContent>

                    {/* File Upload Tab */}
                    <TabsContent value="upload" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="resume-file" className="text-gray-700 dark:text-slate-300 text-sm">
                          Upload Resume PDF
                        </Label>
                        <div className="flex items-center gap-3">
                          <Input
                            id="resume-file"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleResumeFileUpload}
                            className="bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer"
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-500">
                          Max file size: 10MB. PDF format only.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Resume Button Visibility — always visible */}
                  <div className="space-y-4 pt-2 border-t border-gray-300 dark:border-slate-600">
                    <Label className="text-gray-700 dark:text-slate-300 text-sm font-medium">
                      Resume Button Visibility
                    </Label>
                    <div className="space-y-3">
                      {/* View Resume toggle */}
                      <div className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        formData.showViewResume
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30'
                          : 'bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-600'
                      }`}>
                        <div className="flex items-center gap-2">
                          {formData.showViewResume
                            ? <Eye className="w-4 h-4 text-indigo-500" />
                            : <EyeOff className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                          }
                          <div>
                            <p className={`text-sm font-medium ${
                              formData.showViewResume
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-slate-400'
                            }`}>View Resume</p>
                            <p className="text-xs text-gray-500 dark:text-slate-500">
                              {formData.showViewResume ? 'Visible on profile' : 'Hidden from profile'}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={formData.showViewResume}
                          onCheckedChange={(checked) => handleChange('showViewResume', checked)}
                        />
                      </div>

                      {/* Download Resume toggle */}
                      <div className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        formData.showDownloadResume
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30'
                          : 'bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-600'
                      }`}>
                        <div className="flex items-center gap-2">
                          {formData.showDownloadResume
                            ? <Download className="w-4 h-4 text-indigo-500" />
                            : <EyeOff className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                          }
                          <div>
                            <p className={`text-sm font-medium ${
                              formData.showDownloadResume
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-slate-400'
                            }`}>Download Resume</p>
                            <p className="text-xs text-gray-500 dark:text-slate-500">
                              {formData.showDownloadResume ? 'Visible on profile' : 'Hidden from profile'}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={formData.showDownloadResume}
                          onCheckedChange={(checked) => handleChange('showDownloadResume', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resume Preview/Status */}
                  {formData.resumeUrl && (
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-slate-300 text-sm">Current Resume</Label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 sm:p-4 bg-gray-100 dark:bg-slate-800 rounded-lg border border-gray-300 dark:border-slate-600">
                        <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white font-medium truncate">
                            {formData.resumeUrl.startsWith('data:') 
                              ? `${formData.name.replace(/\s+/g, '_')}_Resume.pdf` 
                              : 'Resume (External Link)'}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-slate-400">
                            {formData.resumeUrl.startsWith('data:') 
                              ? '✓ PDF uploaded locally' 
                              : '✓ External URL set'}
                          </p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={downloadResume}
                            className="flex-1 sm:flex-none border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/50 text-xs sm:text-sm"
                          >
                            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            {formData.resumeUrl.startsWith('data:') ? 'Download' : 'View'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleChange('resumeUrl', '')}
                            className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/50"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
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

      {/* Preview Card */}
      <Card className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white text-base sm:text-lg">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 dark:bg-slate-900 rounded-xl p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{formData.name || 'Your Name'}</h3>
            <p className="text-indigo-600 dark:text-indigo-400 text-sm sm:text-base">{formData.title || 'Your Title'}</p>
            <p className="text-gray-600 dark:text-slate-400 mt-2 text-sm">{formData.tagline || 'Your tagline'}</p>
            <div className="mt-4 space-y-1 text-xs sm:text-sm text-gray-500 dark:text-slate-500">
              <p>📧 {formData.email || 'email@example.com'}</p>
              <p>📱 {formData.phone || '+1 (555) 000-0000'}</p>
              <p>📍 {formData.location || 'Your Location'}</p>
              <p>🌐 {formData.website || 'yourwebsite.com'}</p>
            </div>
            {formData.resumeUrl && formData.resumeUrl !== '#' && (
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.showViewResume ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                    <Eye className="w-3 h-3" /> View Resume visible
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400">
                    <EyeOff className="w-3 h-3" /> View Resume hidden
                  </span>
                )}
                {formData.showDownloadResume ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                    <Download className="w-3 h-3" /> Download Resume visible
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400">
                    <EyeOff className="w-3 h-3" /> Download Resume hidden
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
