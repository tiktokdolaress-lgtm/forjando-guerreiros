'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Shield, Swords, Sparkles, Flame, ChevronRight, BarChart2 } from 'lucide-react';
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
  purity = 100,
  streak = 0,
  sosWins = 0,
  pillarsData = null,
  lvlPct = 0,
  lvlTxt = '',
  onGoToArmors = null,
}) {
  const [selectedPillar, setSelectedPillar] = useState(0);

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
    quote: {
      pt: '"Navega as tempestades sem temer qualquer tentação."',
      en: '"Navigates the storms without fearing any temptation."',
      es: '"Navega las tormentas sin temer ninguna tentación."',
    },
    rotateHint: {
      pt: 'GIRAR PEDESTAL 360°',
      en: 'ROTATE PEDESTAL 360°',
      es: 'GIRAR PEDESTAL 360°',
    },
    ret: {
      pt: 'Retenção',
      en: 'Retention',
      es: 'Retención',
    },
    porn: {
      pt: 'Sem Pornô',
      en: 'No Porn',
      es: 'Sin Porno',
    },
    mast: {
      pt: 'Sem Masturbação',
      en: 'No Masturbation',
      es: 'Sin Masturbación',
    },
    viewArmorsForge: {
      pt: 'Ver Armaduras na Forja',
      en: 'View Armors in Forge',
      es: 'Ver Armaduras en la Forja',
    },
    days: {
      pt: 'DIAS',
      en: 'DAYS',
      es: 'DÍAS',
    },
  };

  const handleSelectPillar = (idx) => {
    try { AF.click(); } catch (e) {}
    setSelectedPillar(idx);
  };

  return (
    <div className="relative my-2 sm:my-3 w-full rounded-2xl bg-gradient-to-b from-[#18110b] via-[#100b07] to-[#080504] border-2 border-amber-600/50 p-2 sm:p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] overflow-hidden text-center">
      {/* Brilho Superior da Forja */}
      <div className="pointer-events-none absolute left-1/2 -top-16 -translate-x-1/2 h-36 w-72 rounded-full bg-[radial-gradient(ellipse,rgba(245,158,11,0.22)_0%,transparent_75%)]" />

      {/* TOPO DO CARD: Patente + Badges Integrados (💎 PUREZA, 🔥 DIAS, 🛡️ SOS, DIAS/META) + Frase do Guerreiro */}
      <div className="relative z-10 flex flex-col gap-1.5 pb-2 mb-1 border-b border-amber-900/40">
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/70 border border-amber-500/50 text-amber-300 text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider shadow">
            <span>⚔️</span>
            <span className="truncate">
              {curLang === 'en' ? 'STAGE' : curLang === 'es' ? 'ETAPA' : 'ESTÁGIO'} {arm.stageNum}: {safeTier.name}
            </span>
          </div>

          {/* Badges de Guerra Integrados dentro do Card */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <span className="rounded-md border border-gold/40 bg-gold/15 px-2 py-0.5 text-[9.5px] sm:text-[10.5px] font-mono text-gold font-bold whitespace-nowrap shadow-sm">
              💎 {purity}%
            </span>
            <span className="rounded-md border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[9.5px] sm:text-[10.5px] font-mono text-amber-300 font-bold whitespace-nowrap shadow-sm">
              🔥 {streak} {TXT.days[curLang] || TXT.days.pt}
            </span>
            <span className="rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[9.5px] sm:text-[10.5px] font-mono text-emerald-300 font-bold whitespace-nowrap shadow-sm">
              🛡️ {sosWins} SOS
            </span>
            <span className="rounded-md border border-amber-800/40 bg-black/40 px-2 py-0.5 text-[9.5px] sm:text-[10.5px] font-mono text-amber-200/80 font-bold whitespace-nowrap">
              {nt ? `${d}d / ${nt.min}d` : (curLang === 'en' ? 'MAX' : 'MÁX')}
            </span>
          </div>
        </div>

        {/* Frase sobre o guerreiro no topo onde tem o nome */}
        {TXT.quote[curLang] && (
          <p className="text-[11px] sm:text-xs font-mono text-amber-200/80 italic text-center w-full mt-0.5">
            &ldquo;{TXT.quote[curLang]}&rdquo;
          </p>
        )}
      </div>

      {/* CANVAS 3D INTERATIVO (O GUERREIRO E OS 3 ESTANDARTES GIRAM JUNTOS) */}
      <div className="relative z-10 w-full min-h-[350px] flex flex-col items-center justify-center">
        <ErrorBoundary
          fallback={
            <div className="h-[350px] w-full flex flex-col items-center justify-center p-6 text-center select-none rounded-xl bg-gradient-to-b from-[#1b120a] to-[#0a0704] border border-amber-600/30">
              <div className="text-7xl mb-2 drop-shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-pulse">
                {safeTier.icon || '🛡️'}
              </div>
              <div className="font-display text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500">
                {safeTier.name}
              </div>
              <div className="text-xs font-mono text-amber-200/80 mt-1 max-w-xs">
                {safeTier.reward || 'Armadura Forjada'}
              </div>
            </div>
          }
        >
          <Warrior3DCanvas
            tier={safeTier}
            days={d}
            height={350}
            curLang={curLang}
            interactive={true}
            autoRotate={true}
            pillarsData={pillarsData}
            targetPillarIndex={selectedPillar}
            onPillarChange={(idx) => {
              if (idx !== selectedPillar) setSelectedPillar(idx);
            }}
          />
        </ErrorBoundary>

        {/* SELETOR INTERATIVO RÁPIDO DOS 3 PILARES GIRATÓRIOS DO PEDESTAL COM CONTADOR DE HORAS */}
        <div className="mt-1 mb-2 flex items-center justify-center gap-2 sm:gap-3.5 flex-wrap z-20">
          {/* Pilar 0: Retenção */}
          <div className="flex flex-col items-center gap-0.5">
            <button
              type="button"
              onClick={() => handleSelectPillar(0)}
              className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wide transition-all border flex items-center gap-1 shadow-sm cursor-pointer ${
                selectedPillar === 0
                  ? 'bg-amber-500 text-black border-amber-300 ring-2 ring-amber-400/50 font-black'
                  : 'bg-amber-950/50 text-amber-300 border-amber-700/50 hover:bg-amber-900/50'
              }`}
            >
              <span>🔥</span>
              <span>{TXT.ret[curLang] || TXT.ret.pt}</span>
            </button>
            <span className="text-[9px] sm:text-[9.5px] font-mono text-amber-400/90 font-bold tracking-tight">
              {pillarsData?.ret?.timer || '00h:00m:00s'}
            </span>
          </div>

          {/* Pilar 1: Sem Pornô */}
          <div className="flex flex-col items-center gap-0.5">
            <button
              type="button"
              onClick={() => handleSelectPillar(1)}
              className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wide transition-all border flex items-center gap-1 shadow-sm cursor-pointer ${
                selectedPillar === 1
                  ? 'bg-sky-500 text-black border-sky-300 ring-2 ring-sky-400/50 font-black'
                  : 'bg-sky-950/50 text-sky-300 border-sky-700/50 hover:bg-sky-900/50'
              }`}
            >
              <span>🛡️</span>
              <span>{TXT.porn[curLang] || TXT.porn.pt}</span>
            </button>
            <span className="text-[9px] sm:text-[9.5px] font-mono text-sky-300/90 font-bold tracking-tight">
              {pillarsData?.porn?.timer || '00h:00m:00s'}
            </span>
          </div>

          {/* Pilar 2: Sem Masturbação */}
          <div className="flex flex-col items-center gap-0.5">
            <button
              type="button"
              onClick={() => handleSelectPillar(2)}
              className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wide transition-all border flex items-center gap-1 shadow-sm cursor-pointer ${
                selectedPillar === 2
                  ? 'bg-orange-500 text-black border-orange-300 ring-2 ring-orange-400/50 font-black'
                  : 'bg-orange-950/50 text-orange-300 border-orange-700/50 hover:bg-orange-900/50'
              }`}
            >
              <span>⚒️</span>
              <span>{TXT.mast[curLang] || TXT.mast.pt}</span>
            </button>
            <span className="text-[9px] sm:text-[9.5px] font-mono text-orange-300/90 font-bold tracking-tight">
              {pillarsData?.mast?.timer || '00h:00m:00s'}
            </span>
          </div>
        </div>
      </div>

      {/* DETALHES DE CLASSE E PROGRESSÃO */}
      <div className="relative z-10 w-full flex flex-col items-center text-center mt-0.5">
        {/* Blocos de Armamento & Armadura da Classe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full my-2.5">
          {/* Armamento da Classe */}
          <div className="rounded-xl border border-amber-900/60 bg-[#120c08] p-2 sm:p-2.5 text-left flex items-start gap-2 shadow">
            <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-700/40 text-amber-400 mt-0.5 flex-none">
              <Swords size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[8.5px] font-mono font-black uppercase tracking-wider text-amber-400/90 block">
                {TXT.classArm[curLang]}
              </span>
              <span className="text-xs font-bold text-amber-100 block truncate">
                {arm.weapon}
              </span>
            </div>
          </div>

          {/* Armadura Forjada */}
          <div className="rounded-xl border border-amber-900/60 bg-[#120c08] p-2 sm:p-2.5 text-left flex items-start gap-2 shadow">
            <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-700/40 text-amber-400 mt-0.5 flex-none">
              <Shield size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[8.5px] font-mono font-black uppercase tracking-wider text-amber-400/90 block">
                {TXT.forgedArmor[curLang]}
              </span>
              <span className="text-xs font-bold text-amber-100 block truncate">
                {arm.armor} ({arm.stage})
              </span>
            </div>
          </div>
        </div>

        {/* BARRA DE PROGRESSO DO PATAMAR (COM BRASAS INCANDESCENTES) */}
        {lvlTxt && (
          <div className="w-full pt-2 mt-1 border-t border-amber-900/40 text-left">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-muted font-medium mb-1.5 min-w-0">
              <span className="truncate flex-1 font-semibold text-[#EDE5D5]">{lvlTxt}</span>
              {tier && tier.reward && (
                <span className="text-gold2 truncate ml-2 flex-none font-bold">
                  🎁 {tier.reward}
                </span>
              )}
            </div>
            <div className="w-full h-2 rounded-full bg-black/60 border border-amber-900/40 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                style={{ width: `${Math.min(100, Math.max(0, lvlPct))}%` }}
              />
            </div>
          </div>
        )}

        {/* ATALHO DISCRETO PARA AS ARMADURAS MEDIEVAIS NA FORJA */}
        {onGoToArmors && (
          <button
            type="button"
            onClick={() => {
              try { AF.click(); } catch (e) {}
              onGoToArmors();
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-mono font-bold text-amber-400/90 hover:text-amber-300 transition-colors py-1 px-3 rounded-lg bg-amber-950/30 hover:bg-amber-950/60 border border-amber-700/30"
          >
            <span>🛡️</span>
            <span>{TXT.viewArmorsForge[curLang] || TXT.viewArmorsForge.pt}</span>
            <ChevronRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
