import { useState, useRef } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import type { CustomSocialLink } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Github, Linkedin, Twitter, Code2, BookOpen, Facebook, Youtube, Instagram,
  MessageCircle, Hash, Send, Phone, Palette, Dribbble, Eye, EyeOff,
  Plus, Trash2, Pencil, Globe, Link, Star, Heart, Zap, Coffee, Music,
  Camera, Video, FileText, Gamepad2, Tv, Radio, Podcast, ShoppingBag,
  Briefcase, GraduationCap, Award, Trophy, Target, Flame, Rocket, Bot,
  Cpu, Database, Cloud, Shield, Lock, Key, Mail, MapPin, Rss,
} from 'lucide-react';

// ─── Built-in platform definitions ────────────────────────────────────────────
const socialLinks = [
  { key: 'github',        label: 'GitHub',         icon: Github,        placeholder: 'https://github.com/username' },
  { key: 'linkedin',      label: 'LinkedIn',        icon: Linkedin,      placeholder: 'https://linkedin.com/in/username' },
  { key: 'twitter',       label: 'Twitter',         icon: Twitter,       placeholder: 'https://twitter.com/username' },
  { key: 'facebook',      label: 'Facebook',        icon: Facebook,      placeholder: 'https://facebook.com/username' },
  { key: 'youtube',       label: 'YouTube',         icon: Youtube,       placeholder: 'https://youtube.com/@username' },
  { key: 'instagram',     label: 'Instagram',       icon: Instagram,     placeholder: 'https://instagram.com/username' },
  { key: 'medium',        label: 'Medium',          icon: BookOpen,      placeholder: 'https://medium.com/@username' },
  { key: 'devto',         label: 'Dev.to',          icon: BookOpen,      placeholder: 'https://dev.to/username' },
  { key: 'leetcode',      label: 'LeetCode',        icon: Code2,         placeholder: 'https://leetcode.com/username' },
  { key: 'stackoverflow', label: 'Stack Overflow',  icon: Hash,          placeholder: 'https://stackoverflow.com/users/...' },
  { key: 'discord',       label: 'Discord',         icon: MessageCircle, placeholder: 'https://discord.gg/...' },
  { key: 'telegram',      label: 'Telegram',        icon: Send,          placeholder: 'https://t.me/username' },
  { key: 'whatsapp',      label: 'WhatsApp',        icon: Phone,         placeholder: 'https://wa.me/1234567890' },
  { key: 'reddit',        label: 'Reddit',          icon: MessageCircle, placeholder: 'https://reddit.com/user/username' },
  { key: 'behance',       label: 'Behance',         icon: Palette,       placeholder: 'https://behance.net/username' },
  { key: 'dribbble',      label: 'Dribbble',        icon: Dribbble,      placeholder: 'https://dribbble.com/username' },
] as const;


// ─── Lucide icons available for custom links ──────────────────────────────────
export const CUSTOM_ICON_OPTIONS: { name: string; icon: React.ElementType }[] = [
  { name: 'Globe',         icon: Globe },
  { name: 'Link',          icon: Link },
  { name: 'Star',          icon: Star },
  { name: 'Heart',         icon: Heart },
  { name: 'Zap',           icon: Zap },
  { name: 'Coffee',        icon: Coffee },
  { name: 'Music',         icon: Music },
  { name: 'Camera',        icon: Camera },
  { name: 'Video',         icon: Video },
  { name: 'FileText',      icon: FileText },
  { name: 'Gamepad2',      icon: Gamepad2 },
  { name: 'Tv',            icon: Tv },
  { name: 'Radio',         icon: Radio },
  { name: 'Podcast',       icon: Podcast },
  { name: 'ShoppingBag',   icon: ShoppingBag },
  { name: 'Briefcase',     icon: Briefcase },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'Award',         icon: Award },
  { name: 'Trophy',        icon: Trophy },
  { name: 'Target',        icon: Target },
  { name: 'Flame',         icon: Flame },
  { name: 'Rocket',        icon: Rocket },
  { name: 'Bot',           icon: Bot },
  { name: 'Cpu',           icon: Cpu },
  { name: 'Database',      icon: Database },
  { name: 'Cloud',         icon: Cloud },
  { name: 'Shield',        icon: Shield },
  { name: 'Lock',          icon: Lock },
  { name: 'Key',           icon: Key },
  { name: 'Mail',          icon: Mail },
  { name: 'MapPin',        icon: MapPin },
  { name: 'Rss',           icon: Rss },
  { name: 'Code2',         icon: Code2 },
  { name: 'Github',        icon: Github },
  { name: 'Linkedin',      icon: Linkedin },
  { name: 'Twitter',       icon: Twitter },
  { name: 'Youtube',       icon: Youtube },
  { name: 'Instagram',     icon: Instagram },
  { name: 'Facebook',      icon: Facebook },
  { name: 'Dribbble',      icon: Dribbble },
];

