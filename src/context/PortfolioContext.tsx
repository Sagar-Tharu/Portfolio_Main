import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import type { PortfolioData, CustomSocialLink } from '@/types/portfolio';
import { defaultPortfolioData } from '@/types/portfolio';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface PortfolioContextType {
  data: PortfolioData;
  saveStatus: SaveStatus;
  updatePersonal: (personal: PortfolioData['personal']) => void;
  updateSocial: (social: PortfolioData['social']) => void;
  updateAbout: (about: PortfolioData['about']) => void;
  updateSkills: (skills: PortfolioData['skills']) => void;
  addProject: (project: Omit<PortfolioData['projects'][0], 'id'>) => void;
  updateProject: (id: number, project: Partial<PortfolioData['projects'][0]>) => void;
  deleteProject: (id: number) => void;
  addExperience: (experience: Omit<PortfolioData['experience'][0], 'id'>) => void;
  updateExperience: (id: number, experience: Partial<PortfolioData['experience'][0]>) => void;
  deleteExperience: (id: number) => void;
  addEducation: (education: Omit<PortfolioData['education'][0], 'id'>) => void;
  updateEducation: (id: number, education: Partial<PortfolioData['education'][0]>) => void;
  deleteEducation: (id: number) => void;
  addCertification: (cert: PortfolioData['certifications'][0]) => void;
  updateCertification: (index: number, cert: PortfolioData['certifications'][0]) => void;
  deleteCertification: (index: number) => void;
  addAchievement: (achievement: PortfolioData['achievements'][0]) => void;
  updateAchievement: (index: number, achievement: PortfolioData['achievements'][0]) => void;
  deleteAchievement: (index: number) => void;
  updateStatusBadge: (statusBadge: PortfolioData['statusBadge']) => void;
  updateSectionVisibility: (sectionVisibility: PortfolioData['sectionVisibility']) => void;
  addCustomSocialLink: (link: Omit<CustomSocialLink, 'id'>) => void;
  updateCustomSocialLink: (id: string, link: Partial<CustomSocialLink>) => void;
  deleteCustomSocialLink: (id: string) => void;
  exportData: () => string;
  importData: (jsonString: string) => void;
  resetData: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);
const STORAGE_KEY = 'portfolio_admin_data';
const REMOTE_API_URL = '/api/portfolio-data';

// ─── Migration helpers ────────────────────────────────────────────────────────

function migratePortfolioData(parsed: Partial<PortfolioData>): PortfolioData {
  const migrateSocial = (social: any) => {
    if (!social) return defaultPortfolioData.social;
    const result: any = {};
    const allPlatforms = [
      'github', 'linkedin', 'twitter', 'leetcode', 'devto',
      'facebook', 'youtube', 'instagram', 'medium', 'stackoverflow',
      'discord', 'telegram', 'whatsapp', 'reddit', 'behance', 'dribbble',
    ];
    for (const key of allPlatforms) {
      if (typeof social[key] === 'string') {
        result[key] = { url: social[key], visible: true };
      } else if (social[key]?.url !== undefined) {
        result[key] = { url: social[key].url, visible: social[key].visible !== false };
      } else {
        result[key] = defaultPortfolioData.social[key as keyof typeof defaultPortfolioData.social];
      }
    }
    return result;
  };

  const migrateSkills = (skills: any) => {
    if (!skills) return defaultPortfolioData.skills;
    const result: any = { ...skills };
    for (const category of ['programming', 'frontend', 'backend', 'tools']) {
      if (Array.isArray(skills[category])) {
        result[category] = skills[category].map((s: any) => ({
          name: s.name,
          level: s.level,
          visible: s.visible !== undefined ? s.visible : true,
        }));
      }
    }
    if (Array.isArray(skills.other)) {
      result.other = skills.other.map((s: any) =>
        typeof s === 'string'
          ? { name: s, visible: true }
          : { name: s.name, visible: s.visible !== false }
      );
    }
    return result;
  };

  const migrateAbout = (about: any) => {
    if (!about) return defaultPortfolioData.about;
    return {
      ...about,
      highlights: (about.highlights || defaultPortfolioData.about.highlights).map((h: any) => ({
        label: h.label,
        value: h.value,
        visible: h.visible !== undefined ? h.visible : true,
        ...(h.dynamic ? { dynamic: h.dynamic } : {}),
      })),
    };
  };

  const migratePersonal = (personal: any) => {
    if (!personal) return defaultPortfolioData.personal;
    const hasResume = personal.resumeUrl && personal.resumeUrl !== '#';
    return {
      ...defaultPortfolioData.personal,
      ...personal,
      showViewResume: personal.showViewResume !== undefined ? personal.showViewResume : hasResume,
      showDownloadResume: personal.showDownloadResume !== undefined ? personal.showDownloadResume : hasResume,
    };
  };

  return {
    ...defaultPortfolioData,
    ...parsed,
    personal: migratePersonal(parsed.personal),
    social: migrateSocial(parsed.social),
    about: migrateAbout(parsed.about),
    skills: migrateSkills(parsed.skills),
    statusBadge: parsed.statusBadge || defaultPortfolioData.statusBadge,
    sectionVisibility: parsed.sectionVisibility
      ? {
          hero:           parsed.sectionVisibility.hero           !== undefined ? parsed.sectionVisibility.hero           : true,
          about:          parsed.sectionVisibility.about          !== undefined ? parsed.sectionVisibility.about          : true,
          skills:         parsed.sectionVisibility.skills         !== undefined ? parsed.sectionVisibility.skills         : true,
          projects:       parsed.sectionVisibility.projects       !== undefined ? parsed.sectionVisibility.projects       : true,
          experience:     parsed.sectionVisibility.experience     !== undefined ? parsed.sectionVisibility.experience     : true,
          contact:        parsed.sectionVisibility.contact        !== undefined ? parsed.sectionVisibility.contact        : true,
          certifications: parsed.sectionVisibility.certifications !== undefined ? parsed.sectionVisibility.certifications : true,
          achievements:   parsed.sectionVisibility.achievements   !== undefined ? parsed.sectionVisibility.achievements   : true,
        }
      : defaultPortfolioData.sectionVisibility,
    projects: parsed.projects?.map((p: any) => ({ ...p, visible: p.visible !== undefined ? p.visible : true })) || defaultPortfolioData.projects,
    experience: parsed.experience?.map((e: any) => ({ ...e, visible: e.visible !== undefined ? e.visible : true })) || defaultPortfolioData.experience,
    education: parsed.education?.map((e: any) => ({ ...e, visible: e.visible !== undefined ? e.visible : true })) || defaultPortfolioData.education,
    certifications: parsed.certifications?.map((c: any) => ({ ...c, visible: c.visible !== undefined ? c.visible : true })) || defaultPortfolioData.certifications,
    achievements: parsed.achievements?.map((a: any) => ({ ...a, visible: a.visible !== undefined ? a.visible : true })) || defaultPortfolioData.achievements,
    customSocialLinks: parsed.customSocialLinks || [],
  };
}

