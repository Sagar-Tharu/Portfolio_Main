import { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Github, 
  ExternalLink, 
  Star,
  ArrowRight,
  Layers
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  demo: string | null;
  featured: boolean;
}

export function Projects() {
  const { data } = usePortfolio();
  const { projects, social } = data;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

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

  const filteredProjects = filter === 'featured' 
    ? projects.filter(p => p.featured && p.visible !== false)
    : projects.filter(p => p.visible !== false);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-24 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 relative overflow-hidden transition-colors duration-300"
    >
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/15 dark:bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 animate-fade-in ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Badge variant="outline" className="mb-4 border-indigo-500/50 text-indigo-600 dark:text-indigo-400 px-4 py-1">
            Portfolio
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Featured <span className="text-indigo-600 dark:text-indigo-400">Projects</span>
          </h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            A collection of projects that showcase my skills and passion for building innovative solutions
          </p>
        </div>

        {/* Filter Tabs */}
        <div className={`flex justify-center gap-4 mb-12 transition-all duration-700 delay-200 animate-fade-in ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-indigo-600' : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-400'}
          >
            <Layers size={18} className="mr-2" />
            All Projects
          </Button>
          <Button
            variant={filter === 'featured' ? 'default' : 'outline'}
            onClick={() => setFilter('featured')}
            className={filter === 'featured' ? 'bg-indigo-600' : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-400'}
          >
            <Star size={18} className="mr-2" />
            Featured
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <Card
              key={project.id}
              className={`group bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 overflow-hidden hover:border-indigo-500/50 transition-all duration-500 cursor-pointer shadow-lg animate-scale-in ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100 + 300}ms` }}
              onClick={() => setSelectedProject(project)}
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 dark:from-slate-900 via-transparent to-transparent" />
                
                {/* Featured Badge */}
                {project.featured && (
                  <Badge className="absolute top-3 right-3 bg-yellow-500/90 text-yellow-950">
                    <Star size={12} className="mr-1" />
                    Featured
                  </Badge>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-indigo-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold flex items-center gap-2">
                    View Details <ArrowRight size={18} />
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="secondary" className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs">
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:border-indigo-500">
                      <Github size={16} className="mr-2" />
                      Code
                    </Button>
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1"
                    >
                      <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
                        <ExternalLink size={16} className="mr-2" />
                        Demo
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View More */}
        <div className={`text-center mt-12 transition-all duration-700 delay-700 animate-fade-in ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {social.github.visible && social.github.url && (
            <a
              href={social.github.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="border-indigo-500/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
                <Github size={20} className="mr-2" />
                View More on GitHub
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Project Detail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        {selectedProject && (
          <DialogContent className="max-w-3xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedProject.title}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-slate-400">
                Project Details
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              {/* Image */}
              <div className="rounded-lg overflow-hidden mb-6">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover"
                />
              </div>

              {/* Description */}
              <p className="text-gray-700 dark:text-slate-300 mb-6 leading-relaxed">
                {selectedProject.description}
              </p>

              {/* Tags */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-600 dark:text-slate-400 mb-3">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-4">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white">
                    <Github size={18} className="mr-2" />
                    View Code
                  </Button>
                </a>
                {selectedProject.demo && (
                  <a
                    href={selectedProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                      <ExternalLink size={18} className="mr-2" />
                      Live Demo
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
