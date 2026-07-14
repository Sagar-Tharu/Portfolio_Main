// Portfolio Types

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  resumeUrl: string;
  showViewResume: boolean;
  showDownloadResume: boolean;
}

export interface StatusBadge {
  enabled: boolean;
  text: string;
  color: 'green' | 'blue' | 'purple' | 'yellow' | 'red' | 'indigo';
  description: string;
}

export interface SectionVisibility {
  hero: boolean;
  about: boolean;
  skills: boolean;
  projects: boolean;
  experience: boolean;
  contact: boolean;
  certifications: boolean;
  achievements: boolean;
}

export interface SocialLink {
  url: string;
  visible: boolean;
}

export interface CustomSocialLink {
  id: string;
  label: string;
  url: string;
  visible: boolean;
  /** Either a lucide icon name from the CUSTOM_ICON_OPTIONS list, or a base64 image string */
  icon: string;
  /** 'lucide' = use lucide icon by name, 'image' = use uploaded image */
  iconType: 'lucide' | 'image';
}

export interface SocialLinks {
  github: SocialLink;
  linkedin: SocialLink;
  twitter: SocialLink;
  leetcode: SocialLink;
  devto: SocialLink;
  facebook: SocialLink;
  youtube: SocialLink;
  instagram: SocialLink;
  medium: SocialLink;
  stackoverflow: SocialLink;
  discord: SocialLink;
  telegram: SocialLink;
  whatsapp: SocialLink;
  reddit: SocialLink;
  behance: SocialLink;
  dribbble: SocialLink;
}

export interface AboutHighlight {
  label: string;
  value: string;
  visible: boolean;
  /** If set, the value is auto-computed from data instead of manually entered */
  dynamic?: 'projects' | 'certifications' | 'languages';
}

export interface AboutInfo {
  description: string;
  image: string;
  highlights: AboutHighlight[];
}

export interface Skill {
  name: string;
  level: number;
  visible: boolean;
}

export interface OtherSkill {
  name: string;
  visible: boolean;
}

export interface SkillsData {
  programming: Skill[];
  frontend: Skill[];
  backend: Skill[];
  tools: Skill[];
  other: OtherSkill[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  demo: string | null;
  featured: boolean;
  visible: boolean;
}

export interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
  visible: boolean;
}

export interface EducationItem {
  id: number;
  degree: string;
  institution: string;
  location: string;
  period: string;
  gpa: string;
  description: string;
  achievements: string[];
  visible: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url: string;
  visible: boolean;
}

export interface Achievement {
  title: string;
  description: string;
  visible: boolean;
}

