'use client';
import React from 'react';

/**
 * WarriorLogo - Componente oficial da marca FORJANDO GUERREIROS
 * Reproduz com fidelidade vetorial o guerreiro espartano de armadura dourada,
 * elmo com fenda reluzente, ombreiras pontiagudas, medalhão com textura tática e borda de ouro forjado.
 */
export default function WarriorLogo({
  size = 44,
  showText = false,
  className = '',
  glow = true,
}) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      style={{ minWidth: size }}
    >
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform hover:scale-105"
        style={{ width: size, height: size }}
      >
        {/* Brilho radial de forja incandescente */}
        {glow && (
          <div
            className="absolute inset-0 rounded-full blur-md pointer-events-none opacity-70"
            style={{
              background: 'radial-gradient(circle, rgba(245,175,40,0.55) 0%, rgba(200,100,10,0.2) 60%, transparent 75%)',
              transform: 'scale(1.15)',
            }}
          />
        )}

        {/* SVG Vetorial de Alta Precisão do Brasão do Guerreiro */}
        <svg
          viewBox="0 0 200 200"
          width={size}
          height={size}
          className="relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradientes Dourados Metálicos */}
            <linearGradient id="goldRim" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF0A0" />
              <stop offset="25%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#8A6715" />
              <stop offset="75%" stopColor="#F5D061" />
              <stop offset="100%" stopColor="#A67C1E" />
            </linearGradient>

            <linearGradient id="goldArmor" x1="50" y1="50" x2="150" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF3B0" />
              <stop offset="30%" stopColor="#F5C042" />
              <stop offset="60%" stopColor="#B38019" />
              <stop offset="100%" stopColor="#634509" />
            </linearGradient>

            <linearGradient id="goldBevel" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#F5C042" />
              <stop offset="100%" stopColor="#3A2505" />
            </linearGradient>

            <radialGradient id="carbonCenter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E1E24" />
              <stop offset="70%" stopColor="#0E0E12" />
              <stop offset="100%" stopColor="#050507" />
            </radialGradient>

            <linearGradient id="crestGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF9D2" />
              <stop offset="40%" stopColor="#F5B82E" />
              <stop offset="100%" stopColor="#7A5008" />
            </linearGradient>

            <filter id="forgeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Padrão Hexagonal / Favo de Mel Tático */}
            <pattern id="hexPattern" width="12" height="10.4" patternUnits="userSpaceOnUse">
              <path
                d="M 6 0 L 12 3.46 L 12 10.4 L 6 6.93 Z M 0 3.46 L 6 0 L 6 6.93 L 0 10.4 Z"
                stroke="rgba(245,190,50,0.12)"
                strokeWidth="0.6"
                fill="none"
              />
            </pattern>
          </defs>

          {/* Anel Externo Dourado Chanfrado */}
          <circle cx="100" cy="100" r="95" stroke="url(#goldRim)" strokeWidth="6" fill="url(#carbonCenter)" />
          <circle cx="100" cy="100" r="91" stroke="#2A2415" strokeWidth="2" fill="none" />
          <circle cx="100" cy="100" r="89" fill="url(#carbonCenter)" />

          {/* Textura de Favo de Mel Interna */}
          <circle cx="100" cy="100" r="88" fill="url(#hexPattern)" opacity="0.8" />

          {/* Brilho de forja ao redor do guerreiro */}
          <circle cx="100" cy="95" r="60" fill="radial-gradient(circle, rgba(245,175,40,0.22) 0%, transparent 70%)" />

          {/* Manto / Capa Negra com Borda Forjada */}
          <path
            d="M 50 155 Q 65 110 82 95 Q 100 90 118 95 Q 135 110 150 155 Q 100 168 50 155 Z"
            fill="#121217"
            stroke="#4A3810"
            strokeWidth="1.5"
          />

          {/* Ombreira Esquerda com Pontas de Metal */}
          <g>
            <path
              d="M 28 85 L 56 74 Q 68 88 64 125 L 38 120 Q 30 100 28 85 Z"
              fill="url(#goldArmor)"
              stroke="#FFE890"
              strokeWidth="1.2"
            />
            {/* Espinho da Ombreira */}
            <path d="M 28 85 L 18 70 L 40 76 Z" fill="url(#goldBevel)" stroke="#FFF0A0" strokeWidth="0.8" />
            <circle cx="48" cy="100" r="3.5" fill="#FFE585" stroke="#5A3E08" strokeWidth="1" />
          </g>

          {/* Ombreira Direita com Pontas de Metal */}
          <g>
            <path
              d="M 172 85 L 144 74 Q 132 88 136 125 L 162 120 Q 170 100 172 85 Z"
              fill="url(#goldArmor)"
              stroke="#FFE890"
              strokeWidth="1.2"
            />
            {/* Espinho da Ombreira */}
            <path d="M 172 85 L 182 70 L 160 76 Z" fill="url(#goldBevel)" stroke="#FFF0A0" strokeWidth="0.8" />
            <circle cx="152" cy="100" r="3.5" fill="#FFE585" stroke="#5A3E08" strokeWidth="1" />
          </g>

          {/* Peitoral de Aço Dourado Musculado */}
          <path
            d="M 62 115 Q 100 108 138 115 L 134 150 Q 100 162 66 150 Z"
            fill="url(#goldArmor)"
            stroke="#FFEAA0"
            strokeWidth="1.5"
          />
          {/* Divisão central do peitoral */}
          <line x1="100" y1="112" x2="100" y2="155" stroke="#5A3E08" strokeWidth="2" />
          <path d="M 72 130 Q 100 138 128 130" stroke="#7A5510" strokeWidth="1.5" fill="none" />

          {/* Penacho / Crista do Elmo Espartano */}
          <path
            d="M 88 18 Q 100 12 112 18 Q 118 38 114 62 L 86 62 Q 82 38 88 18 Z"
            fill="url(#crestGlow)"
            stroke="#FFF4B8"
            strokeWidth="1.2"
          />
          {/* Estrias da Crista */}
          <line x1="100" y1="14" x2="100" y2="60" stroke="#5A3E08" strokeWidth="1.5" />
          <line x1="93" y1="22" x2="93" y2="58" stroke="#7A5208" strokeWidth="1" />
          <line x1="107" y1="22" x2="107" y2="58" stroke="#7A5208" strokeWidth="1" />

          {/* Base e Cúpula do Elmo */}
          <path
            d="M 74 60 Q 100 48 126 60 Q 134 76 130 105 Q 118 116 100 118 Q 82 116 70 105 Q 66 76 74 60 Z"
            fill="url(#goldArmor)"
            stroke="#FFF4C0"
            strokeWidth="1.6"
          />

          {/* Fenda Visor T-Slit Espartana com Brilho Tático */}
          <path
            d="M 80 78 L 120 78 L 118 85 L 105 85 L 105 110 L 95 110 L 95 85 L 82 85 Z"
            fill="#060608"
            stroke="#2A1B02"
            strokeWidth="1"
          />
          {/* Brilho da fenda (olhos do guerreiro em brasa) */}
          <circle cx="92" cy="82" r="1.5" fill="#FFC846" filter="url(#forgeGlow)" />
          <circle cx="108" cy="82" r="1.5" fill="#FFC846" filter="url(#forgeGlow)" />

          {/* Placas das Bochechas / Mandíbula Reforçada */}
          <path d="M 72 88 L 86 98 L 86 112 L 74 104 Z" fill="url(#goldBevel)" stroke="#FFF4A0" strokeWidth="0.8" />
          <path d="M 128 88 L 114 98 L 114 112 L 126 104 Z" fill="url(#goldBevel)" stroke="#FFF4A0" strokeWidth="0.8" />

          {/* Faíscas de Forja Flutuantes */}
          <circle cx="45" cy="45" r="1.5" fill="#FFEAA0" filter="url(#forgeGlow)" />
          <circle cx="155" cy="48" r="1.2" fill="#FFEAA0" filter="url(#forgeGlow)" />
          <circle cx="160" cy="130" r="1" fill="#FFC846" filter="url(#forgeGlow)" />
          <circle cx="38" cy="135" r="1" fill="#FFC846" filter="url(#forgeGlow)" />

          {/* Rebites dourados ao redor do anel externo */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const cx = 100 + 91 * Math.cos(rad);
            const cy = 100 + 91 * Math.sin(rad);
            return (
              <circle
                key={deg}
                cx={cx}
                cy={cy}
                r="2.2"
                fill="#FFEAA0"
                stroke="#4A3408"
                strokeWidth="0.8"
              />
            );
          })}
        </svg>
      </div>

      {/* Tipografia 3D Dourada Opcional */}
      {showText && (
        <div className="flex flex-col text-left">
          <span
            className="font-display font-black tracking-[0.14em] leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2B2] via-[#F5C242] to-[#B38018] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            style={{ fontSize: Math.max(13, size * 0.38) }}
          >
            FORJANDO
          </span>
          <span
            className="font-display font-black tracking-[0.18em] leading-[0.95] text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#E5A93C] to-[#8C5D07] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            style={{ fontSize: Math.max(14, size * 0.42) }}
          >
            GUERREIROS
          </span>
        </div>
      )}
    </div>
  );
}
