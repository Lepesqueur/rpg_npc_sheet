export const ATTRIBUTES = [
    { name: 'Tamanho', label: 'Tam', icon: 'fa-mountain', color: 'cyber-yellow', value: 12 },
    { name: 'Vigor', label: 'Vig', icon: 'fa-heart', color: 'cyber-pink', value: 16 },
    { name: 'Destreza', label: 'Des', icon: 'fa-location-arrow', color: 'cyber-purple', value: 18 },
    { name: 'Intelecto', label: 'Int', icon: 'fa-brain', color: 'cyber-purple', value: 20 },
    { name: 'Intuição', label: 'Intu', icon: 'fa-eye', color: 'cyber-pink', value: 15 },
    { name: 'Presença', label: 'Pres', icon: 'fa-star', color: 'cyber-yellow', value: 14 },
];

export const ATTR_MAP = {
    'DES': 'Des',
    'INTUI': 'Intu',
    'VIG': 'Vig',
    'INT': 'Int',
    'TAM': 'Tam',
    'PRE': 'Pres',
    'PRES': 'Pres'
};

export const SKILLS_CATEGORIES = {
    weapons: {
        label: 'Armas',
        icon: 'fa-crosshairs',
        color: '#ff00ff',
        borderColor: '#f1c40f',
        skills: [
            { name: 'Arqueirismo', attr: 'DES', level: 3, icon: 'fa-bullseye' },
            { name: 'Atirar', attr: ['DES', 'INTUI'], level: 2, icon: 'fa-crosshairs' },
            { name: 'Haste', attr: ['DES', 'VIG'], level: 1, icon: 'fa-staff-snake' },
            { name: 'Lâminas', attr: ['TAM', 'DES'], level: 3, icon: 'fa-khanda' },
            { name: 'Pesadas', attr: ['TAM', 'VIG'], level: 0, icon: 'fa-hammer' },
            { name: 'Rápidas', attr: 'DES', level: 2, icon: 'fa-bolt' },
        ]
    },
    tech: {
        label: 'Técnicas',
        icon: 'fa-microchip',
        color: '#ff00ff',
        borderColor: '#00e5ff',
        skills: [
            { name: 'Aparatos', attr: ['DES', 'INT'], level: 1, icon: 'fa-toolbox' },
            { name: 'Arremesso', attr: ['TAM', 'DES'], level: 2, icon: 'fa-bullseye' },
            { name: 'Atletismo', attr: ['VIG', 'DES'], level: 3, icon: 'fa-person-running' },
            { name: 'Furtividade', attr: 'DES', level: 2, icon: 'fa-user-ninja' },
            { name: 'Luta', attr: ['TAM', 'DES'], level: 1, icon: 'fa-hand-fist' },
            { name: 'Prestidigitação', attr: 'DES', level: 1, icon: 'fa-wand-sparkles' },
        ]
    },
    knowledge: {
        label: 'Conhecimentos',
        icon: 'fa-book',
        color: '#ff00ff',
        borderColor: '#9b59b6',
        skills: [
            { name: 'Alquimia', attr: 'INT', level: 2, icon: 'fa-flask' },
            { name: 'Arcana', attr: 'INT', level: 3, icon: 'fa-hat-wizard' },
            { name: 'Escotismo', attr: ['INT', 'INTUI'], level: 1, icon: 'fa-mountain-sun' },
            { name: 'História', attr: 'INT', level: 1, icon: 'fa-scroll' },
            { name: 'Investigação', attr: 'INT', level: 2, icon: 'fa-magnifying-glass' },
            { name: 'Medicina', attr: ['INT', 'INTUI'], level: 1, icon: 'fa-briefcase-medical' },
        ]
    },
    social: {
        label: 'Sociais',
        icon: 'fa-comments',
        color: '#ff00ff',
        borderColor: '#ff00ff',
        skills: [
            { name: 'Dissimular', attr: 'PRE', level: 2, icon: 'fa-mask' },
            { name: 'Empatia Feral', attr: 'INTUI', level: 1, icon: 'fa-paw' },
            { name: 'Inuendo', attr: ['PRE', 'INTUI'], level: 3, icon: 'fa-user-secret' },
            { name: 'Intimidação', attr: ['TAM', 'PRE'], level: 2, icon: 'fa-skull' },
            { name: 'Performance', attr: 'PRE', level: 1, icon: 'fa-masks-theater' },
            { name: 'Persuasão', attr: 'PRE', level: 3, icon: 'fa-handshake' },
        ]
    }
};