export interface PortfolioData {
  personal: PersonalInfo;
  social: SocialLinks;
  customSocialLinks: CustomSocialLink[];
  about: AboutInfo;
  skills: SkillsData;
  projects: Project[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: Certification[];
  achievements: Achievement[];
  statusBadge: StatusBadge;
  sectionVisibility: SectionVisibility;
}

// Default/Initial data
export const defaultPortfolioData: PortfolioData = {
  personal: {
    name: "Sagar Tharu",
    title: "Computer Science & Engineering Student",
    tagline: "Building the future, one line of code at a time",
    email: "tharusagar176@gmail.com",
    phone: "+977-9826418848",
    location: "Rupandehi, Nepal",
    website: "port.sagar",
    resumeUrl: "#",
    showViewResume: true,
    showDownloadResume: true,
  },
  social: {
    github: { url: "https://github.com/sagartharu", visible: true },
    linkedin: { url: "https://linkedin.com/in/sagartharu", visible: true },
    twitter: { url: "https://twitter.com/sagartharu", visible: true },
    leetcode: { url: "https://leetcode.com/sagartharu", visible: true },
    devto: { url: "https://dev.to/sagartharu", visible: true },
    facebook: { url: "", visible: false },
    youtube: { url: "", visible: false },
    instagram: { url: "", visible: false },
    medium: { url: "", visible: false },
    stackoverflow: { url: "", visible: false },
    discord: { url: "", visible: false },
    telegram: { url: "", visible: false },
    whatsapp: { url: "", visible: false },
    reddit: { url: "", visible: false },
    behance: { url: "", visible: false },
    dribbble: { url: "", visible: false },
  },
  customSocialLinks: [],
  about: {
    description: `I'm a passionate Computer Science & Engineering student with a strong foundation in algorithms, data structures, and software engineering principles. I love solving complex problems and building innovative solutions that make a difference.

My journey in tech started when I built my first website at 15, and since then, I've been hooked on creating things with code. I'm particularly interested in full-stack development, artificial intelligence, and distributed systems.

When I'm not coding, you'll find me contributing to open-source projects, participating in hackathons, or exploring the latest tech trends.`,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    highlights: [
      { label: "CGPA", value: "8/10", visible: true },
      { label: "Projects", value: "25+", visible: true, dynamic: "projects" as const },
      { label: "Hackathons", value: "8", visible: true },
      { label: "Certifications", value: "5", visible: true, dynamic: "certifications" as const },
    ],
  },
  skills: {
    programming: [
      { name: "Python", level: 95, visible: true },
      { name: "JavaScript/TypeScript", level: 90, visible: true },
      { name: "Java", level: 85, visible: true },
      { name: "C/C++", level: 80, visible: true },
      { name: "Go", level: 70, visible: true },
      { name: "Rust", level: 65, visible: true },
    ],
    frontend: [
      { name: "React", level: 92, visible: true },
      { name: "Next.js", level: 88, visible: true },
      { name: "Vue.js", level: 75, visible: true },
      { name: "Tailwind CSS", level: 90, visible: true },
      { name: "HTML/CSS", level: 95, visible: true },
    ],
    backend: [
      { name: "Node.js", level: 88, visible: true },
      { name: "Express.js", level: 85, visible: true },
      { name: "Django", level: 80, visible: true },
      { name: "FastAPI", level: 82, visible: true },
      { name: "PostgreSQL", level: 85, visible: true },
      { name: "MongoDB", level: 78, visible: true },
    ],
    tools: [
      { name: "Git/GitHub", level: 92, visible: true },
      { name: "Docker", level: 85, visible: true },
      { name: "AWS", level: 80, visible: true },
      { name: "Kubernetes", level: 70, visible: true },
      { name: "CI/CD", level: 78, visible: true },
      { name: "Linux", level: 88, visible: true },
    ],
    other: [
      { name: "Machine Learning", visible: true },
      { name: "Data Structures", visible: true },
      { name: "Algorithms", visible: true },
      { name: "System Design", visible: true },
      { name: "REST APIs", visible: true },
      { name: "GraphQL", visible: true },
      { name: "WebSockets", visible: true },
      { name: "Microservices", visible: true },
    ],
  },
  projects: [
    {
      id: 1,
      title: "AI-Powered Code Reviewer",
      description: "An intelligent code review tool that uses LLMs to analyze code quality, detect bugs, and suggest improvements.",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=500&fit=crop",
      tags: ["Python", "OpenAI", "FastAPI", "React", "PostgreSQL"],
      github: "https://github.com/alexchen/ai-code-reviewer",
      demo: "https://ai-reviewer.demo",
      featured: true,
      visible: true,
    },
    {
      id: 2,
      title: "Distributed Task Queue",
      description: "A high-performance distributed task queue system built from scratch.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop",
      tags: ["Go", "Redis", "gRPC", "Docker", "Kubernetes"],
      github: "https://github.com/alexchen/task-queue",
      demo: null,
      featured: true,
      visible: true,
    },
  ],
  experience: [
    {
      id: 1,
      role: "Software Engineering Intern",
      company: "Google",
      location: "Mountain View, CA",
      period: "May 2024 - Aug 2024",
      description: "Worked on the Cloud Infrastructure team, developing distributed systems for resource allocation.",
      highlights: [
        "Built a predictive scaling system using ML models",
        "Reduced cloud resource costs by $2M annually",
      ],
      visible: true,
    },
  ],
  education: [
    {
      id: 1,
      degree: "B.S. in Computer Science & Engineering",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      period: "2021 - 2025 (Expected)",
      gpa: "3.9/4.0",
      description: "Dean's List, Computer Science Honors Program.",
      achievements: [
        "Teaching Assistant for CS 170 (Algorithms)",
        "President of ACM Student Chapter",
      ],
      visible: true,
    },
  ],
  certifications: [
    { name: "AWS Solutions Architect", issuer: "Amazon Web Services", date: "2024", url: "#", visible: true },
    { name: "Google Cloud Professional", issuer: "Google Cloud", date: "2024", url: "#", visible: true },
  ],
  achievements: [
    { title: "1st Place - CalHacks 2023", description: "Built an AI-powered accessibility tool", visible: true },
    { title: "Google Code Jam Finalist", description: "Ranked in top 1000 globally", visible: true },
  ],
  statusBadge: {
    enabled: true,
    text: "Available for opportunities",
    color: "green",
    description: "I'm currently looking for software engineering internships and full-time opportunities. Let's discuss how I can contribute to your team!",
  },
  sectionVisibility: {
    hero: true,
    about: true,
    skills: true,
    projects: true,
    experience: true,
    contact: true,
    certifications: true,
    achievements: true,
  },
};
