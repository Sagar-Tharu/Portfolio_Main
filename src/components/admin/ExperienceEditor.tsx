import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit2, Briefcase, Eye, EyeOff } from 'lucide-react';
import type { ExperienceItem } from '@/types/portfolio';

interface ExperienceFormProps {
  experience?: Partial<ExperienceItem>;
  onSave: (experience: Partial<ExperienceItem>) => void;
  onCancel: () => void;
}

function ExperienceForm({ experience, onSave, onCancel }: ExperienceFormProps) {
  const [formData, setFormData] = useState<Partial<ExperienceItem>>(experience || {
    role: '',
    company: '',
    location: '',
    period: '',
    description: '',
    highlights: [],
  });
  const [highlightInput, setHighlightInput] = useState('');

  const handleAddHighlight = () => {
    if (highlightInput.trim()) {
      setFormData(prev => ({ 
        ...prev, 
        highlights: [...(prev.highlights || []), highlightInput.trim()] 
      }));
      setHighlightInput('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      highlights: prev.highlights?.filter((_, i) => i !== index) || [] 
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Role/Position</Label>
          <Input
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            placeholder="Software Engineer"
            className="bg-slate-900 border-slate-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300">Company</Label>
          <Input
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            placeholder="Google"
            className="bg-slate-900 border-slate-600 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Location</Label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="San Francisco, CA"
            className="bg-slate-900 border-slate-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300">Period</Label>
          <Input
            value={formData.period}
            onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
            placeholder="Jan 2023 - Present"
            className="bg-slate-900 border-slate-600 text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your role and responsibilities..."
          rows={3}
          className="bg-slate-900 border-slate-600 text-white resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">Highlights/Achievements</Label>
        <div className="flex gap-2">
          <Input
            value={highlightInput}
            onChange={(e) => setHighlightInput(e.target.value)}
            placeholder="Add a highlight..."
            className="bg-slate-900 border-slate-600 text-white"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
          />
          <Button type="button" onClick={handleAddHighlight} variant="outline" className="border-slate-600">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-2 mt-2">
          {formData.highlights?.map((highlight, index) => (
            <div key={index} className="flex items-center gap-2 px-3 py-2 bg-slate-700 rounded-lg">
              <span className="text-slate-300 text-sm flex-1">{highlight}</span>
              <button 
                onClick={() => handleRemoveHighlight(index)}
                className="text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={formData.visible !== false}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, visible: checked }))}
        />
        <Label className="text-slate-300">Visible on Portfolio</Label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" onClick={onCancel} variant="outline" className="border-slate-600">
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={() => onSave(formData)}
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={!formData.role || !formData.company}
        >
          Save Experience
        </Button>
      </div>
    </div>
  );
}

export function ExperienceEditor() {
  const { data, addExperience, updateExperience, deleteExperience } = usePortfolio();
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (itemData: Partial<ExperienceItem>) => {
    if (editingItem) {
      updateExperience(editingItem.id, itemData);
    } else {
      addExperience(itemData as Omit<ExperienceItem, 'id'>);
    }
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: ExperienceItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Work Experience</h2>
          <p className="text-slate-400">Add your professional experience</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
            </DialogHeader>
            <ExperienceForm
              experience={editingItem || undefined}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {data.experience.map((item) => (
          <Card key={item.id} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{item.role}</h3>
                      <p className="text-indigo-400">{item.company}</p>
                      <p className="text-slate-500 text-sm">{item.period} • {item.location}</p>
                      <p className="text-slate-400 text-sm mt-2">{item.description}</p>
                      {item.highlights.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {item.highlights.map((highlight, i) => (
                            <li key={i} className="text-sm text-slate-500 flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-indigo-400" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      )}
                      {/* Inline Visibility Toggle */}
                      <div className="flex items-center gap-2 mt-3 p-2 bg-slate-900/50 rounded-lg border border-slate-700">
                        {item.visible !== false ? (
                          <Eye className="w-4 h-4 text-green-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-slate-500" />
                        )}
                        <Switch
                          checked={item.visible !== false}
                          onCheckedChange={(checked) => updateExperience(item.id, { visible: checked })}
                        />
                        <span className="text-xs text-slate-400">
                          {item.visible !== false ? 'Visible on Portfolio' : 'Hidden from Portfolio'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(item)}
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteExperience(item.id)}
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.experience.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
          <p className="text-slate-400">No experience added yet.</p>
        </Card>
      )}
    </div>
  );
}