/** Render a custom link's icon — lucide component or uploaded image */
export function CustomLinkIcon({
  link, size = 16,
}: { link: Pick<CustomSocialLink, 'icon' | 'iconType'>; size?: number }) {
  if (link.iconType === 'image') {
    return (
      <img
        src={link.icon}
        alt="icon"
        style={{ width: size, height: size }}
        className="object-contain rounded-sm"
      />
    );
  }
  const match = CUSTOM_ICON_OPTIONS.find(o => o.name === link.icon);
  const Icon = match?.icon ?? Globe;
  return <Icon size={size} />;
}


// ─── Add / Edit Custom Link Dialog ────────────────────────────────────────────
const emptyForm = (): Omit<CustomSocialLink, 'id'> => ({
  label: '',
  url: '',
  visible: true,
  icon: 'Globe',
  iconType: 'lucide',
});

function CustomLinkDialog({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial?: CustomSocialLink;
  onClose: () => void;
  onSave: (link: Omit<CustomSocialLink, 'id'>) => void;
}) {
  const [form, setForm] = useState<Omit<CustomSocialLink, 'id'>>(
    initial ? { label: initial.label, url: initial.url, visible: initial.visible, icon: initial.icon, iconType: initial.iconType }
            : emptyForm()
  );
  const [iconTab, setIconTab] = useState<'lucide' | 'image'>(initial?.iconType ?? 'lucide');
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { alert('Image must be under 1 MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      set('icon', reader.result as string);
      set('iconType', 'image');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.label.trim()) { alert('Please enter a label'); return; }
    if (!form.url.trim())   { alert('Please enter a URL'); return; }
    onSave(form);
    onClose();
  };


  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{initial ? 'Edit' : 'Add'} Custom Social Link</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Label */}
          <div className="space-y-1">
            <Label className="text-slate-300 text-sm">Platform Name *</Label>
            <Input value={form.label} onChange={e => set('label', e.target.value)}
              placeholder="e.g. My Blog, Portfolio, Linktree"
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500" />
          </div>

          {/* URL */}
          <div className="space-y-1">
            <Label className="text-slate-300 text-sm">URL *</Label>
            <Input value={form.url} onChange={e => set('url', e.target.value)}
              placeholder="https://..."
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500" />
          </div>

          {/* Icon picker */}
          <div className="space-y-2">
            <Label className="text-slate-300 text-sm">Icon</Label>
            <Tabs value={iconTab} onValueChange={v => { setIconTab(v as 'lucide' | 'image'); set('iconType', v as 'lucide' | 'image'); }}>
              <TabsList className="bg-slate-800 w-full grid grid-cols-2">
                <TabsTrigger value="lucide" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 text-xs">
                  Choose Icon
                </TabsTrigger>
                <TabsTrigger value="image" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 text-xs">
                  Upload Image
                </TabsTrigger>
              </TabsList>

              {/* Lucide grid */}
              <TabsContent value="lucide">
                <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto pr-1 mt-2">
                  {CUSTOM_ICON_OPTIONS.map(({ name, icon: Icon }) => (
                    <button key={name} type="button" title={name}
                      onClick={() => { set('icon', name); set('iconType', 'lucide'); }}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                        form.icon === name && form.iconType === 'lucide'
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
                {form.iconType === 'lucide' && (
                  <p className="text-xs text-slate-500 mt-1">Selected: {form.icon}</p>
                )}
              </TabsContent>

              {/* Image upload */}
              <TabsContent value="image" className="mt-2 space-y-3">
                <div className="flex items-center gap-3">
                  {form.iconType === 'image' && form.icon && (
                    <img src={form.icon} alt="preview"
                      className="w-12 h-12 rounded-lg object-contain bg-slate-800 border border-slate-600 p-1" />
                  )}
                  <Button type="button" variant="outline" size="sm"
                    onClick={() => fileRef.current?.click()}
                    className="border-slate-600 text-slate-300 hover:text-white">
                    Upload PNG / SVG / JPG
                  </Button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
                <p className="text-xs text-slate-500">Max 1 MB. Transparent PNG or SVG recommended.</p>
              </TabsContent>
            </Tabs>
          </div>

          {/* Visibility */}
          <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2">
              {form.visible ? <Eye size={16} className="text-green-400" /> : <EyeOff size={16} className="text-slate-500" />}
              <span className="text-sm text-slate-300">Visible on portfolio</span>
            </div>
            <Switch checked={form.visible} onCheckedChange={v => set('visible', v)} />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300">Cancel</Button>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {initial ? 'Save Changes' : 'Add Link'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


// ─── Main SocialEditor component ─────────────────────────────────────────────
export function SocialEditor() {
  const { data, updateSocial, addCustomSocialLink, updateCustomSocialLink, deleteCustomSocialLink } = usePortfolio();
  const [formData, setFormData] = useState(data.social);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingLink, setEditingLink] = useState<CustomSocialLink | undefined>(undefined);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: { ...prev[field], url: value } }));
  };

  const handleVisibilityChange = (field: keyof typeof formData, visible: boolean) => {
    setFormData(prev => ({ ...prev, [field]: { ...prev[field], visible } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocial(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Social Links</h2>
        <p className="text-slate-400">Connect your social media profiles and control their visibility</p>
      </div>

      {/* ── Built-in platforms ── */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Social Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {socialLinks.map(({ key, label, icon: Icon, placeholder }) => (
                <div key={key} className="space-y-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={key} className="text-slate-300 flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {label}
                    </Label>
                    <div className="flex items-center gap-2">
                      {formData[key].visible
                        ? <Eye className="w-4 h-4 text-green-400" />
                        : <EyeOff className="w-4 h-4 text-slate-500" />}
                      <Switch
                        checked={formData[key].visible}
                        onCheckedChange={checked => handleVisibilityChange(key, checked)}
                      />
                      <span className="text-xs text-slate-400">
                        {formData[key].visible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  <Input
                    id={key}
                    type="url"
                    value={formData[key].url}
                    onChange={e => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                    className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  {!formData[key].visible && formData[key].url && (
                    <Badge variant="secondary" className="bg-slate-700 text-slate-400 text-xs">
                      Hidden on Portfolio
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Custom Links ── */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Custom Links</CardTitle>
              <p className="text-slate-400 text-sm mt-1">Add any platform not listed above</p>
            </div>
            <Button
              type="button"
              onClick={() => setShowAddDialog(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            >
              <Plus size={16} />
              Add Custom Link
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.customSocialLinks.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-700 rounded-xl">
              <Globe className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No custom links yet</p>
              <p className="text-slate-600 text-xs mt-1">Click "Add Custom Link" to add any social or personal link</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {data.customSocialLinks.map(link => (
                <div
                  key={link.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    link.visible
                      ? 'border-indigo-500/30 bg-indigo-500/5'
                      : 'border-slate-700 bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        link.visible ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-400'
                      }`}>
                        <CustomLinkIcon link={link} size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{link.label}</p>
                        <p className="text-slate-500 text-xs truncate">{link.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Switch
                        checked={link.visible}
                        onCheckedChange={v => updateCustomSocialLink(link.id, { visible: v })}
                      />
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => setEditingLink(link)}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => deleteCustomSocialLink(link.id)}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${link.visible ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-700 text-slate-500'}`}
                  >
                    {link.visible ? 'Visible' : 'Hidden'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Preview ── */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Preview (Visible Links Only)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {/* Built-in */}
            {socialLinks.map(({ key, icon: Icon, label }) =>
              formData[key].url && formData[key].visible ? (
                <a key={key} href={formData[key].url} target="_blank" rel="noopener noreferrer"
                  title={label}
                  className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ) : null
            )}
            {/* Custom */}
            {data.customSocialLinks.filter(l => l.visible && l.url).map(link => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                title={link.label}
                className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 transition-all"
              >
                <CustomLinkIcon link={link} size={18} />
              </a>
            ))}
          </div>
          {socialLinks.every(({ key }) => !formData[key].visible || !formData[key].url) &&
            data.customSocialLinks.every(l => !l.visible || !l.url) && (
            <p className="text-slate-500 text-sm">No visible social links</p>
          )}
        </CardContent>
      </Card>

      {/* ── Dialogs ── */}
      <CustomLinkDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSave={link => addCustomSocialLink(link)}
      />
      {editingLink && (
        <CustomLinkDialog
          open={true}
          initial={editingLink}
          onClose={() => setEditingLink(undefined)}
          onSave={link => updateCustomSocialLink(editingLink.id, link)}
        />
      )}
    </div>
  );
}
