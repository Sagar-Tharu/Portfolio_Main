import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit2, Trophy, Eye, EyeOff } from 'lucide-react';
import type { Achievement } from '@/types/portfolio';

interface AchievementFormProps {
  achievement?: Achievement;
  onSave: (achievement: Achievement) => void;
  onCancel: () => void;
}

function AchievementForm({ achievement, onSave, onCancel }: AchievementFormProps) {
  const [formData, setFormData] = useState<Achievement>(achievement || {
    title: '',
    description: '',
    visible: true,
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-slate-300">Achievement Title</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="1st Place - Hackathon 2024"
          className="bg-slate-900 border-slate-600 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your achievement..."
          rows={3}
          className="bg-slate-900 border-slate-600 text-white resize-none"
        />
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
          disabled={!formData.title}
        >
          Save Achievement
        </Button>
      </div>
    </div>
  );
}

export function AchievementsEditor() {
  const { data, addAchievement, updateAchievement, deleteAchievement } = usePortfolio();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (achievementData: Achievement) => {
    if (editingIndex !== null) {
      updateAchievement(editingIndex, achievementData);
    } else {
      addAchievement(achievementData);
    }
    setEditingIndex(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingIndex(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Achievements</h2>
          <p className="text-slate-400">Showcase your accomplishments and awards</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingIndex !== null ? 'Edit Achievement' : 'Add New Achievement'}</DialogTitle>
            </DialogHeader>
            <AchievementForm
              achievement={editingIndex !== null ? data.achievements[editingIndex] : undefined}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Achievements List */}
      <div className="space-y-4">
        {data.achievements.map((achievement, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5 text-pink-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white">{achievement.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => handleEdit(index)}
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteAchievement(index)}
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {/* Inline Visibility Toggle */}
                <div className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-lg border border-slate-700">
                  {achievement.visible !== false ? (
                    <Eye className="w-4 h-4 text-green-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-slate-500" />
                  )}
                  <Switch
                    checked={achievement.visible !== false}
                    onCheckedChange={(checked) => updateAchievement(index, { ...achievement, visible: checked })}
                  />
                  <span className="text-xs text-slate-400">
                    {achievement.visible !== false ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.achievements.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
          <p className="text-slate-400">No achievements added yet.</p>
        </Card>
      )}
    </div>
  );
}
