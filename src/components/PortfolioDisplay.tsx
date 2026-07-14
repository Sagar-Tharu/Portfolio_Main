import { usePortfolio } from '@/context/PortfolioContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Skills } from '@/sections/Skills';
import { Experience } from '@/sections/Experience';
import { Projects } from '@/sections/Projects';
import { Contact } from '@/sections/Contact';

export function PortfolioDisplay() {
  const { data } = usePortfolio();
  const { sectionVisibility } = data;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Navigation />
      <main>
        {sectionVisibility.hero && <Hero />}
        {sectionVisibility.about && <About />}
        {sectionVisibility.skills && <Skills />}
        {sectionVisibility.experience && <Experience />}
        {sectionVisibility.projects && <Projects />}
        {sectionVisibility.contact && <Contact />}
      </main>
      <Footer />
    </div>
  );
}