import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import ExperienceSection from './components/Experience';
import AIChat from './components/AIChat';
import BookingModal from './components/BookingModal';
import { Mail, Github, Linkedin, Menu, X, Sparkles, Key, Info, Calendar } from 'lucide-react';
import { CONTACT_INFO, SITE_CONFIG } from './constants';

const App: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        try {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        } catch (e) {
          console.error("Error checking API key:", e);
          setHasApiKey(false);
        }
      } else {
        // Fallback for local environments where aistudio is not defined
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Assume success to mitigate race conditions
        setHasApiKey(true);
      } catch (e) {
        console.error("Error selecting API key:", e);
        // If selection fails (e.g. cancelled), we stay on the landing screen
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
  ];

  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-ai-purple/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px] pointer-events-none" />

        <div className="relative z-10 bg-secondary/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-lg w-full text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-gradient-to-tr from-accent to-ai-purple rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="text-white" size={32} />
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">Welcome</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            This interactive portfolio uses <strong>Gemini 3.0 Pro</strong> to provide a personalized AI agent experience. Please connect your API key to continue.
          </p>

          <button
            onClick={handleSelectKey}
            className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all transform hover:scale-[1.02] shadow-xl mb-6 flex items-center justify-center gap-2"
          >
            <Key className="w-5 h-5" />
            Connect API Key
          </button>

          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-500 hover:text-accent transition-colors flex items-center justify-center gap-1"
          >
            <Info size={12} /> API Key Billing Information
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-slate-200 selection:bg-accent selection:text-slate-900">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-primary/90 backdrop-blur-md border-b border-slate-800 py-3' : 'bg-transparent py-6'
          }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a href="#" className="group text-xl font-bold tracking-tight text-white flex items-center">
            <span className="group-hover:text-accent transition-colors duration-300">{SITE_CONFIG.userName}</span>
            <span className="text-accent animate-blink ml-1">_</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                onClick={(e) => handleScrollToSection(e, link.href)}
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-full border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <Calendar size={14} /> Book Call
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-secondary border-b border-slate-700 py-4 px-6 absolute w-full top-full left-0 flex flex-col gap-4">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-300 hover:text-white cursor-pointer"
                onClick={(e) => handleScrollToSection(e, link.href)}
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => {
                setIsBookingOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-accent hover:text-accentHover font-semibold text-left flex items-center gap-2"
            >
              <Calendar size={16} /> Book a Call
            </button>
          </div>
        )}
      </nav>

      <main>
        <Hero
          onOpenBooking={() => setIsBookingOpen(true)}
          onOpenChat={() => setIsChatOpen(true)}
        />
        <Skills />
        <Projects />
        <ExperienceSection />
      </main>

      <footer className="bg-primary border-t border-slate-800 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white">{SITE_CONFIG.userName}</h3>
            <p className="text-slate-500 text-sm mt-1">{SITE_CONFIG.role}</p>
          </div>

          <div className="flex gap-6">
            <a href={`mailto:${CONTACT_INFO.email}`} className="text-slate-400 hover:text-accent transition-colors">
              <Mail size={20} />
            </a>
            <a href={CONTACT_INFO.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-accent transition-colors">
              <Github size={20} />
            </a>
            <a href={CONTACT_INFO.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-accent transition-colors">
              <Linkedin size={20} />
            </a>
          </div>

          <div className="text-slate-600 text-sm">
            © {new Date().getFullYear()} Arpit Korde. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating AI Chat */}
      <AIChat
        isOpen={isChatOpen}
        onToggle={setIsChatOpen}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* Booking Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
};

export default App;