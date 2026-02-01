import React, { useState, useMemo } from 'react';
import { useCharacter } from '../context/CharacterContext';
import SkillRollModal from '../components/SkillRollModal';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../components/Modal';

const AttributesTab = () => {
    const { characterData, updateSkillLevel, isEditMode, toggleSkillVisibility } = useCharacter();
    const [rollingSkill, setRollingSkill] = useState(null);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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

    // Flatten skills from all categories
    const allSkills = useMemo(() => {
        return Object.entries(characterData.skillCategories).flatMap(([key, category]) =>
            category.skills.map(skill => ({
                ...skill,
                categoryKey: key,
                categoryLabel: category.label,
                categoryIcon: category.icon
            }))
        ).sort((a, b) => a.name.localeCompare(b.name));
    }, [characterData.skillCategories]);

    // Filter visible skills for main view
    const visibleSkills = useMemo(() => {
        return allSkills.filter(skill => skill.visible);
    }, [allSkills]);

    // Filter for manage modal
    const filteredManageSkills = useMemo(() => {
        if (!searchTerm) return allSkills;
        return allSkills.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allSkills, searchTerm]);

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-bold text-white tracking-widest uppercase">Perícias Selecionadas</h2>
                {isEditMode && (
                    <button
                        onClick={() => setIsManageModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-pink/10 border border-cyber-pink/30 text-cyber-pink hover:bg-cyber-pink/20 transition-all font-bold text-xs uppercase tracking-wider"
                    >
                        <i className="fa-solid fa-list-check"></i>
                        Gerenciar Perícias
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
                {visibleSkills.length > 0 ? (
                    visibleSkills.map((skill) => (
                        <div
                            key={skill.name}
                            onClick={() => !isEditMode && setRollingSkill(skill)}
                            className={`group relative bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-300 ${!isEditMode ? 'cursor-pointer hover:border-cyber-pink/50 hover:bg-white/10' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#ff00ff] group-hover:bg-[#ff00ff] group-hover:text-black transition-all shadow-sm shrink-0">
                                    <i className={`fa-solid ${skill.icon}`}></i>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="text-sm font-bold text-gray-200 truncate pr-2">{skill.name}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {(Array.isArray(skill.attr) ? skill.attr : [skill.attr]).map((a) => (
                                            <span key={a} className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-black tracking-tighter shadow-sm ${getAttrColor(a)}`}>
                                                {a === 'INTUI' ? 'INTU' : a}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                    {[1, 2, 3].map((i) => (
                                        <button
                                            key={i}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateSkillLevel(skill.categoryKey, skill.name, i);
                                            }}
                                            disabled={!isEditMode}
                                            className={`w-3.5 h-3.5 flex items-center justify-center transition-all duration-300 transform ${isEditMode ? 'hover:scale-125 cursor-pointer' : 'cursor-default'} focus:outline-none ${i > skill.level
                                                ? 'opacity-20'
                                                : i === 3
                                                    ? 'text-[#00ffff] drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] scale-110'
                                                    : 'text-[#f1c40f] drop-shadow-[0_0_5px_rgba(241,196,15,0.5)]'
                                                }`}
                                        >
                                            <i className="fa-solid fa-diamond text-[10px]"></i>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                        <i className="fa-solid fa-ghost text-4xl mb-3 opacity-50"></i>
                        <p>Nenhuma perícia visível selecionada.</p>
                        {isEditMode && <p className="text-sm mt-2">Clique em "Gerenciar Perícias" para adicionar.</p>}
                    </div>
                )}
            </div>

            <SkillRollModal
                isOpen={!!rollingSkill}
                onClose={() => setRollingSkill(null)}
                skill={rollingSkill}
                allAttributes={characterData.attributes}
            />

            {/* Manage Skills Modal */}
            <Modal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} maxWidth="max-w-4xl">
                <ModalHeader onClose={() => setIsManageModalOpen(false)} className="border-b border-white/10">
                    <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">
                        Gerenciar Perícias Visíveis
                    </h2>
                </ModalHeader>
                <ModalBody className="p-6 h-[70vh] flex flex-col bg-zinc-950/95">
                    <div className="mb-4 relative shrink-0">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fa-solid fa-magnifying-glass text-gray-500 text-xs"></i>
                        </div>
                        <input
                            className="w-full bg-black/40 border border-white/10 text-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink/50 transition-all font-sans"
                            placeholder="Buscar perícia..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filteredManageSkills.map(skill => (
                                <div
                                    key={skill.name}
                                    onClick={() => toggleSkillVisibility(skill.categoryKey, skill.name)}
                                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all select-none ${skill.visible
                                            ? 'bg-cyber-pink/10 border-cyber-pink/50 shadow-[0_0_10px_rgba(255,0,153,0.1)]'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${skill.visible ? 'text-cyber-pink bg-cyber-pink/20' : 'text-gray-500 bg-white/5'}`}>
                                            <i className={`fa-solid ${skill.icon}`}></i>
                                        </div>
                                        <div>
                                            <div className={`text-sm font-bold ${skill.visible ? 'text-white' : 'text-gray-400'}`}>{skill.name}</div>
                                            <div className="text-[10px] text-gray-600 uppercase font-bold tracking-wide">{skill.categoryLabel}</div>
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${skill.visible
                                            ? 'bg-cyber-pink border-cyber-pink text-white'
                                            : 'border-gray-600 bg-transparent'
                                        }`}>
                                        {skill.visible && <i className="fa-solid fa-check text-[10px]"></i>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="p-4 bg-zinc-950 border-t border-white/10 flex justify-end">
                    <button
                        onClick={() => setIsManageModalOpen(false)}
                        className="px-6 py-2 rounded-lg bg-cyber-pink hover:bg-cyber-pink/80 text-white font-bold text-sm transition-all"
                    >
                        Concluir
                    </button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default AttributesTab;
