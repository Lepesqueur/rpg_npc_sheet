import React from 'react';
import { useCharacter } from '../context/CharacterContext';

const CircularProgress = ({ value, max, color, label, sublabel, shadowColor, statusKey, isEditMode }) => {
    const { characterData, updateStatusMax, updateStatus, updateConditionLevel } = useCharacter();
    const statusLevel = characterData[statusKey].level || 0;
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / max) * circumference;
    const offset = circumference - progress;

    return (
        <div className="flex flex-col items-center gap-2 w-full shrink-0">
            <div className="relative w-[90px] h-[90px] flex items-center justify-center">
                {/* Botão de Diminuir (Esq) */}
                <button
                    onClick={() => updateStatus(statusKey, -1)}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all z-10"
                >
                    <i className="fa-solid fa-minus text-[8px]"></i>
                </button>

                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="45" cy="45" r={radius} stroke="#2d2d3d" strokeWidth="6" fill="transparent" />
                    <circle
                        cx="45"
                        cy="45"
                        r={radius}
                        stroke={color}
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-500 ease-out"
                        style={{ filter: `drop-shadow(0 0 3px ${shadowColor || color})` }}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex items-baseline justify-center">
                        <span className="text-lg font-bold text-white leading-none">{value}</span>
                        <span className="text-[10px] text-cyber-gray mx-0.5">/</span>
                        {isEditMode ? (
                            <input
                                type="number"
                                value={max}
                                onChange={(e) => updateStatusMax(statusKey, e.target.value)}
                                className="w-8 bg-black/40 border-b border-cyber-yellow/50 text-[11px] font-bold text-cyber-yellow text-center outline-none focus:border-cyber-yellow transition-all"
                            />
                        ) : (
                            <span className="text-[10px] text-cyber-gray font-bold">{max}</span>
                        )}
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-widest mt-1" style={{ color }}>{label}</span>
                </div>

                {/* Botão de Aumentar (Dir) */}
                <button
                    onClick={() => updateStatus(statusKey, 1)}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all z-10"
                >
                    <i className="fa-solid fa-plus text-[8px]"></i>
                </button>
            </div>
            <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color }}>{sublabel}</span>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => {
                        const isActive = statusLevel >= i;
                        return (
                            <div
                                key={i}
                                onClick={() => updateConditionLevel(statusKey, i)}
                                className={`w-4 h-4 border rounded-sm cursor-pointer transition-all hover:scale-110 ${isActive ? 'bg-current shadow-[0_0_8px_currentColor]' : 'bg-transparent overflow-hidden opacity-30 hover:opacity-100'}`}
                                style={{ borderColor: color, color: color }}
                            ></div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CircularProgress;
