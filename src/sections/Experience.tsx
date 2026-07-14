import { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  MapPin,
  ChevronRight,
  Award
} from 'lucide-react';

export function Experience() {
  const { data } = usePortfolio();
  const { experience, education } = data;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');

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

  const items = activeTab === 'experience' 
    ? experience.filter(e => e.visible !== false)
    : education.filter(e => e.visible !== false);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-24 md:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 relative overflow-hidden transition-colors duration-300"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100/30 via-white to-gray-100/30 dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-900/50" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 animate-fade-in ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Badge variant="outline" className="mb-4 border-indigo-500/50 text-indigo-600 dark:text-indigo-400 px-4 py-1">
            Journey
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Experience & <span className="text-indigo-600 dark:text-indigo-400">Education</span>
          </h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            My professional journey and academic background
          </p>
        </div>

        {/* Tabs */}
        <div className={`flex justify-center gap-4 mb-12 transition-all duration-700 delay-200 animate-fade-in ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={() => setActiveTab('experience')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'experience'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
            }`}
          >
            <Briefcase size={20} />
            Experience
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'education'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
            }`}
          >
            <GraduationCap size={20} />
            Education
          </button>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent md:-translate-x-1/2" />

          {/* Timeline Items */}
          <div className="space-y-8">
            {items.map((item, index) => {
              const isExperience = 'role' in item;
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={item.id}
                  className={`relative flex items-start gap-8 transition-all duration-700 animate-fade-in ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 150 + 400}ms` }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white dark:border-slate-950 md:-translate-x-1/2 z-10">
                    <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-50" />
                  </div>

                  {/* Content Card */}
                  <div className={`ml-12 md:ml-0 md:w-5/12 ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <Card className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 p-6 hover:border-indigo-500/50 transition-all group shadow-lg">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {isExperience ? item.role : item.degree}
                          </h3>
                          <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                            {isExperience ? item.company : item.institution}
                          </p>
                        </div>
                        {isExperience && (
                          <Briefcase className="text-gray-400 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" size={24} />
                        )}
                        {!isExperience && (
                          <GraduationCap className="text-gray-400 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" size={24} />
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-slate-400 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {item.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {item.location}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Highlights / Achievements */}
                      {'highlights' in item && item.highlights && (
                        <div className="space-y-2">
                          {item.highlights.map((highlight, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                              <ChevronRight size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {'achievements' in item && item.achievements && (
                        <div className="space-y-2">
                          {item.achievements.map((achievement, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                              <Award size={16} className="text-yellow-500 dark:text-yellow-400 shrink-0 mt-0.5" />
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* GPA for education */}
                      {'gpa' in item && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                          <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                            GPA: {item.gpa}
                          </Badge>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
