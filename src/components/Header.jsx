import React, { useState, useRef } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';
import { useToast } from './Toast';

const Header = () => {
    const { isEditMode, toggleEditMode, characterData, updateName, updateLevel, updateSpeed, updatePerception, updateStatus, exportCharacter, importCharacter } = useCharacter();

    const { showToast } = useToast();
    const [restModal, setRestModal] = useState({ isOpen: false, type: null });
    const [comfortLevel, setComfortLevel] = useState(0);
    const fileInputRef = useRef(null);

    const openRestModal = (type) => {
        setRestModal({ isOpen: true, type });
        setComfortLevel(0);
    };

    const handleRest = () => {
        const C = parseInt(comfortLevel) || 0;
        let gains = { vitality: 0, focus: 0, will: 0 };

        if (restModal.type === 'short') {
            gains.vitality = 1 + C;
            gains.focus = 4 + C;
        } else if (restModal.type === 'long') {
            gains.vitality = 2 + C;
            gains.focus = 8 + C;
            gains.will = 1;
        }

        // Apply gains
        if (gains.vitality !== 0) updateStatus('vitality', gains.vitality);
        if (gains.focus !== 0) updateStatus('focus', gains.focus);
        if (gains.will !== 0) updateStatus('will', gains.will);

        const typeName = restModal.type === 'short' ? 'Curto' : 'Longo';
        showToast(`Descanso ${typeName} realizado! Recursos recuperados.`, 'success');
        setRestModal({ isOpen: false, type: null });
    };

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
                    onClick={() => openRestModal('short')}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/40 border border-white/10 text-cyber-gray hover:text-white hover:border-white/30 transition-all"
                    title="Descanso Curto"
                >
                    <i className="fa-solid fa-campground text-xs"></i>
                </button>
                <button
                    onClick={() => openRestModal('long')}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/40 border border-white/10 text-cyber-gray hover:text-white hover:border-white/30 transition-all"
                    title="Descanso Longo"
                >
                    <i className="fa-solid fa-bed text-xs"></i>
                </button>

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

            {/* Rest Modal */}
            <Modal isOpen={restModal.isOpen} onClose={() => setRestModal({ ...restModal, isOpen: false })} maxWidth="max-w-sm">
                <ModalHeader onClose={() => setRestModal({ ...restModal, isOpen: false })} className="bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-cyber-green/20 flex items-center justify-center text-cyber-green">
                            <i className={`fa-solid ${restModal.type === 'short' ? 'fa-campground' : 'fa-bed'}`}></i>
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase font-display">
                            Descanso {restModal.type === 'short' ? 'Curto' : 'Longo'}
                        </h3>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-cyber-gray uppercase tracking-widest">Nível de Conforto</label>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setComfortLevel(prev => prev - 1)}
                                    className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center justify-center transition-all"
                                >
                                    <i className="fa-solid fa-minus text-xs"></i>
                                </button>
                                <input
                                    type="number"
                                    value={comfortLevel}
                                    onChange={(e) => setComfortLevel(parseInt(e.target.value) || 0)}
                                    className="flex-1 bg-black/40 border border-white/10 rounded py-1.5 text-center text-white font-mono font-bold outline-none"
                                />
                                <button
                                    onClick={() => setComfortLevel(prev => prev + 1)}
                                    className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center justify-center transition-all"
                                >
                                    <i className="fa-solid fa-plus text-xs"></i>
                                </button>
                            </div>
                            <p className="text-[10px] text-cyber-gray mt-1">
                                Positivo melhora a recuperação, negativo prejudica.
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                            <h4 className="text-[10px] font-bold text-cyber-gray uppercase tracking-widest mb-2">Recuperação Estimada</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center justify-between p-2 bg-black/20 rounded">
                                    <span className="text-[10px] text-cyber-pink font-bold">Vitalidade</span>
                                    <span className="text-sm font-mono font-bold text-white">
                                        +{Math.max(0, (restModal.type === 'short' ? 1 : 2) + (parseInt(comfortLevel) || 0))}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-black/20 rounded">
                                    <span className="text-[10px] text-cyber-purple font-bold">Foco</span>
                                    <span className="text-sm font-mono font-bold text-white">
                                        +{Math.max(0, (restModal.type === 'short' ? 4 : 8) + (parseInt(comfortLevel) || 0))}
                                    </span>
                                </div>
                                {restModal.type === 'long' && (
                                    <div className="flex items-center justify-between p-2 bg-black/20 rounded col-span-2">
                                        <span className="text-[10px] text-cyber-yellow font-bold">Vontade</span>
                                        <span className="text-sm font-mono font-bold text-white">+1</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button
                        onClick={handleRest}
                        className="w-full py-2 bg-cyber-green text-black font-bold uppercase tracking-widest rounded hover:bg-white transition-all shadow-neon-green"
                    >
                        Confirmar Descanso
                    </button>
                </ModalFooter>
            </Modal>
        </header>
    );
};

export default Header;
