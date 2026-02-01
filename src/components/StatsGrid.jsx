import React from 'react';
import { useCharacter } from '../context/CharacterContext';

const StatsGrid = () => {
    const { characterData, isEditMode, updateAttribute } = useCharacter();

    return (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {characterData.attributes.map((attr) => (
                <div
                    key={attr.name}
                    className={`glass-card rounded-xl p-4 flex flex-col items-center justify-center border-t-2 ${isEditMode ? 'border-cyber-yellow/40' : `border-t-${attr.color}/50`
                        }`}
                >
                    <i className={`fa-solid ${attr.icon} text-2xl text-${attr.color} mb-2`}></i>
                    <span className="text-xs text-cyber-gray tracking-wider mb-1 uppercase text-center font-bold">
                        {attr.name} <br />
                        <span className="text-[10px] opacity-70">({attr.label})</span>
                    </span>

                    {isEditMode ? (
                        <input
                            type="number"
                            value={attr.value}
                            onChange={(e) => updateAttribute(attr.name, e.target.value)}
                            className="w-full bg-black/40 border border-cyber-yellow/30 rounded text-center text-3xl font-bold text-white focus:outline-none focus:border-cyber-yellow transition-all shadow-[0_0_10px_rgba(255,215,0,0.1)] py-1"
                        />
                    ) : (
                        <span className="font-bold text-white text-4xl">{attr.value}</span>
                    )}
                </div>
            ))}
        </section>
    );
};

export default StatsGrid;
