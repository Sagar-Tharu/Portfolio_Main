import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit2, Award, ExternalLink, Eye, EyeOff } from 'lucide-react';
import type { Certification } from '@/types/portfolio';

interface CertificationFormProps {
  certification?: Certification;
  onSave: (cert: Certification) => void;
  onCancel: () => void;
}

function CertificationForm({ certification, onSave, onCancel }: CertificationFormProps) {
  const [formData, setFormData] = useState<Certification>(certification || {
    name: '',
    issuer: '',
    date: '',
    url: '',
    visible: true,
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-slate-300">Certification Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="AWS Solutions Architect"
          className="bg-slate-900 border-slate-600 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">Issuing Organization</Label>
        <Input
          value={formData.issuer}
          onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
          placeholder="Amazon Web Services"
          className="bg-slate-900 border-slate-600 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Date</Label>
          <Input
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            placeholder="2024"
            className="bg-slate-900 border-slate-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-300">Certificate URL</Label>
          <Input
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://..."
            className="bg-slate-900 border-slate-600 text-white"
          />
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
          disabled={!formData.name || !formData.issuer}
        >
          Save Certification
        </Button>
      </div>
    </div>
  );
}

export function CertificationsEditor() {
  const { data, addCertification, updateCertification, deleteCertification } = usePortfolio();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (certData: Certification) => {
    if (editingIndex !== null) {
      updateCertification(editingIndex, certData);
    } else {
      addCertification(certData);
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
          <h2 className="text-2xl font-bold text-white mb-2">Certifications</h2>
          <p className="text-slate-400">Manage your professional certifications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingIndex !== null ? 'Edit Certification' : 'Add New Certification'}</DialogTitle>
            </DialogHeader>
            <CertificationForm
              certification={editingIndex !== null ? data.certifications[editingIndex] : undefined}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Certifications List */}
      <div className="grid md:grid-cols-2 gap-4">
        {data.certifications.map((cert, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white">{cert.name}</h3>
                      <p className="text-yellow-400 text-sm">{cert.issuer}</p>
                      <p className="text-slate-500 text-sm">{cert.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <Button
                      onClick={() => handleEdit(index)}
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteCertification(index)}
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
                  {cert.visible !== false ? (
                    <Eye className="w-4 h-4 text-green-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-slate-500" />
                  )}
                  <Switch
                    checked={cert.visible !== false}
                    onCheckedChange={(checked) => updateCertification(index, { ...cert, visible: checked })}
                  />
                  <span className="text-xs text-slate-400">
                    {cert.visible !== false ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.certifications.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
          <p className="text-slate-400">No certifications added yet.</p>
        </Card>
      )}
    </div>
  );
}
