'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Shield, Sparkles, Award, Play, Eye, Swords } from 'lucide-react';
import { AF } from '@/lib/audio';

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
  // Dados de armamento e armadura dinâmicos por tier
  const getArmament = () => {
    if (tier.min >= 365) {
      return {
        weapon: curLang === 'en' ? 'Divine Sunblade & Celestial Shield' : curLang === 'es' ? 'Espada Solar Divina y Escudo Celestial' : 'Espada Solar Divina & Escudo Celestial',
        armor: curLang === 'en' ? 'Immortal Solid Gold Plate' : curLang === 'es' ? 'Placas de Oro Macizo Inmortal' : 'Peitoral de Ouro Maciço Imortal',
        stage: 'Estágio 5 (Máximo)',
      };
    }
    if (tier.min >= 180) {
      return {
        weapon: curLang === 'en' ? 'Damascus Greatsword & Sacred Shield' : curLang === 'es' ? 'Mandoble de Damasco y Escudo Sagrado' : 'Montante de Damasco & Escudo Sagrado',
        armor: curLang === 'en' ? 'Enchanted Damascus Steel' : curLang === 'es' ? 'Acero de Damasco Encantado' : 'Aço de Damasco do Grão-Mestre',
        stage: 'Estágio 4',
      };
    }
    if (tier.min >= 31) {
      return {
        weapon: curLang === 'en' ? 'Forged Longsword & Heater Shield' : curLang === 'es' ? 'Espada Larga Forjada y Escudo Heráldico' : 'Espada Longa Forjada & Escudo de Armas',
        armor: curLang === 'en' ? 'Full Knight Steel Plate' : curLang === 'es' ? 'Armadura Completa de Placas' : 'Peitoral de Placas de Aço Polido',
        stage: 'Estágio 3',
      };
    }
    return {
      weapon: curLang === 'en' ? 'Medieval Forged Axe & Round Shield' : curLang === 'es' ? 'Hacha Forjada Medieval y Escudo Redondo' : 'Machado Forjado Medieval & Escudo Redondo',
      armor: curLang === 'en' ? 'Reinforced Leather Cuirass' : curLang === 'es' ? 'Peto de Cuero Reforzado' : 'Peitoral de Couro & Aço da Forja',
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
          <span>ESTÁGIO {tier.min >= 365 ? '10' : tier.min >= 61 ? '5' : tier.min >= 31 ? '3' : '1'}: {tier.name}</span>
        </div>

        <div className="text-[10px] sm:text-xs font-mono font-bold text-amber-200/80">
          {nt ? `${d}d / ${nt.min}d` : 'PATENTE MÁXIMA'}
        </div>
      </div>

      {/* CANVAS 3D INTERATIVO (GIRA 360 COM MOUSE E CELULAR) */}
      <div className="relative z-10 w-full min-h-[340px] flex flex-col items-center justify-center">
        <Warrior3DCanvas
          tier={tier}
          days={d}
          height={340}
          curLang={curLang}
          interactive={true}
          autoRotate={true}
        />
      </div>

      {/* DETALHES DE CLASSE E PROGRESSÃO (COMO NO VÍDEO DO USUÁRIO) */}
      <div className="relative z-10 w-full flex flex-col items-center text-center mt-2">
        <h3 className="text-xl sm:text-2xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FFFEEA] via-[#FFD152] to-[#F59E0B]">
          {tier.name}
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
              AF.click();
              onOpenGallery();
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/50 hover:border-amber-400 text-amber-200 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow"
          >
            <Eye size={14} className="text-amber-400 flex-none" />
            <span className="truncate">{TXT.btnGallery[curLang]}</span>
          </button>

          <button
            onClick={() => {
              AF.seal();
              onLevelUpClick();
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600/30 to-amber-500/30 hover:from-amber-600/50 hover:to-amber-500/50 border border-amber-400/70 hover:border-amber-400 text-amber-200 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
          >
            <Play size={12} className="text-amber-300 flex-none fill-amber-300" />
            <span className="truncate">{TXT.btnLevel[curLang]}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
