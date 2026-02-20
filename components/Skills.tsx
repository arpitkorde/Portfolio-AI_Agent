import React from 'react';
import { SKILLS, SITE_CONFIG } from '../constants';
import { Code, Cpu, Layers, Zap } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const Skills: React.FC = () => {
  const getIcon = (category: string) => {
    if (category.includes('Agent')) return <Cpu className="text-ai-purple" />;
    if (category.includes('Stack')) return <Layers className="text-accent" />;
    if (category.includes('Tools')) return <Code className="text-green-400" />;
    return <Zap className="text-yellow-400" />;
  };

  // Mock data for the chart based on expertise implied in resume
  const chartData = [
    { subject: 'Generative AI', A: 95, fullMark: 100 },
    { subject: 'React / FE', A: 90, fullMark: 100 },
    { subject: 'Cloud / Dev', A: 85, fullMark: 100 },
    { subject: 'Product Strategy', A: 88, fullMark: 100 },
    { subject: 'Data / Ops', A: 80, fullMark: 100 },
    { subject: 'Automation', A: 92, fullMark: 100 },
  ];

  return (
    <section id="skills" className="py-20 scroll-mt-28 bg-slate-900/50">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Technical Arsenal</h2>
          <p className="text-slate-400 max-w-2xl">
            Specialized in bridging the gap between cutting-edge LLM capabilities and production-grade software engineering.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Skill Cards Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {SKILLS.map((skillGroup, idx) => (
              <div key={idx} className="bg-secondary p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                    {getIcon(skillGroup.category)}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{skillGroup.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((item, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Visualization */}
          <div className="lg:w-1/3 bg-secondary rounded-xl border border-slate-700 p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-white mb-6">Proficiency Balance</h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name={SITE_CONFIG.userName.split(' ')[0]}
                    dataKey="A"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="#06b6d4"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-slate-500 mt-4">
              Balanced expertise across Engineering, Strategy, and AI Implementation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;