import React from 'react';
import { EXPERIENCE, EDUCATION, CERTIFICATIONS } from '../constants';
import { Award, Briefcase, GraduationCap } from 'lucide-react';

const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-20 scroll-mt-28 bg-slate-900/50">
      <div className="container mx-auto px-6">
        
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Work History */}
          <div>
             <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <Briefcase className="text-accent" /> Professional Timeline
            </h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
              {EXPERIENCE.map((exp, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-800 group-hover:bg-accent group-hover:border-accent transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-xl">
                    <div className="w-2.5 h-2.5 bg-slate-400 rounded-full group-hover:bg-white transition-colors"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-slate-700 bg-secondary shadow-sm hover:border-slate-600 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h3 className="font-bold text-white text-lg">{exp.company}</h3>
                      <time className="text-xs font-mono text-slate-500">{exp.period}</time>
                    </div>
                    <div className="text-sm text-accent mb-3">{exp.role}</div>
                    <ul className="space-y-1">
                      {exp.highlights.map((point, i) => (
                        <li key={i} className="text-sm text-slate-400 leading-snug">• {point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certs */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <GraduationCap className="text-ai-purple" /> Education
              </h2>
              <div className="bg-secondary p-6 rounded-xl border border-slate-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">{EDUCATION.degree}</h3>
                    <p className="text-slate-400 mt-1">{EDUCATION.university}</p>
                  </div>
                  <span className="text-sm font-mono text-slate-500">{EDUCATION.year}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Award className="text-green-400" /> Certifications
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {CERTIFICATIONS.map((cert, idx) => (
                  <div key={idx} className="bg-secondary p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                    <p className="text-sm text-slate-300 font-medium">{cert}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;