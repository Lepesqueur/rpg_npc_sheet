import React, { useState, useRef } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { useToast } from './Toast';

const Header = () => {
    const { isEditMode, toggleEditMode, characterData, updateName, updateLevel, updateSpeed, updatePerception, updateStatus, exportCharacter, importCharacter } = useCharacter();

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

    return (
        <header className="glass-card rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 relative overflow-hidden mb-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-pink via-cyber-purple to-cyber-yellow opacity-50"></div>

            {/* Left Section: Portrait & Info */}
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative shrink-0 group">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyber-pink to-cyber-purple blur opacity-60 group-hover:opacity-100 transition duration-500"></div>
                    <img
                        alt="Portrait"
                        className="relative w-16 h-16 rounded-full border-2 border-cyber-pink shadow-neon-pink object-cover z-10"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL-Rfhvvuljmg4jGXDfv6K9f-p8gl_YGelnFGV46NwdIKq5W6n9_oax95Cw3LFCCnknNkNWUFEsB1Gmv92NJAF-ATelbs3tiPKx5ulVbkWzHKYqjqICpIWYWGZ5Ty_Zl8w-FS0tDI_ZBIAQ9W6ahI6rjcZSHPrIJsMoE95hy2LB2tcUznhskAhxzqy9qVExzdb7nTB0qleORSCCqLWUQjSMcWYN7SGV8UqVYbyHr8xhekKtDP0kB31SUDFAWkIxxLLu7J-lFpradI"
                    />
                </div>

                <div className="flex flex-col flex-grow">
                    <div className="flex items-center gap-2">
                        {isEditMode ? (
                            <input
                                type="text"
                                value={characterData.name}
                                onChange={(e) => updateName(e.target.value)}
                                className="text-xl font-bold tracking-wide text-white uppercase font-display bg-transparent border-b border-white/20 focus:border-cyber-pink outline-none w-full"
                                placeholder="Nome do Personagem"
                            />
                        ) : (
                            <h1 className="text-xl font-bold tracking-wide text-white uppercase font-display">{characterData.name}</h1>
                        )}
                        <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/10 shrink-0">
                            <span className="text-[10px] text-cyber-gray font-bold uppercase">Nível</span>
                            {isEditMode ? (
                                <input
                                    type="number"
                                    value={characterData.level}
                                    onChange={(e) => updateLevel(e.target.value)}
                                    className="bg-transparent border-b border-white/20 focus:border-cyber-pink outline-none w-8 text-center text-white text-sm font-bold"
                                    min="1"
                                />
                            ) : (
                                <span className="text-white text-sm font-bold">{characterData.level}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Section: Stats (Speed/Perception) */}
            <div className="flex items-center gap-4 shrink-0 md:ml-auto">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10">
                    <i className="fa-solid fa-person-running text-cyber-pink text-xs"></i>
                    <div className="flex flex-col leading-none">
                        <span className="text-[8px] uppercase tracking-wider text-cyber-gray">Velocidade</span>
                        {isEditMode ? (
                            <input
                                type="text"
                                value={characterData.speed}
                                onChange={(e) => updateSpeed(e.target.value)}
                                className="bg-transparent border-none outline-none w-10 text-white font-bold text-xs p-0 m-0 h-auto"
                            />
                        ) : (
                            <span className="text-white font-bold text-xs">{characterData.speed}</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10">
                    <i className="fa-solid fa-eye text-cyber-purple text-xs"></i>
                    <div className="flex flex-col leading-none">
                        <span className="text-[8px] uppercase tracking-wider text-cyber-gray">Percepção</span>
                        {isEditMode ? (
                            <input
                                type="number"
                                value={characterData.perception}
                                onChange={(e) => updatePerception(e.target.value)}
                                className="bg-transparent border-none outline-none w-8 text-white font-bold text-xs p-0 m-0 h-auto"
                            />
                        ) : (
                            <span className="text-white font-bold text-xs">{characterData.perception}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-2 shrink-0 md:ml-4 border-l border-white/10 pl-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 border border-white/10 hover:border-cyber-blue/50 hover:bg-zinc-700 transition-all text-gray-400 hover:text-cyber-blue"
                    title="Carregar"
                >
                    <i className="fa-solid fa-upload text-xs"></i>
                </button>
                <button
                    onClick={exportCharacter}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 border border-white/10 hover:border-cyber-green/50 hover:bg-zinc-700 transition-all text-gray-400 hover:text-cyber-green"
                    title="Salvar"
                >
                    <i className="fa-solid fa-download text-xs"></i>
                </button>

                <div className="h-6 w-px bg-white/10 mx-1"></div>

                <button
                    onClick={toggleEditMode}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-300 ${isEditMode
                        ? 'bg-cyber-yellow/20 border-cyber-yellow text-cyber-yellow shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                        : 'bg-white/5 border-white/10 text-cyber-gray hover:border-white/30 hover:text-white'
                        }`}
                    title={isEditMode ? 'Modo Edição (Ativado)' : 'Modo Leitura'}
                >
                    <i className={`fa-solid ${isEditMode ? 'fa-unlock-keyhole' : 'fa-lock'} text-xs`}></i>
                </button>
            </div>
        </header>
    );
};

export default Header;