// ─── Persistence ──────────────────────────────────────────────────────────────

/** Write to both localStorage (instant) and the server (permanent). */
async function persistData(data: PortfolioData): Promise<void> {
  // 1. Always write to localStorage immediately
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  // 2. Write to server — this is the permanent store
  const response = await fetch(REMOTE_API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }
}

/** Load from server first; fall back to localStorage, then defaults. */
async function loadData(): Promise<PortfolioData> {
  // Try server first (source of truth)
  try {
    const response = await fetch(REMOTE_API_URL);
    if (response.ok) {
      const serverData = await response.json();
      if (serverData && typeof serverData === 'object') {
        const migrated = migratePortfolioData(serverData);
        // Keep localStorage in sync
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }
  } catch {
    // Network error — fall through to localStorage
  }

  // Try localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return migratePortfolioData(JSON.parse(saved));
    }
  } catch {
    // Corrupted — fall through to defaults
  }

  return defaultPortfolioData;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function PortfolioProvider({ children }: { children: ReactNode }) {
  // Start with localStorage data so there's no flash of empty content
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return migratePortfolioData(JSON.parse(saved));
    } catch { /* ignore */ }
    return defaultPortfolioData;
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // On mount, load the authoritative server data (may update UI after initial render)
  useEffect(() => {
    void loadData().then(setData);
  }, []);

  /**
   * The core save function. All update* helpers call this.
   * - Updates React state immediately (UI is never blocked)
   * - Persists to localStorage + server
   * - Sets saveStatus so UI can show feedback
   */
  const saveData = useCallback(async (newData: PortfolioData) => {
    setData(newData);
    setSaveStatus('saving');

    // Clear any pending "saved → idle" timeout
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    try {
      await persistData(newData);
      setSaveStatus('saved');
      // Reset to idle after 3 s
      saveTimeoutRef.current = setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
      console.error('Failed to save portfolio data:', err);
      toast.error('Save failed — changes kept locally but not on server');
      saveTimeoutRef.current = setTimeout(() => setSaveStatus('idle'), 5000);
    }
  }, []);

  // ── Update helpers ──────────────────────────────────────────────────────────

  const updatePersonal = (personal: PortfolioData['personal']) => {
    void saveData({ ...data, personal });
    toast.success('Personal info saved');
  };

  const updateSocial = (social: PortfolioData['social']) => {
    void saveData({ ...data, social });
    toast.success('Social links saved');
  };

  const updateAbout = (about: PortfolioData['about']) => {
    void saveData({ ...data, about });
    toast.success('About section saved');
  };

  const updateSkills = (skills: PortfolioData['skills']) => {
    void saveData({ ...data, skills });
    toast.success('Skills saved');
  };

  // Projects
  const addProject = (project: Omit<PortfolioData['projects'][0], 'id'>) => {
    const newId = Math.max(0, ...data.projects.map(p => p.id)) + 1;
    void saveData({ ...data, projects: [...data.projects, { ...project, id: newId }] });
    toast.success('Project added');
  };

  const updateProject = (id: number, project: Partial<PortfolioData['projects'][0]>) => {
    void saveData({ ...data, projects: data.projects.map(p => p.id === id ? { ...p, ...project } : p) });
    toast.success('Project updated');
  };

  const deleteProject = (id: number) => {
    void saveData({ ...data, projects: data.projects.filter(p => p.id !== id) });
    toast.success('Project deleted');
  };

  // Experience
  const addExperience = (experience: Omit<PortfolioData['experience'][0], 'id'>) => {
    const newId = Math.max(0, ...data.experience.map(e => e.id)) + 1;
    void saveData({ ...data, experience: [...data.experience, { ...experience, id: newId }] });
    toast.success('Experience added');
  };

  const updateExperience = (id: number, experience: Partial<PortfolioData['experience'][0]>) => {
    void saveData({ ...data, experience: data.experience.map(e => e.id === id ? { ...e, ...experience } : e) });
    toast.success('Experience updated');
  };

  const deleteExperience = (id: number) => {
    void saveData({ ...data, experience: data.experience.filter(e => e.id !== id) });
    toast.success('Experience deleted');
  };

  // Education
  const addEducation = (education: Omit<PortfolioData['education'][0], 'id'>) => {
    const newId = Math.max(0, ...data.education.map(e => e.id)) + 1;
    void saveData({ ...data, education: [...data.education, { ...education, id: newId }] });
    toast.success('Education added');
  };

  const updateEducation = (id: number, education: Partial<PortfolioData['education'][0]>) => {
    void saveData({ ...data, education: data.education.map(e => e.id === id ? { ...e, ...education } : e) });
    toast.success('Education updated');
  };

  const deleteEducation = (id: number) => {
    void saveData({ ...data, education: data.education.filter(e => e.id !== id) });
    toast.success('Education deleted');
  };

  // Certifications
  const addCertification = (cert: PortfolioData['certifications'][0]) => {
    void saveData({ ...data, certifications: [...data.certifications, cert] });
    toast.success('Certification added');
  };

  const updateCertification = (index: number, cert: PortfolioData['certifications'][0]) => {
    void saveData({ ...data, certifications: data.certifications.map((c, i) => i === index ? cert : c) });
    toast.success('Certification updated');
  };

  const deleteCertification = (index: number) => {
    void saveData({ ...data, certifications: data.certifications.filter((_, i) => i !== index) });
    toast.success('Certification deleted');
  };

  // Achievements
  const addAchievement = (achievement: PortfolioData['achievements'][0]) => {
    void saveData({ ...data, achievements: [...data.achievements, achievement] });
    toast.success('Achievement added');
  };

  const updateAchievement = (index: number, achievement: PortfolioData['achievements'][0]) => {
    void saveData({ ...data, achievements: data.achievements.map((a, i) => i === index ? achievement : a) });
    toast.success('Achievement updated');
  };

  const deleteAchievement = (index: number) => {
    void saveData({ ...data, achievements: data.achievements.filter((_, i) => i !== index) });
    toast.success('Achievement deleted');
  };

  // Status Badge
  const updateStatusBadge = (statusBadge: PortfolioData['statusBadge']) => {
    void saveData({ ...data, statusBadge });
    toast.success('Status badge saved');
  };

  // Section Visibility
  const updateSectionVisibility = (sectionVisibility: PortfolioData['sectionVisibility']) => {
    void saveData({ ...data, sectionVisibility });
    toast.success('Section visibility saved');
  };

  // Custom Social Links
  const addCustomSocialLink = (link: Omit<CustomSocialLink, 'id'>) => {
    const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    void saveData({ ...data, customSocialLinks: [...data.customSocialLinks, { ...link, id }] });
    toast.success('Custom social link added');
  };

  const updateCustomSocialLink = (id: string, link: Partial<CustomSocialLink>) => {
    void saveData({
      ...data,
      customSocialLinks: data.customSocialLinks.map(l => l.id === id ? { ...l, ...link } : l),
    });
    toast.success('Custom social link updated');
  };

  const deleteCustomSocialLink = (id: string) => {
    void saveData({ ...data, customSocialLinks: data.customSocialLinks.filter(l => l.id !== id) });
    toast.success('Custom social link deleted');
  };

  // Export / Import / Reset
  const exportData = () => JSON.stringify(data, null, 2);

  const importData = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      void saveData(migratePortfolioData(parsed));
      toast.success('Data imported and saved');
    } catch {
      toast.error('Invalid JSON — import failed');
    }
  };

  const resetData = () => {
    void saveData(defaultPortfolioData);
    toast.success('Data reset to defaults');
  };

  return (
    <PortfolioContext.Provider value={{
      data,
      saveStatus,
      updatePersonal,
      updateSocial,
      updateAbout,
      updateSkills,
      addProject,
      updateProject,
      deleteProject,
      addExperience,
      updateExperience,
      deleteExperience,
      addEducation,
      updateEducation,
      deleteEducation,
      addCertification,
      updateCertification,
      deleteCertification,
      addAchievement,
      updateAchievement,
      deleteAchievement,
      updateStatusBadge,
      updateSectionVisibility,
      addCustomSocialLink,
      updateCustomSocialLink,
      deleteCustomSocialLink,
      exportData,
      importData,
      resetData,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
