import { useEffect, useRef, useState, useMemo } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Download,
  GraduationCap,
  Award,
  Trophy,
  Target,
  Eye,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  Instagram,
  Code2,
  BookOpen,
  MessageCircle,
  Hash,
  Send,
  Phone as PhoneIcon,
  Palette,
  Dribbble,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CustomLinkIcon } from '@/components/admin/SocialEditor';

// Map platform key → icon + brand color
const SOCIAL_META: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  github:        { icon: Github,        color: 'hover:bg-gray-700 hover:text-white',        label: 'GitHub' },
  linkedin:      { icon: Linkedin,      color: 'hover:bg-blue-600 hover:text-white',        label: 'LinkedIn' },
  twitter:       { icon: Twitter,       color: 'hover:bg-sky-500 hover:text-white',         label: 'Twitter' },
  facebook:      { icon: Facebook,      color: 'hover:bg-blue-700 hover:text-white',        label: 'Facebook' },
  youtube:       { icon: Youtube,       color: 'hover:bg-red-600 hover:text-white',         label: 'YouTube' },
  instagram:     { icon: Instagram,     color: 'hover:bg-pink-600 hover:text-white',        label: 'Instagram' },
  medium:        { icon: BookOpen,      color: 'hover:bg-green-600 hover:text-white',       label: 'Medium' },
  devto:         { icon: BookOpen,      color: 'hover:bg-slate-800 hover:text-white',       label: 'Dev.to' },
  leetcode:      { icon: Code2,         color: 'hover:bg-yellow-500 hover:text-black',      label: 'LeetCode' },
  stackoverflow: { icon: Hash,          color: 'hover:bg-orange-500 hover:text-white',      label: 'Stack Overflow' },
  discord:       { icon: MessageCircle, color: 'hover:bg-indigo-600 hover:text-white',      label: 'Discord' },
  telegram:      { icon: Send,          color: 'hover:bg-sky-500 hover:text-white',         label: 'Telegram' },
  whatsapp:      { icon: PhoneIcon,     color: 'hover:bg-green-500 hover:text-white',       label: 'WhatsApp' },
  reddit:        { icon: MessageCircle, color: 'hover:bg-orange-600 hover:text-white',      label: 'Reddit' },
  behance:       { icon: Palette,       color: 'hover:bg-blue-600 hover:text-white',        label: 'Behance' },
  dribbble:      { icon: Dribbble,      color: 'hover:bg-pink-500 hover:text-white',        label: 'Dribbble' },
};

