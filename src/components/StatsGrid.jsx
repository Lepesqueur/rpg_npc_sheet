import React from 'react';
import { useCharacter } from '../context/CharacterContext';

const StatsGrid = () => {
    const { characterData, isEditMode, updateAttribute } = useCharacter();

    return (
        <section className="grid grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
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
        </section>
    );
};

export default StatsGrid;
