import React from 'react';
import { PROJECTS } from '../constants';
import { ExternalLink, Zap, CheckCircle2 } from 'lucide-react';

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-20 scroll-mt-28 bg-primary">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-12">Featured Engineering</h2>

        <div className="space-y-16">
          {PROJECTS.map((project, idx) => (
            <div key={idx} className="relative group">
              {/* Background Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-accent to-ai-purple opacity-10 group-hover:opacity-20 rounded-2xl blur transition duration-500"></div>

              <div className="relative bg-secondary rounded-2xl p-8 border border-slate-700 overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-8">

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-accent text-sm font-mono tracking-wider uppercase mb-2 block">{project.role}</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-white">{project.title}</h3>
                      </div>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors"
                        >
                          <ExternalLink size={20} />
                        </a>
                      )}
                    </div>

                    <p className="text-slate-300 mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Zap size={16} className="text-yellow-400" /> Key Features
                        </h4>
                        <ul className="space-y-2">
                          {project.features.map((feature, i) => (
                            <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-green-400" /> Impact
                        </h4>
                        <ul className="space-y-2">
                          {project.impact.map((impact, i) => (
                            <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                              {impact}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-700">
                      {project.techStack.map((tech, i) => (
                        <span key={i} className="px-3 py-1 text-xs font-mono text-accent bg-accent/10 rounded border border-accent/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Visual Decoration (Abstract representation of the project) */}
                  <div className="hidden lg:flex w-64 shrink-0 flex-col gap-4">
                    <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 p-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-50">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                      </div>
                      <div className="mt-6 font-mono text-xs text-green-400">
                        {`> Initializing ${project.title.split(' ')[0]}...`}
                        <br />
                        {`> Loading models...`}
                        <br />
                        <span className="text-blue-400">{`> AI Model Connected`}</span>
                        <br />
                        <span className="text-purple-400">{`> Stream Active`}</span>
                        <br />
                        <span className="animate-pulse">{`> Ready.`}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;