import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit2, Star, Github, ExternalLink, Eye, EyeOff, Upload, X } from 'lucide-react';
import type { Project } from '@/types/portfolio';

interface ProjectFormProps {
  project?: Partial<Project>;
  onSave: (project: Partial<Project>) => void;
  onCancel: () => void;
}

function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<Partial<Project>>(project || {
    title: '',
    description: '',
    image: '',
    tags: [],
    github: '',
    demo: '',
    featured: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string>(project?.image || '');

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tag) || [] }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, image: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview('');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-slate-300">Project Title</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="AI-Powered Code Reviewer"
          className="bg-slate-900 border-slate-600 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your project..."
          rows={3}
          className="bg-slate-900 border-slate-600 text-white resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">Image URL</Label>
        <Input
          value={formData.image}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, image: e.target.value }));
            setImagePreview(e.target.value);
          }}
          placeholder="https://example.com/project-image.jpg"
          className="bg-slate-900 border-slate-600 text-white"
        />
        <div className="text-sm text-slate-400 text-center my-2">or</div>
        <div className="space-y-2">
          <Label htmlFor="image-upload" className="cursor-pointer">
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 hover:border-indigo-500 transition-colors text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm text-slate-400">Click to upload image</p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </Label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        {imagePreview && (
          <div className="relative mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
              }}
            />
            <Button
              type="button"
              onClick={handleRemoveImage}
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">Tags</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="React"
            className="bg-slate-900 border-slate-600 text-white"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
          />
          <Button type="button" onClick={handleAddTag} variant="outline" className="border-slate-600">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags?.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-slate-700 rounded text-sm text-slate-300 flex items-center gap-1">
              {tag}
              <button onClick={() => handleRemoveTag(tag)} className="text-slate-500 hover:text-red-400">
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300 flex items-center gap-2">
            <Github className="w-4 h-4" />
            GitHub URL
          </Label>
          <Input
            value={formData.github}
            onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
            placeholder="https://github.com/..."
            className="bg-slate-900 border-slate-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Demo URL
          </Label>
          <Input
            value={formData.demo || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, demo: e.target.value || null }))}
            placeholder="https://..."
            className="bg-slate-900 border-slate-600 text-white"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Switch
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
          />
          <Label className="text-slate-300">Featured Project</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={formData.visible !== false}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, visible: checked }))}
          />
          <Label className="text-slate-300">Visible on Portfolio</Label>
        </div>
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
          Save Project
        </Button>
      </div>
    </div>
  );
}

export function ProjectsEditor() {
  const { data, addProject, updateProject, deleteProject } = usePortfolio();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (projectData: Partial<Project>) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData as Omit<Project, 'id'>);
    }
    setEditingProject(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Projects</h2>
          <p className="text-slate-400">Manage your portfolio projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
            <ProjectForm
              project={editingProject || undefined}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects List */}
      <div className="grid gap-4">
        {data.projects.map((project) => (
          <Card key={project.id} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-24 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96x64?text=No+Image';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white flex items-center gap-2 flex-wrap">
                        {project.title}
                        {project.featured && (
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        )}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-2 mt-1">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-300">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 4 && (
                          <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-300">
                            +{project.tags.length - 4}
                          </span>
                        )}
                      </div>
                      {/* Inline Visibility Toggle */}
                      <div className="flex items-center gap-2 mt-3 p-2 bg-slate-900/50 rounded-lg border border-slate-700">
                        {project.visible !== false ? (
                          <Eye className="w-4 h-4 text-green-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-slate-500" />
                        )}
                        <Switch
                          checked={project.visible !== false}
                          onCheckedChange={(checked) => updateProject(project.id, { visible: checked })}
                        />
                        <span className="text-xs text-slate-400">
                          {project.visible !== false ? 'Visible on Portfolio' : 'Hidden from Portfolio'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(project)}
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteProject(project.id)}
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

      {data.projects.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
          <p className="text-slate-400">No projects yet. Add your first project!</p>
        </Card>
      )}
    </div>
  );
}
