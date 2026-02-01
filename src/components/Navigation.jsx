import React, { useRef } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { useToast } from './Toast';

const Navigation = ({ activeTab, onTabChange }) => {
    const { exportCharacter, importCharacter } = useCharacter();
    const { showToast } = useToast();
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const success = importCharacter(event.target.result);
            if (success) {
                showToast('Ficha de personagem carregada com sucesso!', 'success');
            } else {
                showToast('Erro ao carregar ficha. Arquivo inválido.', 'error');
            }
            // Reset input so same file can be selected again if needed
            e.target.value = '';
        };
        reader.readAsText(file);
    };

    const tabs = [
        { id: 'attributes', label: 'ATRIBUTOS & PERÍCIAS' },
        { id: 'combat', label: 'COMBATE & DEFESA' },
        { id: 'skills', label: 'HABILIDADES & TALENTOS' },
        { id: 'inventory', label: 'INVENTÁRIO & NOTAS' },
    ];

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 mb-6 gap-4">
            <nav className="flex overflow-x-auto pb-1 space-x-8 scrollbar-hide flex-grow">
                {tabs.map((tab) => (
                    <a
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`cursor-pointer px-2 py-3 text-sm font-semibold transition-colors whitespace-nowrap relative ${activeTab === tab.id ? 'text-white border-b-2 border-cyber-pink' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-pink to-transparent"></span>
                        )}
                    </a>
                ))}
            </nav>

            <div className="flex items-center gap-3 pb-2 px-2 md:px-0">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10 hover:border-cyber-blue/50 hover:bg-zinc-700 transition-all text-gray-400 hover:text-cyber-blue text-xs font-bold uppercase tracking-wider group"
                    title="Carregar Personagem (JSON)"
                >
                    <i className="fa-solid fa-upload group-hover:-translate-y-0.5 transition-transform"></i>
                    <span className="hidden sm:inline">Carregar</span>
                </button>
                <button
                    onClick={exportCharacter}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10 hover:border-cyber-green/50 hover:bg-zinc-700 transition-all text-gray-400 hover:text-cyber-green text-xs font-bold uppercase tracking-wider group"
                    title="Salvar Personagem (JSON)"
                >
                    <i className="fa-solid fa-download group-hover:translate-y-0.5 transition-transform"></i>
                    <span className="hidden sm:inline">Salvar</span>
                </button>
            </div>
        </div>
    );
};

export default Navigation;
