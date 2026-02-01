import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalFooter } from './Modal';
import { ATTR_MAP } from '../data/rules';

const SkillRollModal = ({ isOpen, onClose, skill, allAttributes, sourceItem, onConfirm }) => {
    const [selectedAttr, setSelectedAttr] = useState(null);
    const [advantage, setAdvantage] = useState(0);
    const [step, setStep] = useState('setup'); // 'setup', 'cd', 'result'
    const [dc, setDc] = useState(15);
    const [rollResults, setRollResults] = useState(null);

    // Map abbreviations from rules.js (DES, INTUI, etc) to attribute labels (Des, Intu, etc)
    const skillAttrs = (Array.isArray(skill?.attr) ? skill.attr : [skill?.attr]).map(a => a?.toUpperCase());

    const viableAttributes = (allAttributes || []).filter(attr => {
        const normalizedLabel = attr.label;
        return skillAttrs.some(sa => ATTR_MAP[sa] === normalizedLabel || sa === normalizedLabel.toUpperCase());
    });

    useEffect(() => {
        if (viableAttributes.length > 0 && !selectedAttr) {
            setSelectedAttr(viableAttributes[0].name);
        }
    }, [viableAttributes, selectedAttr]);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep('setup');
            setRollResults(null);

            // Apply Wear penalty if applicable (Desgaste)
            const wearPenalty = sourceItem?.wear ? parseInt(sourceItem.wear) : 0;
            setAdvantage(-wearPenalty);
        }
    }, [isOpen, sourceItem]);

    if (!skill) return null;

    const currentAttr = viableAttributes.find(a => a.name === selectedAttr) || viableAttributes[0] || {};
    const skillLevel = skill.level || 0;

    const performRoll = () => {
        const baseDice = Math.min(skillLevel + 1, 3);
        const finalX = baseDice + advantage;

        // Determine dice count. If X <= 0 (Disadvantage), assume at least 2 dice if 0, or abs(X).
        // Common House Rule for 0: Roll 2 take lowest (Disadvantage 1 is usually 2 dice). 
        // User said: "Se X negativo... joga X D8 em desvantagem". Assuming abs(X). 
        // If X=0, let's default to 2 dice disadvantage (since base 1 - 1 adv = 0).
        let diceCount = finalX > 0 ? finalX : (finalX === 0 ? 2 : Math.abs(finalX));

        // 1. Roll Dice (d8)
        let rolls = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 8) + 1);

        // 2. Master Reroll (Level >= 3)
        // "substituir relancar o pior resultado"
        let rerolledIndices = [];
        if (skillLevel >= 3) {
            const minVal = Math.min(...rolls);
            const minIdx = rolls.indexOf(minVal);

            // Reroll ONLY the worst die once
            const newVal = Math.floor(Math.random() * 8) + 1;
            rolls[minIdx] = newVal;
            rerolledIndices.push(minIdx);
        }

        // 3. Apply Mode (Advantage vs Disadvantage)
        let keptRolls = []; // { val, idx }
        let discardedVal = []; // just numbers for display

        if (finalX > 0) {
            // VANTAGEM: Considera TODOS
            keptRolls = rolls.map((r, i) => ({ val: r, idx: i }));
        } else {
            // DESVANTAGEM: Escolhe o MENOR
            const minVal = Math.min(...rolls);
            // Keep the first occurrence of minVal
            const keepIdx = rolls.indexOf(minVal);

            rolls.forEach((r, i) => {
                if (i === keepIdx) keptRolls.push({ val: r, idx: i });
                else discardedVal.push(r);
            });
        }

        // 4. Calculate Totals & Check Success
        const attrVal = parseInt(currentAttr.value || 0);
        const results = keptRolls.map(r => {
            const total = r.val + attrVal;
            return {
                die: r.val,
                attrVal: attrVal,
                attrName: selectedAttr,
                total: total,
                success: total >= dc,
                isReroll: rerolledIndices.includes(r.idx)
            };
        });

        setRollResults({
            rolls: results,
            discarded: discardedVal
        });
        setStep('result');
    };

    const renderSetupStep = () => (
        <>
            {/* Header Area Specific for Setup */}
            <div className="bg-black/40 p-6 border-b border-white/10 flex justify-between items-center shrink-0 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-pink to-transparent opacity-70"></div>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wider uppercase drop-shadow-[0_0_8px_rgba(255,0,255,0.5)] font-display">
                        Rolagem: {skill.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">Proficiência</span>
                        <div className="flex gap-1.5">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`transform rotate-45 w-2.5 h-2.5 border transition-all duration-300 ${i <= skillLevel ? 'bg-cyber-yellow border-cyber-yellow shadow-[0_0_6px_#f1c40f]' : 'border-white/20 bg-transparent'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
                    <i className="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>

            {sourceItem && (
                <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-crosshairs text-cyber-pink text-xs"></i>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{sourceItem.name}</span>
                    </div>
                    {(sourceItem.costs?.focus > 0 || sourceItem.costs?.vitality > 0 || sourceItem.costs?.will > 0) && (
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Custo:</span>
                            {sourceItem.costs?.vitality > 0 && (
                                <div className="flex items-center gap-1 text-cyber-pink">
                                    <i className="fa-solid fa-heart text-[10px]"></i>
                                    <span className="font-mono font-bold text-[10px]">{sourceItem.costs.vitality}</span>
                                </div>
                            )}
                            {sourceItem.costs?.focus > 0 && (
                                <div className="flex items-center gap-1 text-cyber-purple">
                                    <i className="fa-solid fa-bolt-lightning text-[10px]"></i>
                                    <span className="font-mono font-bold text-[10px]">{sourceItem.costs.focus}</span>
                                </div>
                            )}
                            {sourceItem.costs?.will > 0 && (
                                <div className="flex items-center gap-1 text-cyber-yellow">
                                    <i className="fa-solid fa-brain text-[10px]"></i>
                                    <span className="font-mono font-bold text-[10px]">{sourceItem.costs.will}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <ModalBody className="p-6 space-y-8 overflow-y-auto">
                <section className="space-y-4">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <i className="fa-solid fa-sliders text-cyber-blue"></i> Selecionar Atributo Base
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {viableAttributes.map((attr) => (
                            <div key={attr.name} className="relative">
                                <input
                                    type="radio"
                                    id={`attr_${attr.name}`}
                                    name="base_attr"
                                    className="hidden"
                                    checked={selectedAttr === attr.name}
                                    onChange={() => setSelectedAttr(attr.name)}
                                />
                                <label
                                    htmlFor={`attr_${attr.name}`}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${selectedAttr === attr.name
                                        ? 'border-cyber-pink bg-cyber-pink/10 shadow-[0_0_15px_rgba(255,0,255,0.2)]'
                                        : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                                        }`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br from-cyber-pink/20 to-transparent opacity-0 transition-opacity duration-300 ${selectedAttr === attr.name ? 'opacity-100' : ''}`}></div>
                                    <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest relative z-10">{attr.name}</span>
                                    <span className="text-3xl font-bold text-white mt-1 relative z-10 font-display">{attr.value}</span>
                                    <div className={`text-[10px] px-2 py-0.5 rounded mt-2 font-black relative z-10 transition-colors ${selectedAttr === attr.name ? 'bg-cyber-pink text-white' : 'bg-white/10 text-gray-400 group-hover:bg-white/20 group-hover:text-white'}`}>
                                        +{attr.value} TESTE
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <i className="fa-solid fa-scale-balanced text-cyber-purple"></i> Vantagens e Desvantagens
                    </h3>
                    <div className="bg-black/40 p-6 rounded-xl border border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex flex-col items-center">
                                <span className="text-cyber-red font-bold text-xl drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">-7</span>
                                <span className="text-[8px] text-gray-500 uppercase font-black">Máx Desv.</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className={`font-bold text-2xl transition-all ${advantage > 0 ? 'text-cyber-green' : advantage < 0 ? 'text-cyber-red' : 'text-white'}`}>
                                    {advantage > 0 ? `+${advantage}` : advantage}
                                </span>
                                <span className="text-[8px] text-gray-500 uppercase font-black">Ajuste</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-cyber-green font-bold text-xl drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">+7</span>
                                <span className="text-[8px] text-gray-500 uppercase font-black">Máx Vant.</span>
                            </div>
                        </div>

                        <input
                            type="range"
                            min="-7"
                            max="7"
                            step="1"
                            value={advantage}
                            onChange={(e) => setAdvantage(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyber-pink"
                        />

                        <div className="flex justify-between mt-3 px-1">
                            <div className="flex gap-1.5 overflow-hidden">
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <span key={i} className={`w-1 h-1 rounded-full ${advantage <= -(i + 1) ? 'bg-cyber-red shadow-[0_0_3px_red]' : 'bg-white/10'}`}></span>
                                ))}
                            </div>
                            <span className={`w-1.5 h-1.5 rounded-full ${advantage === 0 ? 'bg-white shadow-[0_0_5px_white]' : 'bg-white/20'}`}></span>
                            <div className="flex gap-1.5 overflow-hidden">
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <span key={i} className={`w-1 h-1 rounded-full ${advantage >= (i + 1) ? 'bg-cyber-green shadow-[0_0_3px_green]' : 'bg-white/10'}`}></span>
                                ))}
                            </div>
                        </div>

                        {sourceItem?.wear > 0 && (
                            <div className="mt-4 flex items-center justify-center gap-2 text-cyber-red bg-cyber-red/10 border border-cyber-red/20 py-2 rounded-lg animate-pulse">
                                <i className="fa-solid fa-triangle-exclamation text-xs"></i>
                                <span className="text-[10px] uppercase font-bold tracking-widest">
                                    Desgaste Aplicado: -{sourceItem.wear} na rolagem
                                </span>
                            </div>
                        )}
                    </div>
                </section>

                <section className="bg-cyber-bg/50 border border-white/10 rounded-xl p-4 space-y-3">
                    <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2 border-b border-white/10 pb-2">
                        <i className="fa-solid fa-book-open text-cyber-yellow"></i> Guia da Rolagem
                    </h3>

                    {(() => {
                        const baseDice = Math.min(skillLevel + 1, 3);
                        const finalX = baseDice + advantage;
                        const displayDice = finalX > 0 ? finalX : (finalX === 0 ? 2 : Math.abs(finalX));
                        const modeLabel = finalX > 0 ? "VANTAGEM (SOMA TUDO)" : "DESVANTAGEM (O MENOR)";
                        const modeColor = finalX > 0 ? "text-cyber-green" : "text-cyber-red";
                        const masterReroll = skillLevel >= 3;

                        return (
                            <div className="text-sm space-y-2 font-mono">
                                <div className="flex justify-between items-center font-bold">
                                    <span className="text-white uppercase text-xs">Total de Dados (X)</span>
                                    <span className={`text-lg ${modeColor}`}>{displayDice}d8</span>
                                </div>
                                <div className="mt-2 text-xs bg-black/40 p-3 rounded text-gray-300 leading-relaxed border-l-2 border-cyber-yellow">
                                    <p className="mb-1">
                                        <strong className={modeColor}>MODO: {modeLabel}</strong>
                                    </p>
                                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-400">
                                        {finalX > 0 ? (
                                            <li>Role <strong>{displayDice}d8</strong> e considere <strong>TODOS</strong> os resultados.</li>
                                        ) : (
                                            <li>Role <strong>{displayDice}d8</strong> e escolha APENAS o <strong>MENOR</strong> resultado.</li>
                                        )}
                                        <li>Some <strong>+{parseInt(currentAttr.value || 0)}</strong> ({selectedAttr}) ao valor de cada dado mantido.</li>
                                        {masterReroll && (
                                            <li className="text-cyber-yellow">
                                                <strong>MESTRE:</strong> Você pode rerolar o pior dado uma vez!
                                            </li>
                                        )}
                                        <li>Verifique quantos resultados superaram a CD.</li>
                                    </ul>
                                </div>
                            </div>
                        );
                    })()}
                </section>
            </ModalBody>

            <ModalFooter className="p-6 pt-0 bg-transparent border-none">
                <button
                    onClick={() => {
                        if (onConfirm) {
                            const success = onConfirm(selectedAttr, advantage);
                            if (success !== false) setStep('cd');
                        } else {
                            setStep('cd');
                        }
                    }}
                    className="w-full py-4 bg-gradient-to-r from-cyber-pink to-cyber-purple text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(255,0,153,0.4)] hover:shadow-[0_0_30px_rgba(255,0,153,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                    <i className="fa-solid fa-dice-d20 text-xl"></i>
                    Rolar Dados
                </button>
            </ModalFooter>
        </>
    );

    const renderDCStep = () => (
        <>
            <div className="bg-black/40 p-6 border-b border-white/10 flex justify-between items-center shrink-0 relative">
                <h2 className="text-xl font-bold text-white tracking-wider uppercase font-display">Definir Dificuldade</h2>
                <button onClick={onClose}><i className="fa-solid fa-xmark text-gray-500 hover:text-white"></i></button>
            </div>
            <ModalBody className="p-8 space-y-8 flex flex-col items-center justify-center min-h-[300px]">
                <div className="text-center space-y-2">
                    <h3 className="text-cyber-yellow font-bold uppercase tracking-[0.2em] text-sm md:text-base">
                        Definir Classe de Dificuldade (CD)
                    </h3>
                    <p className="text-gray-400 text-xs font-mono max-w-xs mx-auto">
                        Insira o valor alvo para o teste de perícia.
                    </p>
                </div>

                <div className="relative group">
                    <div className="absolute inset-0 bg-cyber-yellow/20 blur-xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <input
                        type="number"
                        min="0"
                        value={dc}
                        onChange={(e) => setDc(parseInt(e.target.value) || 0)}
                        className="relative z-10 w-32 h-32 bg-black/60 border-2 border-cyber-yellow rounded-2xl text-center text-5xl font-bold text-white focus:outline-none focus:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all font-display"
                    />
                    <div className="absolute -top-3 -right-3 z-20 bg-cyber-bg border border-cyber-yellow px-2 py-1 rounded text-[10px] font-bold text-cyber-yellow uppercase tracking-widest shadow-lg">
                        CD
                    </div>
                </div>

                <div className="flex gap-2">
                    {[10, 15, 20, 25].map(val => (
                        <button
                            key={val}
                            onClick={() => setDc(val)}
                            className={`px-3 py-1 rounded border text-xs font-bold transition-all ${dc === val
                                ? 'bg-cyber-yellow text-black border-cyber-yellow'
                                : 'bg-transparent text-gray-400 border-white/10 hover:border-cyber-yellow/50 hover:text-white'
                                }`}
                        >
                            {val}
                        </button>
                    ))}
                </div>
            </ModalBody>
            <ModalFooter className="p-6 bg-transparent border-none flex justify-between">
                <button
                    onClick={() => setStep('setup')}
                    className="px-6 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest"
                >
                    Voltar
                </button>
                <button
                    onClick={performRoll}
                    className="px-8 py-3 bg-cyber-yellow text-black rounded-lg font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:scale-105 transition-all flex items-center gap-2"
                >
                    <i className="fa-solid fa-dice text-lg"></i> Confirmar
                </button>
            </ModalFooter>
        </>
    );

    const renderResultsStep = () => {
        if (!rollResults) return null;
        const successes = rollResults.rolls.filter(r => r.success).length;
        const isSuccess = successes > 0;

        return (
            <>
                <div className="bg-black/40 p-6 border-b border-white/10 flex justify-between items-center shrink-0 relative">
                    <h2 className="text-xl font-bold text-white tracking-wider uppercase font-display">Resultados</h2>
                    <button onClick={onClose}><i className="fa-solid fa-xmark text-gray-500 hover:text-white"></i></button>
                </div>
                <ModalBody className="p-6 space-y-6 overflow-y-auto">
                    <div className="text-center space-y-2 border-b border-white/5 pb-6">
                        <span className="text-[10px] uppercase tracking-[0.5em] text-gray-500 font-bold">Resultado Final</span>
                        <h2 className={`text-4xl md:text-5xl font-black font-display tracking-wide ${isSuccess ? 'text-cyber-green drop-shadow-[0_0_15px_rgba(0,255,0,0.5)]' : 'text-cyber-red drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]'}`}>
                            {successes} {successes === 1 ? 'SUCESSO' : 'SUCESSOS'}
                        </h2>
                        <div className="bg-white/5 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 mt-2">
                            <span className="text-xs text-gray-400 font-mono">CD ALVO:</span>
                            <span className="text-lg font-bold text-white font-display">{dc}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rollResults.rolls.map((result, idx) => (
                            <div key={idx} className={`relative overflow-hidden rounded-xl border ${result.success ? 'border-cyber-green/30 bg-cyber-green/5' : 'border-cyber-red/30 bg-cyber-red/5'} p-4 flex items-center justify-between group transition-all`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 flex items-center justify-center rounded-lg text-2xl ${result.success ? 'text-cyber-green bg-cyber-green/10' : 'text-cyber-red bg-cyber-red/10 animate-pulse'}`}>
                                        <i className="fa-solid fa-dice-d20"></i>
                                        <span className="absolute font-display font-bold text-sm tracking-tighter shadow-black drop-shadow-md">{result.die}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1 text-xs text-gray-400 font-mono">
                                            <span>BASE {result.die}</span>
                                            <span>+</span>
                                            <span>{result.attrVal} ({result.attrName})</span>
                                        </div>
                                        <span className={`text-2xl font-bold font-display ${result.success ? 'text-white' : 'text-gray-500'}`}>
                                            = {result.total}
                                        </span>
                                    </div>
                                </div>
                                {result.isReroll && (
                                    <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] text-cyber-yellow uppercase font-bold tracking-wider opacity-80">
                                        <i className="fa-solid fa-rotate-right"></i> Rerolado
                                    </div>
                                )}
                                {result.success && (
                                    <div className="absolute bottom-2 right-2 text-cyber-green">
                                        <i className="fa-solid fa-check-circle"></i>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {rollResults.discarded && rollResults.discarded.length > 0 && (
                        <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                            <div className="text-[10px] uppercase text-gray-500 font-bold mb-2 flex items-center gap-2">
                                <i className="fa-regular fa-trash-can"></i> Dados Descartados (Desvantagem)
                            </div>
                            <div className="flex gap-2">
                                {rollResults.discarded.map((val, i) => (
                                    <span key={i} className="w-8 h-8 flex items-center justify-center rounded bg-white/5 text-gray-600 font-mono text-xs border border-white/5 line-through decoration-cyber-red/50">
                                        {val}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter className="p-6 bg-transparent border-none">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest rounded-xl transition-all"
                    >
                        Fechar
                    </button>
                </ModalFooter>
            </>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
            {step === 'setup' && renderSetupStep()}
            {step === 'cd' && renderDCStep()}
            {step === 'result' && renderResultsStep()}
        </Modal>
    );
};

export default SkillRollModal;
