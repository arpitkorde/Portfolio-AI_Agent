import React from 'react';
import { ArrowRight, Bot, Github, Linkedin } from 'lucide-react';
import { CONTACT_INFO, HEADLINE, SITE_CONFIG, PROJECTS } from '../constants';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenChat: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenChat }) => {
  const handleViewWork = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-ai-purple/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-accent text-xs font-mono mb-6 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Available for AI Product Roles
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            {HEADLINE.split(' ').slice(0, -2).join(' ')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-ai-purple">
              {HEADLINE.split(' ').slice(-2).join(' ')}
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-8 max-w-2xl leading-relaxed">
            I'm <span className="text-white font-semibold">{SITE_CONFIG.userName}</span>, {SITE_CONFIG.role}.
            {PROJECTS[0] && (
              <> Creator of <span className="text-accent">{PROJECTS[0].title}</span>.</>
            )}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a
              href="#projects"
              onClick={handleViewWork}
              className="px-8 py-3.5 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              View Work <ArrowRight size={18} />
            </a>
            <button
              onClick={onOpenChat}
              className="px-8 py-3.5 bg-slate-800 text-white border border-slate-700 rounded-lg font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              Talk to my AI Agent <Bot size={18} />
            </button>
          </div>

          {/* Tech Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-slate-800">
            <div>
              <div className="text-2xl font-bold text-white">12+</div>
              <div className="text-sm text-slate-500">Years Experience</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">300+</div>
              <div className="text-sm text-slate-500">Active Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-sm text-slate-500">Uptime</div>
            </div>
            <div className="flex gap-4 items-center">
              <a href={CONTACT_INFO.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Github size={24} />
              </a>
              <a href={CONTACT_INFO.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;