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

    // Inicializar estado com dados das regras
    const [characterData, setCharacterData] = useState(() => {
        const defaultData = {
            attributes: ATTRIBUTES,
            skillCategories: SKILLS_CATEGORIES,
            name: "Aeliana, a Arconte",
            level: 5,
            xp: 14500,
            nextLevel: 18000,
            speed: "9m",
            perception: 15,
            vitality: { current: 80, max: 100, level: 0 },
            focus: { current: 45, max: 50, level: 0 },
            will: { current: 28, max: 40, level: 0 },
            defenses: {
                fortitude: 16,
                reflex: 18,
                tenacity: 14
            },
            attacks: [
                { id: '1', name: 'Espada Longa', ap: 3, costs: { vitality: 2, focus: 0, will: 0 }, damage: 13, range: 'C.C.', wear: 0, skill: 'Lâminas', properties: 'Versátil', damageType: 'corte' },
                { id: '2', name: 'Arco Curto', ap: 4, costs: { vitality: 0, focus: 5, will: 0 }, damage: 7, range: '18m', wear: 0, skill: 'Arqueirismo', properties: '', damageType: 'perfuracao' }
            ],
            armors: [
                { id: 'a1', name: 'Colete de Kevlar', icon: 'fa-shield-halved', current: 4, max: 4, notes: '', reflexBonus: 0, properties: 'Leve' },
                { id: 'a2', name: 'Elmo Neural', icon: 'fa-mask', current: 2, max: 2, notes: '', reflexBonus: 1, properties: '' }
            ],
            resistances: {}, // Will be populated below
            conditions: {}, // Will be populated below
            talents: [
                {
                    id: 't1',
                    name: "EXPLOSÃO ARCANA",
                    category: "actions",
                    tags: ["Habilidade Ativa", "Magia de Éter"],
                    pa: 3,
                    costs: { focus: 2, will: 0, vitality: 0 },
                    stats: {
                        duracao: "Instantânea",
                        ativacao: "Ação",
                        alcance: "10 metros",
                        alvo: "Área Circular"
                    },
                    description: "Libera uma onda de energia bruta em um raio de 3 metros, causando dano mágico crítico.",
                    fullDescription: "O conjurador canaliza energia pura do Éter, liberando-a em uma violenta onda de choque ao seu redor. A explosão ignora armaduras físicas convencionais e empurra inimigos pequenos para longe do centro do impacto. Criaturas atingidas devem realizar um teste de Resistência Mágica ou sofrerão 4d8 de dano arcano.",
                    potencializacoes: [
                        { name: "+2d6 de Dano Adicional", effect: "Aumenta a densidade da carga energética", resource: "focus", value: 2 },
                        { name: "Aumentar Alcance (+5m)", effect: "Expande a projeção da onda de choque", resource: "will", value: 1 },
                        { name: "Efeito de Atordoamento", effect: "Inimigos falham automaticamente em reações", resource: "vitality", value: 3 }
                    ],
                    icon: "fa-burst",
                    color: "neon-pink"
                },
                {
                    id: 't2',
                    name: "TELETRANSPORTE MENOR",
                    category: "actions",
                    tags: ["Habilidade Ativa"],
                    pa: 2,
                    costs: { focus: 1, will: 0, vitality: 1 },
                    stats: {
                        duracao: "Instantânea",
                        ativacao: "Ação",
                        alcance: "15 metros",
                        alvo: "Pessoal"
                    },
                    description: "Permite deslocar-se instantaneamente para um ponto visível a até 15 metros.",
                    fullDescription: "Curte distância de transporte através do Éter.",
                    potencializacoes: [
                        { name: "Custo de Foco", effect: "Custo reduzido", resource: "focus", value: 1 },
                        { name: "Custo de Vitalidade", effect: "Custo reduzido", resource: "vitality", value: 1 }
                    ],
                    icon: "fa-door-open",
                    color: "neon-pink"
                },
                {
                    id: 't3',
                    name: "ESCUDO PROTETOR",
                    category: "actions",
                    tags: ["Habilidade Ativa"],
                    pa: 1,
                    costs: { focus: 0, will: 5, vitality: 0 },
                    stats: {
                        duracao: "1 minuto",
                        ativacao: "Ação",
                        alcance: "Pessoal",
                        alvo: "Pessoal"
                    },
                    description: "Conjura uma barreira translúcida que absorve os próximos 10 pontos de dano físico.",
                    fullDescription: "Proteção física básica.",
                    potencializacoes: [
                        { name: "Custo de Vontade", effect: "Aumenta durabilidade", resource: "will", value: 5 }
                    ],
                    icon: "fa-shield-halved",
                    color: "neon-pink"
                },
                {
                    id: 't4',
                    name: "MESTRE DE ARMAS",
                    category: "talent",
                    tags: ["Passiva"],
                    pa: 0,
                    costs: { focus: 0, will: 0, vitality: 0 },
                    stats: {
                        duracao: "Passiva",
                        ativacao: "Passiva",
                        alcance: "-",
                        alvo: "Pessoal"
                    },
                    description: "Adiciona +2 em jogadas de ataque com armas pesadas ou de haste.",
                    fullDescription: "Sua maestria com armas grandes é inigualável.",
                    potencializacoes: [],
                    icon: "fa-gavel",
                    color: "neon-yellow"
                },
                {
                    id: 't5',
                    name: "SENTIDOS AGUÇADOS",
                    category: "talent",
                    tags: ["Passiva"],
                    pa: 0,
                    costs: { focus: 1, will: 0, vitality: 0 },
                    stats: {
                        duracao: "Passiva",
                        ativacao: "Passiva",
                        alcance: "-",
                        alvo: "Pessoal"
                    },
                    description: "Vantagem em testes de Percepção baseados em audição ou olfato.",
                    fullDescription: "Seus sentidos são extremamente treinados.",
                    potencializacoes: [
                        { name: "Custo de Foco", effect: "Foco aprofundado", resource: "focus", value: 1 }
                    ],
                    icon: "fa-ear-listen",
                    color: "neon-yellow"
                },
                {
                    id: 't6',
                    name: "RESILIÊNCIA MENTAL",
                    category: "talent",
                    tags: ["Passiva"],
                    pa: 0,
                    costs: { focus: 0, will: 2, vitality: 0 },
                    stats: {
                        duracao: "Passiva",
                        ativacao: "Passiva",
                        alcance: "-",
                        alvo: "Pessoal"
                    },
                    description: "Sua mente é um forte. Imune a efeitos de medo mundanos e resistência a dano psíquico.",
                    fullDescription: "Mente inquebrável.",
                    potencializacoes: [
                        { name: "Custo de Vontade", effect: "Proteção extra", resource: "will", value: 2 }
                    ],
                    icon: "fa-head-side-virus",
                    color: "neon-yellow"
                }
            ]
        };

        // Populate initial conditions from rules
        Object.values(CONDITIONS).forEach(category => {
            category.items.forEach(item => {
                defaultData.conditions[item.key] = { active: false, level: 1 };
            });
        });

        // Populate initial resistances from rules
        Object.values(DAMAGE_RESISTANCES).forEach(category => {
            category.types.forEach(type => {
                defaultData.resistances[type.key] = { value: 0, immunity: false, vulnerable: false };
            });
        });

        // Add some default resistances for testing
        defaultData.resistances.fogo = { value: 10, immunity: false, vulnerable: false };
        defaultData.resistances.impacto = { value: 5, immunity: false, vulnerable: false };
        defaultData.resistances.eletrico = { value: 0, immunity: false, vulnerable: true };
        defaultData.resistances.veneno = { value: 0, immunity: true, vulnerable: false };

        const saved = localStorage.getItem('aeliana_character_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                // Merge robusto: garante que novas chaves (como 'defenses') existam
                const merged = {
                    ...defaultData,
                    ...parsed,
                    name: parsed.name || defaultData.name,
                    level: parsed.level || defaultData.level,
                    xp: parsed.xp !== undefined ? parsed.xp : defaultData.xp,
                    nextLevel: parsed.nextLevel !== undefined ? parsed.nextLevel : defaultData.nextLevel,
                    speed: parsed.speed || defaultData.speed,
                    perception: parsed.perception !== undefined ? parsed.perception : defaultData.perception,
                    // Garante que sub-objetos também existam se o save for antigo
                    defenses: { ...defaultData.defenses, ...(parsed.defenses || {}) },
                    vitality: { ...defaultData.vitality, ...(parsed.vitality || {}) },
                    focus: { ...defaultData.focus, ...(parsed.focus || {}) },
                    will: { ...defaultData.will, ...(parsed.will || {}) },
                    attacks: (parsed.attacks || defaultData.attacks).map(attack => {
                        // Migração de resource: { type, value } para costs: { focus, will, vitality }
                        if (attack.resource && !attack.costs) {
                            const newCosts = { focus: 0, will: 0, vitality: 0 };
                            if (attack.resource.type === 'focus') newCosts.focus = attack.resource.value;
                            else if (attack.resource.type === 'will') newCosts.will = attack.resource.value;
                            else newCosts.vitality = attack.resource.value;

                            const { resource, ...rest } = attack;
                            return { ...rest, costs: newCosts };
                        }
                        return {
                            costs: { focus: 0, will: 0, vitality: 0 },
                            skill: 'Luta', // Default generic skill
                            properties: '', // Default empty properties
                            damageType: 'impacto', // Default damage type
                            ...attack
                        };
                    }),
                    armors: (parsed.armors || defaultData.armors).map(armor => ({
                        notes: '',
                        icon: 'fa-shield-halved',
                        reflexBonus: 0,
                        properties: '',
                        ...armor
                    })),
                    resistances: { ...defaultData.resistances, ...(parsed.resistances || {}) },
                    conditions: { ...defaultData.conditions, ...(parsed.conditions || {}) },
                    talents: parsed.talents || defaultData.talents
                };

                // Sincronizar ícones e atributos das regras (para garantir que fix de UI se propaguem)
                Object.keys(SKILLS_CATEGORIES).forEach(catKey => {
                    if (merged.skillCategories[catKey]) {
                        merged.skillCategories[catKey].skills = merged.skillCategories[catKey].skills.map(skill => {
                            const ruleSkill = SKILLS_CATEGORIES[catKey].skills.find(s => s.name === skill.name);
                            if (ruleSkill) {
                                return {
                                    ...skill,
                                    icon: ruleSkill.icon,
                                    attr: ruleSkill.attr,
                                    visible: skill.visible !== undefined ? skill.visible : false // Default visibility
                                };
                            }
                            return { ...skill, visible: skill.visible !== undefined ? skill.visible : false };
                        });
                    }
                });

                return merged;
            } catch (e) {
                console.error("Failed to parse saved character data", e);
            }
        }

        return defaultData;
    });

    // Salvar no LocalStorage sempre que houver mudança
    useEffect(() => {
        localStorage.setItem('aeliana_character_data', JSON.stringify(characterData));
    }, [characterData]);

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
        if (!isEditMode) return; // Só permite se o modo de edição estiver ligado

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
                // Impede valores negativos e bloqueia se estiver imune
                val = immunity ? 0 : Math.max(0, parseInt(newValue) || 0);
            } else if (field === 'immunity') {
                immunity = newValue;
                // Se ficar imune, desativa vulnerabilidade e zera valor
                if (immunity) {
                    vulnerable = false;
                    val = 0;
                }
            } else if (field === 'vulnerable') {
                vulnerable = newValue;
                // Se ficar vulnerável, desativa imunidade
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

    /**
     * Verifica e consome recursos (vitalidade, foco, vontade).
     * @param {Object} costs - Objeto contendo { vitality, focus, will }
     * @returns {Object} - { success: boolean, missing: Array }
     */
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

    // --- INVENTORY CRUD ---
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

    // --- IMPORT / EXPORT ---
    const exportCharacter = () => {
        const dataStr = JSON.stringify(characterData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `character_${new Date().toISOString().slice(0, 10)}.json`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const importCharacter = (jsonData) => {
        try {
            const parsed = JSON.parse(jsonData);
            // Basic validation: check if crucial keys exist or merge defensively
            if (!parsed || typeof parsed !== 'object') throw new Error("Invalid JSON");

            setCharacterData(prev => ({
                ...prev,
                ...parsed, // Merge imported data over current
                // Ensure nested objects are merged correctly if missing in import
                vitality: { ...prev.vitality, ...(parsed.vitality || {}) },
                focus: { ...prev.focus, ...(parsed.focus || {}) },
                will: { ...prev.will, ...(parsed.will || {}) },
                defenses: { ...prev.defenses, ...(parsed.defenses || {}) },
                skillCategories: parsed.skillCategories || prev.skillCategories, // Full replace or keep existing
            }));
            return true;
        } catch (e) {
            console.error("Failed to import character:", e);
            return false;
        }
    };

    const value = {
        characterData,
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