export const DAMAGE_RESISTANCES = {
    mundane: {
        label: 'Mundano',
        color: 'cyber-pink',
        icon: 'fa-shield-halved',
        types: [
            { key: 'corte', name: 'Corte', icon: 'fa-sword' },
            { key: 'impacto', name: 'Impacto', icon: 'fa-hammer' },
            { key: 'perfuracao', name: 'Perfuração', icon: 'fa-bullseye' },
            { key: 'veneno', name: 'Veneno', icon: 'fa-biohazard' }
        ]
    },
    elemental: {
        label: 'Elemental',
        color: 'cyber-purple',
        icon: 'fa-wand-magic-sparkles',
        types: [
            { key: 'acido', name: 'Ácido', icon: 'fa-flask' },
            { key: 'eletrico', name: 'Elétrico', icon: 'fa-bolt' },
            { key: 'fogo', name: 'Fogo', icon: 'fa-fire' },
            { key: 'frio', name: 'Frio', icon: 'fa-snowflake' }
        ]
    },
    intangible: {
        label: 'Intangível',
        color: 'cyber-yellow',
        icon: 'fa-ghost',
        types: [
            { key: 'psiquico', name: 'Psíquico', icon: 'fa-brain' },
            { key: 'radiante', name: 'Radiante', icon: 'fa-sun' }
        ]
    },
    entropic: {
        label: 'Entrópico',
        color: 'cyber-cyan',
        icon: 'fa-skull',
        types: [
            { key: 'necrotico', name: 'Necrótico', icon: 'fa-cloud-showers-heavy' }
        ]
    }
};

export const CONDITIONS = {
    mental: {
        label: 'Condições Mentais',
        color: 'cyber-purple',
        icon: 'fa-brain',
        items: [
            { key: 'abatida', name: 'Abatida', icon: 'fa-face-frown' },
            { key: 'amedrontada', name: 'Amedrontada', icon: 'fa-ghost' },
            { key: 'ansiosa', name: 'Ansiosa', icon: 'fa-bolt' },
            { key: 'encantada', name: 'Encantada', icon: 'fa-heart' },
            { key: 'enfurecida', name: 'Enfurecida', icon: 'fa-fire' },
            { key: 'entorpecida', name: 'Entorpecida', icon: 'fa-pills' },
        ]
    },
    physical: {
        label: 'Condições Físicas',
        color: 'cyber-pink',
        icon: 'fa-person-falling',
        items: [
            { key: 'atordoada', name: 'Atordoada', icon: 'fa-dizzy' },
            { key: 'caida', name: 'Caída', icon: 'fa-person-falling' },
            { key: 'letargica', name: 'Letárgica', icon: 'fa-hourglass' },
            { key: 'presa', name: 'Presa', icon: 'fa-link' },
            { key: 'ardendo', name: 'Ardendo', icon: 'fa-fire-alt' },
            { key: 'paralisada', name: 'Paralisada', icon: 'fa-lock' },
        ]
    },
    health: {
        label: 'Condições de Saúde',
        color: 'cyber-green',
        icon: 'fa-heart-pulse',
        items: [
            { key: 'doente', name: 'Doente', icon: 'fa-virus' },
            { key: 'envenenada', name: 'Envenenada', icon: 'fa-biohazard' },
            { key: 'sangrando', name: 'Sangrando', icon: 'fa-droplet' },
        ]
    }
};

// "Ação Básica" é obrigatória para a separação da UI (coluna esquerda vs direita)
export const TALENT_GROUPS = [
    "Ação Básica", "OFUSCAR", "RESPLANDECER", "ARTES MARCIAIS", "COMBATE ARMADO",
    "ELETRICIDADE", "ELOQUÊNCIA", "ESPREITAR", "NATUREZA",
    "PIROMANCIA", "PRESERVAR", "TELECINESE", "TELEPATIA"
];

export const TALENT_GROUP_COLORS = {
    "Ação Básica": "cyber-pink",
    "OFUSCAR": "cyber-purple",
    "RESPLANDECER": "cyber-yellow",
    "ARTES MARCIAIS": "cyber-cyan",
    "COMBATE ARMADO": "cyber-pink",
    "ELETRICIDADE": "cyber-purple",
    "ELOQUÊNCIA": "cyber-yellow",
    "ESPREITAR": "cyber-cyan",
    "NATUREZA": "cyber-green",
    "PIROMANCIA": "cyber-pink",
    "PRESERVAR": "cyber-purple",
    "TELECINESE": "cyber-yellow",
    "TELEPATIA": "cyber-cyan"
};
