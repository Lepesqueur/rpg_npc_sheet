import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCharacter } from '../context/CharacterContext';

const CharacterManager = ({ isOpen, onClose }) => {
    const { npcLibrary, activeCharacterId, switchNPC, createNPC, duplicateNPC, deleteNPC } = useCharacter();
    const [newNPCName, setNewNPCName] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleCreate = (e) => {
        e.preventDefault();
        if (newNPCName.trim()) {
            createNPC(newNPCName.trim());
            setNewNPCName('');
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl glass-card rounded-xl border border-white/10 shadow-2xl flex flex-col max-h-[80vh] animate-scale-up overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
                    <div>
                        <h2 className="text-xl font-bold text-white font-display tracking-tight flex items-center gap-2">
                            <i className="fa-solid fa-users-viewfinder text-cyber-yellow"></i>
                            BIBLIOTECA DE NPCs
                        </h2>
                        <p className="text-xs text-cyber-gray uppercase tracking-widest mt-1">Gerenciamento de fichas dinâmicas</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-cyber-gray hover:text-white transition-all"
                    >
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                {/* List Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar bg-[#0d0d12]/95 backdrop-blur-md">
                    {npcLibrary.map((npc) => (
                        <div
                            key={npc.id}
                            className={`group relative flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${npc.id === activeCharacterId
                                    ? 'bg-cyber-yellow/10 border-cyber-yellow/50 shadow-[0_0_15px_rgba(255,215,0,0.1)]'
                                    : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5'
                                }`}
                            onClick={() => switchNPC(npc.id)}
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${npc.id === activeCharacterId ? 'bg-cyber-yellow text-black' : 'bg-white/5 text-cyber-gray'
                                    }`}>
                                    <i className="fa-solid fa-user"></i>
                                </div>
                                <div className="min-w-0">
                                    <h3 className={`font-bold truncate ${npc.id === activeCharacterId ? 'text-white' : 'text-cyber-gray group-hover:text-white'}`}>
                                        {npc.name}
                                    </h3>
                                    <span className="text-[10px] uppercase font-bold text-cyber-gray/60 tracking-tighter">
                                        Nível {npc.level} • {npc.xp} XP
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); duplicateNPC(npc.id); }}
                                    className="p-2 text-cyber-gray hover:text-cyber-purple transition-colors"
                                    title="Duplicar NPC"
                                >
                                    <i className="fa-solid fa-copy"></i>
                                </button>
                                {npcLibrary.length > 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm(`Excluir "${npc.name}" permanentemente?`)) {
                                                deleteNPC(npc.id);
                                            }
                                        }}
                                        className="p-2 text-cyber-gray hover:text-cyber-pink transition-colors"
                                        title="Excluir NPC"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                )}
                            </div>

                            {npc.id === activeCharacterId && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-cyber-yellow rounded-r-full"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer: Create New */}
                <div className="p-6 border-t border-white/5 bg-black/40">
                    <form onSubmit={handleCreate} className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Nome do novo NPC..."
                            value={newNPCName}
                            onChange={(e) => setNewNPCName(e.target.value)}
                            className="bg-black/60 border border-white/10 rounded-lg px-4 py-2 flex-1 text-white text-sm focus:outline-none focus:border-cyber-yellow transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!newNPCName.trim()}
                            className="px-6 py-2 bg-cyber-yellow text-black rounded-lg font-bold text-sm hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <i className="fa-solid fa-plus"></i>
                            CRIAR NPC
                        </button>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CharacterManager;
