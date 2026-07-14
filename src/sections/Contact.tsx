import { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Send,
  Github,
  Linkedin,
  Twitter,
  MessageSquare,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import type { StatusBadge as StatusBadgeType } from '@/types/portfolio';

// Status Badge Component with proper color mapping
function StatusBadgeCard({ statusBadge }: { statusBadge: StatusBadgeType }) {
  const colorClasses = {
    green: {
      bg: 'bg-gradient-to-r from-green-100 to-green-50 dark:from-green-600/20 dark:to-green-600/10',
      border: 'border-green-200 dark:border-green-500/30',
      dot: 'bg-green-500 dark:bg-green-400',
    },
    blue: {
      bg: 'bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-600/20 dark:to-blue-600/10',
      border: 'border-blue-200 dark:border-blue-500/30',
      dot: 'bg-blue-500 dark:bg-blue-400',
    },
    purple: {
      bg: 'bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-600/20 dark:to-purple-600/10',
      border: 'border-purple-200 dark:border-purple-500/30',
      dot: 'bg-purple-500 dark:bg-purple-400',
    },
    yellow: {
      bg: 'bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-600/20 dark:to-yellow-600/10',
      border: 'border-yellow-200 dark:border-yellow-500/30',
      dot: 'bg-yellow-500 dark:bg-yellow-400',
    },
    red: {
      bg: 'bg-gradient-to-r from-red-100 to-red-50 dark:from-red-600/20 dark:to-red-600/10',
      border: 'border-red-200 dark:border-red-500/30',
      dot: 'bg-red-500 dark:bg-red-400',
    },
    indigo: {
      bg: 'bg-gradient-to-r from-indigo-100 to-indigo-50 dark:from-indigo-600/20 dark:to-indigo-600/10',
      border: 'border-indigo-200 dark:border-indigo-500/30',
      dot: 'bg-indigo-500 dark:bg-indigo-400',
    },
  };

  const colors = colorClasses[statusBadge.color] || colorClasses.green;

  return (
    <Card className={`${colors.bg} ${colors.border} p-6 shadow-md`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-3 h-3 rounded-full ${colors.dot} animate-pulse`} />
        <h3 className="font-semibold text-gray-900 dark:text-white">{statusBadge.text}</h3>
      </div>
      <p className="text-gray-700 dark:text-slate-300 text-sm">
        {statusBadge.description}
      </p>
    </Card>
  );
}

export function Contact() {
  const { data } = usePortfolio();
  const { personal, social, statusBadge } = data;
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    subject: '',
    message: '',
  });

  // EmailJS Configuration - Replace these with your actual values
  const EMAILJS_SERVICE_ID = 'service_g0sr7lk';
  const EMAILJS_TEMPLATE_ID = 'template_l6r0h29';
  const EMAILJS_PUBLIC_KEY = '53aKK1DdJ-4FJOXLg';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send email using EmailJS
      const result = await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current!,
        EMAILJS_PUBLIC_KEY
      );

      console.log('EmailJS Success:', result.text);
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Message sent successfully! I\'ll get back to you soon.');
      
      // Reset form
      setFormData({ user_name: '', user_email: '', subject: '', message: '' });
    } catch (error: any) {
      console.error('EmailJS Error:', error.text);
      setIsSubmitting(false);
      toast.error('Failed to send message. Please try again or email me directly.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 relative overflow-hidden transition-colors duration-300"
    >
      {/* Background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 animate-fade-in ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Badge variant="outline" className="mb-4 border-indigo-500/50 text-indigo-600 dark:text-indigo-400 px-4 py-1">
            Get In Touch
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Let's <span className="text-indigo-600 dark:text-indigo-400">Connect</span>
          </h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info */}
          <div className={`space-y-8 transition-all duration-700 delay-200 animate-slide-in-left ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* Contact Cards */}
            <div className="space-y-4">
              <Card className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 p-6 flex items-center gap-4 hover:border-indigo-500/50 transition-all group shadow-md">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-500/30 transition-colors">
                  <Mail className="text-indigo-600 dark:text-indigo-400" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-slate-400">Email</h3>
                  <a 
                    href={`mailto:${personal.email}`}
                    className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {personal.email}
                  </a>
                </div>
              </Card>

              <Card className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 p-6 flex items-center gap-4 hover:border-indigo-500/50 transition-all group shadow-md">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-500/30 transition-colors">
                  <Phone className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-slate-400">Phone</h3>
                  <a 
                    href={`tel:${personal.phone}`}
                    className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    {personal.phone}
                  </a>
                </div>
              </Card>

              <Card className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 p-6 flex items-center gap-4 hover:border-indigo-500/50 transition-all group shadow-md">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-200 dark:group-hover:bg-cyan-500/30 transition-colors">
                  <MapPin className="text-cyan-600 dark:text-cyan-400" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-slate-400">Location</h3>
                  <p className="text-gray-900 dark:text-white">{personal.location}</p>
                </div>
              </Card>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageSquare className="text-indigo-600 dark:text-indigo-400" size={20} />
                Follow Me
              </h3>
              <div className="flex gap-4">
                {[
                  { icon: Github, key: 'github' as const, label: 'GitHub', color: 'hover:bg-gray-700' },
                  { icon: Linkedin, key: 'linkedin' as const, label: 'LinkedIn', color: 'hover:bg-blue-600' },
                  { icon: Twitter, key: 'twitter' as const, label: 'Twitter', color: 'hover:bg-sky-500' },
                ]
                  .filter(({ key }) => social[key].visible && social[key].url)
                  .map(({ icon: Icon, key, label, color }) => (
                    <a
                      key={label}
                      href={social[key].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-600 dark:text-slate-400 ${color} hover:text-white transition-all shadow-sm`}
                      aria-label={label}
                    >
                      <Icon size={22} />
                    </a>
                  ))}
              </div>
            </div>

            {/* Availability / Status Badge */}
            {statusBadge?.enabled && (
              <StatusBadgeCard statusBadge={statusBadge} />
            )}
          </div>

          {/* Right Column - Contact Form */}
          <div className={`transition-all duration-700 delay-400 animate-slide-in-right ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <Card className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 p-6 md:p-8 shadow-lg">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-600 dark:text-slate-400 mb-6">
                    Thank you for reaching out. I'll get back to you as soon as possible.
                  </p>
                  <Button 
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ user_name: '', user_email: '', subject: '', message: '' });
                    }}
                    variant="outline"
                    className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="user_name" className="text-gray-700 dark:text-slate-300">
                        Your Name <span className="text-red-500 dark:text-red-400">*</span>
                      </Label>
                      <Input
                        id="user_name"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user_email" className="text-gray-700 dark:text-slate-300">
                        Email Address <span className="text-red-500 dark:text-red-400">*</span>
                      </Label>
                      <Input
                        id="user_email"
                        name="user_email"
                        type="email"
                        value={formData.user_email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-700 dark:text-slate-300">
                      Subject <span className="text-red-500 dark:text-red-400">*</span>
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Project Collaboration"
                      required
                      className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700 dark:text-slate-300">
                      Message <span className="text-red-500 dark:text-red-400">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project..."
                      required
                      rows={5}
                      className="bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
