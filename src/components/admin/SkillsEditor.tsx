import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Code2, Layout, Server, Wrench, Sparkles } from 'lucide-react';

interface SkillItemProps {
  name: string;
  level: number;
  visible: boolean;
  onChange: (name: string, level: number, visible: boolean) => void;
  onDelete: () => void;
}

function SkillItem({ name, level, visible, onChange, onDelete }: SkillItemProps) {
  return (
    <div className="flex items-center gap-4 p-3 bg-slate-900 rounded-lg border border-slate-700">
      <div className="flex items-center gap-2">
        <Switch
          checked={visible}
          onCheckedChange={(checked) => onChange(name, level, checked)}
        />
      </div>
      <div className="flex-1">
        <Input
          value={name}
          onChange={(e) => onChange(e.target.value, level, visible)}
          placeholder="Skill name"
          className="bg-transparent border-0 p-0 text-white focus-visible:ring-0"
        />
      </div>
      <div className="w-32">
        <Slider
          value={[level]}
          onValueChange={([v]) => onChange(name, v, visible)}
          min={0}
          max={100}
          step={5}
          className="w-full"
        />
      </div>
      <span className="text-slate-400 w-10 text-right">{level}%</span>
      {!visible && (
        <Badge variant="secondary" className="bg-slate-700 text-slate-400 text-xs">
          Hidden
        </Badge>
      )}
      <Button
        type="button"
        onClick={onDelete}
        variant="ghost"
        size="icon"
        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

export function SkillsEditor() {
  const { data, updateSkills } = usePortfolio();
  const [formData, setFormData] = useState(data.skills);
  const [newSkill, setNewSkill] = useState('');
  const [newOtherSkill, setNewOtherSkill] = useState('');

  const handleSkillChange = (
    category: 'programming' | 'frontend' | 'backend' | 'tools',
    index: number,
    name: string,
    level: number,
    visible: boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].map((s, i) => 
        i === index ? { name, level, visible } : s
      ),
    }));
  };

  const addSkill = (
    category: 'programming' | 'frontend' | 'backend' | 'tools',
    name: string
  ) => {
    if (!name.trim()) return;
    setFormData(prev => ({
      ...prev,
      [category]: [...prev[category], { name: name.trim(), level: 50, visible: true }],
    }));
    setNewSkill('');
  };

  const deleteSkill = (
    category: 'programming' | 'frontend' | 'backend' | 'tools',
    index: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const addOtherSkill = () => {
    if (!newOtherSkill.trim()) return;
    setFormData(prev => ({
      ...prev,
      other: [...prev.other, { name: newOtherSkill.trim(), visible: true }],
    }));
    setNewOtherSkill('');
  };

  const deleteOtherSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      other: prev.other.filter((_, i) => i !== index),
    }));
  };

  const toggleOtherSkillVisibility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      other: prev.other.map((s, i) => 
        i === index ? { ...s, visible: !s.visible } : s
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSkills(formData);
  };

  const categories = [
    { id: 'programming', label: 'Programming Languages', icon: Code2 },
    { id: 'frontend', label: 'Frontend', icon: Layout },
    { id: 'backend', label: 'Backend', icon: Server },
    { id: 'tools', label: 'Tools & DevOps', icon: Wrench },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Skills Management</h2>
        <p className="text-slate-400">Manage your technical skills and expertise</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="programming" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-800/50 p-2 mb-6">
            {categories.map(({ id, label, icon: Icon }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400"
              >
                <Icon size={16} className="mr-2 hidden sm:inline" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(({ id }) => (
            <TabsContent key={id} value={id}>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white capitalize">{id} Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add New Skill */}
                  <div className="flex gap-3">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder={`Add new ${id} skill...`}
                      className="bg-slate-900 border-slate-600 text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill(id, newSkill);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => addSkill(id, newSkill)}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-2">
                    {formData[id].map((skill, index) => (
                      <SkillItem
                        key={index}
                        name={skill.name}
                        level={skill.level}
                        visible={skill.visible}
                        onChange={(name, level, visible) => handleSkillChange(id, index, name, level, visible)}
                        onDelete={() => deleteSkill(id, index)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Other Skills */}
        <Card className="bg-slate-800/50 border-slate-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Additional Expertise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                value={newOtherSkill}
                onChange={(e) => setNewOtherSkill(e.target.value)}
                placeholder="Add skill (e.g., Machine Learning)..."
                className="bg-slate-900 border-slate-600 text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addOtherSkill();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addOtherSkill}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.other.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 rounded-lg text-slate-300"
                >
                  <Switch
                    checked={skill.visible}
                    onCheckedChange={() => toggleOtherSkillVisibility(index)}
                    className="scale-75"
                  />
                  <span className={skill.visible ? '' : 'opacity-50'}>{skill.name}</span>
                  {!skill.visible && (
                    <Badge variant="secondary" className="bg-slate-600 text-slate-400 text-xs px-1 py-0">
                      Hidden
                    </Badge>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteOtherSkill(index)}
                    className="text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
          <Button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Save All Skills
          </Button>
        </div>
      </form>
    </div>
  );
}
