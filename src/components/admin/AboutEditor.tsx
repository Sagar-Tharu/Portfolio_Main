import { useState, useEffect } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Image, Upload, Link as LinkIcon, Lock, RefreshCw } from 'lucide-react';
import type { AboutHighlight } from '@/types/portfolio';

/** Compute the live value for a dynamic highlight */
function useDynamicValue(dynamic: AboutHighlight['dynamic'], data: ReturnType<typeof usePortfolio>['data']): string | null {
  if (!dynamic) return null;
  if (dynamic === 'projects') {
    const count = data.projects.filter(p => p.visible !== false).length;
    return `${count}+`;
  }
  if (dynamic === 'certifications') {
    const count = data.certifications.filter(c => c.visible !== false).length;
    return String(count);
  }
  if (dynamic === 'languages') {
    const count = data.skills.programming.filter(s => s.visible !== false).length;
    return `${count}+`;
  }
  return null;
}

export function AboutEditor() {
  const { data, updateAbout } = usePortfolio();
  const [formData, setFormData] = useState(data.about);
  const [imageUploadType, setImageUploadType] = useState<'url' | 'upload'>('url');

  useEffect(() => {
    setFormData(data.about);
  }, [data.about]);

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }));
  };

  const handleImageChange = (value: string) => {
    setFormData(prev => ({ ...prev, image: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleImageChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHighlightChange = (index: number, field: 'label' | 'value' | 'visible', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => 
        i === index ? { ...h, [field]: value } : h
      ),
    }));
  };

  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, { label: 'New', value: '0', visible: true }],
    }));
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAbout(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">About Section</h2>
        <p className="text-slate-400">Tell your story and showcase your highlights</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Description */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Bio / Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300">
                About You
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Write a compelling bio about yourself..."
                rows={8}
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 resize-none"
              />
              <p className="text-xs text-slate-500">
                Use line breaks to separate paragraphs
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Image */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Image className="w-5 h-5" />
              Profile Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Image Upload Type Tabs */}
              <Tabs value={imageUploadType} onValueChange={(v) => setImageUploadType(v as 'url' | 'upload')}>
                <TabsList className="grid grid-cols-2 bg-slate-900/50">
                  <TabsTrigger 
                    value="url"
                    className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Image URL
                  </TabsTrigger>
                  <TabsTrigger 
                    value="upload"
                    className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </TabsTrigger>
                </TabsList>

                {/* URL Input Tab */}
                <TabsContent value="url" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image-url" className="text-slate-300">
                      Image URL
                    </Label>
                    <Input
                      id="image-url"
                      type="url"
                      value={formData.image.startsWith('data:') ? '' : formData.image}
                      onChange={(e) => handleImageChange(e.target.value)}
                      placeholder="https://example.com/your-photo.jpg"
                      className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                    />
                    <p className="text-xs text-slate-500">
                      Enter a direct link to your profile image
                    </p>
                  </div>
                </TabsContent>

                {/* File Upload Tab */}
                <TabsContent value="upload" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image-file" className="text-slate-300">
                      Upload Image
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="image-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="bg-slate-900 border-slate-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Image Preview */}
              {formData.image && (
                <div className="space-y-2">
                  <Label className="text-slate-300">Preview</Label>
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-slate-600 bg-slate-900">
                      <img 
                        src={formData.image} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=Error';
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm text-slate-400">
                        {formData.image.startsWith('data:') 
                          ? '✓ Local image uploaded' 
                          : '✓ Image URL set'}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleImageChange('')}
                        className="border-slate-600 text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Image
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Highlights */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Highlights / Stats</CardTitle>
              <p className="text-slate-400 text-sm mt-1">
                <span className="inline-flex items-center gap-1"><Lock className="w-3 h-3 text-indigo-400" /> Dynamic</span>
                {' '}stats auto-update from your data — labels are still editable.
              </p>
            </div>
            <Button
              type="button"
              onClick={addHighlight}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formData.highlights.map((highlight, index) => {
                const isDynamic = Boolean(highlight.dynamic);
                const liveValue = isDynamic ? (
                  highlight.dynamic === 'projects'
                    ? `${data.projects.filter(p => p.visible !== false).length}+`
                    : highlight.dynamic === 'certifications'
                    ? String(data.certifications.filter(c => c.visible !== false).length)
                    : highlight.dynamic === 'languages'
                    ? `${data.skills.programming.filter(s => s.visible !== false).length}+`
                    : highlight.value
                ) : null;

                return (
                  <div
                    key={index}
                    className={`flex gap-3 items-start p-3 rounded-lg border ${
                      isDynamic
                        ? 'bg-indigo-500/5 border-indigo-500/30'
                        : 'bg-slate-900/50 border-slate-700'
                    }`}
                  >
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {/* Label — always editable */}
                        <Input
                          value={highlight.label}
                          onChange={e => handleHighlightChange(index, 'label', e.target.value)}
                          placeholder="Label (e.g., CGPA)"
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                        {/* Value — read-only for dynamic, editable for manual */}
                        {isDynamic ? (
                          <div className="relative">
                            <Input
                              value={liveValue ?? highlight.value}
                              readOnly
                              className="bg-slate-800 border-indigo-500/40 text-indigo-300 pr-8 cursor-not-allowed"
                            />
                            <Lock className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-400 pointer-events-none" />
                          </div>
                        ) : (
                          <Input
                            value={highlight.value}
                            onChange={e => handleHighlightChange(index, 'value', e.target.value)}
                            placeholder="Value (e.g., 3.9/4.0)"
                            className="bg-slate-900 border-slate-600 text-white"
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <Switch
                          checked={highlight.visible}
                          onCheckedChange={checked => handleHighlightChange(index, 'visible', checked)}
                        />
                        <Label className="text-slate-300 text-sm">Visible on Portfolio</Label>
                        {!highlight.visible && (
                          <Badge variant="secondary" className="bg-slate-700 text-slate-400 text-xs">Hidden</Badge>
                        )}
                        {isDynamic && (
                          <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs gap-1">
                            <RefreshCw className="w-2.5 h-2.5" />
                            Auto • {highlight.dynamic}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
