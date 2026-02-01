import React from 'react';
import { useCharacter } from '../context/CharacterContext';
import SkillRollModal from '../components/SkillRollModal';

const AttributesTab = () => {
    const { characterData, updateSkillLevel, isEditMode } = useCharacter();
    const [rollingSkill, setRollingSkill] = React.useState(null);

    const getAttrColor = (attr) => {
        const colors = {
            'DES': 'bg-[#2ecc71] text-black',
            'VIG': 'bg-[#e74c3c] text-white',
            'INT': 'bg-[#3498db] text-white',
            'PRE': 'bg-[#9b59b6] text-white',
            'TAM': 'bg-[#f1c40f] text-black',
            'INTUI': 'bg-[#ff00ff] text-white',
            'PRES': 'bg-[#9b59b6] text-white', // Alias para PRE
        };
        return colors[attr] || 'bg-gray-600 text-white';
    };

    return (
        <div className="animate-fade-in">
            <main className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
                {Object.entries(characterData.skillCategories).map(([key, category]) => (
                    <section key={key}>
                        <div
                            className="bg-cyber-panel/40 rounded-xl p-5 border shadow-[0_0_15px_rgba(241,196,15,0.05)] h-full glass-card"
                            style={{ borderColor: category.borderColor + '66' }}
                        >
                            <h2 className="text-[#ff00ff] font-bold uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-white/10 pb-2 font-display">
                                <i className={`fa-solid ${category.icon}`}></i> {category.label}
                            </h2>
                            <ul className="space-y-3">
                                {category.skills.map((skill) => (
                                    <li
                                        key={skill.name}
                                        onClick={() => !isEditMode && setRollingSkill(skill)}
                                        className={`flex items-center justify-between group p-1 rounded transition-colors ${!isEditMode ? 'cursor-pointer hover:bg-white/5 active:scale-[0.99]' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[#ff00ff] group-hover:bg-[#ff00ff] group-hover:text-black transition-all shadow-sm">
                                                <i className={`fa-solid ${skill.icon}`}></i>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-sm font-bold text-gray-200">{skill.name}</div>
                                                    {(Array.isArray(skill.attr) ? skill.attr : [skill.attr]).map((a) => (
                                                        <span key={a} className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-black tracking-tighter shadow-sm ${getAttrColor(a)}`}>
                                                            {a === 'INTUI' ? 'INTU' : a}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5">
                                            {[1, 2, 3].map((i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => updateSkillLevel(key, skill.name, i)}
                                                    className={`w-3.5 h-3.5 flex items-center justify-center transition-all duration-300 transform hover:scale-125 focus:outline-none ${i > skill.level
                                                            ? 'opacity-20 hover:opacity-50'
                                                            : i === 3
                                                                ? 'text-[#00ffff] drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] scale-110'
                                                                : 'text-[#f1c40f] drop-shadow-[0_0_5px_rgba(241,196,15,0.5)]'
                                                        }`}
                                                >
                                                    <i className="fa-solid fa-diamond text-[10px]"></i>
                                                </button>
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                ))}
            </main>

            <SkillRollModal
                isOpen={!!rollingSkill}
                onClose={() => setRollingSkill(null)}
                skill={rollingSkill}
                allAttributes={characterData.attributes}
            />
        </div>
    );
};

export default AttributesTab;
