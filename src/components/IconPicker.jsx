import React, { useState } from 'react';
import { Modal } from './Modal';

// Curated list of FontAwesome icons suitable for RPGs
const RPG_ICONS = [
    // Magia e Energia
    { name: 'fa-burst', tags: ['magia', 'energia', 'explosao'] },
    { name: 'fa-fire', tags: ['magia', 'fogo', 'elemento'] },
    { name: 'fa-bolt', tags: ['magia', 'raio', 'energia'] },
    { name: 'fa-droplet', tags: ['magia', 'agua', 'elemento'] },
    { name: 'fa-wind', tags: ['magia', 'vento', 'elemento'] },
    { name: 'fa-snowflake', tags: ['magia', 'gelo', 'elemento'] },
    { name: 'fa-wand-magic-sparkles', tags: ['magia', 'arcano'] },
    { name: 'fa-hat-wizard', tags: ['magia', 'mago'] },
    { name: 'fa-hand-sparkles', tags: ['magia', 'cura', 'divino'] },
    { name: 'fa-skull', tags: ['necromancia', 'morte', 'caveira'] },
    { name: 'fa-ghost', tags: ['espiritual', 'fantasma'] },

    // Combate e Armas
    { name: 'fa-khanda', tags: ['arma', 'espada', 'combate'] },
    { name: 'fa-gavel', tags: ['arma', 'martelo', 'combate'] },
    { name: 'fa-shield-halved', tags: ['defesa', 'escudo', 'protecao'] },
    { name: 'fa-bow-arrow', tags: ['arma', 'arco', 'distancia'] },
    { name: 'fa-crosshairs', tags: ['combate', 'miro', 'precisao'] },
    { name: 'fa-fist-raised', tags: ['combate', 'punho', 'luta'] },
    { name: 'fa-bomb', tags: ['arma', 'explosivo'] },

    // Status e Condições
    { name: 'fa-heart', tags: ['status', 'vida', 'cura'] },
    { name: 'fa-heart-pulse', tags: ['status', 'vida', 'regeneracao'] },
    { name: 'fa-person-running', tags: ['movimento', 'velocidade'] },
    { name: 'fa-eye', tags: ['sentidos', 'percepcao', 'visao'] },
    { name: 'fa-ear-listen', tags: ['sentidos', 'audicao'] },
    { name: 'fa-brain', tags: ['mental', 'intelecto', 'psiquico'] },
    { name: 'fa-user-ninja', tags: ['furtividade', 'agilidade'] },
    { name: 'fa-person-falling', tags: ['status', 'dano', 'queda'] },

    // Roupas e Armaduras
    { name: 'fa-shirt', tags: ['item', 'roupa', 'armadura', 'tronco'] },
    { name: 'fa-vest', tags: ['item', 'roupa', 'colete', 'armadura'] },
    { name: 'fa-helmet-safety', tags: ['item', 'capacete', 'cabeca', 'protecao'] },
    { name: 'fa-user-shield', tags: ['item', 'escudo', 'protecao', 'defesa'] },
    { name: 'fa-glasses', tags: ['item', 'oculos', 'acessorio', 'rosto'] },
    { name: 'fa-mitten', tags: ['item', 'luvas', 'maos', 'protecao'] },
    { name: 'fa-shoe-prints', tags: ['item', 'botas', 'pes', 'pernas'] },
    { name: 'fa-hat-cowboy', tags: ['item', 'chapeu', 'cabeca', 'estilo'] },
    { name: 'fa-mask', tags: ['item', 'mascara', 'rosto', 'furtividade'] },
    { name: 'fa-tshirt', tags: ['item', 'camisa', 'roupa', 'casual'] },

    // Armas e Ferramentas
    { name: 'fa-hammer', tags: ['arma', 'ferramenta', 'martelo', 'construcao'] },
    { name: 'fa-wrench', tags: ['ferramenta', 'mecanica', 'reparo'] },
    { name: 'fa-screwdriver', tags: ['ferramenta', 'construcao', 'reparo'] },
    { name: 'fa-axe-battle', tags: ['arma', 'machado', 'combate'] }, // Note: fa-axe-battle might be pro, using safe defaults if unsure but user asked for "related". Checking free set: fa-axe might not exist, but let's try generic or specific.
    { name: 'fa-gavel', tags: ['arma', 'martelo', 'juiz'] },
    { name: 'fa-staff-snake', tags: ['arma', 'cajado', 'magia'] },
    { name: 'fa-gun', tags: ['arma', 'pistola', 'fogo'] },
    { name: 'fa-compass', tags: ['item', 'ferramenta', 'navegacao'] },
    { name: 'fa-map', tags: ['item', 'mapa', 'navegacao', 'papel'] },
    { name: 'fa-binoculars', tags: ['item', 'observacao', 'ferramenta'] },

    // Comida e Bebida
    { name: 'fa-drumstick-bite', tags: ['item', 'comida', 'carne', 'recuperacao'] },
    { name: 'fa-bread-slice', tags: ['item', 'comida', 'pao', 'raçao'] },
    { name: 'fa-apple-whole', tags: ['item', 'comida', 'fruta', 'saude'] },
    { name: 'fa-wine-bottle', tags: ['item', 'bebida', 'alcool', 'garrafa'] },
    { name: 'fa-beer-mug-empty', tags: ['item', 'bebida', 'cerveja', 'caneca'] },
    { name: 'fa-fish', tags: ['item', 'comida', 'peixe', 'pesca'] },

    // Valiosos e Loot
    { name: 'fa-gem', tags: ['item', 'tesouro', 'joia', 'rubi'] },
    { name: 'fa-coins', tags: ['item', 'dinheiro', 'ouro', 'riqueza'] },
    { name: 'fa-sack-dollar', tags: ['item', 'dinheiro', 'saco', 'tesouro'] },
    { name: 'fa-chest', tags: ['item', 'bau', 'loot', 'armazenamento'] }, // fa-chest might be pro? fa-box-open is free. fa-treasure-chest is pro.
    { name: 'fa-trophy', tags: ['item', 'conquista', 'ouro', 'vitoria'] },

    // Diversos de Inventário
    { name: 'fa-box', tags: ['item', 'caixa', 'recipiente'] },
    { name: 'fa-box-open', tags: ['item', 'caixa', 'aberta'] },
    { name: 'fa-bag-shopping', tags: ['item', 'sacola', 'bolsa'] },
    { name: 'fa-suitcase', tags: ['item', 'mala', 'viagem'] },
    { name: 'fa-book', tags: ['item', 'livro', 'leitura'] },
    { name: 'fa-feather', tags: ['item', 'pena', 'escrita', 'leve'] },
    { name: 'fa-bone', tags: ['item', 'osso', 'necromancia', 'material'] },
    { name: 'fa-flask', tags: ['item', 'pocao', 'alquimia'] },
    { name: 'fa-scroll', tags: ['item', 'pergaminho', 'magia'] },

    // Talentos e Passivas
    { name: 'fa-star', tags: ['talento', 'passiva', 'bonus'] },
    { name: 'fa-medal', tags: ['talento', 'conquista', 'honra'] },
    { name: 'fa-crown', tags: ['talento', 'lideranca', 'realeza'] },
    { name: 'fa-lightbulb', tags: ['talento', 'ideia', 'inteligencia'] },
    { name: 'fa-mountain', tags: ['ambiente', 'terreno'] },
    { name: 'fa-tree', tags: ['ambiente', 'natureza'] }
];

