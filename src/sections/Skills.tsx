import { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code2, 
  Layout, 
  Server, 
  Wrench, 
  Sparkles,
  Cpu,
  Database,
  GitBranch
} from 'lucide-react';

interface SkillBarProps {
  name: string;
  level: number;
  delay: number;
  isVisible: boolean;
}

function SkillBar({ name, level, delay, isVisible }: SkillBarProps) {
  const [animatedLevel, setAnimatedLevel] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimatedLevel(level);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, level, delay]);

  return (
    <div className="group">
      <div className="flex justify-between mb-2">
        <span className="text-gray-700 dark:text-slate-300 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {name}
        </span>
        <span className="text-gray-500 dark:text-slate-500 text-sm">{level}%</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${animatedLevel}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function Skills() {
  const { data } = usePortfolio();
  const { skills } = data;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const skillCategories = [
    {
      id: 'programming',
      label: 'Languages',
      icon: Code2,
      skills: skills.programming.filter(s => s.visible !== false),
    },
    {
      id: 'frontend',
      label: 'Frontend',
      icon: Layout,
      skills: skills.frontend.filter(s => s.visible !== false),
    },
    {
      id: 'backend',
      label: 'Backend',
      icon: Server,
      skills: skills.backend.filter(s => s.visible !== false),
    },
    {
      id: 'tools',
      label: 'Tools & DevOps',
      icon: Wrench,
      skills: skills.tools.filter(s => s.visible !== false),
    },
  ];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 md:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 relative overflow-hidden transition-colors duration-300"
    >
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 animate-fade-in ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Badge variant="outline" className="mb-4 border-indigo-500/50 text-indigo-600 dark:text-indigo-400 px-4 py-1">
            Skills & Expertise
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Technical <span className="text-indigo-600 dark:text-indigo-400">Proficiency</span>
          </h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            A comprehensive toolkit built through years of learning, building, and problem-solving
          </p>
        </div>

        {/* Skills Tabs */}
        <Tabs defaultValue="programming" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-gray-100 dark:bg-slate-900/50 p-2 mb-8">
            {skillCategories.map(({ id, label, icon: Icon }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-all"
              >
                <Icon size={18} className="mr-2 hidden sm:inline" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {skillCategories.map(({ id, skills: categorySkills }) => (
            <TabsContent key={id} value={id}>
              <Card className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 p-6 md:p-8 shadow-lg animate-fade-in">
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                  {categorySkills.map((skill, index) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      level={skill.level}
                      delay={index * 100}
                      isVisible={isVisible}
                    />
                  ))}
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Other Skills Cloud */}
        <div className={`mt-12 transition-all duration-700 delay-500 animate-fade-in ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center flex items-center justify-center gap-2">
            <Sparkles className="text-indigo-600 dark:text-indigo-400" size={24} />
            Additional Expertise
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.other.filter(skill => skill.visible !== false).map((skill, index) => (
              <Badge
                key={skill.name}
                variant="secondary"
                className="bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 px-4 py-2 text-sm cursor-default transition-all duration-300 shadow-sm animate-scale-in"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tech Stack Icons */}
        <div className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { icon: Code2, label: 'Clean Code', desc: 'Best practices & patterns' },
            { icon: Cpu, label: 'Performance', desc: 'Optimized solutions' },
            { icon: Database, label: 'Scalable', desc: 'Cloud-native architecture' },
            { icon: GitBranch, label: 'Collaboration', desc: 'Team-oriented workflow' },
          ].map(({ icon: Icon, label, desc }) => (
            <Card
              key={label}
              className="bg-white/80 dark:bg-slate-800/30 border-gray-200 dark:border-slate-700/50 p-6 text-center hover:bg-white dark:hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all group shadow-md animate-fade-in"
            >
              <Icon className="mx-auto mb-3 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" size={32} />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{label}</h4>
              <p className="text-sm text-gray-600 dark:text-slate-500">{desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
