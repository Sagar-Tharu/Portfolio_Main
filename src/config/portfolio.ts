// Portfolio Configuration - Edit this file to customize your portfolio

export const portfolioConfig = {
  // Personal Info
  personal: {
    name: "Sagar Tharu",
    title: "Computer Science & Engineering Student",
    tagline: "Building the future, one line of code at a time",
    email: "tharusagar176@gmail.com",
    phone: "+977-9826418848",
    location: "Rupandehi, Nepal",
    website: "port.sagar",
    resumeUrl: "#",
  },

  // Social Links
  social: {
    github: "https://github.com/sagartharu",
    linkedin: "https://linkedin.com/in/sagartharu",
    twitter: "https://twitter.com/sagartharu",
    leetcode: "https://leetcode.com/sagartharu",
    devto: "https://dev.to/sagartharu",
  },

  // About Section
  about: {
    description: `I'm a passionate Computer Science & Engineering student with a strong foundation in algorithms, data structures, and software engineering principles. I love solving complex problems and building innovative solutions that make a difference.

My journey in tech started when I built my first website at 15, and since then, I've been hooked on creating things with code. I'm particularly interested in full-stack development, artificial intelligence, and distributed systems.

When I'm not coding, you'll find me contributing to open-source projects, participating in hackathons, or exploring the latest tech trends.`,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    highlights: [
      { label: "CGPA", value: "8/10" },
      { label: "Projects", value: "25+" },
      { label: "Hackathons", value: "8" },
      { label: "Certifications", value: "5" },
    ],
  },

  // Skills
  skills: {
    programming: [
      { name: "Python", level: 95 },
      { name: "JavaScript/TypeScript", level: 90 },
      { name: "Java", level: 85 },
      { name: "C/C++", level: 80 },
      { name: "Go", level: 70 },
      { name: "Rust", level: 65 },
    ],
    frontend: [
      { name: "React", level: 92 },
      { name: "Next.js", level: 88 },
      { name: "Vue.js", level: 75 },
      { name: "Tailwind CSS", level: 90 },
      { name: "HTML/CSS", level: 95 },
    ],
    backend: [
      { name: "Node.js", level: 88 },
      { name: "Express.js", level: 85 },
      { name: "Django", level: 80 },
      { name: "FastAPI", level: 82 },
      { name: "PostgreSQL", level: 85 },
      { name: "MongoDB", level: 78 },
    ],
    tools: [
      { name: "Git/GitHub", level: 92 },
      { name: "Docker", level: 85 },
      { name: "AWS", level: 80 },
      { name: "Kubernetes", level: 70 },
      { name: "CI/CD", level: 78 },
      { name: "Linux", level: 88 },
    ],
    other: [
      "Machine Learning",
      "Data Structures",
      "Algorithms",
      "System Design",
      "REST APIs",
      "GraphQL",
      "WebSockets",
      "Microservices",
    ],
  },

  // Projects
  projects: [
    {
      id: 1,
      title: "AI-Powered Code Reviewer",
      description: "An intelligent code review tool that uses LLMs to analyze code quality, detect bugs, and suggest improvements. Features include automated PR reviews, security vulnerability detection, and performance optimization suggestions.",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=500&fit=crop",
      tags: ["Python", "OpenAI", "FastAPI", "React", "PostgreSQL"],
      github: "https://github.com/alexchen/ai-code-reviewer",
      demo: "https://ai-reviewer.demo",
      featured: true,
    },
    {
      id: 2,
      title: "Distributed Task Queue",
      description: "A high-performance distributed task queue system built from scratch. Supports job scheduling, retry logic, priority queues, and horizontal scaling. Handles 10,000+ tasks per second.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop",
      tags: ["Go", "Redis", "gRPC", "Docker", "Kubernetes"],
      github: "https://github.com/alexchen/task-queue",
      demo: null,
      featured: true,
    },
    {
      id: 3,
      title: "Real-time Collaborative IDE",
      description: "A browser-based code editor with real-time collaboration features. Supports multiple programming languages, live cursor tracking, video chat, and intelligent code completion.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop",
      tags: ["TypeScript", "WebSockets", "Monaco Editor", "Node.js", "MongoDB"],
      github: "https://github.com/alexchen/collab-ide",
      demo: "https://collab-ide.demo",
      featured: true,
    },
    {
      id: 4,
      title: "Machine Learning Visualizer",
      description: "Interactive visualization tool for machine learning algorithms. Users can see how different algorithms work step-by-step, from linear regression to neural networks.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
      tags: ["Python", "TensorFlow", "D3.js", "Flask", "React"],
      github: "https://github.com/alexchen/ml-viz",
      demo: "https://ml-viz.demo",
      featured: false,
    },
    {
      id: 5,
      title: "Blockchain Voting System",
      description: "Secure and transparent voting system built on Ethereum. Features include voter authentication, encrypted ballots, and real-time result tallying.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=500&fit=crop",
      tags: ["Solidity", "Ethereum", "Web3.js", "React", "Node.js"],
      github: "https://github.com/alexchen/blockchain-vote",
      demo: null,
      featured: false,
    },
    {
      id: 6,
      title: "Smart Home IoT Platform",
      description: "Full-stack IoT platform for smart home management. Includes device control, automation rules, energy monitoring, and mobile app integration.",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=500&fit=crop",
      tags: ["React Native", "MQTT", "Node.js", "InfluxDB", "Raspberry Pi"],
      github: "https://github.com/alexchen/smart-home",
      demo: "https://smart-home.demo",
      featured: false,
    },
  ],

  // Experience
  experience: [
    {
      id: 1,
      role: "Software Engineering Intern",
      company: "Google",
      location: "Mountain View, CA",
      period: "May 2024 - Aug 2024",
      description: "Worked on the Cloud Infrastructure team, developing distributed systems for resource allocation. Improved system efficiency by 30% through optimized algorithms.",
      highlights: [
        "Built a predictive scaling system using ML models",
        "Reduced cloud resource costs by $2M annually",
        "Collaborated with 15+ engineers across 3 teams",
      ],
    },
    {
      id: 2,
      role: "Full Stack Developer",
      company: "TechStart Inc.",
      location: "Remote",
      period: "Jan 2024 - Apr 2024",
      description: "Led development of a SaaS platform serving 10,000+ users. Implemented real-time features and optimized database queries for better performance.",
      highlights: [
        "Built RESTful APIs serving 1M+ requests/day",
        "Implemented CI/CD pipeline reducing deployment time by 70%",
        "Mentored 3 junior developers",
      ],
    },
    {
      id: 3,
      role: "Research Assistant",
      company: "University AI Lab",
      location: "San Francisco, CA",
      period: "Sep 2023 - Dec 2023",
      description: "Conducted research on natural language processing and transformer architectures. Published 2 papers at top-tier conferences.",
      highlights: [
        "Developed novel attention mechanism improving accuracy by 15%",
        "Co-authored paper accepted at NeurIPS 2023",
        "Built large-scale dataset with 10M+ samples",
      ],
    },
  ],

  // Education
  education: [
    {
      id: 1,
      degree: "B.S. in Computer Science & Engineering",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      period: "2021 - 2025 (Expected)",
      gpa: "3.9/4.0",
      description: "Dean's List, Computer Science Honors Program. Relevant coursework: Algorithms, Data Structures, Operating Systems, Distributed Systems, Machine Learning.",
      achievements: [
        "Teaching Assistant for CS 170 (Algorithms)",
        "President of ACM Student Chapter",
        "Winner of CalHacks 2023",
      ],
    },
  ],

  // Certifications
  certifications: [
    {
      name: "AWS Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2024",
      url: "#",
    },
    {
      name: "Google Cloud Professional",
      issuer: "Google Cloud",
      date: "2024",
      url: "#",
    },
    {
      name: "TensorFlow Developer",
      issuer: "Google",
      date: "2023",
      url: "#",
    },
  ],

  // Achievements
  achievements: [
    {
      title: "1st Place - CalHacks 2023",
      description: "Built an AI-powered accessibility tool for visually impaired users",
    },
    {
      title: "Google Code Jam Finalist",
      description: "Ranked in top 1000 globally among 50,000+ participants",
    },
    {
      title: "ICPC Regional Champion",
      description: "Won 1st place at ICPC Pacific Northwest Regional Contest",
    },
  ],
};

export type PortfolioConfig = typeof portfolioConfig;
