import React from 'react';
import { useCharacter } from '../context/CharacterContext';

const StatsGrid = () => {
    const { characterData, isEditMode, updateAttribute, updateSpeed, updatePerception } = useCharacter();

    return (
        <section className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-12 gap-2 mb-4">
            {/* Core Attributes */}
            <div className="col-span-3 md:col-span-3 lg:col-span-10 grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {characterData.attributes.map((attr) => (
                    <div
                        key={attr.name}
                        className={`glass-card rounded-lg p-2 flex flex-col items-center justify-center border-t-2 ${isEditMode ? 'border-cyber-yellow/40' : `border-t-${attr.color}/50`
                            }`}
                    >
                        <i className={`fa-solid ${attr.icon} text-lg text-${attr.color} mb-1`}></i>
                        <span className="text-[10px] text-cyber-gray tracking-wider uppercase text-center font-bold leading-tight mb-1">
                            {attr.name}
                        </span>

                        {isEditMode ? (
                            <input
                                type="number"
                                value={attr.value}
                                onChange={(e) => updateAttribute(attr.name, e.target.value)}
                                className="w-full bg-black/40 border border-cyber-yellow/30 rounded text-center text-xl font-bold text-white focus:outline-none focus:border-cyber-yellow transition-all shadow-[0_0_10px_rgba(255,215,0,0.1)] py-0.5"
                            />
                        ) : (
                            <span className="font-bold text-white text-2xl">{attr.value}</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Secondary Stats Column */}
            <div className="col-span-3 md:col-span-1 lg:col-span-2 flex flex-col gap-2">
                {/* Speed Stat */}
                <div className={`glass-card rounded-lg px-3 py-1.5 flex grow items-center gap-3 border-l-2 ${isEditMode ? 'border-cyber-yellow/40' : 'border-l-cyber-pink/50'}`}>
                    <div className="w-8 h-8 rounded bg-cyber-pink/10 flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-person-running text-lg text-cyber-pink"></i>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[8px] text-cyber-gray tracking-wider uppercase font-bold leading-tight">Velocidade</span>
                        {isEditMode ? (
                            <input
                                type="text"
                                value={characterData.speed}
                                onChange={(e) => updateSpeed(e.target.value)}
                                className="bg-transparent border-none outline-none w-full text-white font-bold text-sm p-0 m-0 h-auto"
                            />
                        ) : (
                            <span className="font-bold text-white text-sm truncate">{characterData.speed}</span>
                        )}
                    </div>
                </div>

                {/* Perception Stat */}
                <div className={`glass-card rounded-lg px-3 py-1.5 flex grow items-center gap-3 border-l-2 ${isEditMode ? 'border-cyber-yellow/40' : 'border-l-cyber-purple/50'}`}>
                    <div className="w-8 h-8 rounded bg-cyber-purple/10 flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-eye text-lg text-cyber-purple"></i>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[8px] text-cyber-gray tracking-wider uppercase font-bold leading-tight">Percepção</span>
                        {isEditMode ? (
                            <input
                                type="number"
                                value={characterData.perception}
                                onChange={(e) => updatePerception(e.target.value)}
                                className="bg-transparent border-none outline-none w-full text-white font-bold text-sm p-0 m-0 h-auto"
                            />
                        ) : (
                            <span className="font-bold text-white text-sm truncate">{characterData.perception}</span>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatsGrid;
