import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Circle } from 'lucide-react';

const colorOptions = [
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
] as const;

const presetMessages = [
  { text: 'Open to Opportunities', color: 'green' as const },
  { text: 'Full-Stack Developer', color: 'blue' as const },
  { text: 'Currently Building SaaS Projects', color: 'blue' as const },
  { text: 'Software Engineer @ XYZ Company', color: 'purple' as const },
  { text: 'Open to Remote Roles | React & Node.js', color: 'green' as const },
  { text: 'Working on AI-Powered Applications', color: 'blue' as const },
  { text: 'Available for Freelance Work', color: 'green' as const },
  { text: 'Seeking Internship Opportunities', color: 'yellow' as const },
];

// Preview component with proper color mapping
function StatusBadgePreview({ color, text, description }: { color: string; text: string; description: string }) {
  const colorClasses = {
    green: {
      bg: 'bg-gradient-to-r from-green-100 to-green-50 dark:from-green-600/20 dark:to-green-600/10',
      border: 'border-green-200 dark:border-green-500/30',
      dot: 'bg-green-500 dark:bg-green-400',
    },
    blue: {
      bg: 'bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-600/20 dark:to-blue-600/10',
      border: 'border-blue-200 dark:border-blue-500/30',
      dot: 'bg-blue-500 dark:bg-blue-400',
    },
    purple: {
      bg: 'bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-600/20 dark:to-purple-600/10',
      border: 'border-purple-200 dark:border-purple-500/30',
      dot: 'bg-purple-500 dark:bg-purple-400',
    },
    yellow: {
      bg: 'bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-600/20 dark:to-yellow-600/10',
      border: 'border-yellow-200 dark:border-yellow-500/30',
      dot: 'bg-yellow-500 dark:bg-yellow-400',
    },
    red: {
      bg: 'bg-gradient-to-r from-red-100 to-red-50 dark:from-red-600/20 dark:to-red-600/10',
      border: 'border-red-200 dark:border-red-500/30',
      dot: 'bg-red-500 dark:bg-red-400',
    },
    indigo: {
      bg: 'bg-gradient-to-r from-indigo-100 to-indigo-50 dark:from-indigo-600/20 dark:to-indigo-600/10',
      border: 'border-indigo-200 dark:border-indigo-500/30',
      dot: 'bg-indigo-500 dark:bg-indigo-400',
    },
  };

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.green;

  return (
    <Card className={`${colors.bg} ${colors.border} p-4 sm:p-6`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-3 h-3 rounded-full ${colors.dot} animate-pulse`} />
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{text || 'Your Status'}</h3>
      </div>
      <p className="text-gray-700 dark:text-slate-300 text-xs sm:text-sm">
        {description || 'Your description will appear here'}
      </p>
    </Card>
  );
}

export function StatusBadgeEditor() {
  const { data, updateStatusBadge } = usePortfolio();
  const [formData, setFormData] = useState(data.statusBadge);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatusBadge(formData);
  };

  const applyPreset = (preset: typeof presetMessages[0]) => {
    setFormData(prev => ({
      ...prev,
      text: preset.text,
      color: preset.color,
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Status Badge</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400">
          Add a dynamic status badge to your portfolio
        </p>
      </div>

      <Card className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white text-base sm:text-lg">Badge Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Enable/Disable */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
              <div>
                <Label className="text-gray-900 dark:text-white font-medium">Enable Status Badge</Label>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                  Show status badge in Contact section
                </p>
              </div>
              <Switch
                checked={formData.enabled}
                onCheckedChange={(checked) => handleChange('enabled', checked)}
              />
            </div>

            {/* Badge Text */}
            <div className="space-y-2">
              <Label htmlFor="text" className="text-gray-700 dark:text-slate-300 text-sm">
                Badge Text
              </Label>
              <Input
                id="text"
                value={formData.text}
                onChange={(e) => handleChange('text', e.target.value)}
                placeholder="Open to Opportunities"
                className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm sm:text-base"
              />
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-slate-300 text-sm">Badge Color</Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleChange('color', color.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.color === color.value
                        ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Circle className={`w-6 h-6 ${color.class} fill-current`} />
                      <span className="text-xs text-gray-700 dark:text-slate-300">{color.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700 dark:text-slate-300 text-sm">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="I'm currently looking for software engineering internships..."
                rows={3}
                className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm sm:text-base resize-none"
              />
            </div>

            {/* Preset Messages */}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-slate-300 text-sm">Quick Presets</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presetMessages.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="text-left p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Circle className={`w-3 h-3 bg-${preset.color}-500 fill-current flex-shrink-0`} />
                      <span className="text-sm text-gray-900 dark:text-white truncate">{preset.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-slate-300 text-sm">Preview</Label>
              <StatusBadgePreview color={formData.color} text={formData.text} description={formData.description} />
            </div>

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
    </div>
  );
}
