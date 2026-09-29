'use client';
import React, { useState } from 'react';
import { 
  Compass, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Shield, 
  Flame, 
  Zap, 
  Siren, 
  Layers, 
  BookOpen, 
  Skull, 
  Sparkles,
  Award
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { AF } from '@/lib/audio';

export const TOUR_STORAGE_KEY = 'fg_tour_seen_v1';

export const TOUR_I18N = {
  headerTitle: {
    pt: 'MANUAL DO GUERREIRO',
    en: "WARRIOR'S MANUAL",
    es: 'MANUAL DEL GUERRERO',
  },
  headerSub: {
    pt: 'Tour guiado pelas ferramentas táticas do aplicativo',
    en: 'Guided tour of the tactical tools in the app',
    es: 'Tour guiado por las herramientas tácticas de la app',
  },
  skipBtn: {
    pt: 'Pular',
    en: 'Skip',
    es: 'Saltar',
  },
  prevBtn: {
    pt: 'Anterior',
    en: 'Previous',
    es: 'Anterior',
  },
  nextBtn: {
    pt: 'Próximo',
    en: 'Next',
    es: 'Siguiente',
  },
  finishBtn: {
    pt: 'ENTENDIDO, IR PARA A BATALHA',
    en: 'UNDERSTOOD, ENTER BATTLE',
    es: 'ENTENDIDO, IR A LA BATALLA',
  },
  stepLabel: {
    pt: 'ETAPA',
    en: 'STEP',
    es: 'ETAPA',
  },
  ofLabel: {
    pt: 'DE',
    en: 'OF',
    es: 'DE',
  },
  tipPrefix: {
    pt: 'DIRETRIZ DE COMBATE',
    en: 'COMBAT DIRECTIVE',
    es: 'DIRECTRIZ DE COMBATE',
  },
  slides: [
    {
      id: 'qg',
      icon: '🏰',
      badge: {
        pt: '1. O CORAÇÃO DO SISTEMA',
        en: '1. THE CORE OF THE SYSTEM',
        es: '1. EL CORAZÓN DEL SISTEMA',
      },
      title: {
        pt: 'Quartel General & As 3 Torres 3D',
        en: 'Headquarters & The 3 3D Towers',
        es: 'Cuartel General y las 3 Torres 3D',
      },
      desc: {
        pt: 'Aqui você vence cada ciclo de 24 horas. Acompanhe em tempo real suas 3 Torres de Honra: Retenção Seminal, Zero Pornografia e Zero Masturbação. Seus segundos limpos acumulam poder e fazem sua armadura medieval evoluir.',
        en: 'Here you conquer each 24-hour cycle. Monitor your 3 Pillar Towers in real time: Semen Retention, Zero Pornography, and Zero Masturbation. Your clean seconds forge power and evolve your medieval armor.',
        es: 'Aquí vences cada ciclo de 24 horas. Monitorea en tiempo real las 3 Torres de los Pilares: Retención Seminal, Cero Pornografía y Cero Masturbación. Tus segundos limpios forjan poder y hacen evolucionar tu armadura medieval.',
      },
      features: [
        {
          pt: '🏛️ 3 Torres Interativas com cronômetro ao vivo segundo a segundo',
          en: '🏛️ 3 Interactive Towers with live second-by-second precision timer',
          es: '🏛️ 3 Torres interactivas con cronómetro en vivo segundo a segundo',
        },
        {
          pt: '⚔️ Pacto de Honra diário e Registro da Batalha das 24 Horas',
          en: '⚔️ Daily Honor Pact and 24-Hour Battle Log',
          es: '⚔️ Pacto de Honor diario y Registro de Batalla cada 24 horas',
        },
        {
          pt: '🛡️ Evolução de 11 Armaduras Medievais e Frases de Poder por Nível',
          en: '🛡️ Evolution of 11 Medieval Armors & Power Quotes by Level',
          es: '🛡️ Evolución de 11 Armaduras Medievales y Frases de Poder por Nivel',
        },
      ],
      tip: {
        pt: 'Toque nas torres ou no card de combate todo fim de tarde para selar sua vitória diária.',
        en: 'Tap the towers or daily combat card every evening to seal your daily victory.',
        es: 'Toca las torres o la tarjeta diaria cada atardecer para sellar tu victoria.',
      },
    },
    {
      id: 'forge',
      icon: '🔨',
      badge: {
        pt: '2. CONSTRUÇÃO DE DISCIPLINA',
        en: '2. DISCIPLINE BUILDING',
        es: '2. CONSTRUCCIÓN DE DISCIPLINA',
      },
      title: {
        pt: 'A Forja & Slots de Hábitos',
        en: 'The Forge & Habit Slots',
        es: 'La Forja y Slots de Hábitos',
      },
      desc: {
        pt: 'Construa novos hábitos viris para canalizar sua energia vital. O sistema libera slots limitados conforme seu nível aumenta para evitar sobrecarga e garantir consistência inabalável.',
        en: 'Forge new masculine habits to transmute your vital energy. The system unlocks slots as your rank rises to prevent burnout and ensure unshakable consistency.',
        es: 'Construye hábitos viriles para transmutar tu energía vital. El sistema desbloquea ranuras según sube tu rango para evitar sobrecargas y asegurar constancia.',
      },
      features: [
        {
          pt: '🏛️ Hábitos distribuídos nos 4 pilares: Corpo, Mente, Missão e Espírito',
          en: '🏛️ Habits split into 4 pillars: Body, Mind, Mission, and Spirit',
          es: '🏛️ Hábitos divididos en 4 pilares: Cuerpo, Mente, Misión y Espíritu',
        },
        {
          pt: '⚡ Marcação rápida de Feito (✓) ou Falhou (✕) com histórico de 7 dias',
          en: '⚡ Quick check-in for Done (✓) or Failed (✕) with 7-day history',
          es: '⚡ Marcado rápido de Cumplido (✓) o Fallado (✕) con historial de 7 días',
        },
        {
          pt: '⚠️ Alerta de Negligência Inteligente caso deixe hábitos parados',
          en: '⚠️ Intelligent Neglect Alert if you abandon active habits',
          es: '⚠️ Alerta de Negligencia Inteligente si dejas hábitos desatendidos',
        },
      ],
      tip: {
        pt: 'Não tente ativar 10 hábitos de uma vez. Comece com 2 a 3 essenciais e mantenha a constância.',
        en: "Don't activate 10 habits at once. Start with 2 to 3 vital habits and maintain consistency.",
        es: 'No actives 10 hábitos a la vez. Empieza con 2 o 3 hábitos esenciales y sé constante.',
      },
    },
    {
      id: 'ops',
      icon: '⚔️',
      badge: {
        pt: '3. EXECUÇÃO NO MUNDO REAL',
        en: '3. REAL-WORLD EXECUTION',
        es: '3. EJECUCIÓN EN EL MUNDO REAL',
      },
      title: {
        pt: 'Operações & Projetos Estratégicos',
        en: 'Operations & Strategic Projects',
        es: 'Operaciones y Proyectos Estratégicos',
      },
      desc: {
        pt: 'Homens sem missão caem em tentação. Na aba Operações você cria tarefas diárias priorizadas e organiza projetos de 30 a 90 dias com os 6 modelos prontos da Forja.',
        en: 'Men without a mission fall into temptation. In the Operations tab you create prioritized daily tasks and organize 30 to 90-day projects using the Forge ready templates.',
        es: 'Los hombres sin misión caen en tentación. En Operaciones creas tareas diarias priorizadas y organizas proyectos de 30 a 90 días con las plantillas de la Forja.',
      },
      features: [
        {
          pt: '🎯 Gestão de tarefas por prioridade (Alta, Média, Baixa) e horários',
          en: '🎯 Task management by priority (High, Medium, Low) and schedule',
          es: '🎯 Gestión de tareas por prioridad (Alta, Media, Baja) y horario',
        },
        {
          pt: '📁 6 Modelos Prontos: Shape Blindado, Negócio Digital, Leitura, etc.',
          en: '📁 6 Ready Templates: Armor Physique, Digital Business, Mastery Reading, etc.',
          es: '📁 6 Plantillas Listas: Físico Blindado, Negocio Digital, Lectura, etc.',
        },
        {
          pt: '📅 Recurso "Adiar com Honra" para reorganizar prazos sem perder o foco',
          en: '📅 "Postpone with Honor" feature to reschedule deadlines without losing focus',
          es: '📅 Recurso "Posponer con Honor" para reprogramar plazos sin perder el foco',
        },
      ],
      tip: {
        pt: 'Defina pelo menos 1 tarefa de alta prioridade na noite anterior para já acordar no ataque.',
        en: 'Set at least 1 high-priority task the night before so you wake up on the offensive.',
        es: 'Define al menos 1 tarea de alta prioridad la noche anterior para despertar al ataque.',
      },
    },
    {
      id: 'enemy_lib',
      icon: '🛡️',
      badge: {
        pt: '4. CIÊNCIA & BLINDAGEM MENTAL',
        en: '4. SCIENCE & MENTAL SHIELDING',
        es: '4. CIENCIA Y BLINDAJE MENTAL',
      },
      title: {
        pt: 'Dossiê do Inimigo & Biblioteca Estoica',
        en: 'Enemy Dossier & Stoic Library',
        es: 'Dossier del Enemigo y Biblioteca Estoica',
      },
      desc: {
        pt: 'Entenda a neurobiologia por trás do vício. Na aba Inimigo, consulte artigos médicos sobre DEIP, dessensibilização e Death Grip. Na Biblioteca, encontre lições práticas, citações estoicas e respiração tática.',
        en: 'Understand the neuroscience behind addiction. In the Enemy tab, review clinical articles on PIED, desensitization, and Death Grip. In the Library, unlock 21 lessons, Stoic meditations, and tactical breathing.',
        es: 'Comprende la neurociencia detrás del vicio. En la pestaña Enemigo, consulta artículos clínicos sobre DEIP y Death Grip. En la Biblioteca, desbloquea 21 lecciones, meditaciones estoicas y respiración guiada.',
      },
      features: [
        {
          pt: '🧠 Quadro clínico e cronograma de restauração neural dos receptores D2',
          en: '🧠 Clinical board & neural timeline of D2 receptor restoration',
          es: '🧠 Cuadro clínico y cronología de restauración de receptores D2',
        },
        {
          pt: '📚 21 Lições de combate progressivas desbloqueadas por patamar',
          en: '📚 21 Progressive combat lessons unlocked by tier',
          es: '📚 21 Lecciones de combate progresivas desbloqueadas por rango',
        },
        {
          pt: '🌬️ 3 Programas de Respiração Guiada (Combate, Foco e Sono Reparador)',
          en: '🌬️ 3 Guided Breathing Programs (Combat, Focus, and Restful Sleep)',
          es: '🌬️ 3 Programas de Respiración Guiada (Combate, Enfoque y Sueño Reparador)',
        },
      ],
      tip: {
        pt: 'Quando sua mente hesitar, estude a ciência médica do vício e lembre-se do preço biológico.',
        en: 'When your mind wavers, study the medical science of addiction and remember the biological cost.',
        es: 'Cuando tu mente dude, estudia la ciencia médica del vicio y recuerda el coste biológico.',
      },
    },
    {
      id: 'sos',
      icon: '🚨',
      badge: {
        pt: '5. BLINDAGEM DE EMERGÊNCIA',
        en: '5. EMERGENCY PROTOCOL',
        es: '5. PROTOCOLO DE EMERGENCIA',
      },
      title: {
        pt: 'Botão Flutuante S.O.S de Emergência',
        en: 'Floating Red S.O.S Button',
        es: 'Botón Flotante Rojo S.O.S de Pánico',
      },
      desc: {
        pt: 'Em qualquer lugar do app, você terá o botão vermelho S.O.S sempre à vista. Quando a urgência parecer insuportável, não lute sozinho no escuro: aperte imediatamente para ativar o protocolo de resgate neural.',
        en: 'Anywhere in the app, the red S.O.S button remains pinned within reach. When the urge feels overwhelming, do not fight in the dark: tap it immediately to trigger the neural rescue protocol.',
        es: 'En cualquier parte de la app, el botón rojo S.O.S estará siempre a tu alcance. Cuando la tentación parezca incontrolable, no luches a oscuras: tócalo de inmediato para activar el rescate neural.',
      },
      features: [
        {
          pt: '🚨 Interrupção de padrão com respiração 4-4-4-4 e frequências sonoras',
          en: '🚨 Pattern interruption with 4-4-4-4 box breathing and acoustic tones',
          es: '🚨 Interrupción de patrones con respiración 4-4-4-4 y frecuencias sonoras',
        },
        {
          pt: '🛡️ Registro de gatilhos e cálculo automático do seu Mapa de Risco',
          en: '🛡️ Trigger logging and automatic calculation of your Risk Map',
          es: '🛡️ Registro de detonantes y cálculo automático de tu Mapa de Riesgo',
        },
        {
          pt: '👑 Cada tentação vencida no S.O.S registra uma vitória no seu histórico',
          en: '👑 Every urge conquered via S.O.S records a victory in your war stats',
          es: '👑 Cada tentación vencida en el S.O.S registra una victoria en tu historial',
        },
      ],
      tip: {
        pt: 'Vencer uma crise de 5 minutos preserva meses de honra. O botão S.O.S é sua arma definitiva.',
        en: 'Conquering a 5-minute crisis preserves months of honor. The S.O.S button is your ultimate weapon.',
        es: 'Vencer una crisis de 5 minutos preserva meses de honor. El botón S.O.S es tu arma definitiva.',
      },
    },
  ],
};

export default function AppTourModal({ onClose }) {
  const { S } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const l = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const tx = TOUR_I18N;
  const slides = tx.slides;

  const [currentIdx, setCurrentIdx] = useState(0);
  const slide = slides[currentIdx];
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === slides.length - 1;

  const handleFinish = () => {
    try { AF.seal(); } catch (e) {}
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
      }
    } catch (e) {}
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const handleNext = () => {
    try { AF.click(); } catch (e) {}
    if (isLast) {
      handleFinish();
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    try { AF.click(); } catch (e) {}
    if (!isFirst) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleJump = (idx) => {
    try { AF.click(); } catch (e) {}
    setCurrentIdx(idx);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-2xl bg-gradient-to-b from-[#18110b] via-[#100b07] to-[#090604] border-2 border-gold/50 p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)] text-ink overflow-hidden max-h-[90vh] flex flex-col select-none">
      {/* Brilho Superior Dourado */}
      <div className="pointer-events-none absolute left-1/2 -top-12 -translate-x-1/2 h-28 w-80 rounded-full bg-[radial-gradient(ellipse,rgba(245,158,11,0.25)_0%,transparent_75%)]" />

      {/* CABEÇALHO */}
      <div className="relative z-10 flex items-start justify-between gap-3 pb-3 border-b border-gold/20 flex-none">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex-none p-2 rounded-xl bg-gold/15 border border-gold/40 text-gold shadow-sm">
            <Compass size={22} className="text-gold animate-spin-slow" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display text-lg sm:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 font-black truncate">
                {tx.headerTitle[l]}
              </span>
              <span className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[9.5px] font-mono text-gold font-extrabold uppercase shadow-sm">
                {tx.stepLabel[l]} {currentIdx + 1} {tx.ofLabel[l]} {slides.length}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-mono text-amber-200/70 truncate mt-0.5">
              {tx.headerSub[l]}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFinish}
          aria-label={tx.skipBtn[l]}
          className="flex-none flex items-center gap-1 px-2.5 py-1 rounded-lg border border-line bg-surface2 text-muted hover:text-gold hover:border-gold/40 text-xs font-mono transition-colors cursor-pointer"
        >
          <span>{tx.skipBtn[l]}</span>
          <X size={14} />
        </button>
      </div>

      {/* BARRA DE PROGRESSO SLIDE */}
      <div className="relative z-10 w-full bg-surface2 h-1.5 rounded-full overflow-hidden my-3">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-gold transition-all duration-300 rounded-full"
          style={{ width: `${((currentIdx + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* CORPO DO SLIDE (ROLÁVEL SUAVE) */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-1 my-1 space-y-3.5 text-left">
        {/* CARD PRINCIPAL DO RECURSO */}
        <div className="rounded-xl border border-gold/30 bg-black/40 p-4 sm:p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between gap-3 mb-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl flex-none" role="img">{slide.icon}</span>
              <div>
                <span className="text-[10px] font-mono text-gold font-extrabold uppercase tracking-wider block">
                  {slide.badge[l]}
                </span>
                <h3 className="font-display text-base sm:text-lg font-bold text-ink leading-tight">
                  {slide.title[l]}
                </h3>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-[13px] text-ink/90 leading-relaxed mb-3.5">
            {slide.desc[l]}
          </p>

          {/* LISTA DE DESTAQUES */}
          <div className="space-y-2 mb-3.5">
            {slide.features.map((feat, i) => (
              <div 
                key={i}
                className="flex items-start gap-2 p-2 rounded-lg bg-surface2/70 border border-line/60 text-xs text-muted"
              >
                <span className="text-ink font-medium leading-relaxed">
                  {feat[l]}
                </span>
              </div>
            ))}
          </div>

          {/* DICA DE COMBATE */}
          <div className="p-3 rounded-lg border border-gold/30 bg-gold/5 flex items-start gap-2 text-xs">
            <span className="text-base flex-none">💡</span>
            <div>
              <span className="font-mono text-[10px] font-extrabold text-gold block uppercase tracking-wider">
                {tx.tipPrefix[l]}
              </span>
              <p className="text-gold2 leading-relaxed text-[11.5px] sm:text-xs mt-0.5">
                {slide.tip[l]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RODAPÉ COM CONTROLES */}
      <div className="relative z-10 pt-3 border-t border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-3 flex-none">
        {/* INDICADOR DE BOLINHAS */}
        <div className="flex items-center gap-1.5 order-2 sm:order-1">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleJump(idx)}
              className={`h-2 transition-all rounded-full cursor-pointer ${
                idx === currentIdx
                  ? 'w-6 bg-gold shadow-sm'
                  : 'w-2 bg-line hover:bg-muted'
              }`}
              title={`${tx.stepLabel[l]} ${idx + 1}`}
              aria-label={`${tx.stepLabel[l]} ${idx + 1}`}
            />
          ))}
        </div>

        {/* BOTÕES ANTERIOR E PRÓXIMO */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
          {!isFirst && (
            <button
              type="button"
              onClick={handlePrev}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg border border-line bg-surface2 text-muted hover:text-ink hover:border-gold/40 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{tx.prevBtn[l]}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className={`flex-1 sm:flex-none py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer ${
              isLast
                ? 'bg-gradient-to-r from-amber-500 via-gold to-amber-400 text-[#141414] font-extrabold hover:brightness-110 active:scale-95'
                : 'btn-gold'
            }`}
          >
            <span>{isLast ? tx.finishBtn[l] : tx.nextBtn[l]}</span>
            {isLast ? <Check size={14} strokeWidth={3} /> : <ArrowRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
