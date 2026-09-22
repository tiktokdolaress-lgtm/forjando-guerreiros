'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Eye, Play } from 'lucide-react';
import { AF } from '@/lib/audio';

export default function HolographicWarriorCard({
  tier,
  d,
  nt,
  curLang,
  onOpenGallery,
  onLevelUpClick,
}) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Efeito Parallax 2.5D ao mover o mouse ou passar o dedo
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Ângulo de inclinação 3D máximo: 14 graus
    const rotX = -((y - centerY) / centerY) * 12;
    const rotY = ((x - centerX) / centerX) * 14;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.28,
    });
  };

  const handleTouchMove = (e) => {
    const card = cardRef.current;
    if (!card || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = card.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 12;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.24,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Suporte a Giroscópio no Mobile (se o usuário conceder ou em dispositivos compatíveis)
  useEffect(() => {
    const handleOrientation = (e) => {
      if (e.beta === null || e.gamma === null) return;
      // Inclinando celular para frente/trás (beta) e esquerda/direita (gamma)
      const clampedBeta = Math.max(-20, Math.min(20, e.beta - 45)); // Padrão segurando na mão
      const clampedGamma = Math.max(-20, Math.min(20, e.gamma));
      setRotateX(-clampedBeta * 0.4);
      setRotateY(clampedGamma * 0.4);
    };

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  return (
    <div
      style={{ perspective: '1100px' }}
      className="relative my-3 sm:my-4 w-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
        }}
        className="relative flex flex-col items-center justify-center min-h-[310px] sm:min-h-[370px] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#16100c] via-[#0d0907] to-[#070504] border border-amber-900/50 p-2 sm:p-4 shadow-[0_16px_36px_rgba(0,0,0,0.8)] select-none"
      >
        {/* Camada Holográfica de Brilho Especular Dinâmico */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-2xl"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255,230,150,0.55), transparent 75%)`,
            mixBlendMode: 'screen',
          }}
        />

        {/* Camada 0 (Fundo com profundidade Z negativa): Luz de Tocha / Braseiro */}
        <div
          style={{
            transform: `translateZ(-40px) translate(${-rotateY * 0.6}px, ${-rotateX * 0.6}px)`,
            transition: isHovered ? 'none' : 'transform 0.5s ease-out',
          }}
          className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[260px] w-[260px] sm:h-[350px] sm:w-[350px] rounded-full ${
            tier.min >= 365
              ? 'bg-[radial-gradient(circle,rgba(255,215,0,0.45)_0%,rgba(245,158,11,0.25)_45%,transparent_75%)] anim-solar-aura'
              : tier.min >= 180
              ? 'bg-[radial-gradient(circle,rgba(56,189,248,0.3)_0%,rgba(245,158,11,0.2)_45%,transparent_75%)] anim-torch-glow'
              : tier.min >= 61
              ? 'bg-[radial-gradient(circle,rgba(245,158,11,0.4)_0%,rgba(234,88,12,0.22)_45%,transparent_70%)] anim-torch-glow'
              : tier.min <= 3
              ? 'bg-[radial-gradient(circle,rgba(160,160,160,0.18)_0%,rgba(100,100,100,0.08)_45%,transparent_70%)]'
              : 'bg-[radial-gradient(circle,rgba(245,158,11,0.3)_0%,rgba(217,119,6,0.12)_45%,transparent_70%)] anim-torch-glow'
          }`}
        />

        {/* Efeito de Runas Místicas para Soberano do Templo (270+ dias) */}
        {tier.min >= 270 && (
          <div
            style={{ transform: 'translateZ(-20px)' }}
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center anim-runic-pulse"
          >
            <span className="text-amber-400/40 text-4xl select-none font-mono">᚛ ᚠ ᚢ ᚦ ᚬ ᚱ ᚴ ᚜</span>
          </div>
        )}

        {/* Camada 1: Faíscas Vivas Flutuando no Espaço 3D */}
        <div
          style={{ transform: `translateZ(20px) translate(${rotateY * 0.4}px, ${rotateX * 0.4}px)` }}
          className="pointer-events-none absolute inset-0 overflow-hidden z-10"
        >
          <span className="absolute bottom-12 left-[20%] h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] anim-spark-drift-1" />
          <span className="absolute bottom-16 right-[22%] h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_10px_#fde047] anim-spark-drift-2" />
          <span className="absolute bottom-10 left-[48%] h-1 w-1 rounded-full bg-orange-500 shadow-[0_0_6px_#f97316] anim-spark-drift-3" />
          <span className="absolute bottom-8 right-[38%] h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fbbf24] anim-spark-drift-1" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Camada 2: O GUERREIRO 2.5D COM DESLOCAMENTO Z PARA FRENTE */}
        <div
          onClick={onLevelUpClick}
          style={{
            transform: `translateZ(45px) translate(${rotateY * 0.8}px, ${rotateX * 0.8}px)`,
            transformStyle: 'preserve-3d',
            transition: isHovered ? 'none' : 'transform 0.5s ease-out',
          }}
          className="relative z-20 flex flex-col items-center justify-end w-full cursor-pointer group/warrior"
          title={
            curLang === 'en'
              ? 'Click to watch rank celebration animation'
              : curLang === 'es'
              ? 'Clic para ver animación de nivel'
              : 'Clique para ver a animação de celebração da patente'
          }
        >
          {/* Varredura reluzente de aço temperado para Cavaleiro em diante */}
          {tier.min >= 31 && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden z-30">
              <div className="h-full w-28 bg-gradient-to-r from-transparent via-white/25 to-transparent anim-armor-shine" />
            </div>
          )}

          <img
            src={tier.image || '/escudeiro.png'}
            alt={tier.name || 'Guerreiro da Forja'}
            style={{
              filter:
                tier.min <= 3
                  ? 'grayscale(0.42) contrast(1.1) brightness(0.85) drop-shadow(0 18px 30px rgba(0,0,0,0.98))'
                  : tier.min <= 7
                  ? 'sepia(0.18) contrast(1.06) brightness(0.92) drop-shadow(0 18px 30px rgba(0,0,0,0.98)) drop-shadow(0 0 18px rgba(217,119,6,0.2))'
                  : tier.min >= 365
                  ? 'drop-shadow(0 18px 30px rgba(0,0,0,0.98)) drop-shadow(0 0 35px rgba(255,215,0,0.85))'
                  : tier.min >= 61
                  ? 'drop-shadow(0 18px 30px rgba(0,0,0,0.98)) drop-shadow(0 0 28px rgba(245,158,11,0.65))'
                  : 'drop-shadow(0 18px 30px rgba(0,0,0,0.98)) drop-shadow(0 0 24px rgba(245,158,11,0.25))',
            }}
            className="h-[225px] min-[390px]:h-[255px] sm:h-[305px] md:h-[335px] w-auto max-w-full object-contain anim-warrior-breathe select-none pointer-events-none transition-transform group-hover/warrior:scale-[1.03]"
          />

          {/* Camada 3: Pedestal de Ferro e Bigorna da Forja com Selo da Patente (Z-axis mais frontal) */}
          <div
            style={{
              transform: 'translateZ(25px)',
            }}
            className="relative z-30 -mt-3 sm:-mt-4 w-full max-w-[280px] sm:max-w-[340px]"
          >
            <div className="h-6 sm:h-7 rounded-t-lg bg-gradient-to-r from-[#1f160e] via-[#3d2712] to-[#1f160e] border-t-2 border-x-2 border-amber-600/70 shadow-[0_8px_24px_rgba(0,0,0,0.98)] flex items-center justify-between px-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
              <span className="text-[8.5px] sm:text-[10px] font-mono font-black uppercase tracking-wider text-amber-200 truncate">
                ⚔️ {tier.name} {tier.subtitle ? `· ${tier.subtitle}` : ''}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
            </div>
          </div>
        </div>

        {/* Camada 4: Botões de Ação Rápida */}
        <div
          style={{ transform: 'translateZ(35px)' }}
          className="relative z-30 flex items-center justify-center gap-2 mt-2 pt-1 border-t border-amber-950/40 w-full max-w-[340px]"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              AF.click();
              onOpenGallery();
            }}
            className="flex-1 py-1.5 px-2 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/50 hover:border-amber-400/80 text-amber-200 text-[9.5px] sm:text-[10.5px] font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow"
          >
            <Eye size={13} className="text-amber-400 flex-none" />
            <span className="truncate">{curLang === 'en' ? '11 Armors' : curLang === 'es' ? '11 Armaduras' : '11 Armaduras'}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onLevelUpClick();
            }}
            className="flex-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-amber-600/30 to-amber-500/30 hover:from-amber-600/50 hover:to-amber-500/50 border border-amber-400/70 hover:border-amber-400 text-amber-200 text-[9.5px] sm:text-[10.5px] font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
          >
            <Play size={11} className="text-amber-300 flex-none fill-amber-300" />
            <span className="truncate">{curLang === 'en' ? 'Level Up FX' : curLang === 'es' ? 'Animación Nivel' : 'Animação Nível'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
