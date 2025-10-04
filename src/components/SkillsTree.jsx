import { useState } from 'react';

const SkillsTree = ({ skillsets }) => {
  const [expandedSkillsets, setExpandedSkillsets] = useState(new Set());
  const [expandedSkills, setExpandedSkills] = useState(new Set());

  const toggleSkillset = (index) => {
    const newExpanded = new Set(expandedSkillsets);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSkillsets(newExpanded);
  };

  const toggleSkill = (skillsetIndex, skillIndex) => {
    const key = `${skillsetIndex}-${skillIndex}`;
    const newExpanded = new Set(expandedSkills);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSkills(newExpanded);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {skillsets?.map((skillset, skillsetIndex) => {
        const isSkillsetExpanded = expandedSkillsets.has(skillsetIndex);
        
        return (
          <div key={skillsetIndex} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-sm">
            {/* Skillset Header */}
            <div 
              className="p-6 bg-green-500 dark:bg-green-600 text-white cursor-pointer hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
              onClick={() => toggleSkillset(skillsetIndex)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">{skillset.name}</h3>
                  <p className="text-green-100 text-sm mt-1">{skillset.description}</p>
                </div>
                <svg 
                  className={`w-6 h-6 transform transition-transform duration-300 ${isSkillsetExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Skills List */}
            {isSkillsetExpanded && (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {skillset.skills?.map((skill, skillIndex) => {
                  const skillKey = `${skillsetIndex}-${skillIndex}`;
                  const isSkillExpanded = expandedSkills.has(skillKey);
                  
                  return (
                    <div key={skillIndex}>
                      {/* Skill Header */}
                      <div 
                        className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                        onClick={() => toggleSkill(skillsetIndex, skillIndex)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{skill.name}</h4>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{skill.description}</p>
                            </div>
                          </div>
                          {skill.subskills && skill.subskills.length > 0 && (
                            <svg 
                              className={`w-5 h-5 text-zinc-400 transform transition-transform duration-200 ${isSkillExpanded ? 'rotate-180' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Subskills */}
                      {isSkillExpanded && skill.subskills && skill.subskills.length > 0 && (
                        <div className="bg-zinc-50 dark:bg-zinc-800/50">
                          <div className="px-4 py-3">
                            <div className="grid gap-3">
                              {skill.subskills.map((subskill, subskillIndex) => (
                                <div key={subskillIndex} className="flex items-start gap-3 p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <div>
                                    <h5 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">{subskill.name}</h5>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">{subskill.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SkillsTree;