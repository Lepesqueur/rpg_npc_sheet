import React, { createContext, useContext, useState, useEffect } from 'react';
import { ATTRIBUTES, SKILLS_CATEGORIES, DAMAGE_RESISTANCES, CONDITIONS } from '../data/rules';

const CharacterContext = createContext();

export const useCharacter = () => {
    const context = useContext(CharacterContext);
    if (!context) {
        throw new Error('useCharacter must be used within a CharacterProvider');
    }
    return context;
};

export const CharacterProvider = ({ children }) => {
    const [isEditMode, setIsEditMode] = useState(false);

    // --- Core Data Helpers ---
    const generateDefaultData = (name = "Novo NPC") => {
        const data = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            attributes: JSON.parse(JSON.stringify(ATTRIBUTES)),
            skillCategories: JSON.parse(JSON.stringify(SKILLS_CATEGORIES)),
            name: name,
            level: 1,
            xp: 0,
            nextLevel: 1000,
            speed: "9m",
            perception: 10,
            vitality: { current: 10, max: 10, level: 0 },
            focus: { current: 10, max: 10, level: 0 },
            will: { current: 10, max: 10, level: 0 },
            defenses: { fortitude: 10, reflex: 10, tenacity: 10 },
            attacks: [],
            armors: [],
            resistances: {},
            conditions: {},
            talents: []
        };

        // Populate initial conditions and resistances
        Object.values(CONDITIONS).forEach(category => {
            category.items.forEach(item => {
                data.conditions[item.key] = { active: false, level: 1 };
            });
        });
        Object.values(DAMAGE_RESISTANCES).forEach(category => {
            category.types.forEach(type => {
                data.resistances[type.key] = { value: 0, immunity: false, vulnerable: false };
            });
        });

        return data;
    };

    // --- State Initialization ---
    const [npcLibrary, setNpcLibrary] = useState(() => {
        const savedLibrary = localStorage.getItem('gm_npc_library');
        if (savedLibrary) {
            try {
                return JSON.parse(savedLibrary);
            } catch (e) {
                console.error("Failed to parse NPC library", e);
            }
        }

        // Backward compatibility: Migration from single character save
        const legacySave = localStorage.getItem('aeliana_character_data');
        if (legacySave) {
            try {
                const legacyData = JSON.parse(legacySave);
                if (!legacyData.id) legacyData.id = 'legacy_aeliana';
                return [legacyData];
            } catch (e) {
                console.error("Failed to migrate legacy character", e);
            }
        }

        // Default: Start with a diverse medieval library if empty
        const defaultCharacters = [
            {
                ...generateDefaultData("Grommash, o Quebra-Escudos"),
                level: 5,
                attributes: ATTRIBUTES.map(a => a.name === 'Vigor' ? { ...a, value: 22 } : a.name === 'Tamanho' ? { ...a, value: 18 } : a),
                vitality: { current: 120, max: 120, level: 0 },
                attacks: [
                    { id: 'g1', name: 'Machado de Batalha', ap: 3, costs: { vitality: 3, focus: 0, will: 0 }, damage: 18, range: 'Melee', wear: 0, skill: 'Pesadas', properties: 'Brutal', damageType: 'corte' }
                ]
            },
            {
                ...generateDefaultData("Valerius, o Iluminado"),
                level: 4,
                attributes: ATTRIBUTES.map(a => a.name === 'Intuição' ? { ...a, value: 20 } : a.name === 'Presença' ? { ...a, value: 18 } : a),
                will: { current: 60, max: 60, level: 0 },
                attacks: [
                    { id: 'v1', name: 'Maça Sagrada', ap: 3, costs: { vitality: 0, focus: 0, will: 2 }, damage: 12, range: 'Melee', wear: 0, skill: 'Pesadas', properties: 'Radiante', damageType: 'impacto' }
                ]
            },
            {
                ...generateDefaultData("Elowen da Floresta"),
                level: 3,
                attributes: ATTRIBUTES.map(a => a.name === 'Destreza' ? { ...a, value: 24 } : a.name === 'Intuição' ? { ...a, value: 18 } : a),
                focus: { current: 50, max: 50, level: 0 },
                attacks: [
                    { id: 'e1', name: 'Arco Longo Élfico', ap: 4, costs: { vitality: 0, focus: 3, will: 0 }, damage: 15, range: '30m', wear: 0, skill: 'Arqueirismo', properties: 'Preciso', damageType: 'perfuracao' }
                ]
            },
            {
                ...generateDefaultData("Nyx, a Sombra"),
                level: 6,
                attributes: ATTRIBUTES.map(a => a.name === 'Destreza' ? { ...a, value: 26 } : a.name === 'Intelecto' ? { ...a, value: 16 } : a),
                vitality: { current: 70, max: 70, level: 0 },
                attacks: [
                    { id: 'n1', name: 'Adaga de Veneno', ap: 2, costs: { vitality: 1, focus: 2, will: 0 }, damage: 8, range: 'Melee', wear: 0, skill: 'Rápidas', properties: 'Venenosa', damageType: 'perfuracao' }
                ]
            },
            {
                ...generateDefaultData("Malakor, o Arquimago"),
                level: 8,
                attributes: ATTRIBUTES.map(a => a.name === 'Intelecto' ? { ...a, value: 28 } : a.name === 'Intuição' ? { ...a, value: 20 } : a),
                focus: { current: 100, max: 100, level: 0 },
                will: { current: 80, max: 80, level: 0 },
                attacks: [
                    { id: 'm1', name: 'Cajado de Éter', ap: 3, costs: { vitality: 0, focus: 10, will: 5 }, damage: 25, range: '15m', wear: 0, skill: 'Arcana', properties: 'Mágico', damageType: 'psiquico' }
                ]
            }
        ];
        return defaultCharacters;
    });

    const [activeCharacterId, setActiveCharacterId] = useState(() => {
        const savedId = localStorage.getItem('active_npc_id');
        if (savedId && npcLibrary.some(npc => npc.id === savedId)) {
            return savedId;
        }
        return npcLibrary[0]?.id || '';
    });

    const characterData = npcLibrary.find(npc => npc.id === activeCharacterId) || npcLibrary[0];

    // Helper function to update character data in the library
    const setCharacterData = (updater) => {
        setNpcLibrary(prev => prev.map(npc => {
            if (npc.id === activeCharacterId) {
                const newData = typeof updater === 'function' ? updater(npc) : updater;
                return { ...npc, ...newData };
            }
            return npc;
        }));
    };

    // --- Persistence ---
    useEffect(() => {
        localStorage.setItem('gm_npc_library', JSON.stringify(npcLibrary));
    }, [npcLibrary]);

    useEffect(() => {
        localStorage.setItem('active_npc_id', activeCharacterId);
    }, [activeCharacterId]);

    // Force seed medieval characters if they don't exist in the current library
    useEffect(() => {
        const medievalNames = ["Grommash, o Quebra-Escudos", "Valerius, o Iluminado", "Elowen da Floresta", "Nyx, a Sombra", "Malakor, o Arquimago"];
        const hasMedieval = npcLibrary.some(npc => medievalNames.includes(npc.name));

        if (!hasMedieval) {
            setNpcLibrary(prev => {
                const defaultCharacters = [
                    {
                        ...generateDefaultData("Grommash, o Quebra-Escudos"),
                        level: 5,
                        attributes: ATTRIBUTES.map(a => a.name === 'Vigor' ? { ...a, value: 22 } : a.name === 'Tamanho' ? { ...a, value: 18 } : a),
                        vitality: { current: 120, max: 120, level: 0 },
                        attacks: [{ id: 'g1', name: 'Machado de Batalha', ap: 3, costs: { vitality: 3, focus: 0, will: 0 }, damage: 18, range: 'Melee', wear: 0, skill: 'Pesadas', properties: 'Brutal', damageType: 'corte' }]
                    },
                    {
                        ...generateDefaultData("Valerius, o Iluminado"),
                        level: 4,
                        attributes: ATTRIBUTES.map(a => a.name === 'Intuição' ? { ...a, value: 20 } : a.name === 'Presença' ? { ...a, value: 18 } : a),
                        will: { current: 60, max: 60, level: 0 },
                        attacks: [{ id: 'v1', name: 'Maça Sagrada', ap: 3, costs: { vitality: 0, focus: 0, will: 2 }, damage: 12, range: 'Melee', wear: 0, skill: 'Pesadas', properties: 'Radiante', damageType: 'impacto' }]
                    },
                    {
                        ...generateDefaultData("Elowen da Floresta"),
                        level: 3,
                        attributes: ATTRIBUTES.map(a => a.name === 'Destreza' ? { ...a, value: 24 } : a.name === 'Intuição' ? { ...a, value: 18 } : a),
                        focus: { current: 50, max: 50, level: 0 },
                        attacks: [{ id: 'e1', name: 'Arco Longo Élfico', ap: 4, costs: { vitality: 0, focus: 3, will: 0 }, damage: 15, range: '30m', wear: 0, skill: 'Arqueirismo', properties: 'Preciso', damageType: 'perfuracao' }]
                    },
                    {
                        ...generateDefaultData("Nyx, a Sombra"),
                        level: 6,
                        attributes: ATTRIBUTES.map(a => a.name === 'Destreza' ? { ...a, value: 26 } : a.name === 'Intelecto' ? { ...a, value: 16 } : a),
                        vitality: { current: 70, max: 70, level: 0 },
                        attacks: [{ id: 'n1', name: 'Adaga de Veneno', ap: 2, costs: { vitality: 1, focus: 2, will: 0 }, damage: 8, range: 'Melee', wear: 0, skill: 'Rápidas', properties: 'Venenosa', damageType: 'perfuracao' }]
                    },
                    {
                        ...generateDefaultData("Malakor, o Arquimago"),
                        level: 8,
                        attributes: ATTRIBUTES.map(a => a.name === 'Intelecto' ? { ...a, value: 28 } : a.name === 'Intuição' ? { ...a, value: 20 } : a),
                        focus: { current: 100, max: 100, level: 0 },
                        will: { current: 80, max: 80, level: 0 },
                        attacks: [{ id: 'm1', name: 'Cajado de Éter', ap: 3, costs: { vitality: 0, focus: 10, will: 5 }, damage: 25, range: '15m', wear: 0, skill: 'Arcana', properties: 'Mágico', damageType: 'psiquico' }]
                    }
                ];
                return [...prev, ...defaultCharacters];
            });
        }
    }, []);

    // --- Library Actions ---
    const switchNPC = (id) => {
        if (npcLibrary.some(npc => npc.id === id)) {
            setActiveCharacterId(id);
            setIsEditMode(false);
        }
    };

    const createNPC = (name = "Novo NPC") => {
        const newNPC = generateDefaultData(name);
        setNpcLibrary(prev => [...prev, newNPC]);
        setActiveCharacterId(newNPC.id);
        setIsEditMode(true);
    };

    const duplicateNPC = (id) => {
        const npcToClone = npcLibrary.find(npc => npc.id === id);
        if (npcToClone) {
            const clone = {
                ...JSON.parse(JSON.stringify(npcToClone)),
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                name: `${npcToClone.name} (Cópia)`
            };
            setNpcLibrary(prev => [...prev, clone]);
            setActiveCharacterId(clone.id);
        }
    };

    const deleteNPC = (id) => {
        if (npcLibrary.length <= 1) return; // Prevent deleting the last NPC
        setNpcLibrary(prev => {
            const filtered = prev.filter(npc => npc.id !== id);
            if (activeCharacterId === id) {
                setActiveCharacterId(filtered[0]?.id || '');
            }
            return filtered;
        });
    };

    const toggleEditMode = () => setIsEditMode(prev => !prev);

    const updateAttribute = (name, newValue) => {
        setCharacterData(prev => ({
            ...prev,
            attributes: prev.attributes.map(attr =>
                attr.name === name ? { ...attr, value: parseInt(newValue) || 0 } : attr
            )
        }));
    };

    const updateDefense = (key, newValue) => {
        setCharacterData(prev => ({
            ...prev,
            defenses: {
                ...prev.defenses,
                [key]: parseInt(newValue) || 0
            }
        }));
    };

    const updateStatusMax = (statusKey, newValue) => {
        setCharacterData(prev => ({
            ...prev,
            [statusKey]: {
                ...prev[statusKey],
                max: parseInt(newValue) || 0
            }
        }));
    };

    const updateStatus = (statusKey, deltaOrValue, isDelta = true) => {
        setCharacterData(prev => {
            const currentVal = prev[statusKey].current;
            const maxVal = prev[statusKey].max;
            let newValue = isDelta ? currentVal + deltaOrValue : deltaOrValue;

            // Clamp between 0 and max
            newValue = Math.min(Math.max(0, newValue), maxVal);

            return {
                ...prev,
                [statusKey]: {
                    ...prev[statusKey],
                    current: parseInt(newValue) || 0
                }
            };
        });
    };

    const updateConditionLevel = (statusKey, newLevel) => {
        setCharacterData(prev => ({
            ...prev,
            [statusKey]: {
                ...prev[statusKey],
                level: prev[statusKey].level === newLevel ? newLevel - 1 : newLevel
            }
        }));
    };

    const updateSkillLevel = (categoryKey, skillName, newLevel) => {
        if (!isEditMode) return;

        setCharacterData(prev => {
            const updatedCategories = { ...prev.skillCategories };
            const category = { ...updatedCategories[categoryKey] };
            const updatedSkills = category.skills.map(skill => {
                if (skill.name === skillName) {
                    return { ...skill, level: skill.level === newLevel ? newLevel - 1 : newLevel };
                }
                return skill;
            });
            category.skills = updatedSkills;
            updatedCategories[categoryKey] = category;

            return {
                ...prev,
                skillCategories: updatedCategories
            };
        });
    };

    const toggleSkillVisibility = (categoryKey, skillName) => {
        if (!isEditMode) return;

        setCharacterData(prev => {
            const updatedCategories = { ...prev.skillCategories };
            const category = { ...updatedCategories[categoryKey] };
            const updatedSkills = category.skills.map(skill => {
                if (skill.name === skillName) {
                    return { ...skill, visible: !skill.visible };
                }
                return skill;
            });
            category.skills = updatedSkills;
            updatedCategories[categoryKey] = category;

            return {
                ...prev,
                skillCategories: updatedCategories
            };
        });
    };

    const addAttack = (attack) => {
        setCharacterData(prev => ({
            ...prev,
            attacks: [...(prev.attacks || []), { ...attack, id: Date.now().toString(), wear: 0, damageType: attack.damageType || 'impacto' }]
        }));
    };

    const updateAttack = (id, updatedAttack) => {
        setCharacterData(prev => ({
            ...prev,
            attacks: prev.attacks.map(attack => attack.id === id ? { ...attack, ...updatedAttack } : attack)
        }));
    };

    const deleteAttack = (id) => {
        setCharacterData(prev => ({
            ...prev,
            attacks: prev.attacks.filter(attack => attack.id !== id)
        }));
    };

    const updateAttackWear = (id, level) => {
        setCharacterData(prev => ({
            ...prev,
            attacks: prev.attacks.map(attack => {
                if (attack.id === id) {
                    const newWear = attack.wear === level ? level - 1 : level;
                    return { ...attack, wear: Math.max(0, newWear) };
                }
                return attack;
            })
        }));
    };

    const addArmor = (armor) => {
        setCharacterData(prev => ({
            ...prev,
            armors: [...(prev.armors || []), { ...armor, id: Date.now().toString(), current: armor.max }]
        }));
    };

    const updateArmor = (id, updatedArmor) => {
        setCharacterData(prev => ({
            ...prev,
            armors: prev.armors.map(armor => armor.id === id ? { ...armor, ...updatedArmor } : armor)
        }));
    };

    const deleteArmor = (id) => {
        setCharacterData(prev => ({
            ...prev,
            armors: prev.armors.filter(armor => armor.id !== id)
        }));
    };

    const updateArmorCurrent = (id, newValue) => {
        setCharacterData(prev => ({
            ...prev,
            armors: prev.armors.map(armor => armor.id === id ? { ...armor, current: parseInt(newValue) || 0 } : armor)
        }));
    };

    const updateResistance = (type, field, newValue) => {
        setCharacterData(prev => {
            const currentRes = prev.resistances[type] || { value: 0, immunity: false, vulnerable: false };
            let val = currentRes.value;
            let immunity = currentRes.immunity;
            let vulnerable = currentRes.vulnerable;

            if (field === 'value') {
                val = immunity ? 0 : Math.max(0, parseInt(newValue) || 0);
            } else if (field === 'immunity') {
                immunity = newValue;
                if (immunity) {
                    vulnerable = false;
                    val = 0;
                }
            } else if (field === 'vulnerable') {
                vulnerable = newValue;
                if (vulnerable) immunity = false;
            }

            return {
                ...prev,
                resistances: {
                    ...prev.resistances,
                    [type]: { value: val, immunity, vulnerable }
                }
            };
        });
    };

    const updateAllResistances = (newResistances) => {
        setCharacterData(prev => ({
            ...prev,
            resistances: newResistances
        }));
    };

    const updateActiveCondition = (key, field, newValue) => {
        setCharacterData(prev => {
            const currentItem = prev.conditions[key] || { active: false, level: 1 };
            return {
                ...prev,
                conditions: {
                    ...prev.conditions,
                    [key]: {
                        ...currentItem,
                        [field]: field === 'level' ? (parseInt(newValue) || 1) : newValue
                    }
                }
            };
        });
    };

    const updateAllConditions = (newConditions) => {
        setCharacterData(prev => ({
            ...prev,
            conditions: newConditions
        }));
    };

    const addTalent = (talent) => {
        setCharacterData(prev => ({
            ...prev,
            talents: [...(prev.talents || []), { ...talent, id: Date.now().toString() }]
        }));
    };

    const updateTalent = (id, updatedTalent) => {
        setCharacterData(prev => ({
            ...prev,
            talents: prev.talents.map(t => t.id === id ? { ...t, ...updatedTalent } : t)
        }));
    };

    const deleteTalent = (id) => {
        setCharacterData(prev => ({
            ...prev,
            talents: prev.talents.filter(t => t.id !== id)
        }));
    };

    const consumeResources = (costs) => {
        const { vitality = 0, focus = 0, will = 0 } = costs;
        const missing = [];

        if (characterData.vitality.current < vitality) missing.push('Vitalidade');
        if (characterData.focus.current < focus) missing.push('Foco');
        if (characterData.will.current < will) missing.push('Vontade');

        if (missing.length > 0) {
            return { success: false, missing };
        }

        setCharacterData(prev => ({
            ...prev,
            vitality: { ...prev.vitality, current: prev.vitality.current - vitality },
            focus: { ...prev.focus, current: prev.focus.current - focus },
            will: { ...prev.will, current: prev.will.current - will }
        }));

        return { success: true, missing: [] };
    };

    const updateName = (newName) => {
        if (!isEditMode) return;
        setCharacterData(prev => ({
            ...prev,
            name: newName
        }));
    };

    const updateLevel = (newLevel) => {
        if (!isEditMode) return;
        setCharacterData(prev => ({
            ...prev,
            level: parseInt(newLevel) || 1
        }));
    };

    const updateXp = (newXp) => {
        if (!isEditMode) return;
        setCharacterData(prev => ({
            ...prev,
            xp: parseInt(newXp) || 0
        }));
    };

    const updateNextLevel = (newNext) => {
        if (!isEditMode) return;
        setCharacterData(prev => ({
            ...prev,
            nextLevel: parseInt(newNext) || 0
        }));
    };

    const updateSpeed = (newVal) => {
        if (!isEditMode) return;
        setCharacterData(prev => ({ ...prev, speed: newVal }));
    };

    const updatePerception = (newVal) => {
        if (!isEditMode) return;
        setCharacterData(prev => ({ ...prev, perception: newVal }));
    };

    const exportCharacter = () => {
        const dataStr = JSON.stringify(characterData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `character_${characterData.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const importCharacter = (jsonData) => {
        try {
            const parsed = JSON.parse(jsonData);
            if (!parsed || typeof parsed !== 'object') throw new Error("Invalid JSON");

            // Assign a new ID to avoid conflicts if it's a manual import
            const importedNPC = {
                ...parsed,
                id: parsed.id || Date.now().toString() + Math.random().toString(36).substr(2, 9)
            };

            setNpcLibrary(prev => [...prev.filter(npc => npc.id !== importedNPC.id), importedNPC]);
            setActiveCharacterId(importedNPC.id);
            return true;
        } catch (e) {
            console.error("Failed to import character:", e);
            return false;
        }
    };

    const value = {
        characterData,
        npcLibrary,
        activeCharacterId,
        switchNPC,
        createNPC,
        duplicateNPC,
        deleteNPC,
        isEditMode,
        toggleEditMode,
        updateAttribute,
        updateDefense,
        updateStatusMax,
        updateStatus,
        updateConditionLevel,
        updateSkillLevel,
        toggleSkillVisibility,
        addAttack,
        updateAttack,
        deleteAttack,
        updateAttackWear,
        addArmor,
        updateArmor,
        deleteArmor,
        updateArmorCurrent,
        updateResistance,
        updateAllResistances,
        updateActiveCondition,
        updateAllConditions,
        addTalent,
        updateTalent,
        deleteTalent,
        consumeResources,
        updateName,
        updateLevel,
        updateXp,
        updateNextLevel,
        updateSpeed,
        updatePerception,
        exportCharacter,
        importCharacter
    };

    return (
        <CharacterContext.Provider value={value}>
            {children}
        </CharacterContext.Provider>
    );
};
