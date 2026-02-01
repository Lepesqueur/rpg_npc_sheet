import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ConfirmationModal } from '../components/Modal';
import SkillRollModal from '../components/SkillRollModal';
import { useCharacter } from '../context/CharacterContext';
import { useToast } from '../components/Toast';
import { DAMAGE_RESISTANCES, CONDITIONS } from '../data/rules';

const ARMOR_TYPES = {
    armadura: { label: 'Armadura', icon: 'fa-shirt' },
    escudo: { label: 'Escudo', icon: 'fa-shield-halved' },
    elmo: { label: 'Elmo', icon: 'fa-helmet-safety' },
    outros: { label: 'Outros', icon: 'fa-box-open' }
};

// Componente simples de progresso circular usando SVG
const CircularProgress = ({ value, max, color, label, sublabel, statusKey, isEditMode }) => {
    const { characterData, updateStatusMax, updateStatus, updateConditionLevel } = useCharacter();
    const statusLevel = characterData[statusKey].level || 0;
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / max) * circumference;
    const offset = circumference - progress;

    return (
        <div className="flex flex-col items-center gap-3 w-full shrink-0">
            <div className="relative w-[100px] h-[100px] flex items-center justify-center">
                {/* Control Buttons - Tightly integrated */}
                <button
                    onClick={() => updateStatus(statusKey, -1)}
                    className="absolute -left-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all z-10"
                >
                    <i className="fa-solid fa-minus text-[8px]"></i>
                </button>

                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="3" fill="transparent" />
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        stroke={color}
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-in-out"
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex items-baseline justify-center font-mono">
                        <span className="text-xl font-black text-white leading-none">{value}</span>
                        <span className="text-[10px] text-white/20 mx-1">/</span>
                        {isEditMode ? (
                            <input
                                type="number"
                                value={max}
                                onChange={(e) => updateStatusMax(statusKey, e.target.value)}
                                className="w-8 bg-black/40 border-b border-cyber-yellow/50 text-[11px] font-bold text-cyber-yellow text-center outline-none focus:border-cyber-yellow transition-all"
                            />
                        ) : (
                            <span className="text-[11px] text-white/40 font-bold">{max}</span>
                        )}
                    </div>
                    <span className="text-[8px] uppercase font-black tracking-widest mt-0.5 opacity-60" style={{ color }}>{label}</span>
                </div>

                <button
                    onClick={() => updateStatus(statusKey, 1)}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all z-10"
                >
                    <i className="fa-solid fa-plus text-[8px]"></i>
                </button>
            </div>

            <div className="flex flex-col items-center gap-1.5">
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-50" style={{ color }}>{sublabel}</span>
                <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(i => {
                        const isActive = statusLevel >= i;
                        return (
                            <div
                                key={i}
                                onClick={() => updateConditionLevel(statusKey, i)}
                                className={`w-2.5 h-2.5 rounded-full border-2 cursor-pointer transition-all duration-300 hover:scale-125 ${isActive
                                        ? 'bg-current border-transparent'
                                        : 'bg-transparent border-white/10 hover:border-white/30'
                                    }`}
                                style={{ color: isActive ? color : 'inherit' }}
                            ></div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const CombatTab = () => {
    const {
        characterData, isEditMode, updateDefense,
        addAttack, updateAttack, deleteAttack, updateAttackWear,
        addArmor, updateArmor, deleteArmor, updateArmorCurrent,
        updateAllResistances,
        updateActiveCondition, updateAllConditions, consumeResources
    } = useCharacter();
    const { showToast } = useToast();
    const [activeModal, setActiveModal] = useState(null);
    const [selectedAttack, setSelectedAttack] = useState(null);
    const [attackForm, setAttackForm] = useState({ name: '', ap: 0, costs: { focus: 0, will: 0, vitality: 0 }, damage: 1, range: '', skill: 'Luta', properties: '', damageType: 'impacto' });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [attackToDelete, setAttackToDelete] = useState(null);

    const [armorForm, setArmorForm] = useState({ name: '', max: 0, current: 0, notes: '', type: 'armadura', reflexBonus: 0, properties: '' });
    const [selectedArmor, setSelectedArmor] = useState(null);
    const [isArmorDeleteModalOpen, setIsArmorDeleteModalOpen] = useState(false);
    const [armorToDelete, setArmorToDelete] = useState(null);
    const [tempConditions, setTempConditions] = useState({});
    const [tempResistances, setTempResistances] = useState({});
    const [rollingSkill, setRollingSkill] = useState(null);
    const [rollingSource, setRollingSource] = useState(null);

    const openEditModal = (attack) => {
        setSelectedAttack(attack);
        setAttackForm(attack);
        setActiveModal('weapon');
    };

    const openAddModal = () => {
        setSelectedAttack(null);
        setAttackForm({ name: '', ap: 0, costs: { focus: 0, will: 0, vitality: 0 }, damage: 1, range: '', skill: 'Luta', properties: '', damageType: 'impacto' });
        setActiveModal('weapon');
    };

    const handleSaveAttack = () => {
        if (selectedAttack) {
            updateAttack(selectedAttack.id, attackForm);
        } else {
            addAttack(attackForm);
        }
        setActiveModal(null);
    };

    const handleDeleteAttack = () => {
        if (selectedAttack) {
            setAttackToDelete(selectedAttack);
            setIsDeleteModalOpen(true);
        }
    };

    const confirmDeleteAttack = () => {
        if (attackToDelete) {
            deleteAttack(attackToDelete.id);
            setIsDeleteModalOpen(false);
            setAttackToDelete(null);
            if (activeModal === 'weapon') setActiveModal(null);
        }
    };
    const openConditionsModal = () => {
        const deepCopy = {};
        Object.keys(characterData.conditions || {}).forEach(key => {
            deepCopy[key] = { ...characterData.conditions[key] };
        });
        setTempConditions(deepCopy);
        setActiveModal('conditions');
    };

    const handleSaveConditions = () => {
        updateAllConditions(tempConditions);
        setActiveModal(null);
    };

    const updateTempCondition = (key, field, newValue) => {
        setTempConditions(prev => ({
            ...prev,
            [key]: {
                ...(prev[key] || { active: false, level: 1 }),
                [field]: field === 'level' ? (parseInt(newValue) || 1) : newValue
            }
        }));
    };

    const openResistancesModal = () => {
        const deepCopy = {};
        Object.keys(characterData.resistances || {}).forEach(key => {
            deepCopy[key] = { ...characterData.resistances[key] };
        });
        setTempResistances(deepCopy);
        setActiveModal('resistances');
    };

    const handleSaveResistances = () => {
        updateAllResistances(tempResistances);
        setActiveModal(null);
    };

    const updateTempResistance = (type, field, newValue) => {
        setTempResistances(prev => {
            const currentRes = prev[type] || { value: 0, immunity: false, vulnerable: false };
            let val = currentRes.value;
            let immunity = currentRes.immunity;
            let vulnerable = currentRes.vulnerable;

            if (field === 'value') {
                val = immunity ? 0 : Math.max(0, parseInt(newValue) || 0);
            } else if (field === 'immunity') {
                immunity = newValue;
                if (immunity) {
                    vulnerable = false;
                    val = 0;
                }
            } else if (field === 'vulnerable') {
                vulnerable = newValue;
                if (vulnerable) immunity = false;
            }

            return {
                ...prev,
                [type]: { value: val, immunity, vulnerable }
            };
        });
    };

    const openArmorEditModal = (armor) => {
        setSelectedArmor(armor);
        setArmorForm({ ...armor, type: armor.type || 'armadura' });
        setActiveModal('armor');
    };

    const openArmorAddModal = () => {
        setSelectedArmor(null);
        setArmorForm({ name: '', max: 0, current: 0, notes: '', type: 'armadura', reflexBonus: 0, properties: '' });
        setActiveModal('armor');
    };

    const handleSaveArmor = () => {
        if (selectedArmor) {
            updateArmor(selectedArmor.id, armorForm);
        } else {
            addArmor(armorForm);
        }
        setActiveModal(null);
    };

    const handleDeleteArmor = () => {
        if (selectedArmor) {
            setArmorToDelete(selectedArmor);
            setIsArmorDeleteModalOpen(true);
        }
    };

    const confirmDeleteArmor = () => {
        if (armorToDelete) {
            deleteArmor(armorToDelete.id);
            setIsArmorDeleteModalOpen(false);
            setArmorToDelete(null);
            if (activeModal === 'armor') setActiveModal(null);
        }
    };

    const handleAttackClick = (attack) => {
        if (isEditMode) {
            openEditModal(attack);
        } else {
            const allSkills = Object.values(characterData.skillCategories).flatMap(cat => cat.skills);
            const skill = allSkills.find(s => s.name === attack.skill);
            if (skill) {
                setRollingSkill(skill);
                setRollingSource(attack);
            }
        }
    };

    const handleRollConfirm = () => {
        if (rollingSource && rollingSource.costs) {
            const hasCosts = Object.values(rollingSource.costs).some(cost => cost > 0);
            if (hasCosts) {
                const result = consumeResources(rollingSource.costs);
                if (result.success) {
                    showToast(`ATAQUE "${rollingSource.name}" REALIZADO! RECURSOS CONSUMIDOS.`, 'success');
                    return true;
                } else {
                    showToast(`RECURSOS INSUFICIENTES: ${result.missing.join(', ')}`, 'error');
                    return false;
                }
            }
        }
        return true;
    };

    return (
        <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">

                {/* 1. ATAQUES & 2. ARMADURAS */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="border border-white/10 rounded-xl p-4 flex flex-col glass-card">
                        <h3 className="text-cyber-gray text-xs font-bold tracking-[0.2em] uppercase mb-4 pl-3 border-l-4 border-cyber-pink font-display">Ataques</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="text-[10px] text-cyber-gray uppercase tracking-wider border-b border-white/5">
                                    <tr>
                                        <th className="pb-2 font-semibold">Arma</th>
                                        <th className="pb-2 font-semibold text-center">AP</th>
                                        <th className="pb-2 font-semibold text-center">Recurso</th>
                                        <th className="pb-2 font-semibold text-center">Dano</th>
                                        <th className="pb-2 font-semibold text-center">Alcance</th>
                                        <th className="pb-2 font-semibold text-center">Desgaste</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {characterData.attacks.map((attack) => (
                                        <tr key={attack.id} onClick={() => handleAttackClick(attack)} className={`group hover:bg-white/5 transition-colors text-[13px] cursor-pointer`}>
                                            <td className="py-3 font-bold text-white group-hover:text-cyber-pink transition-colors">
                                                <div className="flex items-center gap-2">
                                                    {isEditMode && (
                                                        <div className="flex gap-2 mr-1">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); openEditModal(attack); }}
                                                                className="text-cyber-pink hover:text-white transition-colors p-1"
                                                            >
                                                                <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setAttackToDelete(attack);
                                                                    setIsDeleteModalOpen(true);
                                                                }}
                                                                className="text-cyber-red hover:text-white transition-colors p-1"
                                                            >
                                                                <i className="fa-solid fa-trash text-[10px]"></i>
                                                            </button>
                                                        </div>
                                                    )}
                                                    {attack.name}
                                                </div>
                                            </td>
                                            <td className="py-3 text-center text-cyber-yellow font-mono font-bold">{attack.ap}</td>
                                            <td className="py-3 text-center">
                                                <div className="flex flex-col items-center justify-center gap-1">
                                                    {attack.costs.vitality > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <i className="fa-solid fa-heart text-cyber-pink text-[8px] font-bold"></i>
                                                            <span className="text-white font-mono font-bold text-[11px]">{attack.costs.vitality}</span>
                                                        </div>
                                                    )}
                                                    {attack.costs.focus > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <i className="fa-solid fa-bolt-lightning text-cyber-purple text-[8px] font-bold"></i>
                                                            <span className="text-white font-mono font-bold text-[11px]">{attack.costs.focus}</span>
                                                        </div>
                                                    )}
                                                    {attack.costs.will > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <i className="fa-solid fa-brain text-cyber-yellow text-[8px] font-bold"></i>
                                                            <span className="text-white font-mono font-bold text-[11px]">{attack.costs.will}</span>
                                                        </div>
                                                    )}
                                                    {(!attack.costs.vitality && !attack.costs.focus && !attack.costs.will) && (
                                                        <span className="text-gray-500 font-mono text-[11px]">0</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 text-center text-white font-mono font-bold">
                                                {attack.wear > 0 ? (
                                                    <div className="flex flex-col items-center leading-none">
                                                        <span className="text-cyber-red">{Math.max(0, attack.damage - attack.wear)}</span>
                                                        <span className="text-[9px] text-gray-500 line-through opacity-60">{attack.damage}</span>
                                                    </div>
                                                ) : (
                                                    attack.damage
                                                )}
                                            </td>
                                            <td className="py-3 text-center text-gray-400 font-mono">{attack.range}</td>
                                            <td className="py-3 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {[1, 2].map(level => (
                                                        <div
                                                            key={level}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                updateAttackWear(attack.id, level);
                                                            }}
                                                            className={`w-3 h-3 border rounded-sm transition-all hover:scale-110 cursor-pointer ${(attack.wear || 0) >= level
                                                                ? 'bg-cyber-yellow border-cyber-yellow shadow-[0_0_8px_rgba(255,215,0,0.5)]'
                                                                : 'bg-transparent border-white/20 hover:border-cyber-yellow/50'
                                                                }`}
                                                        ></div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {isEditMode && (
                                        <tr onClick={openAddModal} className="group hover:bg-cyber-pink/5 transition-colors cursor-pointer text-[13px] border-t border-dashed border-white/10">
                                            <td colSpan="6" className="py-4 text-center text-cyber-pink font-bold uppercase tracking-widest text-[10px]">
                                                <i className="fa-solid fa-plus mr-2"></i> Adicionar Novo Ataque
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="border border-white/10 rounded-xl p-4 flex flex-col glass-card">
                        <h3 className="text-cyber-gray text-xs font-bold tracking-[0.2em] uppercase mb-4 pl-3 border-l-4 border-cyber-yellow font-display">Defesas</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="text-[10px] text-cyber-gray uppercase tracking-wider border-b border-white/5">
                                    <tr>
                                        <th className="pb-2 font-semibold">Nome da Armadura</th>
                                        <th className="pb-2 font-semibold text-center w-20">MÁX</th>
                                        <th className="pb-2 font-semibold text-center w-24">ATUAL</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {(characterData.armors || []).map((armor) => (
                                        <tr key={armor.id} onClick={() => isEditMode && openArmorEditModal(armor)} className={`group hover:bg-white/5 transition-colors text-[13px] ${isEditMode ? 'cursor-pointer' : 'cursor-default'}`}>
                                            <td className="py-3 flex items-center gap-3">
                                                <div className="flex gap-2 items-center">
                                                    {isEditMode && (
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); openArmorEditModal(armor); }}
                                                                className="text-cyber-yellow hover:text-white transition-colors p-1"
                                                            >
                                                                <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setArmorToDelete(armor); setIsArmorDeleteModalOpen(true); }}
                                                                className="text-cyber-red hover:text-white transition-colors p-1"
                                                            >
                                                                <i className="fa-solid fa-trash text-[10px]"></i>
                                                            </button>
                                                        </div>
                                                    )}
                                                    <i className={`fa-solid ${ARMOR_TYPES[armor.type || 'armadura']?.icon || 'fa-shield-halved'} text-cyber-yellow text-xs`}></i>
                                                    <span className="font-bold text-white group-hover:text-cyber-yellow transition-colors">{armor.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 text-center text-cyber-yellow font-bold text-lg font-mono">{armor.max}</td>
                                            <td className="py-3 text-center">
                                                <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                                    {Array.from({ length: Math.min(5, armor.max || 0) }).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            onClick={() => updateArmorCurrent(armor.id, armor.current === i + 1 ? i : i + 1)}
                                                            className={`w-3.5 h-3.5 border rounded-sm transition-all hover:scale-110 cursor-pointer ${(armor.current || 0) > i
                                                                ? 'bg-cyber-yellow border-cyber-yellow shadow-[0_0_8px_rgba(255,215,0,0.5)]'
                                                                : 'bg-transparent border-white/20 hover:border-cyber-yellow/50'
                                                                }`}
                                                        ></div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {isEditMode && (
                                        <tr onClick={openArmorAddModal} className="group hover:bg-cyber-yellow/5 transition-colors cursor-pointer text-[13px] border-t border-dashed border-white/10">
                                            <td colSpan="3" className="py-4 text-center text-cyber-yellow font-bold uppercase tracking-widest text-[10px]">
                                                <i className="fa-solid fa-plus mr-2"></i> Adicionar Nova Defesa
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 3. DEFESAS PRIMÁRIAS & 4. RESISTÊNCIAS ESPECIAIS */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="border border-white/10 rounded-xl p-4 flex flex-col glass-card">
                        <h3 className="text-cyber-gray text-xs font-bold tracking-[0.2em] uppercase mb-4 pl-3 border-l-4 border-cyber-purple font-display">Salvaguardas</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { key: 'fortitude', icon: 'fa-shield-halved', color: 'cyber-purple', label: 'Fortitude' },
                                { key: 'reflex', icon: 'fa-bolt-lightning', color: 'cyber-pink', label: 'Reflexo' },
                                { key: 'tenacity', icon: 'fa-hand-fist', color: 'cyber-yellow', label: 'Tenacidade' }
                            ].map((def) => (
                                <div key={def.key} className={`bg-black/40 p-3 rounded-lg flex flex-col items-center border-b-2 border-${def.color}/50 group hover:bg-${def.color}/5 transition-all`}>
                                    <i className={`fa-solid ${def.icon} text-xl text-${def.color} mb-1 group-hover:scale-110 transition-transform`}></i>
                                    <span className="text-[9px] text-cyber-gray uppercase tracking-widest font-bold">{def.label}</span>
                                    {isEditMode ? (
                                        <input
                                            type="number"
                                            value={characterData.defenses[def.key]}
                                            onChange={(e) => updateDefense(def.key, e.target.value)}
                                            className="w-full bg-transparent text-center text-2xl font-bold text-white border-b border-cyber-yellow/30 focus:border-cyber-yellow outline-none"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-white">{characterData.defenses[def.key]}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border border-white/10 rounded-xl p-4 flex flex-col glass-card">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-cyber-gray text-xs font-bold tracking-[0.2em] uppercase pl-3 border-l-4 border-cyber-yellow font-display">Resistência a dano</h3>
                            {isEditMode && (
                                <button onClick={openResistancesModal} className="text-cyber-gray hover:text-white transition-colors">
                                    <i className="fa-solid fa-pen-to-square text-xs"></i>
                                </button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {/* Resistências (Valor > 0 e não vulnerável) */}
                            {Object.entries(characterData.resistances || {}).some(([key, res]) => res.value > 0 && !res.vulnerable && !res.immunity) && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-cyber-green text-[16px]">verified_user</span>
                                        <span className="text-[10px] font-bold text-cyber-green uppercase tracking-tighter">Resistências</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(DAMAGE_RESISTANCES).flatMap(([catKey, cat]) =>
                                            cat.types.map(type => {
                                                const res = characterData.resistances[type.key];
                                                if (res && res.value > 0 && !res.vulnerable && !res.immunity) {
                                                    return (
                                                        <span key={type.key} className="bg-cyber-green/10 border border-cyber-green/30 text-cyber-green px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1">
                                                            <i className={`fa-solid ${type.icon} text-[9px]`}></i> {type.name} ({res.value})
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Imunidades */}
                            {Object.entries(characterData.resistances || {}).some(([key, res]) => res.immunity) && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-cyber-cyan text-[16px]">security</span>
                                        <span className="text-[10px] font-bold text-cyber-cyan uppercase tracking-tighter">Imunidades</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(DAMAGE_RESISTANCES).flatMap(([catKey, cat]) =>
                                            cat.types.map(type => {
                                                const res = characterData.resistances[type.key];
                                                if (res && res.immunity) {
                                                    return (
                                                        <span key={type.key} className="bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1">
                                                            <i className={`fa-solid ${type.icon} text-[9px]`}></i> {type.name}
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Vulnerabilidades */}
                            {Object.entries(characterData.resistances || {}).some(([key, res]) => res.vulnerable || (res.value > 0 && res.vulnerable)) && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-cyber-red text-[16px]">warning</span>
                                        <span className="text-[10px] font-bold text-cyber-red uppercase tracking-tighter">Vulnerabilidades</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(DAMAGE_RESISTANCES).flatMap(([catKey, cat]) =>
                                            cat.types.map(type => {
                                                const res = characterData.resistances[type.key];
                                                if (res && (res.vulnerable)) {
                                                    return (
                                                        <span key={type.key} className="bg-cyber-red/10 border border-cyber-red/30 text-cyber-red px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1">
                                                            <i className={`fa-solid ${type.icon} text-[9px]`}></i> {type.name} {res.value > 0 ? `(${res.value})` : ''}
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border border-white/10 rounded-xl p-4 flex flex-col glass-card">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-cyber-gray text-xs font-bold tracking-[0.2em] uppercase pl-3 border-l-4 border-cyber-pink font-display">Condições ativas</h3>
                            {isEditMode && (
                                <button onClick={openConditionsModal} className="text-cyber-gray hover:text-white transition-colors">
                                    <i className="fa-solid fa-pen-to-square text-xs"></i>
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 p-2 rounded-lg bg-black/20 border border-white/5 min-h-[60px]">
                            {Object.entries(characterData.conditions || {}).map(([key, cond]) => {
                                if (!cond.active) return null;

                                // Find condition info from rules
                                let condInfo = null;
                                let colorClass = 'cyber-pink';
                                Object.values(CONDITIONS).forEach(cat => {
                                    const item = cat.items.find(i => i.key === key);
                                    if (item) {
                                        condInfo = item;
                                        colorClass = cat.color;
                                    }
                                });

                                if (!condInfo) return null;

                                const rgbMap = {
                                    'cyber-pink': '255,0,153',
                                    'cyber-purple': '189,0,255',
                                    'cyber-green': '57,255,20'
                                };
                                const rgb = rgbMap[colorClass] || '136,136,153';

                                return (
                                    <div
                                        key={key}
                                        className={`px-2 py-1 bg-${colorClass}/10 border border-${colorClass}/30 text-${colorClass} rounded text-[10px] font-bold uppercase flex items-center gap-2 shadow-[0_0_5px_rgba(${rgb},0.3)]`}
                                    >
                                        <i className={`fa-solid ${condInfo.icon}`}></i>
                                        <span>{condInfo.name}</span>
                                        <div className="flex items-center bg-black/30 rounded px-1 ml-1 border border-white/5">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (cond.level > 1) {
                                                        updateActiveCondition(key, 'level', cond.level - 1);
                                                    } else {
                                                        updateActiveCondition(key, 'active', false);
                                                    }
                                                }}
                                                className="w-4 h-4 flex items-center justify-center hover:text-white transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="min-w-[12px] text-center text-white">{cond.level}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateActiveCondition(key, 'level', cond.level + 1); }}
                                                className="w-4 h-4 flex items-center justify-center hover:text-white transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            {!Object.values(characterData.conditions || {}).some(c => c.active) && (
                                <span className="text-cyber-gray text-[10px] italic opacity-50 flex items-center justify-center w-full">Nenhuma condição ativa</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 5. STATUS E CONDIÇÕES */}
                <div className="lg:col-span-3 border border-white/10 rounded-xl p-4 flex flex-col glass-card">
                    <h3 className="text-cyber-gray text-xs font-bold tracking-[0.2em] uppercase mb-6 pl-3 border-l-4 border-cyber-yellow font-display">Status e Condições</h3>
                    <div className="flex flex-col gap-6 items-center mb-6">
                        <CircularProgress
                            value={characterData.vitality.current}
                            max={characterData.vitality.max}
                            color="#ff0099"
                            label="Vitalidade"
                            sublabel="Ferida"
                            statusKey="vitality"
                            isEditMode={isEditMode}
                        />
                        <CircularProgress
                            value={characterData.focus.current}
                            max={characterData.focus.max}
                            color="#bd00ff"
                            label="Foco"
                            sublabel="Fadiga"
                            statusKey="focus"
                            isEditMode={isEditMode}
                        />
                        <CircularProgress
                            value={characterData.will.current}
                            max={characterData.will.max}
                            color="#ffd700"
                            label="Vontade"
                            sublabel="Trauma"
                            statusKey="will"
                            isEditMode={isEditMode}
                        />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={activeModal === 'weapon'} onClose={() => setActiveModal(null)} maxWidth="max-w-2xl">
                <ModalHeader onClose={() => setActiveModal(null)} className="bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-cyber-pink/20 border border-cyber-pink/50 flex items-center justify-center shadow-neon-pink text-cyber-pink-shadow"><i className="fa-solid fa-sword text-cyber-pink text-xl text-glow-pink"></i></div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-white uppercase font-display">{selectedAttack ? 'Editar Ataque' : 'Novo Ataque'}</h2>
                            <p className="text-cyber-gray text-xs font-semibold tracking-widest uppercase font-mono">{attackForm.name || 'Nova Arma'}</p>
                        </div>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-cyber-gray uppercase font-bold ml-1 tracking-widest">Nome da Arma</label>
                            <input
                                className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white outline-none focus:border-cyber-pink transition-all"
                                type="text"
                                value={attackForm.name}
                                onChange={(e) => setAttackForm({ ...attackForm, name: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-cyber-gray uppercase font-bold ml-1 tracking-widest">Ação Pública (AP)</label>
                            <input
                                className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white font-mono outline-none focus:border-cyber-pink transition-all"
                                type="number"
                                value={attackForm.ap}
                                onChange={(e) => setAttackForm({ ...attackForm, ap: Math.max(0, parseInt(e.target.value) || 0) })}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-3 bg-white/5 p-3 rounded-xl border border-white/5 col-span-1 md:col-span-2">
                            <div>
                                <label className="block text-[9px] font-bold text-cyber-purple uppercase mb-1 ml-1 tracking-widest">Custo Foco</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/40 border border-white/10 text-gray-200 rounded-lg px-3 py-1.5 font-mono text-sm focus:border-cyber-purple focus:outline-none transition-all"
                                    value={attackForm.costs.focus || 0}
                                    onChange={(e) => setAttackForm({ ...attackForm, costs: { ...attackForm.costs, focus: Math.max(0, parseInt(e.target.value) || 0) } })}
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold text-cyber-yellow uppercase mb-1 ml-1 tracking-widest">Custo Vontade</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/40 border border-white/10 text-gray-200 rounded-lg px-3 py-1.5 font-mono text-sm focus:border-cyber-yellow focus:outline-none transition-all"
                                    value={attackForm.costs.will || 0}
                                    onChange={(e) => setAttackForm({ ...attackForm, costs: { ...attackForm.costs, will: Math.max(0, parseInt(e.target.value) || 0) } })}
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold text-cyber-pink uppercase mb-1 ml-1 tracking-widest">Custo Vida</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/40 border border-white/10 text-gray-200 rounded-lg px-3 py-1.5 font-mono text-sm focus:border-cyber-pink focus:outline-none transition-all"
                                    value={attackForm.costs.vitality || 0}
                                    onChange={(e) => setAttackForm({ ...attackForm, costs: { ...attackForm.costs, vitality: Math.max(0, parseInt(e.target.value) || 0) } })}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-cyber-gray uppercase font-bold ml-1 tracking-widest">Dano</label>
                            <input
                                className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white font-mono outline-none focus:border-cyber-pink transition-all"
                                type="number"
                                min="0"
                                value={attackForm.damage}
                                onChange={(e) => setAttackForm({ ...attackForm, damage: Math.max(0, parseInt(e.target.value) || 0) })}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-cyber-gray uppercase font-bold ml-1 tracking-widest">Alcance</label>
                            <input
                                className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white font-mono outline-none focus:border-cyber-pink transition-all"
                                type="text"
                                value={attackForm.range}
                                onChange={(e) => setAttackForm({ ...attackForm, range: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                            <label className="text-[10px] text-cyber-gray uppercase font-bold ml-1 tracking-widest">Perícia Associada</label>
                            <select
                                className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white outline-none focus:border-cyber-pink transition-all"
                                value={attackForm.skill}
                                onChange={(e) => setAttackForm({ ...attackForm, skill: e.target.value })}
                            >
                                {Object.values(characterData.skillCategories).flatMap(cat => cat.skills).map(skill => (
                                    <option key={skill.name} value={skill.name}>{skill.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                            <label className="text-[10px] text-cyber-gray uppercase font-bold ml-1 tracking-widest">Tipo de Dano</label>
                            <select
                                className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white outline-none focus:border-cyber-pink transition-all font-sans"
                                value={attackForm.damageType}
                                onChange={(e) => setAttackForm({ ...attackForm, damageType: e.target.value })}
                            >
                                {Object.values(DAMAGE_RESISTANCES).flatMap(cat => cat.types).map(type => (
                                    <option key={type.key} value={type.key}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                            <label className="text-[10px] text-cyber-gray uppercase font-bold ml-1 tracking-widest">Propriedades</label>
                            <input
                                className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white outline-none focus:border-cyber-pink transition-all"
                                type="text"
                                placeholder="Ex: Leve, Versátil, Perigosa..."
                                value={attackForm.properties}
                                onChange={(e) => setAttackForm({ ...attackForm, properties: e.target.value })}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="bg-black/60 flex justify-between">
                    {selectedAttack ? (
                        <button onClick={handleDeleteAttack} className="px-6 py-2.5 rounded-lg border border-cyber-red/50 text-cyber-red font-bold uppercase text-xs hover:bg-cyber-red/10 transition-all">Excluir</button>
                    ) : (
                        <div></div>
                    )}
                    <button onClick={handleSaveAttack} className="px-8 py-2.5 rounded-lg bg-cyber-pink text-white font-extrabold uppercase text-xs shadow-neon-pink hover:scale-105 transition-all">Salvar</button>
                </ModalFooter>
            </Modal >

            {/* Other modals (Resistances, Armor, Conditions) following the same logic */}
            {/* Modal de Armadura */}
            <Modal isOpen={activeModal === 'armor'} onClose={() => setActiveModal(null)} maxWidth="max-w-2xl">
                <ModalHeader onClose={() => setActiveModal(null)} className="bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-cyber-yellow/20 border border-cyber-yellow/50 flex items-center justify-center shadow-neon-yellow text-cyber-yellow-shadow">
                            <i className={`fa-solid ${ARMOR_TYPES[armorForm.type]?.icon || 'fa-shield-halved'} text-cyber-yellow text-xl text-glow-yellow`}></i>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-white uppercase font-display">{selectedArmor ? 'Editar Defesa' : 'Nova Defesa'}</h2>
                            <p className="text-cyber-gray text-xs font-semibold tracking-widest uppercase font-mono">{armorForm.name || 'Nova Defesa'}</p>
                        </div>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-cyber-gray uppercase font-bold ml-1 tracking-widest">Nome da Defesa</label>
                            <input
                                className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white outline-none focus:border-cyber-yellow transition-all"
                                type="text"
                                value={armorForm.name}
                                onChange={(e) => setArmorForm({ ...armorForm, name: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-cyber-gray uppercase font-bold ml-1 tracking-widest">Valor de Proteção (MAX)</label>
                            <input
                                className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white font-mono outline-none focus:border-cyber-yellow transition-all"
                                type="number"
                                value={armorForm.max}
                                onChange={(e) => setArmorForm({ ...armorForm, max: parseInt(e.target.value) || 0, current: selectedArmor ? armorForm.current : parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-cyber-gray uppercase font-bold ml-1 tracking-widest">Tipo</label>
                            <select
                                className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white outline-none focus:border-cyber-yellow transition-all font-sans"
                                value={armorForm.type}
                                onChange={(e) => setArmorForm({ ...armorForm, type: e.target.value })}
                            >
                                {Object.entries(ARMOR_TYPES).map(([key, info]) => (
                                    <option key={key} value={key}>{info.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-cyber-gray uppercase font-bold ml-1 tracking-widest">Bônus de Reflexo</label>
                            <input
                                className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white font-mono outline-none focus:border-cyber-yellow transition-all"
                                type="number"
                                value={armorForm.reflexBonus}
                                onChange={(e) => setArmorForm({ ...armorForm, reflexBonus: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                            <label className="text-[10px] text-cyber-gray uppercase font-bold ml-1 tracking-widest">Propriedades</label>
                            <input
                                className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white outline-none focus:border-cyber-yellow transition-all"
                                type="text"
                                placeholder="Ex: Pesada, Selada, Energizada..."
                                value={armorForm.properties}
                                onChange={(e) => setArmorForm({ ...armorForm, properties: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                            <label className="text-[10px] text-cyber-gray uppercase font-bold ml-1 tracking-widest">Notas/Observações</label>
                            <textarea
                                className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white min-h-[80px] outline-none focus:border-cyber-yellow transition-all resize-none"
                                value={armorForm.notes}
                                onChange={(e) => setArmorForm({ ...armorForm, notes: e.target.value })}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="bg-black/60 flex justify-between">
                    {selectedArmor ? (
                        <button onClick={handleDeleteArmor} className="px-6 py-2.5 rounded-lg border border-cyber-red/50 text-cyber-red font-bold uppercase text-xs hover:bg-cyber-red/10 transition-all">Excluir</button>
                    ) : (
                        <div></div>
                    )}
                    <button onClick={handleSaveArmor} className="px-8 py-2.5 rounded-lg bg-cyber-yellow text-black font-extrabold uppercase text-xs shadow-neon-yellow hover:scale-105 transition-all">Salvar</button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={activeModal === 'resistances'} onClose={() => setActiveModal(null)} maxWidth="max-w-4xl">
                <ModalHeader onClose={() => setActiveModal(null)} className="bg-black/40 border-b border-white/10">
                    <div>
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-white text-glow-purple">Editar Resistências</h2>
                        <p className="text-xs text-cyber-gray mt-1 uppercase tracking-tighter">Ajuste valores, imunidades e vulnerabilidades</p>
                    </div>
                </ModalHeader>
                <ModalBody className="p-6 overflow-y-auto space-y-8 max-h-[70vh]">
                    {Object.entries(DAMAGE_RESISTANCES).map(([catKey, category]) => (
                        <section key={catKey}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`h-px flex-grow bg-gradient-to-r ${catKey === 'mundane' ? 'from-cyber-pink' : catKey === 'elemental' ? 'from-cyber-purple' : catKey === 'intangible' ? 'from-cyber-yellow' : 'from-cyber-cyan'} to-transparent opacity-30`}></div>
                                <h3 className={`font-bold uppercase tracking-widest text-sm flex items-center gap-2 ${catKey === 'mundane' ? 'text-cyber-pink' : catKey === 'elemental' ? 'text-cyber-purple' : catKey === 'intangible' ? 'text-cyber-yellow' : 'text-cyber-cyan'}`}>
                                    <i className={`fa-solid ${category.icon}`}></i> {category.label}
                                </h3>
                                <div className={`h-px flex-grow bg-gradient-to-l ${catKey === 'mundane' ? 'from-cyber-pink' : catKey === 'elemental' ? 'from-cyber-purple' : catKey === 'intangible' ? 'from-cyber-yellow' : 'from-cyber-cyan'} to-transparent opacity-30`}></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {category.types.map(type => {
                                    const res = tempResistances[type.key] || { value: 0, immunity: false, vulnerable: false };
                                    const catColor = catKey === 'mundane' ? 'cyber-pink' : catKey === 'elemental' ? 'cyber-purple' : catKey === 'intangible' ? 'cyber-yellow' : 'cyber-cyan';

                                    return (
                                        <div key={type.key} className={`bg-black/40 border border-${catColor}/20 rounded-lg p-3 flex flex-col gap-3 transition-all ${res.value > 0 || res.immunity || res.vulnerable ? 'border-opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.5)]' : 'border-opacity-20'}`}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-white font-semibold flex items-center gap-2 text-sm uppercase truncate">
                                                    <i className={`fa-solid ${type.icon} text-${catColor}/80`}></i> {type.name}
                                                </span>
                                                <input
                                                    className={`bg-black/40 border border-${catColor}/30 rounded px-2 py-1 text-center w-12 text-sm focus:outline-none focus:border-${catColor}/60 transition-colors font-mono text-${catColor} ${res.immunity ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                    type="number"
                                                    min="0"
                                                    disabled={res.immunity}
                                                    value={res.value}
                                                    onChange={(e) => updateTempResistance(type.key, 'value', e.target.value)}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                                <label
                                                    onClick={() => updateTempResistance(type.key, 'immunity', !res.immunity)}
                                                    className="flex items-center gap-2 cursor-pointer group"
                                                >
                                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${res.immunity ? 'bg-cyber-green border-cyber-green shadow-[0_0_10px_rgba(57,255,20,0.5)]' : 'border-cyber-green/30 group-hover:border-cyber-green/50'}`}>
                                                        {res.immunity && <i className="fa-solid fa-check text-[10px] text-white"></i>}
                                                    </div>
                                                    <span className={`text-[10px] uppercase font-bold tracking-tighter transition-colors ${res.immunity ? 'text-cyber-green' : 'text-cyber-gray group-hover:text-cyber-green'}`}>Imune</span>
                                                </label>
                                                <label
                                                    onClick={() => updateTempResistance(type.key, 'vulnerable', !res.vulnerable)}
                                                    className="flex items-center gap-2 cursor-pointer group"
                                                >
                                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${res.vulnerable ? 'bg-cyber-red border-cyber-red shadow-[0_0_10px_rgba(255,49,49,0.5)]' : 'border-cyber-red/30 group-hover:border-cyber-red/50'}`}>
                                                        {res.vulnerable && <i className="fa-solid fa-check text-[10px] text-white"></i>}
                                                    </div>
                                                    <span className={`text-[10px] uppercase font-bold tracking-tighter transition-colors ${res.vulnerable ? 'text-cyber-red' : 'text-cyber-gray group-hover:text-cyber-red'}`}>Vuln.</span>
                                                </label>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </ModalBody>
                <ModalFooter className="bg-black/60 flex justify-end p-6 border-t border-white/10">
                    <button onClick={handleSaveResistances} className="px-8 py-2 bg-gradient-to-r from-cyber-purple to-cyber-pink rounded text-sm font-bold uppercase tracking-widest text-white shadow-neon-pink hover:scale-105 active:scale-95 transition-all">Salvar</button>
                </ModalFooter>
            </Modal>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteAttack}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja excluir o ataque "${attackToDelete?.name}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
            />

            <ConfirmationModal
                isOpen={isArmorDeleteModalOpen}
                onClose={() => setIsArmorDeleteModalOpen(false)}
                onConfirm={confirmDeleteArmor}
                title="Deletar Armadura"
                message={`Deseja realmente apagar a armadura "${armorToDelete?.name}"?`}
                confirmText="Deletar"
            />

            <Modal isOpen={activeModal === 'conditions'} onClose={() => setActiveModal(null)} maxWidth="max-w-6xl">
                <ModalHeader onClose={() => setActiveModal(null)} className="bg-gradient-to-r from-cyber-purple/10 to-transparent border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-cyber-pink text-3xl">warning</span>
                        <div>
                            <h2 className="text-2xl font-bold tracking-wider uppercase italic leading-tight text-white">Editar Condições Ativas</h2>
                            <p className="text-[10px] text-cyber-gray tracking-[0.3em] uppercase">Módulo de Alteração de Estado de Combate</p>
                        </div>
                    </div>
                </ModalHeader>
                <ModalBody className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {Object.entries(CONDITIONS).map(([catKey, category]) => (
                            <section key={catKey} className="space-y-4">
                                <div className={`flex items-center gap-3 mb-6 border-l-4 border-${category.color.replace('cyber-', '')} pl-3`}>
                                    <h3 className={`text-${category.color} text-sm font-bold tracking-[0.2em] uppercase`}>{category.label}</h3>
                                </div>
                                <div className="space-y-3">
                                    {category.items.map(item => {
                                        const cond = tempConditions[item.key] || { active: false, level: 1 };
                                        const colorName = category.color.replace('cyber-', '');
                                        return (
                                            <div key={item.key} className={`flex items-center justify-between p-4 rounded-xl bg-black/40 border transition-all group ${cond.active ? `border-${category.color}/40 bg-${category.color}/5` : 'border-white/5 hover:border-white/10'}`}>
                                                <div className="flex items-center gap-4">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={cond.active}
                                                            onChange={(e) => updateTempCondition(item.key, 'active', e.target.checked)}
                                                        />
                                                        <div className={`w-10 h-5 bg-white/10 rounded-full transition-colors peer-checked:bg-${category.color}/50 border border-white/10 relative`}>
                                                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${cond.active ? 'translate-x-5' : ''}`}></div>
                                                        </div>
                                                    </label>

                                                    {cond.active && (
                                                        <div className="flex items-center gap-1 bg-black/40 rounded-lg border border-white/10 p-1 animate-scale-up">
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateTempCondition(item.key, 'level', Math.max(1, cond.level - 1)); }}
                                                                className={`w-6 h-6 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all`}
                                                            >
                                                                <i className="fa-solid fa-minus text-[10px]"></i>
                                                            </button>
                                                            <div className={`w-8 text-center font-display font-bold text-sm text-${category.color} text-glow-${colorName}`}>
                                                                {cond.level}
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateTempCondition(item.key, 'level', cond.level + 1); }}
                                                                className={`w-6 h-6 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all`}
                                                            >
                                                                <i className="fa-solid fa-plus text-[10px]"></i>
                                                            </button>
                                                        </div>
                                                    )}

                                                    <span className={`text-sm font-bold tracking-widest uppercase transition-colors ${cond.active ? `text-${category.color} text-glow-${colorName}` : 'text-cyber-gray group-hover:text-white'}`}>
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                </ModalBody>
                <ModalFooter className="p-8 border-t border-white/10 bg-black/60 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-3 text-cyber-gray italic text-xs uppercase tracking-widest">
                        <i className="fa-solid fa-circle-info"></i>
                        <span>Níveis elevados aumentam as penalidades dos testes. Clique no número para alterar o nível.</span>
                    </div>
                    <button
                        onClick={handleSaveConditions}
                        className="w-full max-w-xs py-4 bg-cyber-pink hover:bg-cyber-pink/80 text-white font-bold uppercase tracking-[0.2em] rounded-lg shadow-neon-pink transition-all"
                    >
                        Confirmar Alterações
                    </button>
                </ModalFooter>
            </Modal>


            <SkillRollModal
                isOpen={!!rollingSkill}
                onClose={() => { setRollingSkill(null); setRollingSource(null); }}
                skill={rollingSkill}
                allAttributes={characterData.attributes}
                sourceItem={rollingSource}
                onConfirm={handleRollConfirm}
            />
        </div>
    );
};

export default CombatTab;
