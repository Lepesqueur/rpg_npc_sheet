import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody } from './Modal';
import { useCharacter } from '../context/CharacterContext';
import { useToast } from './Toast';
import { COMPENDIUM } from '../data/compendium';
import { TALENT_GROUPS, TALENT_GROUP_COLORS } from '../data/rules';

const CompendiumModal = ({ isOpen, onClose }) => {
    const { isEditMode, addTalent } = useCharacter();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [subFilter, setSubFilter] = useState('all');

    const handleAddTalent = (talent) => {
        if (!isEditMode) {
            showToast('Habilite o Modo Edição para importar talentos.', 'error');
            return;
        }
        addTalent({
            ...talent,
            id: Date.now().toString()
        });
        showToast(`${talent.name} adicionado às habilidades!`, 'success');
    };

    const filteredData = COMPENDIUM.talents.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

        let matchesSubFilter = subFilter === 'all' || item.category === subFilter;

        return matchesSearch && matchesSubFilter;
    });

    const getResourceColor = (item) => {
        return TALENT_GROUP_COLORS[item.category] || 'cyber-pink';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
            <ModalHeader onClose={onClose} className="bg-white/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full pr-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-cyber-blue/20 flex items-center justify-center text-cyber-blue shadow-neon-blue">
                            <i className="fa-solid fa-book-atlas"></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white uppercase font-display tracking-wider">Compêndio</h3>
                            <p className="text-[10px] text-cyber-gray font-mono uppercase tracking-widest">Biblioteca de Talentos</p>
                        </div>
                    </div>

                    <div className="relative flex-grow max-w-xs">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-cyber-gray text-xs"></i>
                        <input
                            type="text"
                            placeholder="Buscar talentos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder:text-gray-600 focus:border-cyber-blue outline-none transition-all"
                        />
                    </div>
                </div>
            </ModalHeader>

            <ModalBody>
                <div className="flex flex-col gap-6">
                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-white/5">
                        <button
                            onClick={() => setSubFilter('all')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${subFilter === 'all'
                                ? 'bg-cyber-blue text-white shadow-neon-blue'
                                : 'bg-white/5 text-cyber-gray hover:text-white hover:bg-white/10 border border-white/5'
                                }`}
                        >
                            <i className="fa-solid fa-star"></i>
                            Todos os Talentos
                        </button>
                    </div>

                    {/* Sub-Filters (Talent Groups) */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {TALENT_GROUPS.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setSubFilter(filter)}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${subFilter === filter
                                    ? 'bg-cyber-blue/20 border-cyber-blue/40 text-cyber-blue shadow-[0_0_10px_rgba(0,186,255,0.2)]'
                                    : 'bg-white/5 border-white/5 text-cyber-gray hover:text-white'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Content List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredData.length > 0 ? (
                            filteredData.map((item, idx) => (
                                <div key={idx} className="glass-card border border-white/10 p-4 hover:border-cyber-blue/50 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-cyber-blue opacity-50 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex items-start gap-3">
                                            {item.icon && (
                                                <div className={`w-10 h-10 rounded bg-white/5 flex items-center justify-center text-${getResourceColor(item)} border border-white/10 shrink-0`}>
                                                    <i className={`fa-solid ${item.icon}`}></i>
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="text-sm font-bold text-white uppercase tracking-tight">{item.name}</h4>
                                                <span className="text-[10px] text-cyber-gray uppercase font-mono">{item.category}</span>
                                                {item.description && (
                                                    <p className="text-[11px] text-gray-400 mt-2 line-clamp-2 leading-relaxed italic border-l border-white/10 pl-2">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleAddTalent(item)}
                                            className="px-3 py-1.5 rounded bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue hover:text-black text-[10px] font-bold uppercase transition-all whitespace-nowrap"
                                        >
                                            <i className="fa-solid fa-plus mr-1"></i>
                                            Adicionar
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 border border-dashed border-white/10 rounded-xl">
                                <i className="fa-solid fa-magnifying-glass text-4xl text-white/5"></i>
                                <span className="text-cyber-gray text-xs uppercase tracking-widest">Nenhum talento encontrado</span>
                            </div>
                        )}
                    </div>

                    {!isEditMode && (
                        <div className="bg-cyber-yellow/10 border border-cyber-yellow/30 p-3 rounded-lg flex items-center gap-3">
                            <i className="fa-solid fa-triangle-exclamation text-cyber-yellow animate-pulse"></i>
                            <p className="text-[10px] text-cyber-yellow uppercase font-bold tracking-wider">
                                Ative o Modo Edição no cabeçalho para poder importar talentos do compêndio.
                            </p>
                        </div>
                    )}
                </div>
            </ModalBody>
        </Modal>
    );
};

export default CompendiumModal;
