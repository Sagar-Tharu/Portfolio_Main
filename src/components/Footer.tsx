import { usePortfolio } from '@/context/PortfolioContext';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Heart,
  Code2,
  ArrowUp
} from 'lucide-react';

export function Footer() {
  const { data } = usePortfolio();
  const { personal, social } = data;
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <a href="#hero" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code2 className="text-white" size={22} />
              </div>
              <span className="text-white font-bold text-lg">
                {personal.name.split(' ')[0]}
                <span className="text-indigo-400">.dev</span>
              </span>
            </a>
            <p className="text-slate-400 text-sm max-w-xs">
              {personal.title} passionate about building innovative solutions and creating impactful technology.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: Github, link: social.github, label: 'GitHub' },
                { icon: Linkedin, link: social.linkedin, label: 'LinkedIn' },
                { icon: Twitter, link: social.twitter, label: 'Twitter' },
              ]
                .filter(({ link }) => link.visible && link.url)
                .map(({ icon: Icon, link, label }) => (
                  <a
                    key={label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 transition-all"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </a>
                ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'About', href: '#about' },
                { label: 'Skills', href: '#skills' },
                { label: 'Projects', href: '#projects' },
                { label: 'Experience', href: '#experience' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${personal.email}`}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  {personal.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${personal.phone}`}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  {personal.phone}
                </a>
              </li>
              <li className="text-slate-400 text-sm">
                {personal.location}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {currentYear} {personal.name}. Made with{' '}
            <Heart className="inline w-4 h-4 text-red-500 fill-red-500" /> using React & Tailwind
          </p>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors text-sm group"
          >
            Back to top
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <ArrowUp size={16} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
