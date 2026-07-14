import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit2, GraduationCap, Award, Eye, EyeOff } from 'lucide-react';
import type { EducationItem } from '@/types/portfolio';

interface EducationFormProps {
  education?: Partial<EducationItem>;
  onSave: (education: Partial<EducationItem>) => void;
  onCancel: () => void;
}

function EducationForm({ education, onSave, onCancel }: EducationFormProps) {
  const [formData, setFormData] = useState<Partial<EducationItem>>(education || {
    degree: '',
    institution: '',
    location: '',
    period: '',
    gpa: '',
    description: '',
    achievements: [],
  });
  const [achievementInput, setAchievementInput] = useState('');

  const handleAddAchievement = () => {
    if (achievementInput.trim()) {
      setFormData(prev => ({ 
        ...prev, 
        achievements: [...(prev.achievements || []), achievementInput.trim()] 
      }));
      setAchievementInput('');
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      achievements: prev.achievements?.filter((_, i) => i !== index) || [] 
    }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-slate-300">Degree/Program</Label>
        <Input
          value={formData.degree}
          onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
          placeholder="B.S. in Computer Science"
          className="bg-slate-900 border-slate-600 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Institution</Label>
          <Input
            value={formData.institution}
            onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
            placeholder="University Name"
            className="bg-slate-900 border-slate-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300">Location</Label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="City, State"
            className="bg-slate-900 border-slate-600 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Period</Label>
          <Input
            value={formData.period}
            onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
            placeholder="2020 - 2024"
            className="bg-slate-900 border-slate-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300">GPA</Label>
          <Input
            value={formData.gpa}
            onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
            placeholder="3.9/4.0"
            className="bg-slate-900 border-slate-600 text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Relevant coursework, honors, etc."
          rows={3}
          className="bg-slate-900 border-slate-600 text-white resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">Achievements</Label>
        <div className="flex gap-2">
          <Input
            value={achievementInput}
            onChange={(e) => setAchievementInput(e.target.value)}
            placeholder="Add an achievement..."
            className="bg-slate-900 border-slate-600 text-white"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAchievement())}
          />
          <Button type="button" onClick={handleAddAchievement} variant="outline" className="border-slate-600">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-2 mt-2">
          {formData.achievements?.map((achievement, index) => (
            <div key={index} className="flex items-center gap-2 px-3 py-2 bg-slate-700 rounded-lg">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-slate-300 text-sm flex-1">{achievement}</span>
              <button 
                onClick={() => handleRemoveAchievement(index)}
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
          disabled={!formData.degree || !formData.institution}
        >
          Save Education
        </Button>
      </div>
    </div>
  );
}

export function EducationEditor() {
  const { data, addEducation, updateEducation, deleteEducation } = usePortfolio();
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (itemData: Partial<EducationItem>) => {
    if (editingItem) {
      updateEducation(editingItem.id, itemData);
    } else {
      addEducation(itemData as Omit<EducationItem, 'id'>);
    }
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: EducationItem) => {
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
          <h2 className="text-2xl font-bold text-white mb-2">Education</h2>
          <p className="text-slate-400">Add your educational background</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Education' : 'Add New Education'}</DialogTitle>
            </DialogHeader>
            <EducationForm
              education={editingItem || undefined}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {data.education.map((item) => (
          <Card key={item.id} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{item.degree}</h3>
                      <p className="text-purple-400">{item.institution}</p>
                      <p className="text-slate-500 text-sm">{item.period} • {item.location}</p>
                      {item.gpa && (
                        <p className="text-indigo-400 text-sm mt-1">GPA: {item.gpa}</p>
                      )}
                      <p className="text-slate-400 text-sm mt-2">{item.description}</p>
                      {item.achievements.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {item.achievements.map((achievement, i) => (
                            <li key={i} className="text-sm text-slate-500 flex items-center gap-2">
                              <Award className="w-3 h-3 text-yellow-400" />
                              {achievement}
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
                          onCheckedChange={(checked) => updateEducation(item.id, { visible: checked })}
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
                        onClick={() => deleteEducation(item.id)}
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

      {data.education.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
          <p className="text-slate-400">No education added yet.</p>
        </Card>
      )}
    </div>
  );
}
