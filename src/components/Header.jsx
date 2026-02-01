import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';
import { useToast } from './Toast';

const Header = () => {
    const { isEditMode, toggleEditMode, characterData, updateName, updateLevel, updateXp, updateNextLevel, updateSpeed, updatePerception, updateStatus } = useCharacter();

    const { showToast } = useToast();
    const [restModal, setRestModal] = useState({ isOpen: false, type: null });
    const [comfortLevel, setComfortLevel] = useState(0);

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

    return (
        <header className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden mb-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-pink via-cyber-purple to-cyber-yellow opacity-50"></div>

            {/* Edit Mode Toggle */}
            <div className="absolute top-4 right-6 z-20 flex gap-2">
                {/* Rest Buttons */}
                <button
                    onClick={() => openRestModal('short')}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/40 border border-white/10 text-cyber-gray hover:text-white hover:border-white/30 transition-all group"
                    title="Descanso Curto"
                >
                    <i className="fa-solid fa-campground text-xs group-hover:scale-110 transition-transform"></i>
                </button>
                <button
                    onClick={() => openRestModal('long')}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/40 border border-white/10 text-cyber-gray hover:text-white hover:border-white/30 transition-all group"
                    title="Descanso Longo"
                >
                    <i className="fa-solid fa-bed text-xs group-hover:scale-110 transition-transform"></i>
                </button>

                <button
                    onClick={toggleEditMode}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 group ${isEditMode
                        ? 'bg-cyber-yellow/20 border-cyber-yellow text-cyber-yellow shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                        : 'bg-white/5 border-white/10 text-cyber-gray hover:border-white/30 hover:text-white'
                        }`}
                >
                    <i className={`fa-solid ${isEditMode ? 'fa-unlock-keyhole' : 'fa-lock'} text-xs`}></i>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                        {isEditMode ? 'Modo Edição' : 'Modo Leitura'}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${isEditMode ? 'bg-cyber-yellow animate-pulse' : 'bg-gray-600'}`}></div>
                </button>
            </div>

            <div className="relative shrink-0 group">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyber-pink to-cyber-purple blur opacity-60 group-hover:opacity-100 transition duration-500"></div>
                <img
                    alt="Aeliana Portrait"
                    className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-cyber-pink shadow-neon-pink object-cover z-10"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL-Rfhvvuljmg4jGXDfv6K9f-p8gl_YGelnFGV46NwdIKq5W6n9_oax95Cw3LFCCnknNkNWUFEsB1Gmv92NJAF-ATelbs3tiPKx5ulVbkWzHKYqjqICpIWYWGZ5Ty_Zl8w-FS0tDI_ZBIAQ9W6ahI6rjcZSHPrIJsMoE95hy2LB2tcUznhskAhxzqy9qVExzdb7nTB0qleORSCCqLWUQjSMcWYN7SGV8UqVYbyHr8xhekKtDP0kB31SUDFAWkIxxLLu7J-lFpradI"
                />
            </div>
            <div className="flex-grow w-full md:w-auto text-center md:text-left flex flex-col justify-center h-32 md:h-40">
                {isEditMode ? (
                    <input
                        type="text"
                        value={characterData.name}
                        onChange={(e) => updateName(e.target.value)}
                        className="text-4xl md:text-5xl font-bold tracking-wide text-white mb-1 uppercase text-glow-pink font-display bg-transparent border-b border-white/20 focus:border-cyber-pink outline-none w-full text-center md:text-left"
                        placeholder="Nome do Personagem"
                    />
                ) : (
                    <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-white mb-1 uppercase text-glow-pink font-display">{characterData.name}</h1>
                )}

                <div className="text-cyber-gray text-lg font-medium tracking-widest uppercase mb-4 flex items-center justify-center md:justify-start gap-2">
                    Nível
                    {isEditMode ? (
                        <input
                            type="number"
                            value={characterData.level}
                            onChange={(e) => updateLevel(e.target.value)}
                            className="bg-transparent border-b border-white/20 focus:border-cyber-pink outline-none w-16 text-center text-white"
                            min="1"
                        />
                    ) : (
                        <span className="text-white">{characterData.level}</span>
                    )}
                </div>
                <div className="w-full max-w-md mx-auto md:mx-0">
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyber-pink via-cyber-purple to-cyber-yellow shadow-[0_0_10px_#ff007f] transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(0, (characterData.xp / characterData.nextLevel) * 100))}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-cyber-gray mt-1 font-mono">
                        {isEditMode ? (
                            <>
                                <div className="flex items-center gap-1">
                                    XP:
                                    <input
                                        type="number"
                                        value={characterData.xp}
                                        onChange={(e) => updateXp(e.target.value)}
                                        className="bg-transparent border-b border-white/20 focus:border-cyber-pink outline-none w-16 text-xs text-cyber-gray"
                                    />
                                </div>
                                <div className="flex items-center gap-1">
                                    Próximo Nível:
                                    <input
                                        type="number"
                                        value={characterData.nextLevel}
                                        onChange={(e) => updateNextLevel(e.target.value)}
                                        className="bg-transparent border-b border-white/20 focus:border-cyber-pink outline-none w-16 text-xs text-cyber-gray text-right"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <span>XP: {characterData.xp}</span>
                                <span>Próximo Nível: {characterData.nextLevel}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Speed and Perception - New Column */}
            <div className="w-full md:w-auto flex flex-row items-center justify-center gap-4 shrink-0 md:absolute md:bottom-6 md:right-6">
                <div className="glass-panel p-2 rounded-lg border border-white/10 bg-black/40 flex items-center gap-3 min-w-[140px]">
                    <div className="w-8 h-8 rounded bg-cyber-pink/20 flex items-center justify-center text-cyber-pink shrink-0">
                        <i className="fa-solid fa-person-running"></i>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-cyber-gray leading-none mb-1">Velocidade</span>
                        {isEditMode ? (
                            <input
                                type="number"
                                value={characterData.speed}
                                onChange={(e) => updateSpeed(e.target.value)}
                                className="bg-transparent border-b border-white/20 focus:border-cyber-pink outline-none w-16 text-sm font-bold text-white leading-none"
                            />
                        ) : (
                            <span className="text-sm font-bold text-white leading-none">{characterData.speed}</span>
                        )}
                    </div>
                </div>

                <div className="glass-panel p-2 rounded-lg border border-white/10 bg-black/40 flex items-center gap-3 min-w-[140px]">
                    <div className="w-8 h-8 rounded bg-cyber-purple/20 flex items-center justify-center text-cyber-purple shrink-0">
                        <i className="fa-solid fa-eye"></i>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-cyber-gray leading-none mb-1">Percepção</span>
                        {isEditMode ? (
                            <input
                                type="number"
                                value={characterData.perception}
                                onChange={(e) => updatePerception(e.target.value)}
                                className="bg-transparent border-b border-white/20 focus:border-cyber-purple outline-none w-16 text-sm font-bold text-white leading-none"
                            />
                        ) : (
                            <span className="text-sm font-bold text-white leading-none">{characterData.perception}</span>
                        )}
                    </div>
                </div>
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
