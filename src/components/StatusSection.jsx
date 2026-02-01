import React from 'react';
import CircularProgress from './CircularProgress';
import { useCharacter } from '../context/CharacterContext';

const StatusSection = () => {
    const { characterData, isEditMode } = useCharacter();

    return (
        <div className="border border-white/10 rounded-xl p-4 flex flex-col glass-card">
            <h3 className="text-cyber-gray text-xs font-bold tracking-[0.2em] uppercase mb-4 pl-3 border-l-4 border-cyber-yellow font-display">Status do Personagem</h3>
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-8 items-center justify-around py-4">
                <CircularProgress
                    value={characterData.vitality.current}
                    max={characterData.vitality.max}
                    color="#ff007f"
                    label="Vitalidade"
                    sublabel="Ferida"
                    statusKey="vitality"
                    isEditMode={isEditMode}
                />
                <CircularProgress
                    value={characterData.focus.current}
                    max={characterData.focus.max}
                    color="#bd00ff"
                    label="Foco"
                    sublabel="Fadiga"
                    statusKey="focus"
                    isEditMode={isEditMode}
                />
                <CircularProgress
                    value={characterData.will.current}
                    max={characterData.will.max}
                    color="#ffd700"
                    label="Vontade"
                    sublabel="Trauma"
                    statusKey="will"
                    isEditMode={isEditMode}
                />
            </div>
        </div>
    );
};

export default StatusSection;