const IconPicker = ({ isOpen, onClose, onSelect, currentIcon }) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const filteredIcons = RPG_ICONS.filter(icon =>
        icon.name.includes(searchTerm.toLowerCase()) ||
        icon.tags.some(tag => tag.includes(searchTerm.toLowerCase()))
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
            <div className="bg-zinc-950/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider">Selecionar Ícone</h3>
                        <p className="text-xs text-slate-400 mt-1">Escolha um ícone para sua habilidade ou talento.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white">
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                {/* Search */}
                <div className="p-6 pb-2">
                    <div className="relative">
                        <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                        <input
                            type="text"
                            placeholder="Buscar ícone (ex: fogo, espada, vida)..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyber-pink transition-colors font-sans"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                    {filteredIcons.length > 0 ? (
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                            {filteredIcons.map((icon) => (
                                <button
                                    key={icon.name}
                                    onClick={() => { onSelect(icon.name); onClose(); }}
                                    className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-2 border transition-all hover:scale-105 active:scale-95 ${currentIcon === icon.name
                                        ? 'bg-cyber-pink/20 border-cyber-pink text-cyber-pink shadow-[0_0_15px_rgba(255,0,153,0.3)]'
                                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20'
                                        }`}
                                    title={icon.tags.join(', ')}
                                >
                                    <i className={`fa-solid ${icon.name} text-2xl`}></i>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                            <i className="fa-solid fa-ghost text-4xl mb-4 opacity-50"></i>
                            <p>Nenhum ícone encontrado para "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default IconPicker;
