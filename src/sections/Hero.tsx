import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { usePortfolio } from '@/context/PortfolioContext';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  ChevronDown,
  Code2,
  Terminal,
  Cpu,
  Database
} from 'lucide-react';

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data } = usePortfolio();
  const { personal, social } = data;

  // Animated background particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - dist / 150)})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 dark:opacity-100 opacity-30"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-slate-900/50 dark:to-slate-900" />

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-indigo-500/30 dark:text-indigo-500/20 animate-bounce" style={{ animationDuration: '3s' }}>
          <Code2 size={40} />
        </div>
        <div className="absolute top-40 right-20 text-purple-500/30 dark:text-purple-500/20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
          <Terminal size={35} />
        </div>
        <div className="absolute bottom-40 left-20 text-cyan-500/30 dark:text-cyan-500/20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
          <Cpu size={45} />
        </div>
        <div className="absolute bottom-20 right-10 text-pink-500/30 dark:text-pink-500/20 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>
          <Database size={38} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-300 dark:border-indigo-500/30 mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
          <span className="text-indigo-700 dark:text-indigo-300 text-sm font-medium">Available for opportunities</span>
        </div>

        {/* Name */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight animate-fade-in">
          Hi, I'm{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            {personal.name.split(' ')[0]}
          </span>
        </h1>

        {/* Title */}
        <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-slate-300 mb-4 font-light animate-fade-in"
           style={{ animationDelay: '0.1s' }}>
          {personal.title}
        </p>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto animate-fade-in"
           style={{ animationDelay: '0.2s' }}>
          {personal.tagline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in"
             style={{ animationDelay: '0.3s' }}>
          <Button
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
            onClick={() => scrollToSection('projects')}
          >
            View My Work
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 px-8 py-6 text-lg rounded-xl"
            onClick={() => scrollToSection('contact')}
          >
            Get In Touch
          </Button>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-16 animate-fade-in"
             style={{ animationDelay: '0.4s' }}>
          {[
            { icon: Github, key: 'github' as const, label: 'GitHub' },
            { icon: Linkedin, key: 'linkedin' as const, label: 'LinkedIn' },
            { icon: Twitter, key: 'twitter' as const, label: 'Twitter' },
          ].filter(({ key }) => social[key].visible && social[key].url).map(({ icon: Icon, key, label }) => (
            <a
              key={label}
              href={social[key].url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 hover:border-indigo-500/50 transition-all duration-300 group shadow-sm"
              aria-label={label}
            >
              <Icon size={22} className="group-hover:scale-110 transition-transform" />
            </a>
          )).concat(
            <a
              key="Email"
              href={`mailto:${personal.email}`}
              className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 hover:border-indigo-500/50 transition-all duration-300 group shadow-sm"
              aria-label="Email"
            >
              <Mail size={22} className="group-hover:scale-110 transition-transform" />
            </a>
          )}
        </div>

        {/* Tech Stack Preview */}
        <div className="flex flex-wrap justify-center gap-3 max-w-xl mx-auto animate-fade-in"
             style={{ animationDelay: '0.5s' }}>
          {['React', 'Python', 'TypeScript', 'Node.js', 'AWS', 'Machine Learning'].map((tech, index) => (
            <span
              key={tech}
              className="px-4 py-2 rounded-lg bg-white/80 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-400 text-sm hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all cursor-default shadow-sm animate-scale-in"
              style={{ animationDelay: `${0.6 + index * 0.05}s` }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => scrollToSection('about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
}
