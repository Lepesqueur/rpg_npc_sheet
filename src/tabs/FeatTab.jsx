import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ConfirmationModal } from '../components/Modal';
import SkillRollModal from '../components/SkillRollModal';
import { useCharacter } from '../context/CharacterContext';
import { useToast } from '../components/Toast';
import IconPicker from '../components/IconPicker';

const FeatTab = () => {
    const { characterData, isEditMode, addTalent, updateTalent, deleteTalent, consumeResources } = useCharacter();
    const { showToast } = useToast();
    const [viewingTalent, setViewingTalent] = useState(null);
    const [editingTalent, setEditingTalent] = useState(null); // Used for both Add and Edit
    const [itemToDelete, setItemToDelete] = useState(null);
    const [rollingSkill, setRollingSkill] = useState(null);
    const [rollingSource, setRollingSource] = useState(null);
    const [selectedPots, setSelectedPots] = useState([]); // Selected enhancements indices

    const talents = characterData.talents || [];
    const allSkills = Object.values(characterData.skillCategories).flatMap(cat => cat.skills);

    const handleActivateSkill = (skill) => {
        // Safe check for costs, defaulting to free if undefined
        const safeSkill = { ...skill, costs: skill.costs || {} };
        const totalCosts = calculateTotalCosts(safeSkill);
        const result = consumeResources(totalCosts);

        if (result.success) {
            showToast(`HABILIDADE "${skill.name}" ATIVADA COM SUCESSO!`, 'success');

            const related = skill.relatedSkill;
            const skillSource = { ...skill, costs: totalCosts }; // Pass totals to roll modal

            // Close the description modal
            setViewingTalent(null);

            if (related) {
                // Open roll modal with the already "paid" source
                handleRollSkill(related, skillSource);
            }
            setSelectedPots([]);
        } else {
            showToast(`RECURSOS INSUFICIENTES: ${result.missing.join(', ')}`, 'error');
        }
    };

    const calculateTotalCosts = (skill) => {
        const base = {
            focus: parseInt(skill.costs?.focus || 0),
            vitality: parseInt(skill.costs?.vitality || 0),
            will: parseInt(skill.costs?.will || 0)
        };

        if (skill.potencializacoes && selectedPots.length > 0) {
            selectedPots.forEach(idx => {
                const pot = skill.potencializacoes[idx];
                if (pot && pot.resource && pot.value) {
                    const val = parseInt(pot.value);
                    if (!isNaN(val)) {
                        base[pot.resource] = (base[pot.resource] || 0) + val;
                    }
                }
            });
        }
        return base;
    };

    const togglePot = (idx) => {
        setSelectedPots(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    const actions = talents.filter(t => t.category === 'actions');
    const specificTalents = talents.filter(t => t.category === 'talent');

    const handleDelete = (e, id) => {
        e.stopPropagation();
        const item = talents.find(t => t.id === id);
        setItemToDelete(item);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            deleteTalent(itemToDelete.id);
            setItemToDelete(null);
        }
    };

    const handleEdit = (e, item) => {
        e.stopPropagation();
        setEditingTalent(item);
    };

    const handleSave = (talentData) => {
        if (talentData.id) {
            updateTalent(talentData.id, talentData);
        } else {
            addTalent(talentData);
        }
        setEditingTalent(null);
        if (viewingTalent && viewingTalent.id === talentData.id) {
            setViewingTalent(talentData);
        }
    };

    const handleItemClick = (item) => {
        if (isEditMode) {
            setEditingTalent(item);
        } else {
            setViewingTalent(item);
        }
    };

    const handleRollSkill = (skillName, source) => {
        const skill = allSkills.find(s => s.name === skillName);
        if (skill) {
            setRollingSkill(skill);
            setRollingSource(source);
        } else {
            showToast(`ERRO: Perícia "${skillName}" não encontrada! Verifique o nome da perícia.`, 'error');
        }
    };

    const handleRollConfirm = (selectedAttrName, advantage) => {
        // Resources are already consumed in handleActivateSkill
        if (!rollingSkill || !selectedAttrName) return true;

        const attr = characterData.attributes.find(a => a.name === selectedAttrName);
        const attrValue = attr ? attr.value : 0;
        const skillLevel = rollingSkill.level || 0;

        const d20 = Math.floor(Math.random() * 20) + 1;
        const total = d20 + attrValue + skillLevel + advantage;

        showToast(
            `RESULTADO: ${total} (d20: ${d20} + ${selectedAttrName}: ${attrValue} + Perícia: ${skillLevel} + Ajuste: ${advantage})`,
            'success'
        );

        setSelectedPots([]);
        return true;
    };

    return (
        <div className="animate-fade-in">
            <section className="glass-card rounded-2xl p-6 min-h-[500px] flex flex-col">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-6 bg-cyber-pink shadow-neon-pink"></div>
                            <h2 className="text-white font-display font-bold text-lg tracking-widest uppercase">Habilidades & Talentos</h2>
                        </div>
                        {isEditMode && (
                            <button
                                onClick={() => setEditingTalent({ category: 'actions', tags: ['Habilidade Ativa'], stats: {}, potencializacoes: [] })}
                                className="w-8 h-8 rounded-lg bg-cyber-pink/20 border border-cyber-pink/40 text-cyber-pink hover:bg-cyber-pink/30 transition-all flex items-center justify-center"
                            >
                                <i className="fa-solid fa-plus text-xs"></i>
                            </button>
                        )}
                    </div>
                    <div className="space-y-4">
                        {talents.map((item) => {
                            const isAction = item.category === 'actions';
                            const mainColor = isAction ? 'cyber-pink' : 'cyber-yellow';
                            const mainColorBg = isAction ? 'bg-cyber-pink' : 'bg-cyber-yellow';
                            const mainColorBorder = isAction ? 'border-cyber-pink' : 'border-cyber-yellow';
                            const mainColorText = isAction ? 'text-cyber-pink' : 'text-cyber-yellow';
                            const shadowColor = isAction ? 'shadow-[0_0_15px_rgba(255,0,153,0.1)]' : 'shadow-[0_0_15px_rgba(255,215,0,0.1)]';

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleItemClick(item)}
                                    className={`group relative bg-white/5 border border-white/10 ${isEditMode ? `hover:${mainColorBorder} ${mainColorBg}/5 ${shadowColor}` : `hover:${mainColorBorder}/50`} rounded-xl p-5 transition-all duration-300 cursor-pointer`}
                                >
                                    <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                                        <div className="flex items-center gap-2">
                                            {item.costs?.focus > 0 && (
                                                <span className="flex items-center gap-0.5 text-cyber-purple text-[10px] font-bold" title="Custo de Foco">
                                                    <i className="fa-solid fa-bolt text-[9px]"></i> {item.costs.focus}
                                                </span>
                                            )}
                                            {item.costs?.will > 0 && (
                                                <span className="flex items-center gap-0.5 text-cyber-yellow text-[10px] font-bold" title="Custo de Vontade">
                                                    <i className="fa-solid fa-brain text-[9px]"></i> {item.costs.will}
                                                </span>
                                            )}
                                            {item.costs?.vitality > 0 && (
                                                <span className="flex items-center gap-0.5 text-cyber-pink text-[10px] font-bold" title="Custo de Vitalidade">
                                                    <i className="fa-solid fa-heart text-[9px]"></i> {item.costs.vitality}
                                                </span>
                                            )}
                                            <span className={`px-2 py-0.5 ${mainColorBg}/20 ${mainColorText} text-[10px] font-bold border ${mainColorBorder}/30 rounded uppercase`}>
                                                {item.pa} PA
                                            </span>
                                        </div>
                                        {isEditMode && (
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => handleDelete(e, item.id)}
                                                    className={`text-gray-500 hover:${mainColorText} transition-colors p-1`}
                                                >
                                                    <i className="fa-solid fa-trash text-xs"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${mainColorBg}/10 border ${mainColorBorder}/20 group-hover:shadow-[0_0_10px_currentColor] transition-all text-${mainColor}`}>
                                            <i className={`fa-solid ${item.icon || (isAction ? 'fa-burst' : 'fa-star')} text-2xl`}></i>
                                        </div>
                                        <div className="flex-grow pr-16">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-display text-white font-bold tracking-wider uppercase">{item.name}</h3>
                                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-500 font-bold uppercase tracking-tighter">
                                                    {item.stats?.ativacao || (isAction ? 'Ação' : 'Passiva')}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Modal de Detalhes - Baseado no modal_talento.html */}
            <Modal isOpen={!!viewingTalent} onClose={() => { setViewingTalent(null); setSelectedPots([]); }} maxWidth="max-w-2xl">
                <div className="relative z-50 overflow-hidden rounded-3xl">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${viewingTalent?.category === 'actions' ? 'via-cyber-pink' : 'via-cyber-yellow'} to-transparent opacity-50 z-20`}></div>

                    <div className="p-6 md:p-8 flex items-start justify-between border-b border-white/10 bg-zinc-950/98 backdrop-blur-xl">
                        <div className="flex items-center gap-5">
                            <div className={`w-16 h-16 rounded-2xl ${viewingTalent?.category === 'actions' ? 'bg-cyber-pink/10 border-cyber-pink/40 text-cyber-pink shadow-[0_0_20px_rgba(255,0,153,0.2)]' : 'bg-cyber-yellow/10 border-cyber-yellow/40 text-cyber-yellow shadow-[0_0_20px_rgba(255,215,0,0.2)]'} border flex items-center justify-center relative`}>
                                <i className={`fa-solid ${viewingTalent?.icon || (viewingTalent?.category === 'actions' ? 'fa-burst' : 'fa-star')} text-4xl`}></i>
                                {viewingTalent?.pa !== undefined && (
                                    <div className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md border font-display font-black text-xs shadow-lg ${viewingTalent?.category === 'actions' ? 'bg-cyber-pink border-white/20 text-white shadow-cyber-pink/40' : 'bg-cyber-yellow border-black/10 text-zinc-900 shadow-cyber-yellow/40'}`}>
                                        {viewingTalent.pa} PA
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-3xl font-display font-bold uppercase tracking-wider text-white">{viewingTalent?.name}</h2>
                                    {isEditMode && (
                                        <button
                                            onClick={(e) => { handleEdit(e, viewingTalent); }}
                                            className="text-slate-400 hover:text-cyber-pink transition-colors p-1" title="Editar Talento"
                                        >
                                            <i className="fa-solid fa-pen-to-square text-lg"></i>
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                    {viewingTalent?.tags?.map((tag, idx) => (
                                        <React.Fragment key={tag}>
                                            <span className={`px-2.5 py-0.5 rounded-md ${idx === 0 ? 'bg-cyber-pink/20 border-cyber-pink/40 text-cyber-pink' : 'bg-white/5 border-white/10 text-slate-300'} border text-[10px] font-bold uppercase tracking-widest`}>
                                                {tag}
                                            </span>
                                            {idx < viewingTalent.tags.length - 1 && <span className="w-1 h-1 rounded-full bg-slate-600"></span>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                {(() => {
                                    const totals = calculateTotalCosts(viewingTalent || {});
                                    return (
                                        <>
                                            {totals.focus > 0 && (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-bold text-cyber-purple/70 uppercase tracking-tighter leading-none mb-1">Foco</span>
                                                    <div className="bg-cyber-purple text-white font-display font-bold px-3 py-1 rounded-lg text-lg shadow-lg shadow-cyber-purple/20">
                                                        {totals.focus}
                                                    </div>
                                                </div>
                                            )}
                                            {totals.will > 0 && (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-bold text-cyber-yellow/70 uppercase tracking-tighter leading-none mb-1">Vontade</span>
                                                    <div className="bg-cyber-yellow text-zinc-900 font-display font-bold px-3 py-1 rounded-lg text-lg shadow-lg shadow-cyber-yellow/20">
                                                        {totals.will}
                                                    </div>
                                                </div>
                                            )}
                                            {totals.vitality > 0 && (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-bold text-cyber-pink/70 uppercase tracking-tighter leading-none mb-1">Vida</span>
                                                    <div className="bg-cyber-pink text-white font-display font-bold px-3 py-1 rounded-lg text-lg shadow-lg shadow-cyber-pink/20">
                                                        {totals.vitality}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                            <button onClick={() => { setViewingTalent(null); setSelectedPots([]); }} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
                                <i className="fa-solid fa-xmark text-slate-400 group-hover:text-white"></i>
                            </button>
                        </div>
                    </div>

                    <ModalBody className="p-6 md:p-8 space-y-8 overflow-y-auto max-h-[60vh] bg-zinc-950/98 backdrop-blur-xl custom-scrollbar">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Duração', value: viewingTalent?.stats?.duracao },
                                { label: 'Ativação', value: viewingTalent?.stats?.ativacao },
                                { label: 'Alcance', value: viewingTalent?.stats?.alcance },
                                { label: 'Alvo', value: viewingTalent?.stats?.alvo }
                            ].map(stat => (
                                <div key={stat.label} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">{stat.label}</span>
                                    <span className="font-display text-lg text-slate-200">{stat.value || '-'}</span>
                                </div>
                            ))}
                        </div>

                        {/* Perícia Relacionada */}
                        {viewingTalent?.relatedSkill && (
                            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center text-cyber-blue">
                                        <i className="fa-solid fa-graduation-cap"></i>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-1">Perícia Relacionada</span>
                                        <span className="text-white font-bold uppercase tracking-wider">{viewingTalent.relatedSkill}</span>
                                    </div>
                                </div>
                                <div className="text-[10px] text-cyber-blue/50 font-black uppercase tracking-widest italic pr-2">
                                    Teste automático ao ativar
                                </div>
                            </div>
                        )}

                        {/* Descrição */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-align-left text-cyber-pink text-sm"></i>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Descrição</h3>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                <p className="text-slate-300 leading-relaxed">
                                    {viewingTalent?.fullDescription || viewingTalent?.description}
                                </p>
                            </div>
                        </div>

                        {/* Potencializações */}
                        {viewingTalent?.potencializacoes?.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <i className="fa-solid fa-bolt text-cyber-yellow text-sm"></i>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Potencializações</h3>
                                    </div>
                                    <span className="text-[10px] text-cyber-yellow font-bold uppercase">Melhorar Habilidade</span>
                                </div>
                                <div className="grid gap-3">
                                    {viewingTalent.potencializacoes.map((pot, idx) => {
                                        const resourceColours = {
                                            focus: 'hover:border-cyber-purple/30 group-hover:text-cyber-purple',
                                            will: 'hover:border-cyber-yellow/30 group-hover:text-cyber-yellow',
                                            vitality: 'hover:border-cyber-pink/30 group-hover:text-cyber-pink'
                                        };
                                        const textColours = {
                                            focus: 'text-cyber-purple',
                                            will: 'text-cyber-yellow',
                                            vitality: 'text-cyber-pink'
                                        };
                                        const isSelected = selectedPots.includes(idx);
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => togglePot(idx)}
                                                className={`group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border transition-all cursor-pointer ${isSelected
                                                    ? `border-${pot.resource === 'focus' ? 'cyber-purple' : pot.resource === 'will' ? 'cyber-yellow' : 'cyber-pink'} bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]`
                                                    : 'border-white/5'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 flex-grow">
                                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
                                                        ? `border-${pot.resource === 'focus' ? 'cyber-purple' : pot.resource === 'will' ? 'cyber-yellow' : 'cyber-pink'} bg-${pot.resource === 'focus' ? 'cyber-purple' : pot.resource === 'will' ? 'cyber-yellow' : 'cyber-pink'}`
                                                        : 'border-white/20'
                                                        }`}>
                                                        {isSelected && <i className="fa-solid fa-check text-[10px] text-white"></i>}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`font-medium transition-colors ${isSelected ? 'text-white' : 'text-slate-200'}`}>{pot.name}</span>
                                                        <span className="text-xs text-slate-500 italic">{pot.effect}</span>
                                                    </div>
                                                </div>
                                                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-800 border ${isSelected ? 'border-white/20 shadow-inner' : 'border-white/10'}`}>
                                                    <span className={`text-xs font-bold ${textColours[pot.resource]}`}>+{pot.value} {pot.resource?.toUpperCase()}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </ModalBody>

                    <ModalFooter className="p-6 bg-zinc-950 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <button className="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 order-2 md:order-1">
                            <i className="fa-solid fa-circle-question text-sm"></i>
                            Ver Regras Detalhadas
                        </button>
                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto order-1 md:order-2">
                            <button onClick={() => { setViewingTalent(null); setSelectedPots([]); }} className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Cancelar</button>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                {isEditMode && (
                                    <button
                                        onClick={(e) => handleEdit(e, viewingTalent)}
                                        className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-cyber-pink text-cyber-pink hover:bg-cyber-pink/10 font-bold uppercase tracking-wide text-sm transition-all active:scale-95 shadow-[0_0_10px_rgba(255,0,153,0.1)]"
                                    >
                                        Editar Talento
                                    </button>
                                )}
                                <button
                                    onClick={() => handleActivateSkill(viewingTalent)}
                                    className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-cyber-pink hover:brightness-110 text-white font-bold text-sm shadow-lg shadow-cyber-pink/20 transition-all active:scale-95 uppercase tracking-wide"
                                >
                                    Ativar Habilidade
                                </button>
                            </div>
                        </div>
                    </ModalFooter>
                </div>
            </Modal>

            <SkillRollModal
                isOpen={!!rollingSkill}
                onClose={() => { setRollingSkill(null); setRollingSource(null); }}
                skill={rollingSkill}
                allAttributes={characterData.attributes}
                sourceItem={rollingSource}
                onConfirm={handleRollConfirm}
            />

            {/* TalentFormModal */}
            <TalentFormModal
                isOpen={!!editingTalent}
                onClose={() => setEditingTalent(null)}
                onSave={handleSave}
                initialData={editingTalent}
            />

            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={confirmDelete}
                title="Excluir Item"
                message={`Deseja realmente excluir "${itemToDelete?.name}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
            />
        </div>
    );
};

const TalentFormModal = ({ isOpen, onClose, onSave, initialData }) => {
    const { characterData } = useCharacter();
    const [formData, setFormData] = useState(initialData);
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const allSkills = Object.values(characterData.skillCategories).flatMap(cat => cat.skills);

    // Sync state when initialData changes
    React.useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                tags: initialData.tags || [],
                stats: initialData.stats || {},
                potencializacoes: initialData.potencializacoes || []
            });
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTagChange = (e) => {
        const tags = e.target.value.split(',').map(tag => tag.trim());
        setFormData(prev => ({ ...prev, tags }));
    };

    const addPotencializacao = () => {
        setFormData(prev => ({
            ...prev,
            potencializacoes: [...prev.potencializacoes, { name: '', effect: '', resource: 'focus', value: 0 }]
        }));
    };

    const updatePotencializacao = (index, field, value) => {
        const newPots = [...formData.potencializacoes];
        newPots[index] = { ...newPots[index], [field]: value };
        setFormData(prev => ({ ...prev, potencializacoes: newPots }));
    };

    const removePotencializacao = (index) => {
        setFormData(prev => ({
            ...prev,
            potencializacoes: prev.potencializacoes.filter((_, i) => i !== index)
        }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
            <ModalHeader onClose={onClose} className="border-b border-white/10">
                <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">
                    {formData?.id ? 'Editar Item' : 'Novo Item'}
                </h2>
            </ModalHeader>
            <ModalBody className="p-6 space-y-6 overflow-y-auto max-h-[75vh] custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome</label>
                            <input
                                className="w-full bg-black/40 border border-white/10 text-gray-200 rounded-lg px-4 py-2 focus:border-cyber-pink focus:outline-none"
                                name="name"
                                value={formData?.name || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 text-gray-200 rounded-lg px-4 py-2 focus:border-cyber-pink focus:outline-none"
                                    name="category"
                                    value={formData?.category || 'actions'}
                                    onChange={handleChange}
                                >
                                    <option value="actions">Ação</option>
                                    <option value="talent">Talento</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Custo (PA)</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/40 border border-white/10 text-gray-200 rounded-lg px-4 py-2 focus:border-cyber-pink focus:outline-none"
                                    name="pa"
                                    value={formData?.pa || 0}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ícone</label>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsIconPickerOpen(true)}
                                    className="flex-grow flex items-center justify-between bg-black/40 border border-white/10 text-gray-200 rounded-lg px-4 py-2 hover:bg-white/5 hover:border-cyber-pink/50 transition-all group"
                                >
                                    <span className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center">
                                            <i className={`fa-solid ${formData?.icon || 'fa-question'} text-cyber-pink`}></i>
                                        </div>
                                        <span className="text-sm">{formData?.icon || 'Selecionar Ícone...'}</span>
                                    </span>
                                    <i className="fa-solid fa-chevron-down text-xs text-gray-500 group-hover:text-white transition-colors"></i>
                                </button>
                            </div>
                        </div>

                        <IconPicker
                            isOpen={isIconPickerOpen}
                            onClose={() => setIsIconPickerOpen(false)}
                            onSelect={(iconName) => handleChange({ target: { name: 'icon', value: iconName } })}
                            currentIcon={formData?.icon}
                        />
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tags (separadas por vírgula)</label>
                            <input
                                className="w-full bg-black/40 border border-white/10 text-gray-200 rounded-lg px-4 py-2 focus:border-cyber-pink focus:outline-none"
                                value={formData?.tags?.join(', ') || ''}
                                onChange={handleTagChange}
                                placeholder="Habilidade Ativa, Magia de Éter"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Perícia Relacionada (Opcional)</label>
                            <select
                                className="w-full bg-black/40 border border-white/10 text-gray-200 rounded-lg px-4 py-2 focus:border-cyber-pink focus:outline-none"
                                name="relatedSkill"
                                value={formData?.relatedSkill || ''}
                                onChange={handleChange}
                            >
                                <option value="">Nenhuma</option>
                                {allSkills.map(skill => (
                                    <option key={skill.name} value={skill.name}>{skill.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Resource Costs */}
                        <div className="grid grid-cols-3 gap-3 bg-black/40 p-3 rounded-xl border border-white/10">
                            <div>
                                <label className="block text-[9px] font-bold text-cyber-purple uppercase mb-1">Custo Foco</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/40 border border-white/10 text-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-cyber-purple focus:outline-none"
                                    name="costs.focus"
                                    value={formData?.costs?.focus || 0}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold text-cyber-yellow uppercase mb-1">Custo Vontade</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/40 border border-white/10 text-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-cyber-yellow focus:outline-none"
                                    name="costs.will"
                                    value={formData?.costs?.will || 0}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold text-cyber-pink uppercase mb-1">Custo Vida</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/40 border border-white/10 text-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-cyber-pink focus:outline-none"
                                    name="costs.vitality"
                                    value={formData?.costs?.vitality || 0}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid Fields */}
                    <div className="space-y-4 bg-black/40 p-4 rounded-2xl border border-white/10">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Estatísticas</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duração</label>
                                <input
                                    className="w-full bg-black/20 border border-white/10 text-gray-200 rounded-lg px-4 py-2 text-sm"
                                    name="stats.duracao"
                                    value={formData?.stats?.duracao || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ativação</label>
                                <select
                                    className="w-full bg-black/20 border border-white/10 text-gray-200 rounded-lg px-4 py-2 text-sm focus:border-cyber-pink focus:outline-none"
                                    name="stats.ativacao"
                                    value={formData?.stats?.ativacao || 'Ação'}
                                    onChange={handleChange}
                                >
                                    <option value="Ação">Ação</option>
                                    <option value="Passiva">Passiva</option>
                                    <option value="Ritual">Ritual</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alcance</label>
                                <input
                                    className="w-full bg-black/20 border border-white/10 text-gray-200 rounded-lg px-4 py-2 text-sm"
                                    name="stats.alcance"
                                    value={formData?.stats?.alcance || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alvo</label>
                                <input
                                    className="w-full bg-black/20 border border-white/10 text-gray-200 rounded-lg px-4 py-2 text-sm"
                                    name="stats.alvo"
                                    value={formData?.stats?.alvo || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Descriptions */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição Curta</label>
                        <textarea
                            className="w-full bg-black/40 border border-white/10 text-gray-200 rounded-lg px-4 py-2 focus:border-cyber-pink focus:outline-none min-h-[60px]"
                            name="description"
                            value={formData?.description || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição Completa</label>
                        <textarea
                            className="w-full bg-black/40 border border-white/10 text-gray-200 rounded-lg px-4 py-2 focus:border-cyber-pink focus:outline-none min-h-[100px]"
                            name="fullDescription"
                            value={formData?.fullDescription || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Potencializações */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Potencializações</h3>
                        <button
                            onClick={addPotencializacao}
                            className="text-cyber-yellow hover:text-white transition-colors text-[10px] font-bold uppercase border border-cyber-yellow/20 px-2 py-1 rounded"
                        >
                            + Adicionar
                        </button>
                    </div>
                    <div className="space-y-3">
                        {formData?.potencializacoes?.map((pot, idx) => (
                            <div key={idx} className="bg-black/40 border border-white/10 p-4 rounded-xl space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-grow space-y-3">
                                        <input
                                            placeholder="Nome da melhoria"
                                            className="w-full bg-black/40 border border-white/10 text-gray-200 rounded-lg px-3 py-1.5 text-sm"
                                            value={pot.name}
                                            onChange={(e) => updatePotencializacao(idx, 'name', e.target.value)}
                                        />
                                        <input
                                            placeholder="Efeito"
                                            className="w-full bg-black/40 border border-white/10 text-gray-200 rounded-lg px-3 py-1.5 text-xs italic"
                                            value={pot.effect}
                                            onChange={(e) => updatePotencializacao(idx, 'effect', e.target.value)}
                                        />
                                    </div>
                                    <div className="shrink-0 flex flex-col items-end gap-2 text-right">
                                        <select
                                            className="bg-black/40 border border-white/10 text-gray-200 rounded-lg px-2 py-1 text-xs"
                                            value={pot.resource}
                                            onChange={(e) => updatePotencializacao(idx, 'resource', e.target.value)}
                                        >
                                            <option value="focus">Foco</option>
                                            <option value="will">Vontade</option>
                                            <option value="vitality">Vitalidade</option>
                                        </select>
                                        <input
                                            type="number"
                                            className="w-16 bg-black/40 border border-white/10 text-gray-200 rounded-lg px-2 py-1 text-xs text-center"
                                            value={pot.value}
                                            onChange={(e) => updatePotencializacao(idx, 'value', parseInt(e.target.value))}
                                        />
                                        <button
                                            onClick={() => removePotencializacao(idx)}
                                            className="text-gray-600 hover:text-cyber-pink"
                                        >
                                            <i className="fa-solid fa-trash-can text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </ModalBody>
            <ModalFooter className="p-6 bg-zinc-900 border-t border-white/10 gap-3">
                <button
                    onClick={onClose}
                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase"
                >
                    Cancelar
                </button>
                <button
                    onClick={() => onSave(formData)}
                    className="px-8 py-2 bg-cyber-pink hover:brightness-110 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyber-pink/20 transition-all uppercase"
                >
                    Salvar
                </button>
            </ModalFooter>
        </Modal>
    );
};

export default FeatTab;