export function About() {
  const { data } = usePortfolio();
  const { personal, about, social, certifications, achievements } = data;
  // also pull custom links
  const customSocialLinks = data.customSocialLinks ?? [];
  const { certifications: showCerts, achievements: showAchievements } = data.sectionVisibility;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleDownloadResume = () => {
    if (personal.resumeUrl) {
      // Check if it's a base64 PDF
      if (personal.resumeUrl.startsWith('data:application/pdf')) {
        // Create a download link for base64 PDF
        const link = document.createElement('a');
        link.href = personal.resumeUrl;
        link.download = `${personal.name.replace(/\s+/g, '_')}_Resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Open URL in new tab
        window.open(personal.resumeUrl, '_blank');
      }
    }
  };

  const handleViewResume = () => {
    setShowResumeDialog(true);
  };

  // Build a toolbar-free PDF URL.
  // For base64 PDFs → convert to a Blob URL so we can append #toolbar=0.
  // For external URLs → append the fragment directly.
  const cleanResumeUrl = useMemo(() => {
    if (!personal.resumeUrl || personal.resumeUrl === '#') return '';
    if (personal.resumeUrl.startsWith('data:application/pdf')) {
      // Convert base64 → Blob URL
      try {
        const base64 = personal.resumeUrl.split(',')[1];
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: 'application/pdf' });
        return URL.createObjectURL(blob) + '#toolbar=0&navpanes=0&scrollbar=0';
      } catch {
        return personal.resumeUrl;
      }
    }
    // External URL — append fragment to disable toolbar
    return personal.resumeUrl + '#toolbar=0&navpanes=0&scrollbar=0';
  }, [personal.resumeUrl]);
  // Visible social links from admin panel
  const visibleSocialLinks = Object.entries(social)
    .filter(([, link]) => link.visible && link.url && link.url.trim() !== '')
    .map(([key, link]) => ({ key, url: link.url, ...SOCIAL_META[key] }))
    .filter(item => item.icon); // skip unknown keys

  // Visible custom links
  const visibleCustomLinks = customSocialLinks.filter(l => l.visible && l.url && l.url.trim() !== '');

  const hasResume = Boolean(personal.resumeUrl && personal.resumeUrl !== '#');
  const showViewResume = hasResume && personal.showViewResume !== false;
  const showDownloadResume = hasResume && personal.showDownloadResume !== false;
  const showResumeButtons = showViewResume || showDownloadResume;

  const formatWebsite = (url: string) => url.replace(/^https?:\/\//, '');
  const getWebsiteHref = (url: string) =>
    url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 relative overflow-hidden transition-colors duration-300"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 animate-fade-in ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Badge variant="outline" className="mb-4 border-indigo-500/50 text-indigo-600 dark:text-indigo-400 px-4 py-1">
            About Me
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Let Me <span className="text-indigo-600 dark:text-indigo-400">Introduce</span> Myself
          </h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            A passionate Computer Science & Engineering student dedicated to building innovative solutions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Image & Quick Info */}
          <div className={`space-y-6 transition-all duration-700 delay-200 animate-slide-in-left ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* Profile Card */}
            <Card className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 overflow-hidden shadow-lg">
              <div className="relative">
                {/* Cover Image */}
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600" />
                
                {/* Profile Image */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden bg-gray-200 dark:bg-slate-700">
                    <img
                      src={about.image}
                      alt={personal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-20 pb-6 px-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{personal.name}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 mb-4">{personal.title}</p>

                {/* Contact Info */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
                    <MapPin size={18} className="text-indigo-600 dark:text-indigo-400" />
                    <span>{personal.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
                    <Mail size={18} className="text-indigo-600 dark:text-indigo-400" />
                    <a href={`mailto:${personal.email}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {personal.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
                    <Phone size={18} className="text-indigo-600 dark:text-indigo-400" />
                    <span>{personal.phone}</span>
                  </div>
                  {personal.website && (
                    <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
                      <Globe size={18} className="text-indigo-600 dark:text-indigo-400" />
                      <a href={getWebsiteHref(personal.website)} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {formatWebsite(personal.website)}
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {(visibleSocialLinks.length > 0 || visibleCustomLinks.length > 0) && (
                  <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                    <p className="text-xs text-gray-500 dark:text-slate-500 mb-3 font-medium uppercase tracking-wider">
                      Find me on
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {/* Built-in social links */}
                      {visibleSocialLinks.map(({ key, url, icon: Icon, color, label }) => (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={label}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700/60 transition-all duration-200 ${color}`}
                        >
                          <Icon size={16} />
                        </a>
                      ))}
                      {/* Custom social links */}
                      {visibleCustomLinks.map(link => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={link.label}
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700/60 hover:bg-indigo-600 hover:text-white transition-all duration-200"
                        >
                          <CustomLinkIcon link={link} size={16} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resume Buttons */}
                {showResumeButtons && (
                  <div className="space-y-3 mt-6">
                    {showViewResume && (
                      <Button 
                        onClick={handleViewResume}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Eye size={18} className="mr-2" />
                        View Resume
                      </Button>
                    )}
                    {showDownloadResume && (
                      <Button 
                        onClick={handleDownloadResume}
                        variant="outline"
                        className="w-full border-gray-300 dark:border-slate-600"
                      >
                        <Download size={18} className="mr-2" />
                        Download Resume
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {about.highlights.filter(stat => stat.visible !== false).map((stat, index) => {
                // Compute live value for dynamic highlights
                let displayValue = stat.value;
                if (stat.dynamic === 'projects') {
                  displayValue = `${data.projects.filter(p => p.visible !== false).length}+`;
                } else if (stat.dynamic === 'certifications') {
                  displayValue = String(data.certifications.filter(c => c.visible !== false).length);
                } else if (stat.dynamic === 'languages') {
                  displayValue = `${data.skills.programming.filter(s => s.visible !== false).length}+`;
                }
                return (
                  <Card
                    key={stat.label}
                    className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 p-4 text-center hover:border-indigo-500/50 transition-all duration-300 group shadow-md animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      {displayValue}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">{stat.label}</div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Right Column - Bio & Details */}
          <div className={`space-y-8 transition-all duration-700 delay-400 animate-slide-in-right ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {/* Bio */}
            <div className="prose prose-invert max-w-none">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="text-indigo-600 dark:text-indigo-400" size={24} />
                My Story
              </h3>
              <div className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {about.description}
              </div>
            </div>

            {/* Certifications */}
            {showCerts && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <GraduationCap className="text-indigo-600 dark:text-indigo-400" size={24} />
                Certifications
              </h3>
              <div className="space-y-3">
                {certifications.filter(cert => cert.visible !== false).map((cert) => (
                  <Card
                    key={cert.name}
                    className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 p-4 flex items-center justify-between hover:border-indigo-500/50 transition-all cursor-pointer group shadow-md animate-fade-in"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                        <Award className="text-indigo-600 dark:text-indigo-400" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {cert.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400">{cert.issuer} • {cert.date}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            )}

            {/* Achievements */}
            {showAchievements && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Trophy className="text-indigo-600 dark:text-indigo-400" size={24} />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.filter(achievement => achievement.visible !== false).map((achievement) => (
                  <Card
                    key={achievement.title}
                    className="bg-gradient-to-r from-white to-gray-50 dark:from-slate-800/50 dark:to-slate-800/30 border-gray-200 dark:border-slate-700 p-4 hover:border-yellow-500/50 transition-all shadow-md animate-fade-in"
                  >
                    <div className="flex items-start gap-3">
                      <Trophy className="text-yellow-500 dark:text-yellow-400 shrink-0 mt-1" size={18} />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400">{achievement.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Resume Viewer Dialog */}
      <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <DialogContent className="max-w-5xl h-[90vh] bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="flex items-center gap-2">
                <Eye className="text-indigo-600 dark:text-indigo-400" size={24} />
                Resume Preview
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950">
            <embed
              src={cleanResumeUrl}
              type="application/pdf"
              className="w-full h-full"
              title="Resume Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
