'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Shield, Sparkles, Award, Play, Eye, Swords } from 'lucide-react';
import { AF } from '@/lib/audio';
import ErrorBoundary from '@/components/ErrorBoundary';

// Importa o Canvas 3D dinamicamente sem SSR (Three.js precisa de window/WebGL)
const Warrior3DCanvas = dynamic(() => import('@/components/Warrior3DCanvas'), {
  ssr: false,
  loading: () => (
    <div className="h-[340px] w-full flex flex-col items-center justify-center gap-2 text-amber-400 font-mono text-xs">
      <div className="h-10 w-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      <span>FORJANDO GUERREIRO 3D...</span>
    </div>
  ),
});

export default function Warrior3DCard({
  tier,
  d = 0,
  nt = null,
  curLang = 'pt',
  onOpenGallery,
  onLevelUpClick,
}) {
  const safeTier = tier && typeof tier.min === 'number' ? tier : {
    min: 0,
    slots: 3,
    name: curLang === 'en' ? 'RECRUIT OF THE FORGE' : curLang === 'es' ? 'RECLUTA DE LA FORJA' : 'NEÓFITO DA FORJA',
    icon: '🛡️',
    reward: 'Armadura Básica',
    subtitle: 'Início da Jornada'
  };

  // Dados de armamento e armadura dinâmicos para cada uma das 11 patentes
  const getArmament = () => {
    if (safeTier.min >= 730) {
      return {
        stageNum: 11,
        weapon: curLang === 'en' ? 'Cosmic Godblade & Aegis of Eternity' : curLang === 'es' ? 'Espada Cósmica y Égida de la Eternidad' : 'Espada Cósmica da Criação & Égide da Eternidade',
        armor: curLang === 'en' ? 'Ascended Divine Armor with Solar Wings' : curLang === 'es' ? 'Armadura Ascendida con Alas Solares' : 'Armadura Ascendida com Asas Celestiais',
        stage: 'Estágio 11 (Máximo Cósmico)',
      };
    }
    if (safeTier.min >= 365) {
      return {
        stageNum: 10,
        weapon: curLang === 'en' ? 'Divine Sunblade & Pure Gold Sun Shield' : curLang === 'es' ? 'Espada Solar Divina y Escudo de Oro' : 'Espada Solar Divina & Escudo Solar de Ouro Puro',
        armor: curLang === 'en' ? 'Complete Solid 24k Gold Armor & Crown' : curLang === 'es' ? 'Armadura de Oro Puro 24k y Corona' : 'Armadura Completa de Ouro Puro 24k Maciço',
        stage: 'Estágio 10 (Imortal)',
      };
    }
    if (safeTier.min >= 270) {
      return {
        stageNum: 9,
        weapon: curLang === 'en' ? 'Temple Runic Sword & Gilded Relic Shield' : curLang === 'es' ? 'Espada Rúnica del Templo y Escudo Reliquia' : 'Espada Rúnica do Templo & Escudo Relíquia de Ébano',
        armor: curLang === 'en' ? 'Sacred Ebony Plates with Gold Runes' : curLang === 'es' ? 'Placas Sagradas de Ébano y Oro' : 'Placas Sagradas de Ébano com Filigranas Douradas',
        stage: 'Estágio 9',
      };
    }
    if (safeTier.min >= 180) {
      return {
        stageNum: 8,
        weapon: curLang === 'en' ? 'Mystic Sapphire Claymore & Blue Cross Shield' : curLang === 'es' ? 'Claymore de Zafiro y Escudo Cruz Azul' : 'Montante Rúnico Místico & Escudo de Cruz Azul',
        armor: curLang === 'en' ? 'Sapphire Damascus Steel Armor & Fur Mantle' : curLang === 'es' ? 'Acero de Damasco Zafiro y Manto de Piel' : 'Aço Damasco Místico com Runas Azuis',
        stage: 'Estágio 8',
      };
    }
    if (safeTier.min >= 120) {
      return {
        stageNum: 7,
        weapon: curLang === 'en' ? 'Commander Double Sword & Bronze Lion Shield' : curLang === 'es' ? 'Espada de Comandante y Escudo de León' : 'Espada de Comando Imperial & Escudo de Bronze do Leão',
        armor: curLang === 'en' ? 'Dark Damascus Plates with Lion Pauldrons & Crimson Cape' : curLang === 'es' ? 'Placas de Damasco Oscuro y Capa Carmesí' : 'Aço Damasco com Ombreiras de Leão & Capa Carmesim',
        stage: 'Estágio 7',
      };
    }
    if (safeTier.min >= 61) {
      return {
        stageNum: 6,
        weapon: curLang === 'en' ? 'Gothic Zweihänder & Spiked Tower Shield' : curLang === 'es' ? 'Zweihänder Gótico y Escudo Torre con Espinas' : 'Montante Zweihänder Gótico & Escudo Torre Espinhado',
        armor: curLang === 'en' ? 'Blackened Gothic Plate Armor & Winged Visor' : curLang === 'es' ? 'Armadura Gótica Negra y Visera Alada' : 'Aço Negro Gótico com Visor Alado & Capa de Batalha',
        stage: 'Estágio 6',
      };
    }
    if (safeTier.min >= 31) {
      return {
        stageNum: 5,
        weapon: curLang === 'en' ? 'Polished Steel Longsword & Knight Heater Shield' : curLang === 'es' ? 'Espada Larga de Acero y Escudo Triangular' : 'Espada Longa de Aço Forjado & Escudo de Armas',
        armor: curLang === 'en' ? 'Full Mirror Steel Plates with Cross Visor & Blue Cape' : curLang === 'es' ? 'Armadura Completa de Placas y Capa Azul' : 'Peitoral de Placas de Aço Polido & Manto Azul Real',
        stage: 'Estágio 5',
      };
    }
    if (safeTier.min >= 15) {
      return {
        stageNum: 4,
        weapon: curLang === 'en' ? 'Steel Arming Sword & Norman Kite Shield' : curLang === 'es' ? 'Espada de Armar y Escudo Pipa Normando' : 'Espada de Armar de Ferro & Escudo Pipa Normando',
        armor: curLang === 'en' ? 'Steel Chainmail Hauberk & Norman Nasal Helmet' : curLang === 'es' ? 'Cota de Malla de Acero y Casco Normando' : 'Cota de Malha de Aço Escuro com Elmo Normando',
        stage: 'Estágio 4',
      };
    }
    if (safeTier.min >= 8) {
      return {
        stageNum: 3,
        weapon: curLang === 'en' ? 'Battle Axe & Viking Round Oak Shield' : curLang === 'es' ? 'Hacha de Batalla y Escudo Redondo' : 'Machado de Batalha Forjado & Escudo Redondo de Carvalho',
        armor: curLang === 'en' ? 'Studded Leather Brigandine & Spangenhelm' : curLang === 'es' ? 'Brigantina de Cuero y Casco Spangenhelm' : 'Gibão de Couro Batido com Placas & Spangenhelm',
        stage: 'Estágio 3',
      };
    }
    if (safeTier.min >= 4) {
      return {
        stageNum: 2,
        weapon: curLang === 'en' ? 'Forged Handaxe & Wooden Buckler' : curLang === 'es' ? 'Hachuela Forjada y Rodela de Madera' : 'Machadinha Forjada de Ferro & Broquel de Madeira',
        armor: curLang === 'en' ? 'Reinforced Raw Leather Vest & Iron Coif' : curLang === 'es' ? 'Chaleco de Cuero Reforzado y Gorjal' : 'Colete de Couro Cru Reforçado & Gorjal de Ferro',
        stage: 'Estágio 2',
      };
    }
    return {
      stageNum: 1,
      weapon: curLang === 'en' ? 'Rustic Forged Dagger (No Shield)' : curLang === 'es' ? 'Daga Forjada Rústica (Sin Escudo)' : 'Adaga Curta Forjada Rústica (Sem Escudo)',
      armor: curLang === 'en' ? 'Ash Linen Tunic & Leather Headband' : curLang === 'es' ? 'Túnica de Lino y Cenizas con Cinta' : 'Túnica de Linho e Cinzas & Faixa de Couro',
      stage: 'Estágio 1',
    };
  };

  const arm = getArmament();

  const TXT = {
    classArm: {
      pt: 'ARMAMENTO DA CLASSE',
      en: 'CLASS ARMAMENT',
      es: 'ARMAMENTO DE LA CLASE',
    },
    forgedArmor: {
      pt: 'ARMADURA FORJADA',
      en: 'FORGED ARMOR',
      es: 'ARMADURA FORJADA',
    },
    dragHint: {
      pt: 'ARRASTE PARA GIRAR 360°',
      en: 'DRAG TO ROTATE 360°',
      es: 'ARRASTRA PARA GIRAR 360°',
    },
    quote: {
      pt: '"Navega as tempestades sem temer qualquer tentação."',
      en: '"Navigates the storms without fearing any temptation."',
      es: '"Navega las tormentas sin temer ninguna tentación."',
    },
    btnGallery: {
      pt: '11 ARMADURAS MEDIEVAIS',
      en: '11 MEDIEVAL ARMORS',
      es: '11 ARMADURAS MEDIEVALES',
    },
    btnLevel: {
      pt: 'ANIMAR NÍVEL ⚡',
      en: 'LEVEL UP FX ⚡',
      es: 'ANIMAR NIVEL ⚡',
    },
  };

  return (
    <div className="relative my-3 sm:my-4 w-full rounded-2xl bg-gradient-to-b from-[#18110b] via-[#100b07] to-[#080504] border-2 border-amber-600/50 p-2 sm:p-4 shadow-[0_16px_40px_rgba(0,0,0,0.85)] overflow-hidden">
      {/* Luz Superior da Forja */}
      <div className="pointer-events-none absolute left-1/2 -top-16 -translate-x-1/2 h-36 w-72 rounded-full bg-[radial-gradient(ellipse,rgba(245,158,11,0.25)_0%,transparent_75%)]" />

      {/* Topo do Card: Estágio da Patente (Como no vídeo do usuário) */}
      <div className="relative z-10 flex items-center justify-between pb-2 mb-1 border-b border-amber-900/40">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider shadow">
          <span>⚔️</span>
          <span>{curLang === 'en' ? 'STAGE' : curLang === 'es' ? 'ETAPA' : 'ESTÁGIO'} {arm.stageNum}: {safeTier.name}</span>
        </div>

        <div className="text-[10px] sm:text-xs font-mono font-bold text-amber-200/80">
          {nt ? `${d}d / ${nt.min}d` : (curLang === 'en' ? 'MAX RANK' : curLang === 'es' ? 'RANGO MÁXIMO' : 'PATENTE MÁXIMA')}
        </div>
      </div>

      {/* CANVAS 3D INTERATIVO (GIRA 360 COM MOUSE E CELULAR) */}
      <div className="relative z-10 w-full min-h-[340px] flex flex-col items-center justify-center">
        <ErrorBoundary
          fallback={
            <div className="h-[340px] w-full flex flex-col items-center justify-center p-6 text-center select-none rounded-xl bg-gradient-to-b from-[#1b120a] to-[#0a0704] border border-amber-600/30">
              <div className="text-7xl mb-2 drop-shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-pulse">
                {safeTier.icon || '🛡️'}
              </div>
              <div className="font-display text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500">
                {safeTier.name}
              </div>
              <div className="text-xs font-mono text-amber-200/80 mt-1 max-w-xs">
                {curLang === 'en'
                  ? 'Stage ' + arm.stageNum + ' · ' + (safeTier.reward || 'Forged Armor')
                  : 'Estágio ' + arm.stageNum + ' · ' + (safeTier.reward || 'Armadura Forjada')}
              </div>
              <div className="mt-3 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-600/40 text-[10px] font-mono text-amber-300">
                {curLang === 'en' ? '⚔️ FORGE AVATAR ACTIVE' : '⚔️ AVATAR DA FORJA ATIVO'}
              </div>
            </div>
          }
        >
          <Warrior3DCanvas
            tier={safeTier}
            days={d}
            height={340}
            curLang={curLang}
            interactive={true}
            autoRotate={true}
          />
        </ErrorBoundary>
      </div>

      {/* DETALHES DE CLASSE E PROGRESSÃO (COMO NO VÍDEO DO USUÁRIO) */}
      <div className="relative z-10 w-full flex flex-col items-center text-center mt-2">
        <h3 className="text-xl sm:text-2xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FFFEEA] via-[#FFD152] to-[#F59E0B]">
          {safeTier.name}
        </h3>

        <p className="text-xs font-mono text-amber-200/80 italic mt-0.5 max-w-md">
          {TXT.quote[curLang]}
        </p>

        {/* Blocos de Armamento & Armadura da Classe (Estilo RPG Medieval do Vídeo) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full my-3">
          {/* Armamento da Classe */}
          <div className="rounded-xl border border-amber-900/60 bg-[#120c08] p-2.5 text-left flex items-start gap-2 shadow">
            <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-700/40 text-amber-400 mt-0.5">
              <Swords size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-mono font-black uppercase tracking-wider text-amber-400/90 block">
                {TXT.classArm[curLang]}
              </span>
              <span className="text-xs font-bold text-amber-100 block truncate">
                {arm.weapon}
              </span>
            </div>
          </div>

          {/* Armadura Forjada */}
          <div className="rounded-xl border border-amber-900/60 bg-[#120c08] p-2.5 text-left flex items-start gap-2 shadow">
            <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-700/40 text-amber-400 mt-0.5">
              <Shield size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-mono font-black uppercase tracking-wider text-amber-400/90 block">
                {TXT.forgedArmor[curLang]}
              </span>
              <span className="text-xs font-bold text-amber-100 block truncate">
                {arm.armor} ({arm.stage})
              </span>
            </div>
          </div>
        </div>

        {/* Botões de Ação: Galeria de Armaduras & Celebração de Nível */}
        <div className="flex items-center justify-center gap-2 w-full">
          <button
            onClick={() => {
              try { AF.click(); } catch (e) {}
              if (onOpenGallery) onOpenGallery();
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/50 hover:border-amber-400 text-amber-200 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow"
          >
            <Eye size={14} className="text-amber-400 flex-none" />
            <span className="truncate">{TXT.btnGallery[curLang] || TXT.btnGallery.pt}</span>
          </button>

          <button
            onClick={() => {
              try { AF.seal(); } catch (e) {}
              if (onLevelUpClick) onLevelUpClick();
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600/30 to-amber-500/30 hover:from-amber-600/50 hover:to-amber-500/50 border border-amber-400/70 hover:border-amber-400 text-amber-200 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
          >
            <Play size={12} className="text-amber-300 flex-none fill-amber-300" />
            <span className="truncate">{TXT.btnLevel[curLang] || TXT.btnLevel.pt}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
