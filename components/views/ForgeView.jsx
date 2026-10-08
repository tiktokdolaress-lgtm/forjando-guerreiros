'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Flame, Clock, Check, X, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, Sparkles, CalendarDays, Edit3, Trash2, Archive, ArchiveRestore, MoreVertical, Shield, Play, Lock, Eye, CheckCircle2, Zap, Compass, ShieldAlert, Target } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import { FORGE_RULES, DEFAULT_HABITS, TIERS } from '@/lib/data';
import { cxHabits, cxTiers, cx } from '@/lib/content-i18n';
import * as L from '@/lib/logic';
import { AF } from '@/lib/audio';
import { today, fdmy, dstr, fmtD, setLocaleLang } from '@/lib/utils';
import WarriorLevelUpModal from '@/components/WarriorLevelUpModal';
import WarriorEvolutionGalleryModal from '@/components/WarriorEvolutionGalleryModal';

/* Dicionário Internacional dos Efeitos Biológicos e Mentais (PT / EN / ES) */
const BIO_EFFECTS_I18N = {
  header: {
    pt: 'EFEITOS BIOLÓGICOS & MENTAIS ATIVOS NESTE MARCO:',
    en: 'ACTIVE BIOLOGICAL & MENTAL EFFECTS AT THIS MILESTONE:',
    es: 'EFECTOS BIOLÓGICOS Y MENTALES ACTIVOS EN ESTE HITO:',
  },
  tiers: [
    {
      min: 0, max: 3,
      perks: {
        pt: ['Quebra do ciclo automático', 'Redução do pico de cortisol', 'Recuperação inicial da dopamina'],
        en: ['Automatic loop broken', 'Cortisol spike reduction', 'Initial dopamine recovery'],
        es: ['Ruptura del ciclo automático', 'Reducción del pico de cortisol', 'Recuperación inicial de dopamina'],
      }
    },
    {
      min: 4, max: 7,
      perks: {
        pt: ['Pico natural de testosterona (+45%)', 'Aumento de energia física', 'Fim gradual da névoa mental'],
        en: ['Natural testosterone surge (+45%)', 'Boost in physical energy', 'Gradual end of brain fog'],
        es: ['Pico natural de testosterona (+45%)', 'Aumento de energía física', 'Fin gradual de la niebla mental'],
      }
    },
    {
      min: 8, max: 14,
      perks: {
        pt: ['Sono profundo restaurador', 'Vontade e assertividade reforçadas', 'Olhar firme e redução da timidez'],
        en: ['Deep restorative sleep', 'Enhanced willpower & assertiveness', 'Steady gaze and less shyness'],
        es: ['Sueño profundo y reparador', 'Voluntad y asertividad reforzadas', 'Mirada firme y menos timidez'],
      }
    },
    {
      min: 15, max: 30,
      perks: {
        pt: ['Receptores de dopamina rebalanceados', 'Redução drástica de ansiedade social', 'Magnetismo pessoal e foco aguçado'],
        en: ['Rebalanced dopamine receptors', 'Drastic drop in social anxiety', 'Personal magnetism & sharp focus'],
        es: ['Receptores de dopamina equilibrados', 'Reducción drástica de ansiedad social', 'Magnetismo personal y enfoque agudo'],
      }
    },
    {
      min: 31, max: 60,
      perks: {
        pt: ['Controle absoluto de pensamentos invasivos', 'Aura de respeito natural', 'Vitalidade transmutada em criação'],
        en: ['Total control over invasive thoughts', 'Aura of natural respect', 'Vitality transmuted into creation'],
        es: ['Control total sobre pensamientos intrusivos', 'Aura de respeto natural', 'Vitalidad transmutada en creación'],
      }
    },
    {
      min: 61, max: 90,
      perks: {
        pt: ['Superação da flatline (platô)', 'Alta performance física e cognitiva', 'Autodomínio e disciplina inabaláveis'],
        en: ['Flatline conquered', 'High physical & cognitive performance', 'Unshakable self-mastery and discipline'],
        es: ['Superación de la flatline (meseta)', 'Alto rendimiento físico y cognitivo', 'Autodominio y disciplina inquebrantables'],
      }
    },
    {
      min: 91, max: 120,
      perks: {
        pt: ['Blindagem neural contra recaídas tardias', 'Foco cirúrgico em metas de vida e carreira', 'Paz mental profunda e presença inabalável'],
        en: ['Neural shield against late-stage relapses', 'Surgical focus on life & career goals', 'Deep mental peace and unshakable presence'],
        es: ['Blindaje neural contra recaídas tardías', 'Enfoque quirúrgico en metas de vida y carrera', 'Paz mental profunda y presencia inquebrantable'],
      }
    },
    {
      min: 121, max: 180,
      perks: {
        pt: ['Aço de Damasco mental: 6 meses limpo', 'Cérebro completamente reconfigurado', 'Fogo criativo alimentando novos impérios'],
        en: ['Mental Damascus steel: 6 months clean', 'Brain fully rewired and reset', 'Creative fire fueling new empires'],
        es: ['Acero de Damasco mental: 6 meses limpio', 'Cerebro completamente reconfigurado', 'Fuego creativo alimentando nuevos imperios'],
      }
    },
    {
      min: 181, max: 270,
      perks: {
        pt: ['Transmutação seminal em força física e patrimônio', 'Aura magnética e liderança natural', 'Zero necessidade de aprovação externa'],
        en: ['Seminal transmutation into wealth & physical power', 'Magnetic aura and natural leadership', 'Zero need for external validation'],
        es: ['Transmutación seminal en riqueza y fuerza física', 'Aura magnética y liderazgo natural', 'Cero necesidad de aprobación externa'],
      }
    },
    {
      min: 271, max: 365,
      perks: {
        pt: ['1 Ano Completo: soberania absoluta da mente', 'Poder transformador de legado e exemplo', 'O homem forjado que você prometeu se tornar'],
        en: ['1 Full Year: absolute mind sovereignty', 'Transformative power of legacy and example', 'The forged man you swore to become'],
        es: ['1 Año Completo: soberanía mental absoluta', 'Poder transformador de legado y ejemplo', 'El hombre forjado que prometiste ser'],
      }
    },
    {
      min: 366, max: 9999,
      perks: {
        pt: ['Mito vivo: 2+ anos de disciplina suprema', 'Panteão dos mestres inquebrantáveis', 'Caráter de aço eterno'],
        en: ['Living myth: 2+ years of supreme discipline', 'Pantheon of unshakable masters', 'Eternal steel character'],
        es: ['Mito vivo: 2+ años de disciplina suprema', 'Panteón de maestros inquebrantables', 'Carácter de acero eterno'],
      }
    },
  ]
};

/* Textos Trilíngues do Bloco de Protocolo Tático */
const TACTICAL_BLOCK_I18N = {
  title: {
    pt: 'PROTOCOLO TÁTICO & BLINDAGEM DO GUERREIRO',
    en: 'TACTICAL PROTOCOL & WARRIOR SHIELDING',
    es: 'PROTOCOLO TÁCTICO Y BLINDAJE DEL GUERRERO',
  },
  riskTitle: {
    pt: 'ZONA DE RISCO ELEVADO',
    en: 'HIGH RISK ZONE',
    es: 'ZONA DE ALTO RIESGO',
  },
  riskDesc: {
    pt: 'Noite / Cansaço (22h - 01h). Mantenha as telas fora do quarto.',
    en: 'Night / Fatigue (10 PM - 1 AM). Keep screens away from bed.',
    es: 'Noche / Cansancio (22h - 01h). Mantén las pantallas fuera del cuarto.',
  },
  goldenRuleTitle: {
    pt: 'REGRA DE CONDUTA',
    en: 'RULE OF CONDUCT',
    es: 'REGLA DE CONDUCTA',
  },
  goldenRuleDesc: {
    pt: 'A tentação dura 10 minutos. O arrependimento dura dias inteiros.',
    en: 'The urge lasts 10 minutes. Regret lingers for days.',
    es: 'La tentación dura 10 minutos. El arrepentimiento dura días enteros.',
  },
  energyTitle: {
    pt: 'ENERGIA VITAL',
    en: 'VITAL ENERGY',
    es: 'ENERGÍA VITAL',
  },
  energyDesc: {
    pt: 'Transmute o fogo interno em treino, estudo e trabalho.',
    en: 'Transmute inner fire into training, studying, and building.',
    es: 'Transmuta el fuego interno en entrenamiento, estudio y trabajo.',
  },
};

function getBioPerksI18n(days, lang) {
  const currentLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const found = BIO_EFFECTS_I18N.tiers.find((b) => days >= b.min && days <= b.max) || BIO_EFFECTS_I18N.tiers[0];
  return {
    header: BIO_EFFECTS_I18N.header[currentLang] || BIO_EFFECTS_I18N.header.pt,
    perks: found.perks[currentLang] || found.perks.pt,
  };
}

const FORGE_CATEGORIES = [
  { id: 'active', label: 'Protocolo Ativo', icon: Flame },
  { id: 'reserve', label: 'Reserva & Arsenal', icon: Sparkles },
];

/* Categorias / Pilares da Masculinidade Trilíngues */
const PILLARS_I18N = {
  all: { pt: 'Todos', en: 'All', es: 'Todos' },
  body: { pt: '🏛️ Corpo & Vigor', en: '🏛️ Body & Vigor', es: '🏛️ Cuerpo y Vigor' },
  mind: { pt: '🧠 Mente & Foco', en: '🧠 Mind & Focus', es: '🧠 Mente y Enfoque' },
  mission: { pt: '💼 Missão & Finanças', en: '💼 Mission & Wealth', es: '💼 Misión y Finanzas' },
  spirit: { pt: '⚔️ Espírito & Honra', en: '⚔️ Spirit & Honor', es: '⚔️ Espíritu y Honor' },
  archived: { pt: '📦 Arquivados', en: '📦 Archived', es: '📦 Archivados' },
};

/* Textos Traduzidos dos Botões e Ações */
const LABELS_I18N = {
  viewDetails: { pt: 'Detalhes & Histórico 7D', en: 'Details & 7D History', es: 'Detalles e Historial 7D' },
  hideDetails: { pt: 'Ocultar Detalhes', en: 'Hide Details', es: 'Ocultar Detalles' },
  forgeProtocolTitle: { pt: 'PROTOCOLO DA FORJA', en: 'FORGE PROTOCOL', es: 'PROTOCOLO DE LA FORJA' },
  forgeReserveHeader: { pt: 'BANCO DE RESERVA & ARSENAL', en: 'RESERVE HABIT ARSENAL', es: 'BANCO DE RESERVA Y ARSENAL' },
  viewBenefit: { pt: 'VER BENEFÍCIOS & PROTEÇÃO', en: 'VIEW BENEFITS & PROTECTION', es: 'VER BENEFICIOS Y PROTECCIÓN' },
  hideBenefit: { pt: 'OCULTAR BENEFÍCIOS', en: 'HIDE BENEFITS', es: 'OCULTAR BENEFICIOS' },
  viewHistory: { pt: 'HISTÓRICO DOS ÚLTIMOS 7 DIAS', en: 'LAST 7 DAYS HISTORY', es: 'HISTORIAL DE LOS ÚLTIMOS 7 DÍAS' },
  hideHistory: { pt: 'OCULTAR HISTÓRICO', en: 'HIDE HISTORY', es: 'OCULTAR HISTORIAL' },
  activeInProtocol: { pt: 'NO PROTOCOLO', en: 'IN PROTOCOL', es: 'EN PROTOCOLO' },
  activeBtn: { pt: 'ATIVO', en: 'ACTIVE', es: 'ACTIVO' },
  activateBtn: { pt: '+ ATIVAR', en: '+ ACTIVATE', es: '+ ACTIVAR' },
  completeBtn: { pt: 'CONCLUÍDO HOJE', en: 'DONE TODAY', es: 'COMPLETO HOY' },
  toCompleteBtn: { pt: 'CONCLUIR HOJE', en: 'MARK AS DONE', es: 'MARCAR HECHO' },
  failBtn: { pt: 'FALHEI', en: 'FAILED', es: 'FALLÉ' },
  editHabit: { pt: 'Editar Hábito', en: 'Edit Habit', es: 'Editar Hábito' },
  deleteHabit: { pt: 'Excluir', en: 'Delete', es: 'Eliminar' },
  archiveHabit: { pt: 'Arquivar', en: 'Archive', es: 'Archivar' },
  unarchiveHabit: { pt: 'Desarquivar', en: 'Unarchive', es: 'Desarchivar' },
  custom: { pt: 'PERSONALIZADO', en: 'CUSTOM', es: 'PERSONALIZADO' },
  customStar: { pt: '★ PERSONALIZADO', en: '★ CUSTOM', es: '★ PERSONALIZADO' },
  customHabitLabel: { pt: '★ Personalizado', en: '★ Custom', es: '★ Personalizado' },
  slotRulesTitle: { pt: 'REGRAS DE SLOTS POR PATAMAR', en: 'SLOT RULES BY TIER', es: 'REGLAS DE SLOTS POR RANGO' },
  activeSlotsBadge: { pt: 'ATIVOS', en: 'ACTIVE', es: 'ACTIVOS' },
  habitWord: { pt: 'hábito', en: 'habit', es: 'hábito' },
  habitsWord: { pt: 'hábitos', en: 'habits', es: 'hábitos' },
  createHabit: { pt: 'CRIAR HÁBITO', en: 'CREATE HABIT', es: 'CREAR HÁBITO' },
  negligenceAlert: { pt: 'ALERTA DE NEGLIGÊNCIA — A FORJA ESFRIA', en: 'NEGLIGENCE ALERT — THE FORGE GROWS COLD', es: 'ALERTA DE NEGLIGENCIA — LA FORJA SE ENFRÍA' },
  daysWithoutDoing: { pt: '2+ dias sem fazer', en: '2+ days without doing', es: '2+ días sin hacer' },
  negligenceQuote: {
    pt: 'Guerreiro que desaparece do treino vira estatística. Retome HOJE.',
    en: 'A warrior who vanishes from training becomes a statistic. Resume TODAY.',
    es: 'El guerrero que desaparece del entrenamiento se vuelve estadística. Retoma HOY.'
  },
  activeInProtocolTitle: {
    pt: '⚡ ATIVOS NO PROTOCOLO',
    en: '⚡ ACTIVE IN PROTOCOL',
    es: '⚡ ACTIVOS EN PROTOCOLO'
  },
  slotsWord: { pt: 'SLOTS', en: 'SLOTS', es: 'SLOTS' },
  moveToReserve: { pt: 'Mover para a Reserva', en: 'Move to Reserve', es: 'Mover a la Reserva' },
  undoBtn: { pt: 'Desfazer', en: 'Undo', es: 'Deshacer' },
  undoCompletion: { pt: 'Desfazer conclusão', en: 'Undo completion', es: 'Deshacer conclusión' },
  availableSlot: { pt: 'Slot Disponível', en: 'Available Slot', es: 'Slot Disponible' },
  tapToActivate: { pt: 'Toque aqui para ativar um hábito da Reserva →', en: 'Tap here to activate a habit from Reserve →', es: 'Toca aquí para activar un hábito de la Reserva →' },
  nextUnlock: { pt: 'Próximo Desbloqueio', en: 'Next Unlock', es: 'Próximo Desbloqueo' },
  slotsFull: { pt: 'Slots Esgotados', en: 'Slots Full', es: 'Slots Agotados' },
  slotsFullBtn: { pt: 'SLOTS CHEIOS', en: 'SLOTS FULL', es: 'SLOTS LLENOS' },
  slotsFullTooltip: {
    pt: (s) => `Todos os ${s} slots do protocolo já estão em uso. Desative um hábito antes de escolher outro.`,
    en: (s) => `All ${s} protocol slots are already in use. Deactivate a habit before choosing another.`,
    es: (s) => `Todos los ${s} slots del protocolo ya están en uso. Desactiva un hábito antes de elegir otro.`
  },
  reserveSlotsFullNotice: {
    pt: (s) => `🔒 Protocolo Completo: Todos os seus ${s} slots da Forja já estão em uso. Para escolher outros hábitos, libere um slot desativando um hábito ativo.`,
    en: (s) => `🔒 Protocol Full: All your ${s} Forge slots are already in use. To choose other habits, free up a slot by deactivating an active habit.`,
    es: (s) => `🔒 Protocolo Completo: Todos tus ${s} slots de la Forja ya están en uso. Para elegir otros hábitos, libera un slot desactivando un hábito activo.`
  },
  nextUnlockDesc: {
    pt: (min, slots) => `Mantenha a retenção até ${min} dias para destravar ${slots >= 99 ? 'slots ilimitados' : `${slots} slots`} no protocolo.`,
    en: (min, slots) => `Maintain retention up to ${min} days to unlock ${slots >= 99 ? 'unlimited slots' : `${slots} slots`} in protocol.`,
    es: (min, slots) => `Mantén la retención hasta ${min} días para desbloquear ${slots >= 99 ? 'slots ilimitados' : `${slots} slots`} en el protocolo.`
  },
  supremeRankReached: {
    pt: 'Você atingiu o patamar supremo de slots ilimitados!',
    en: 'You have reached the supreme rank of unlimited slots!',
    es: '¡Has alcanzado el rango supremo de slots ilimitados!'
  },
  slotsInUse: { pt: 'Slots em uso:', en: 'Slots in use:', es: 'Slots en uso:' },
  viewReserve: { pt: 'Ver Reserva →', en: 'View Reserve →', es: 'Ver Reserva →' },
  noActiveHabits: {
    pt: 'Nenhum hábito ativo no protocolo. Selecione hábitos na Reserva para forjar seu dia.',
    en: 'No active habits in protocol. Select habits in Reserve to forge your day.',
    es: 'Ningún hábito activo en el protocolo. Selecciona hábitos en la Reserva para forjar tu día.'
  },
  exploreReserve: { pt: 'Explorar Reserva de Hábitos →', en: 'Explore Habit Reserve →', es: 'Explorar Reserva de Hábitos →' },
  forgeReserveTitle: { pt: 'RESERVA DA FORJA', en: 'FORGE RESERVE', es: 'RESERVA DE LA FORJA' },
  availableWord: { pt: 'DISPONÍVEIS', en: 'AVAILABLE', es: 'DISPONIBLES' },
  activateInProtocol: { pt: 'Ativar no Protocolo', en: 'Activate in Protocol', es: 'Activar en Protocolo' },
  noHabitsCategory: { pt: 'Nenhum hábito nesta categoria.', en: 'No habits in this category.', es: 'Ningún hábito en esta categoría.' },
  noArchivedHabits: { pt: 'Nenhum hábito arquivado no momento.', en: 'No archived habits at this time.', es: 'Ningún hábito archivado en este momento.' },
  
  // Tab Armaduras
  armorsTitle: { pt: '11 ARMADURAS MEDIEVAIS & PROGRESSÃO', en: '11 MEDIEVAL ARMORS & ADVANCEMENT', es: '11 ARMADURAS MEDIEVALES Y AVANCE' },
  daysClean: { pt: 'DIAS LIMPOS', en: 'DAYS CLEAN', es: 'DÍAS LIMPIOS' },
  armorsDesc: {
    pt: 'A cada marco de retenção conquistado, novas ligas e elmos são forjados. As armaduras futuras permanecem trancadas na forja sagrada até que você alcance os dias necessários.',
    en: 'Each retention threshold tempers new steel. Future armors remain locked in the sacred vault until your clean days prove worthy.',
    es: 'Cada hito de retención templa nuevo acero. Las futuras armaduras permanecen bloqueadas en la forja sagrada hasta que alcances los días necesarios.'
  },
  sacredForgeLocked: { pt: 'FORJA SAGRADA TRANCADA', en: 'SACRED FORGE LOCKED', es: 'FORJA SAGRADA BLOQUEADA' },
  lockedDaysRemaining: {
    pt: (rem) => `Faltam ${rem} dias de retenção limpa para temperar esta armadura.`,
    en: (rem) => `${rem} days of clean retention remaining to temper this armor.`,
    es: (rem) => `Faltan ${rem} días de retención limpia para templar esta armadura.`
  },
  warReward: { pt: 'RECOMPENSA DE GUERRA', en: 'WAR REWARD', es: 'RECOMPENSA DE GUERRA' },
  animateWarrior: { pt: 'ANIMAR GUERREIRO ⚡', en: 'ANIMATE WARRIOR ⚡', es: 'ANIMAR GUERRERO ⚡' },
  lockedReachDays: {
    pt: (min) => `BLOQUEADO · ALCANCE ${min} DIAS`,
    en: (min) => `LOCKED · REACH ${min} DAYS`,
    es: (min) => `BLOQUEADO · ALCANZA ${min} DÍAS`
  },
  
  // Tab Regras & Slots
  slotUnlockTiersTitle: { pt: 'PATAMARES DE DESBLOQUEIO DE SLOTS', en: 'SLOT UNLOCK TIERS', es: 'NIVELES DE DESBLOQUEO DE SLOTS' },
  tierUnlockSlotsTitle: { pt: 'PATAMARES DE DESBLOQUEIO DE SLOTS', en: 'SLOT UNLOCK TIERS', es: 'NIVELES DE DESBLOQUEO DE SLOTS' },
  activeSlotsHeader: { pt: 'SLOTS ATIVOS', en: 'ACTIVE SLOTS', es: 'SLOTS ACTIVOS' },
  slotRulesDesc: {
    pt: 'A retenção seminal e a disciplina forjam seu caráter. Conforme seus dias limpos aumentam, novos slots no protocolo diário são liberados.',
    en: 'Seminal retention and discipline forge your character. As your clean days increase, new slots in the daily protocol are unlocked.',
    es: 'La retención seminal y la disciplina forjan tu carácter. Conforme aumentan tus días limpios, se liberan nuevos slots en el protocolo diario.'
  },
  rulesDesc: {
    pt: 'A retenção seminal e a disciplina forjam seu caráter. Conforme seus dias limpos aumentam, novos slots no protocolo diário são liberados.',
    en: 'Seminal retention and discipline forge your character. As your clean days increase, new slots in the daily protocol are unlocked.',
    es: 'La retención seminal y la disciplina forjan tu carácter. Conforme aumentan tus días limpios, se liberan nuevos slots en el protocolo diario.'
  },
  currentBadge: { pt: 'ATUAL', en: 'CURRENT', es: 'ACTUAL' },
  unlockedBadge: { pt: 'LIBERADO', en: 'UNLOCKED', es: 'DESBLOQUEADO' },
  lockedBadge: { pt: 'BLOQUEADO', en: 'LOCKED', es: 'BLOQUEADO' },
  minimumWord: { pt: 'Mínimo:', en: 'Minimum:', es: 'Mínimo:' },
  minWord: { pt: 'Mínimo:', en: 'Minimum:', es: 'Mínimo:' },
  daysWord: { pt: 'dias', en: 'days', es: 'días' },
  unlimitedWord: { pt: 'Ilimitados (∞)', en: 'Unlimited (∞)', es: 'Ilimitados (∞)' },
  archivedHabitsTitle: { pt: 'HÁBITOS ARQUIVADOS', en: 'ARCHIVED HABITS', es: 'HÁBITOS ARCHIVADOS' },
  archivedHabitsEmpty: {
    pt: 'Nenhum hábito arquivado. Hábitos que você arquivar da reserva ou do protocolo aparecerão aqui para restauração.',
    en: 'No archived habits. Habits you archive from reserve or protocol will appear here for restoration.',
    es: 'Ningún hábito archivado. Los hábitos que archives de la reserva o del protocolo aparecerán aquí para restauración.'
  },
  noArchivedHabitsDesc: {
    pt: 'Nenhum hábito arquivado. Hábitos que você arquivar da reserva ou do protocolo aparecerão aqui para restauração.',
    en: 'No archived habits. Habits you archive from reserve or protocol will appear here for restoration.',
    es: 'Ningún hábito archivado. Los hábitos que archives de la reserva o del protocolo aparecerán aquí para restauración.'
  },
  
  // Modais de Criação e Edição
  createNewHabit: { pt: 'CRIAR NOVO HÁBITO', en: 'CREATE NEW HABIT', es: 'CREAR NUEVO HÁBITO' },
  createHabitSub: {
    pt: 'Forje um novo hábito inegociável para a sua rotina militar.',
    en: 'Forge a new non-negotiable habit for your battle routine.',
    es: 'Forja un nuevo hábito innegociable para tu rutina militar.'
  },
  habitNameLabel: { pt: 'Nome do Hábito:', en: 'Habit Name:', es: 'Nombre del Hábito:' },
  habitNamePlaceholder: { pt: 'Ex: 50 Flexões ao acordar', en: 'E.g.: 50 Push-ups upon waking', es: 'Ej.: 50 Flexiones al despertar' },
  iconLabel: { pt: 'Ícone / Emoji:', en: 'Icon / Emoji:', es: 'Ícono / Emoji:' },
  timeOptionalLabel: { pt: 'Horário & Alerta 🔔 (Opcional):', en: 'Time & Alert 🔔 (Optional):', es: 'Horario y Alerta 🔔 (Opcional):' },
  timeLabel: { pt: 'Horário & Alerta 🔔:', en: 'Time & Alert 🔔:', es: 'Horario y Alerta 🔔:' },
  saveChanges: { pt: 'Salvar Alterações', en: 'Save Changes', es: 'Guardar Cambios' },
  cancelBtn: { pt: 'Cancelar', en: 'Cancel', es: 'Cancelar' },
  createHabitBtn: { pt: 'Criar Hábito', en: 'Create Habit', es: 'Crear Hábito' },
  editHabitTitle: { pt: 'EDITAR HÁBITO', en: 'EDIT HABIT', es: 'EDITAR HÁBITO' },
  editHabitSub: {
    pt: 'Ajuste os dados do seu hábito customizado.',
    en: 'Adjust your custom habit settings.',
    es: 'Ajusta los datos de tu hábito personalizado.'
  },
  confirmDeleteHabit: {
    pt: 'Tem certeza que deseja excluir definitivamente este hábito criado por você?',
    en: 'Are you sure you want to permanently delete this custom habit?',
    es: '¿Estás seguro de que deseas eliminar definitivamente este hábito creado por ti?'
  },
  toastNameRequired: { pt: 'Digite o nome do hábito', en: 'Enter the habit name', es: 'Ingresa el nombre del hábito' },
  toastHabitCreated: { pt: '✅ Hábito criado e disponível na Reserva!', en: '✅ Habit created and available in Reserve!', es: '✅ ¡Hábito creado y disponible en la Reserva!' },
  toastHabitUpdated: { pt: '✅ Hábito atualizado com sucesso!', en: '✅ Habit updated successfully!', es: '✅ ¡Hábito actualizado con éxito!' },
  toastHabitDeleted: { pt: 'Hábito excluído', en: 'Habit deleted', es: 'Hábito eliminado' },
  toastHabitMovedReserve: { pt: 'Hábito movido para a reserva', en: 'Habit moved to reserve', es: 'Hábito movido a la reserva' },
  toastHabitActivated: { pt: 'Hábito ativado no protocolo', en: 'Habit activated in protocol', es: 'Hábito activado en el protocolo' },
  toastHabitArchived: { pt: 'Hábito arquivado', en: 'Habit archived', es: 'Hábito archivado' },
  toastHabitRestored: { pt: 'Hábito restaurado da Reserva', en: 'Habit restored from Reserve', es: 'Hábito restaurado de la Reserva' },
  toastLimitReached: {
    pt: (slots) => `Limite de ${slots} slots atingido!`,
    en: (slots) => `Limit of ${slots} slots reached!`,
    es: (slots) => `¡Límite de ${slots} slots alcanzado!`
  },
};

/* Mapeamento de Categoria */
function getHabitCategory(h) {
  const idStr = String(h.id);
  const nameLower = String(h.n || '').toLowerCase();

  if (['1', '2', '13', '14', '18', '19'].includes(idStr) || nameLower.includes('banho') || nameLower.includes('shower') || nameLower.includes('ducha') || nameLower.includes('treino') || nameLower.includes('train') || nameLower.includes('água') || nameLower.includes('water') || nameLower.includes('sol') || nameLower.includes('sun') || nameLower.includes('pélvica') || nameLower.includes('pelvic') || nameLower.includes('força') || nameLower.includes('strength')) {
    return 'body';
  }
  if (['3', '5', '6', '7', '8', '20'].includes(idStr) || nameLower.includes('leitura') || nameLower.includes('reading') || nameLower.includes('lectura') || nameLower.includes('telas') || nameLower.includes('screen') || nameLower.includes('redes') || nameLower.includes('feed') || nameLower.includes('açúcar') || nameLower.includes('sugar') || nameLower.includes('azúcar') || nameLower.includes('caminhada') || nameLower.includes('walk')) {
    return 'mind';
  }
  if (['16', '21', '22', '23'].includes(idStr) || nameLower.includes('foco') || nameLower.includes('focus') || nameLower.includes('tarefa') || nameLower.includes('task') || nameLower.includes('financeiro') || nameLower.includes('planejar') || nameLower.includes('trabalho') || nameLower.includes('work')) {
    return 'mission';
  }
  return 'spirit';
}

/* Banco de Explicações Científicas Contra Recaída */
function getHabitBenefitText(h, lang) {
  if (h.p) return h.p;
  if (h.b) return h.b;
  if (h.why) return h.why;
  if (h.benefit) return h.benefit;
  if (h.desc) return h.desc;

  const idStr = String(h.id);
  const nameLower = String(h.n || '').toLowerCase();

  if (idStr === '1' || nameLower.includes('banho') || nameLower.includes('shower') || nameLower.includes('ducha')) {
    return lang === 'en'
      ? 'Cools the pelvic floor, extinguishes sudden urges, and creates an instant spike of clean dopamine.'
      : lang === 'es'
      ? 'Enfría el área pélvica, apaga impulsos repentinos y genera dopamina limpia sin estímulos virtuales.'
      : 'Resfria a região pélvica, elimina impulsos repentinos e gera um pico imediato de dopamina limpa sem estímulo virtual.';
  }
  if (idStr === '2' || nameLower.includes('treino') || nameLower.includes('train') || nameLower.includes('entrenamiento') || nameLower.includes('força')) {
    return lang === 'en'
      ? 'Transmutes stored sexual energy into muscle density, increases free testosterone, and discharges body restlessness.'
      : lang === 'es'
      ? 'Transmuta la energía sexual en músculo, eleva la testosterona libre y descarga la tensión física.'
      : 'Transmuta a energia seminal represada em densidade muscular, eleva a testosterona livre e descarrega a tensão corporal.';
  }
  if (idStr === '13' || nameLower.includes('água') || nameLower.includes('water') || nameLower.includes('agua')) {
    return lang === 'en'
      ? 'Maximizes cellular hydration, optimizes blood flow, and eliminates physical sluggishness.'
      : lang === 'es'
      ? 'Mantiene la hidratación celular máxima, optimiza el flujo sanguíneo y aleja la lentitud.'
      : 'Mantém a hidratação celular máxima, otimiza o fluxo sanguíneo e afasta a letargia que costuma abrir brechas para tentação.';
  }
  if (idStr === '4' || nameLower.includes('acordar') || nameLower.includes('wake') || nameLower.includes('despertar')) {
    return lang === 'en'
      ? 'First battle won against flesh comfort. Lingering in bed after waking is the origin of 60% of morning relapses.'
      : lang === 'es'
      ? 'Primera batalla ganada contra la comodidad. Quedarse en la cama es la cuna del 60% de las recaídas matutinas.'
      : 'Primeira vitória sobre a carne. Ficar enrolando na cama é o ninho de 60% das recaídas matinais. Levantar rápido sela o dia.';
  }
  if (idStr === '5' || nameLower.includes('telas') || nameLower.includes('screen') || nameLower.includes('pantalla')) {
    return lang === 'en'
      ? 'Cuts out night blue light that disrupts sleep and stops late-night solitary screen access.'
      : lang === 'es'
      ? 'Corta la luz azul nocturna y evita el acceso solitario a pantallas en la noche.'
      : 'Corta a luz azul noturna que desregula a melatonina e impede o acesso solitário a telas no momento mais vulnerável.';
  }
  if (idStr === '17' || nameLower.includes('celular') || nameLower.includes('phone') || nameLower.includes('móvil')) {
    return lang === 'en'
      ? 'Keeping the phone out of the bedroom eliminates 95% of nighttime and early morning relapse risk.'
      : lang === 'es'
      ? 'El teléfono fuera del dormitorio elimina el 95% del riesgo de recaídas nocturnas y matutinas.'
      : 'Regra de ouro inegociável: celular fora do quarto elimina 95% do risco de recaídas na madrugada.';
  }

  return lang === 'en'
    ? 'Reinforces cognitive willpower, protects your dopamine baseline, and channels energy into discipline.'
    : lang === 'es'
    ? 'Refuerza la fuerza de voluntad cognitiva, protege la dopamina y canaliza energía en disciplina.'
    : 'Fortalece o córtex pré-frontal, protege os receptores de dopamina e transmuta a energia em autodomínio.';
}

export default function ForgeView() {
  const { S, update, t, openModal, closeModal, toast } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const curLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const LBL = LABELS_I18N;
  const PIL = PILLARS_I18N;

  setLocaleLang(curLang);

  const [selectedPillar, setSelectedPillar] = useState('all');
  const [openBenefitId, setOpenBenefitId] = useState(null);
  const [openDetailsId, setOpenDetailsId] = useState(null);
  const [showRulesTable, setShowRulesTable] = useState(false);
  const [showEvolutionGallery, setShowEvolutionGallery] = useState(false);
  const [activeCategory, setActiveCategory] = useState('active');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [levelUpModalTier, setLevelUpModalTier] = useState(null);

  /* Tiers e Regras Traduzidas */
  const CURRENT_TIERS = cxTiers(curLang, TIERS);
  const CURRENT_RULES = cxTiers(curLang, FORGE_RULES);
  const curTier = CURRENT_TIERS.find((x) => x.min === L.tierNow(S).min) || L.tierNow(S);

  /* Carrega todos os hábitos do usuário */
  const ALLH = cxHabits(curLang, L.allH(S));
  const d = L.progressDays(S);

  let maxSlots = 2;
  try {
    if (typeof L.slotLimit === 'function') {
      maxSlots = L.slotLimit(S);
    } else if (typeof L.maxSlots === 'function') {
      maxSlots = L.maxSlots(d);
    } else if (Array.isArray(CURRENT_RULES)) {
      const found = CURRENT_RULES.slice().reverse().find((r) => d >= r.min);
      maxSlots = found ? found.slots : 2;
    }
  } catch {
    maxSlots = 2;
  }
  if (!maxSlots || isNaN(maxSlots) || maxSlots < 2) {
    maxSlots = 2;
  }
  const nextRule = Array.isArray(CURRENT_RULES) ? CURRENT_RULES.find((r) => r.min > d) : null;

  const activeIds = (S && S.forge && Array.isArray(S.forge.active)) ? S.forge.active : [];
  const archivedIds = (S && S.forge && Array.isArray(S.forge.archived)) ? S.forge.archived : [];
  const activeCount = activeIds.length;
  const fd = L.fDone(S, today());
  const ff = L.fFailed(S, today());

  /* Protocolo Tático de Conduta */
  const tac = TACTICAL_BLOCK_I18N;

  const renderTacticalProtocol = () => (
    <Card className="border-gold/20 bg-surface2/80 p-3.5 w-full min-w-0">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Compass size={14} className="text-gold" />
          <span className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-gold2">
            {tac.title[curLang]}
          </span>
        </div>
        <span className="text-[9.5px] font-mono font-bold text-gold/80 px-2 py-0.5 rounded bg-gold/10 border border-gold/20">
          FORJA ATIVA
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
        <div className="rounded-r border border-danger/30 bg-danger/5 p-2.5">
          <div className="flex items-center gap-1.5 text-danger font-bold text-[10.5px] uppercase tracking-wider mb-1">
            <ShieldAlert size={13} />
            <span>{tac.riskTitle[curLang]}</span>
          </div>
          <p className="text-[11px] text-muted leading-tight">
            {tac.riskDesc[curLang]}
          </p>
        </div>

        <div className="rounded-r border border-gold/30 bg-gold/5 p-2.5">
          <div className="flex items-center gap-1.5 text-gold font-bold text-[10.5px] uppercase tracking-wider mb-1">
            <Target size={13} />
            <span>{tac.goldenRuleTitle[curLang]}</span>
          </div>
          <p className="text-[11px] text-muted leading-tight">
            {tac.goldenRuleDesc[curLang]}
          </p>
        </div>

        <div className="rounded-r border border-ok/30 bg-ok/5 p-2.5">
          <div className="flex items-center gap-1.5 text-ok font-bold text-[10.5px] uppercase tracking-wider mb-1">
            <Flame size={13} />
            <span>{tac.energyTitle[curLang]}</span>
          </div>
          <p className="text-[11px] text-muted leading-tight">
            {tac.energyDesc[curLang]}
          </p>
        </div>
      </div>
    </Card>
  );

  /* Identificar se o hábito é customizado pelo usuário */
  const isCustomHabit = (id) => {
    if (!id || id === 'undefined') return false;
    const num = Number(id);
    if (!isNaN(num) && num >= 1 && num <= 20) return false;
    const customList = (S && S.customHabits) || (S && S.forge && S.forge.custom) || [];
    return customList.some((c) => String(c.id) === String(id)) || (typeof id === 'string' && (id.length > 6 || id.startsWith('cust_')));
  };

  /* Hábitos Ativos */
  const activeHabits = activeIds.map((id) => {
    return ALLH.find((h) => String(h.id) === String(id)) || {
      id,
      n: curLang === 'en' ? `Habit #${id}` : `Hábito #${id}`,
      icon: '⚡',
    };
  });

  /* Hábitos Não-Ativos (Reserva ou Arquivados) */
  const nonActiveHabits = ALLH.filter((h) => !activeIds.some((aid) => String(aid) === String(h.id)));
  const reserveHabits = nonActiveHabits.filter((h) => !archivedIds.some((arid) => String(arid) === String(h.id)));
  const archivedHabits = nonActiveHabits.filter((h) => archivedIds.some((arid) => String(arid) === String(h.id)));

  /* Filtrar reserva por categoria selecionada */
  const filteredReserve = selectedPillar === 'archived'
    ? archivedHabits
    : reserveHabits.filter((h) => {
        if (selectedPillar === 'all') return true;
        return getHabitCategory(h) === selectedPillar;
      });

  /* Hábitos negligenciados */
  const neglected = activeHabits.filter((h) => {
    try {
      const doneDates = (S && S.forge && S.forge.done) || {};
      let daysWithout = 0;
      for (let i = 1; i <= 7; i++) {
        const ds = dstr(new Date(Date.now() - i * 86400000));
        const list = doneDates[ds] || [];
        const found = list.some((x) => String(x) === String(h.id));
        if (!found) {
          daysWithout++;
        } else {
          break;
        }
      }
      return daysWithout >= 2;
    } catch {
      return false;
    }
  });

  /* Ativar / Desativar */
  const toggleActive = (id) => {
    const isAct = activeIds.some((aid) => String(aid) === String(id));
    if (isAct) {
      update((s) => {
        s.forge.active = (s.forge.active || []).filter((x) => String(x) !== String(id));
      });
      AF.click();
      toast(LBL.toastHabitMovedReserve[curLang]);
    } else {
      if (activeCount >= maxSlots && maxSlots < 99) {
        toast(LBL.toastLimitReached[curLang](maxSlots));
        AF.tone(110, 0.35, 'sine', 0.18, 0, 55);
        return;
      }
      update((s) => {
        s.forge.active = s.forge.active || [];
        s.forge.active.push(id);
        // Se estava arquivado, desarquiva
        s.forge.archived = (s.forge.archived || []).filter((x) => String(x) !== String(id));
      });
      AF.click();
      toast(LBL.toastHabitActivated[curLang]);
    }
  };

  /* Arquivar / Desarquivar */
  const toggleArchive = (id) => {
    const isArch = archivedIds.some((arid) => String(arid) === String(id));
    update((s) => {
      s.forge.archived = s.forge.archived || [];
      if (isArch) {
        s.forge.archived = s.forge.archived.filter((x) => String(x) !== String(id));
      } else {
        s.forge.archived.push(id);
        s.forge.active = (s.forge.active || []).filter((x) => String(x) !== String(id));
      }
    });
    AF.click();
    toast(isArch ? LBL.toastHabitRestored[curLang] : LBL.toastHabitArchived[curLang]);
  };

  /* Excluir Hábito Personalizado com Confirmação In-App */
  const deleteCustomHabit = (id) => {
    const habit = (S.customHabits || []).find((h) => String(h.id) === String(id));
    const habitName = habit ? habit.n : '';

    const ConfirmModal = () => (
      <div className="text-center p-1">
        <div className="w-12 h-12 rounded-full border border-danger/40 bg-danger/10 flex items-center justify-center mx-auto mb-3 text-danger">
          <Trash2 size={24} />
        </div>
        <h3 className="font-display text-xl tracking-wide text-danger mb-1.5">
          {curLang === 'en' ? 'DELETE CUSTOM HABIT?' : curLang === 'es' ? '¿ELIMINAR HÁBITO PERSONALIZADO?' : 'EXCLUIR HÁBITO PERSONALIZADO?'}
        </h3>
        <p className="text-xs text-muted leading-relaxed mb-4">
          {LBL.confirmDeleteHabit[curLang]}
          {habitName ? ` ("${habitName}")` : ''}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 py-2 rounded text-xs font-bold font-mono bg-danger text-white hover:bg-danger/90 transition-colors cursor-pointer"
            onClick={() => {
              closeModal();
              update((s) => {
                s.customHabits = (s.customHabits || []).filter((x) => String(x.id) !== String(id));
                s.forge = s.forge || {};
                s.forge.active = (s.forge.active || []).filter((x) => String(x) !== String(id));
                s.forge.archived = (s.forge.archived || []).filter((x) => String(x) !== String(id));
                if (s.forge.times) delete s.forge.times[id];
              });
              AF.click();
              toast(LBL.toastHabitDeleted[curLang]);
            }}
          >
            {curLang === 'en' ? 'Yes, Delete' : curLang === 'es' ? 'Sí, Eliminar' : 'Sim, Excluir'}
          </button>
          <button
            type="button"
            className="btn-dark py-2 px-4 text-xs font-bold font-mono cursor-pointer"
            onClick={closeModal}
          >
            {curLang === 'en' ? 'Cancel' : curLang === 'es' ? 'Cancelar' : 'Cancelar'}
          </button>
        </div>
      </div>
    );
    openModal(<ConfirmModal />);
  };

  /* Modal de Edição de Hábito Personalizado */
  const openEditModal = (h) => {
    const EditH = () => {
      const [name, setName] = useState(h.n || '');
      const [icon, setIcon] = useState(h.icon || '⚡');
      const [time, setTime] = useState((S.forge && S.forge.times && S.forge.times[h.id]) || '');

      return (
        <div className="text-center">
          <h3 className="mb-2 font-display text-2xl tracking-wide text-gold">{LBL.editHabitTitle[curLang]}</h3>
          <p className="mb-4 text-xs text-muted">{LBL.editHabitSub[curLang]}</p>
          <div className="flex flex-col gap-3 text-left">
            <label>
              <span className="lbl">{LBL.habitNameLabel[curLang]}</span>
              <input
                type="text"
                className="field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label>
                <span className="lbl">{LBL.iconLabel[curLang]}</span>
                <input
                  type="text"
                  className="field text-center text-lg"
                  maxLength={4}
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                />
              </label>
              <label>
                <span className="lbl">{LBL.timeLabel[curLang]}</span>
                <input
                  type="time"
                  className="field"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="btn-gold flex-1 py-2 font-bold text-xs"
              onClick={() => {
                if (!name.trim()) return toast(LBL.toastNameRequired[curLang]);
                update((s) => {
                  const target = (s.customHabits || []).find((c) => String(c.id) === String(h.id));
                  if (target) {
                    target.n = name.trim();
                    target.icon = icon || '⚡';
                  }
                  if (time) {
                    s.forge.times = s.forge.times || {};
                    s.forge.times[h.id] = time;
                  }
                });
                closeModal();
                toast(LBL.toastHabitUpdated[curLang]);
              }}
            >
              {LBL.saveChanges[curLang]}
            </button>
            <button
              type="button"
              className="py-2 px-3 rounded border border-danger/40 bg-danger/10 hover:bg-danger/20 text-danger text-xs font-bold font-mono transition-colors flex items-center gap-1 cursor-pointer"
              onClick={() => {
                closeModal();
                deleteCustomHabit(h.id);
              }}
            >
              <Trash2 size={13} />
              <span>{LBL.deleteHabit[curLang]}</span>
            </button>
            <button type="button" className="btn-dark py-2 px-4 text-xs font-bold cursor-pointer" onClick={closeModal}>
              {LBL.cancelBtn[curLang]}
            </button>
          </div>
        </div>
      );
    };
    openModal(<EditH />);
  };

  const toggleDone = (id) => {
    update((s) => {
      const dd = today();
      const a = s.forge.done[dd] = s.forge.done[dd] || [];
      const idx = a.findIndex((x) => String(x) === String(id));
      if (idx >= 0) {
        a.splice(idx, 1);
      } else {
        a.push(id);
        const f = s.forge.failed[dd] = s.forge.failed[dd] || [];
        const fi = f.findIndex((x) => String(x) === String(id));
        if (fi >= 0) f.splice(fi, 1);
      }
    });
    AF.click();
  };

  const toggleFailed = (id) => {
    update((s) => {
      const dd = today();
      const f = s.forge.failed[dd] = s.forge.failed[dd] || [];
      const idx = f.findIndex((x) => String(x) === String(id));
      if (idx >= 0) {
        f.splice(idx, 1);
      } else {
        f.push(id);
        const a = s.forge.done[dd] = s.forge.done[dd] || [];
        const ai = a.findIndex((x) => String(x) === String(id));
        if (ai >= 0) a.splice(ai, 1);
      }
    });
    AF.tone(110, 0.35, 'sine', 0.18, 0, 55);
  };

  const setTime = (id, time) => {
    update((s) => {
      s.forge.times = s.forge.times || {};
      s.forge.times[id] = time;
    });
  };

  const openCreateModal = () => {
    const CreateH = () => {
      const [name, setName] = useState('');
      const [icon, setIcon] = useState('⚡');
      const [time, setTime] = useState('');

      return (
        <div className="text-center">
          <h3 className="mb-2 font-display text-2xl tracking-wide text-gold">{LBL.createNewHabit[curLang]}</h3>
          <p className="mb-4 text-xs text-muted">{LBL.createHabitSub[curLang]}</p>
          <div className="flex flex-col gap-3 text-left">
            <label>
              <span className="lbl">{LBL.habitNameLabel[curLang]}</span>
              <input
                type="text"
                placeholder={LBL.habitNamePlaceholder[curLang]}
                className="field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label>
                <span className="lbl">{LBL.iconLabel[curLang]}</span>
                <input
                  type="text"
                  placeholder="⚡"
                  className="field text-center text-lg"
                  maxLength={4}
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                />
              </label>
              <label>
                <span className="lbl">{LBL.timeOptionalLabel[curLang]}</span>
                <input
                  type="time"
                  className="field"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="btn-gold flex-1 py-2 font-bold text-xs"
              onClick={() => {
                if (!name.trim()) return toast(LBL.toastNameRequired[curLang]);
                const newId = Date.now();
                update((s) => {
                  s.customHabits = s.customHabits || [];
                  s.customHabits.push({ id: newId, n: name.trim(), icon: icon || '⚡' });
                  if (time) {
                    s.forge.times = s.forge.times || {};
                    s.forge.times[newId] = time;
                  }
                });
                closeModal();
                toast(LBL.toastHabitCreated[curLang]);
              }}
            >
              {LBL.createHabitBtn[curLang]}
            </button>
            <button type="button" className="btn-dark py-2 px-4 text-xs font-bold" onClick={closeModal}>
              {LBL.cancelBtn[curLang]}
            </button>
          </div>
        </div>
      );
    };
    openModal(<CreateH />);
  };

  const renderLast7Days = (habitId) => {
    const days = [];
    const doneMap = (S && S.forge && S.forge.done) || {};
    const failMap = (S && S.forge && S.forge.failed) || {};

    for (let i = 6; i >= 0; i--) {
      const ds = dstr(new Date(Date.now() - i * 86400000));
      const listDone = doneMap[ds] || [];
      const listFail = failMap[ds] || [];
      const isD = listDone.some((x) => String(x) === String(habitId));
      const isF = listFail.some((x) => String(x) === String(habitId));
      days.push({ ds, isD, isF, label: fmtD(ds) });
    }

    return (
      <div className="flex items-center justify-between gap-1 mt-2 p-2 rounded bg-surface border border-line">
        {days.map((dItem, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <span className="text-[8.5px] font-mono text-muted">{dItem.label}</span>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                dItem.isD
                  ? 'border-gold bg-gold text-[#141414]'
                  : dItem.isF
                  ? 'border-danger bg-danger text-white'
                  : 'border-line/60 bg-surface2 text-muted'
              }`}
            >
              {dItem.isD ? '✓' : dItem.isF ? '✕' : '·'}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3.5 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* NAVEGAÇÃO DA FORJA: 2 SUB-ABAS ESSENCIAIS + ACESSO RÁPIDO ÀS ARMADURAS E REGRAS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 w-full max-w-full min-w-0 select-none">
        {/* 2 Sub-Abas Principais */}
        <div className="flex-1 p-1 rounded-xl bg-surface2/80 border border-line/80 flex items-center gap-1.5">
          {FORGE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  AF.click();
                  setActiveCategory(cat.id);
                }}
                className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all truncate select-none cursor-pointer ${
                  isSelected
                    ? 'bg-gold text-[#141414] shadow-sm font-black'
                    : 'text-muted hover:text-ink hover:bg-surface/50'
                }`}
              >
                <Icon size={14} className="flex-none" />
                <span className="truncate">
                  {cat.id === 'active'
                    ? (curLang === 'en' ? 'Active Protocol' : curLang === 'es' ? 'Protocolo Activo' : 'Protocolo Ativo')
                    : (curLang === 'en' ? 'Reserve & Arsenal' : curLang === 'es' ? 'Reserva y Arsenal' : 'Reserva & Arsenal')}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold flex-none ${
                  isSelected ? 'bg-black/20 text-black' : 'bg-surface text-gold border border-line/50'
                }`}>
                  {cat.id === 'active'
                    ? `${activeCount}/${maxSlots >= 99 ? '∞' : maxSlots}`
                    : reserveHabits.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Acesso Rápido Rústico Medieval: Armaduras & Regras */}
        <div className="flex items-center gap-1.5 flex-none">
          <button
            type="button"
            onClick={() => {
              AF.seal();
              setShowEvolutionGallery(true);
            }}
            title={curLang === 'en' ? 'View 11 Medieval Armors' : curLang === 'es' ? 'Ver 11 Armaduras Medievales' : 'Ver 11 Armaduras Medievais'}
            className="flex-1 sm:flex-none py-2 px-3 rounded-xl border border-amber-500/40 bg-amber-950/25 hover:bg-amber-950/45 hover:border-amber-400 text-amber-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Shield size={13} className="text-amber-400 flex-none" />
            <span className="truncate">{curLang === 'en' ? '11 Armors' : curLang === 'es' ? '11 Armaduras' : '11 Armaduras'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              AF.click();
              setShowRulesTable(true);
            }}
            title={curLang === 'en' ? 'Forge Rules & Combat Slots' : curLang === 'es' ? 'Reglas de la Forja y Slots' : 'Regras da Forja & Slots'}
            className="flex-1 sm:flex-none py-2 px-3 rounded-xl border border-line bg-surface2/90 hover:border-gold/50 text-muted hover:text-gold text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Compass size={13} className="text-gold flex-none" />
            <span className="truncate">{curLang === 'en' ? 'Rules & Slots' : curLang === 'es' ? 'Reglas & Slots' : 'Regras & Slots'}</span>
          </button>
        </div>
      </div>

      {/* 1. PROTOCOLO ATIVO */}
      {activeCategory === 'active' && (
        <div id="tour-forge-habits" className="flex flex-col gap-3.5 w-full max-w-full min-w-0 overflow-hidden">
          {/* TOPO COMPACTO: Status de Slots e Ação de Criar Hábito */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 sm:p-3.5 rounded-xl border border-gold/30 bg-gradient-to-r from-[#17151F] via-[#121218] to-[#17151F] shadow-sm select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/15 border border-gold/35 text-gold flex-none">
                <Flame size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-black text-xs sm:text-sm text-[#F5EEDC] tracking-wide uppercase">
                    {curLang === 'en' ? 'ACTIVE FORGE SLOTS' : curLang === 'es' ? 'SLOTS ACTIVOS DE LA FORJA' : 'SLOTS ATIVOS DA FORJA'}
                  </span>
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-gold/15 border border-gold/40 text-gold">
                    {activeCount}/{maxSlots >= 99 ? '∞' : maxSlots} {curLang === 'en' ? 'ACTIVE' : curLang === 'es' ? 'ACTIVOS' : 'ATIVOS'}
                  </span>
                </div>
                <span className="text-[10.5px] text-muted font-mono truncate mt-0.5">
                  {curTier ? `${curTier.name} · ${maxSlots >= 99 ? (curLang === 'en' ? 'Unlimited slots unlocked' : curLang === 'es' ? 'Slots ilimitados desbloqueados' : 'Slots ilimitados liberados') : `${maxSlots} ${curLang === 'en' ? 'slots unlocked' : curLang === 'es' ? 'slots desbloqueados' : 'slots liberados'}`}` : ''}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="btn-gold py-1.5 px-3 sm:px-4 text-xs font-black flex items-center justify-center gap-1.5 rounded-lg shadow-[0_0_12px_rgba(255,200,70,0.2)] active:scale-95 cursor-pointer self-start sm:self-auto flex-none"
            >
              <Plus size={14} strokeWidth={3} className="text-[#141414]" />
              <span>{LBL.createHabit[curLang]}</span>
            </button>
          </div>

          {/* 2. ALERTA DE NEGLIGÊNCIA COMPACTO */}
          {neglected.length > 0 && (
            <Card className="border-danger/40 bg-danger/5 p-3 sm:p-3.5 w-full max-w-full min-w-0 overflow-hidden">
              <div className="flex items-center gap-1.5 mb-2 text-danger font-bold text-xs uppercase tracking-wider min-w-0">
                <AlertTriangle size={14} className="flex-none" />
                <span className="truncate">{LBL.negligenceAlert[curLang]}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full min-w-0">
                {neglected.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg border border-danger/30 bg-surface2 text-xs w-full min-w-0 overflow-hidden"
                  >
                    <span className="flex items-center gap-1.5 truncate font-semibold min-w-0 flex-1">
                      <span className="flex-none">{h.icon}</span>
                      <span className="truncate">{h.n}</span>
                    </span>
                    <span className="flex-none font-mono text-[10px] sm:text-[10.5px] font-bold text-danger whitespace-nowrap pl-1">
                      {LBL.daysWithoutDoing[curLang]}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10.5px] text-muted leading-tight">
                {LBL.negligenceQuote[curLang]}
              </p>
            </Card>
          )}

          {/* 3. ATIVOS NO PROTOCOLO */}
          <div className="w-full max-w-full min-w-0">
            <div className="flex items-center justify-between mb-2">
              <K className="mb-0">{LBL.activeInProtocolTitle[curLang]} ({activeCount}/{maxSlots >= 99 ? '∞' : maxSlots} {LBL.slotsWord[curLang]})</K>
            </div>

            {activeHabits.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 w-full max-w-full min-w-0">
                {activeHabits.map((h) => {
                  const isDone = fd.some((x) => String(x) === String(h.id));
                  const isFail = ff.some((x) => String(x) === String(h.id));
                  const tm = (L.hTime && L.hTime(S, h.id)) || (S.forge && S.forge.times && S.forge.times[h.id]) || '';
                  const isDetailsOpen = openDetailsId === h.id;
                  const benefitText = getHabitBenefitText(h, lang);
                  const isCustom = isCustomHabit(h.id);

                  return (
                    <Card
                      key={h.id}
                      className={`p-2.5 sm:p-3 transition-all border w-full max-w-full min-w-0 rounded-xl select-none ${
                        isDone
                          ? 'border-gold/60 bg-gradient-to-r from-gold/15 via-[#181622] to-[#131219] shadow-[0_2px_12px_rgba(255,200,70,0.12)]'
                          : isFail
                          ? 'border-danger/50 bg-danger/10'
                          : 'border-line/80 bg-[#16151D] hover:border-gold/40'
                      }`}
                    >
                      {/* Linha Principal: Ícone + Título/Horário + Ações Táteis */}
                      <div className="flex items-center justify-between gap-2.5 min-w-0 w-full">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className={`grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-lg border text-lg flex-none transition-all ${
                            isDone
                              ? 'border-gold bg-gold/20 text-gold shadow-sm'
                              : isFail
                              ? 'border-danger/40 bg-danger/15 text-danger'
                              : 'border-[#3c3c46] bg-[#1D1B26] text-ink'
                          }`}>
                            {h.icon}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className={`text-xs sm:text-[13px] font-bold block truncate leading-tight ${
                                isDone ? 'text-gold' : isFail ? 'line-through text-danger' : 'text-[#F5EEDC]'
                              }`}>
                                {h.n}
                              </span>
                              {isCustom && (
                                <div className="flex items-center gap-0.5 flex-none">
                                  <button
                                    type="button"
                                    title={LBL.editHabit[curLang]}
                                    onClick={() => openEditModal(h)}
                                    className="text-muted hover:text-gold p-0.5"
                                  >
                                    <Edit3 size={11} />
                                  </button>
                                  <button
                                    type="button"
                                    title={LBL.deleteHabit[curLang]}
                                    onClick={() => deleteCustomHabit(h.id)}
                                    className="text-muted hover:text-danger p-0.5"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 mt-0.5 text-[9.5px] font-mono text-muted truncate">
                              <div className="flex items-center gap-1 bg-surface px-1.5 py-0.2 rounded border border-line/60 flex-none">
                                <Clock size={10} className="text-gold flex-none" />
                                <input
                                  type="time"
                                  value={tm}
                                  onChange={(e) => setTime(h.id, e.target.value)}
                                  className="bg-transparent text-ink focus:outline-none w-[42px] sm:w-[48px] text-center"
                                />
                              </div>
                              {isCustom && (
                                <span className="text-gold/90 font-semibold truncate flex-none">
                                  {LBL.customStar[curLang]}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Ações Rápidas: Mover Reserva, Falhar e Botão Concluir */}
                        <div className="flex items-center gap-1 sm:gap-1.5 flex-none">
                          <button
                            type="button"
                            title={LBL.moveToReserve[curLang]}
                            onClick={() => toggleActive(h.id)}
                            className="text-muted/60 hover:text-gold p-1.5 rounded hover:bg-surface2 transition-colors flex-none"
                          >
                            <Archive size={14} />
                          </button>

                          {!isDone && (
                            <button
                              type="button"
                              title={LBL.failBtn[curLang]}
                              onClick={() => toggleFailed(h.id)}
                              className={`grid h-8 w-8 place-items-center rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                isFail
                                  ? 'border-danger bg-danger text-white shadow-sm'
                                  : 'border-[#3c3c46] bg-surface text-muted/60 hover:border-danger hover:text-danger'
                              }`}
                            >
                              <X size={13} strokeWidth={2.5} />
                            </button>
                          )}

                          <button
                            type="button"
                            title={isDone ? LBL.undoCompletion[curLang] : LBL.toCompleteBtn[curLang]}
                            onClick={() => toggleDone(h.id)}
                            className={`grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-lg border text-xs font-bold transition-all duration-150 cursor-pointer active:scale-90 select-none ${
                              isDone
                                ? 'border-gold bg-gold text-[#141414] shadow-[0_0_12px_rgba(255,200,70,0.35)] font-black'
                                : 'border-[#3c3c46] bg-surface text-muted/60 hover:border-gold hover:text-gold'
                            }`}
                          >
                            <Check size={16} strokeWidth={isDone ? 3 : 2} />
                          </button>
                        </div>
                      </div>

                      {/* Linha Expansível Discreta: Detalhes & Histórico 7D */}
                      <div className="mt-2 pt-1.5 border-t border-line/40 w-full min-w-0">
                        <button
                          type="button"
                          onClick={() => setOpenDetailsId(isDetailsOpen ? null : h.id)}
                          className="text-[10px] text-muted hover:text-gold flex items-center justify-between w-full font-mono py-0.5 select-none cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck size={11} className="text-gold" />
                            <span className="font-semibold">{isDetailsOpen ? LBL.hideDetails[curLang] : LBL.viewDetails[curLang]}</span>
                          </span>
                          {isDetailsOpen ? <ChevronUp size={12} className="text-gold" /> : <ChevronDown size={12} className="text-muted" />}
                        </button>

                        {isDetailsOpen && (
                          <div className="mt-2 flex flex-col gap-2 pt-1 border-t border-line/30">
                            <div>
                              <span className="text-[9px] font-mono text-muted uppercase font-bold block mb-1">
                                {LBL.viewHistory[curLang]}
                              </span>
                              {renderLast7Days(h.id)}
                            </div>

                            {benefitText && (
                              <div className="text-[11px] text-[#EDE5D5] bg-surface/90 p-2 rounded-lg border border-gold/30 leading-relaxed shadow-sm">
                                <p className="flex items-start gap-1.5">
                                  <Sparkles size={12} className="text-gold flex-none mt-0.5" />
                                  <span>{benefitText}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}

                {/* CARD DE SLOT DISPONÍVEL */}
                {activeCount < maxSlots && (
                  <div
                    onClick={() => setActiveCategory('reserve')}
                    className="cursor-pointer border-2 border-dashed border-gold/30 hover:border-gold/60 bg-gold/5 hover:bg-gold/10 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all min-h-[145px] group w-full min-w-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/35 text-gold flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                      <Plus size={20} strokeWidth={2.5} />
                    </div>
                    <b className="text-xs text-gold font-bold uppercase tracking-wider block">
                      {LBL.availableSlot[curLang]} ({activeCount + 1}/{maxSlots >= 99 ? '∞' : maxSlots})
                    </b>
                    <span className="text-[11px] text-muted mt-1">
                      {LBL.tapToActivate[curLang]}
                    </span>
                  </div>
                )}

                {/* CARD DE PRÓXIMO PATAMAR */}
                {activeCount >= maxSlots && activeHabits.length % 2 === 1 && (
                  <div className="border border-line/70 bg-surface2/70 rounded-lg p-4 flex flex-col justify-between min-h-[145px] w-full min-w-0">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10.5px] font-mono font-bold uppercase text-gold2 tracking-wider flex items-center gap-1.5">
                          <ShieldCheck size={13} className="text-gold" /> {LBL.nextUnlock[curLang]}
                        </span>
                        <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-surface border border-line text-muted">{LBL.slotsFull[curLang]}</span>
                      </div>
                      <p className="text-xs text-ink font-semibold mt-1">
                        {nextRule ? LBL.nextUnlockDesc[curLang](nextRule.min, nextRule.slots) : LBL.supremeRankReached[curLang]}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-line/60 flex items-center justify-between text-[11px] text-muted">
                      <span>{LBL.slotsInUse[curLang]} <b className="text-gold font-mono">{activeCount}/{maxSlots >= 99 ? '∞' : maxSlots}</b></span>
                      <button
                        type="button"
                        onClick={() => setActiveCategory('reserve')}
                        className="text-gold hover:underline text-[11px] font-semibold"
                      >
                        {LBL.viewReserve[curLang]}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card className="text-center py-6 w-full min-w-0">
                <Empty>{LBL.noActiveHabits[curLang]}</Empty>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setActiveCategory('reserve')}
                    className="btn-gold py-1.5 px-4 text-xs font-bold"
                  >
                    {LBL.exploreReserve[curLang]}
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* 2. RESERVA DA FORJA COM FILTROS DE CATEGORIA */}
      {activeCategory === 'reserve' && (
        <div id="reserva-forja-section" className="flex flex-col gap-3.5 w-full max-w-full min-w-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0 w-full">
            <div className="flex items-center gap-2">
              <K className="mb-0">📦 {LBL.forgeReserveTitle[curLang]} ({filteredReserve.length} {LBL.availableWord[curLang]})</K>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="btn-gold py-1.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 self-start sm:self-auto"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>{LBL.createHabit[curLang]}</span>
            </button>
          </div>

          {/* Filtros por Categorias + Aba Arquivados com Scroll Horizontal Suave no Mobile */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 w-full max-w-full min-w-0">
            {[
              { id: 'all', label: PIL.all[curLang] },
              { id: 'body', label: PIL.body[curLang] },
              { id: 'mind', label: PIL.mind[curLang] },
              { id: 'mission', label: PIL.mission[curLang] },
              { id: 'spirit', label: PIL.spirit[curLang] },
              { id: 'archived', label: PIL.archived[curLang] },
            ].map((p) => {
              const count = p.id === 'all'
                ? reserveHabits.length
                : p.id === 'archived'
                ? archivedHabits.length
                : reserveHabits.filter((h) => getHabitCategory(h) === p.id).length;
              const isSelected = selectedPillar === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPillar(p.id)}
                  className={`shrink-0 text-[10.5px] font-mono px-2.5 py-1 rounded transition-all flex items-center gap-1 whitespace-nowrap ${
                    isSelected
                      ? 'bg-gold text-[#141414] font-bold shadow-sm'
                      : 'bg-surface2 text-muted hover:text-ink border border-line'
                  }`}
                >
                  <span>{p.label}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded ${isSelected ? 'bg-black/20 text-black' : 'bg-surface text-muted'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Banner Informativo quando todos os slots estiverem preenchidos */}
          {activeCount >= maxSlots && maxSlots < 99 && (
            <div className="rounded-lg border border-amber-500/35 bg-amber-500/10 p-2.5 flex items-center gap-2.5 text-xs text-amber-300">
              <Lock size={15} className="text-amber-400 shrink-0" />
              <span className="text-[11px] leading-snug">
                {LBL.reserveSlotsFullNotice[curLang](maxSlots)}
              </span>
            </div>
          )}

          {/* Grade de 3 Colunas na Reserva */}
          {filteredReserve.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full max-w-full min-w-0">
              {filteredReserve.map((h) => {
                const isBenefitOpen = openBenefitId === h.id;
                const benefitText = getHabitBenefitText(h, lang);
                const isCustom = isCustomHabit(h.id);
                const isArchived = archivedIds.some((arid) => String(arid) === String(h.id));

                return (
                  <div
                    key={h.id}
                    className={`p-2.5 rounded-lg border transition-colors flex flex-col justify-between w-full min-w-0 overflow-hidden ${
                      isArchived
                        ? 'border-line/40 bg-surface/50 opacity-70'
                        : 'border-line bg-surface2/70 hover:border-gold/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-lg flex-none">{h.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs font-bold text-ink truncate">
                              {h.n}
                            </span>
                            {/* Botão de Editar/Excluir se for customizado na reserva */}
                            {isCustom && (
                              <div className="flex items-center gap-1 flex-none">
                                <button
                                  type="button"
                                  title={LBL.editHabit[curLang]}
                                  onClick={() => openEditModal(h)}
                                  className="text-muted hover:text-gold p-0.5"
                                >
                                  <Edit3 size={11} />
                                </button>
                                <button
                                  type="button"
                                  title={LBL.deleteHabit[curLang]}
                                  onClick={() => deleteCustomHabit(h.id)}
                                  className="text-muted hover:text-danger p-0.5"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            )}
                          </div>
                          {isCustom && (
                            <span className="text-[8.5px] uppercase font-mono text-gold/80 block truncate">
                              {LBL.customHabitLabel[curLang]}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-none pl-1">
                        {/* Botão Arquivar / Desarquivar */}
                        <button
                          type="button"
                          title={isArchived ? LBL.unarchiveHabit[curLang] : LBL.archiveHabit[curLang]}
                          onClick={() => toggleArchive(h.id)}
                          className="text-muted/70 hover:text-gold p-1 rounded hover:bg-surface"
                        >
                          {isArchived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
                        </button>

                        {/* Botão Ativar */}
                        {!isArchived && (
                          <button
                            type="button"
                            disabled={activeCount >= maxSlots && maxSlots < 99}
                            title={activeCount >= maxSlots && maxSlots < 99 ? LBL.slotsFullTooltip[curLang](maxSlots) : LBL.activateInProtocol[curLang]}
                            onClick={() => toggleActive(h.id)}
                            className={`flex-none text-[10px] font-mono px-2 py-0.5 rounded border transition-colors font-bold ${
                              activeCount >= maxSlots && maxSlots < 99
                                ? 'border-line/40 bg-surface/40 text-muted/50 cursor-not-allowed opacity-60'
                                : 'border-line bg-surface text-muted hover:border-gold hover:text-gold cursor-pointer'
                            }`}
                          >
                            {activeCount >= maxSlots && maxSlots < 99 ? (
                              <span className="flex items-center gap-1">
                                <Lock size={9} /> {LBL.slotsFullBtn[curLang]}
                              </span>
                            ) : (
                              LBL.activateBtn[curLang]
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Botão Expansível de Benefício na Reserva */}
                    <div className="mt-1.5 pt-1 border-t border-line/30 w-full min-w-0">
                      <button
                        type="button"
                        onClick={() => setOpenBenefitId(isBenefitOpen ? null : h.id)}
                        className="text-[9.5px] text-muted hover:text-gold flex items-center justify-between w-full font-mono py-0.5"
                      >
                        <span className="flex items-center gap-1 truncate">
                          <ShieldCheck size={10} className="text-gold flex-none" />
                          <span className="truncate">{isBenefitOpen ? LBL.hideBenefit[curLang] : LBL.viewBenefit[curLang]}</span>
                        </span>
                        {isBenefitOpen ? <ChevronUp size={10} className="flex-none" /> : <ChevronDown size={10} className="flex-none" />}
                      </button>
                      {isBenefitOpen && (
                        <div className="mt-1 text-[10px] text-muted bg-surface p-2 rounded-lg border border-line leading-snug">
                          {benefitText}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center bg-surface2/30 rounded-lg border border-line/40 w-full min-w-0">
              <p className="text-xs text-muted">
                {selectedPillar === 'archived' ? LBL.noArchivedHabits[curLang] : LBL.noHabitsCategory[curLang]}
              </p>
            </div>
          )}
        </div>
      )}

      {/* MODAL SAGRADO DAS 11 ARMADURAS MEDIEVAIS & EFEITOS */}
      {showEvolutionGallery && (
        <WarriorEvolutionGalleryModal
          tiers={CURRENT_TIERS}
          currentTier={curTier}
          currentDays={d}
          lang={curLang}
          onClose={() => setShowEvolutionGallery(false)}
          onTestLevelUp={(tier) => {
            setShowEvolutionGallery(false);
            setLevelUpModalTier(tier);
          }}
        />
      )}

      {/* MODAL MEDIEVAL RÚSTICO: REGRAS DA FORJA & SLOTS */}
      {showRulesTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-gradient-to-b from-[#18141F] via-[#121118] to-[#0D0C12] border-2 border-gold/40 shadow-[0_16px_50px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-gold/30 bg-[#1A1722]/90 flex-none">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/15 border border-gold/40 text-gold flex-none">
                  <Compass size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-display font-black text-[#F5EEDC] tracking-wide uppercase truncate">
                    {curLang === 'en' ? 'FORGE RULES & COMBAT SLOTS' : curLang === 'es' ? 'REGLAS DE LA FORJA Y SLOTS' : 'REGRAS DA FORJA & SLOTS DE COMBATE'}
                  </h3>
                  <p className="text-[10.5px] text-muted font-mono truncate">
                    {curLang === 'en' ? 'Retention days unlock new slots and discipline rules.' : curLang === 'es' ? 'Los días de retención desbloquean nuevos slots y disciplina.' : 'Dias limpos destravam novos slots e fortalecem sua disciplina.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRulesTable(false)}
                className="text-muted hover:text-gold p-1.5 rounded-lg hover:bg-surface2 transition-colors cursor-pointer flex-none ml-2"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Scrollable */}
            <div className="p-3.5 sm:p-4 overflow-y-auto space-y-3.5">
              {/* Tabela de Desbloqueio */}
              <div className="rounded-xl border border-gold/30 bg-surface2/60 p-3 sm:p-3.5">
                <div className="flex items-center justify-between mb-2.5 flex-wrap gap-1.5">
                  <span className="font-display font-bold text-xs text-gold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-gold" />
                    {LBL.tierUnlockSlotsTitle[curLang]}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/15 border border-gold/35 text-gold font-bold">
                    {activeCount}/{maxSlots >= 99 ? '∞' : maxSlots} {LBL.activeSlotsBadge[curLang]}
                  </span>
                </div>
                <p className="text-[11.5px] text-muted mb-3 leading-relaxed">
                  {LBL.rulesDesc[curLang]}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CURRENT_RULES && CURRENT_RULES.map((r, i) => {
                    const isCur = d >= r.min && (i === CURRENT_RULES.length - 1 || d < CURRENT_RULES[i + 1].min);
                    const isUnlocked = d >= r.min;
                    return (
                      <div
                        key={r.min}
                        className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                          isCur
                            ? 'border-gold bg-gold/15 shadow-[0_0_12px_rgba(255,200,70,0.2)]'
                            : isUnlocked
                            ? 'border-line bg-surface2/80'
                            : 'border-line/40 bg-surface/30 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base flex-none">{r.icon || '🎖️'}</span>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-ink truncate">
                              {r.name || (curLang === 'en' ? `Level ${i + 1}` : curLang === 'es' ? `Nivel ${i + 1}` : `Nível ${i + 1}`)}
                            </span>
                            <span className="text-[10px] font-mono text-muted">
                              {r.min}+ {LBL.daysWord[curLang]} → <b className="text-gold">{r.slots >= 99 ? LBL.unlimitedWord[curLang] : `${r.slots} ${r.slots === 1 ? LBL.habitWord[curLang] : LBL.habitsWord[curLang]}`}</b>
                            </span>
                          </div>
                        </div>
                        {isCur ? (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-gold text-[#141414] flex-none">
                            {LBL.currentBadge[curLang]}
                          </span>
                        ) : isUnlocked ? (
                          <span className="text-[9px] font-mono text-gold font-semibold flex-none">{LBL.unlockedBadge[curLang]}</span>
                        ) : (
                          <span className="text-[9px] font-mono text-muted flex-none">{LBL.lockedBadge[curLang]}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Protocolo Tático de Conduta */}
              {renderTacticalProtocol()}

              {/* Hábitos Arquivados */}
              {archivedHabits.length > 0 && (
                <div className="rounded-xl border border-line bg-surface2/60 p-3 sm:p-3.5">
                  <span className="font-display font-bold text-xs text-[#EDE5D5] uppercase tracking-wider block mb-2.5">
                    📦 {LBL.archivedHabitsTitle[curLang]} ({archivedHabits.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {archivedHabits.map((h) => (
                      <div
                        key={h.id}
                        className="p-2 rounded-lg border border-line/60 bg-surface2 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-base flex-none">{h.icon}</span>
                          <span className="text-xs font-semibold text-ink truncate">{h.n}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleArchive(h.id)}
                          className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border border-line bg-surface hover:border-gold hover:text-gold text-muted transition-colors font-bold flex-none cursor-pointer"
                        >
                          <ArchiveRestore size={11} />
                          <span>{LBL.unarchiveHabit[curLang]}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-line/60 bg-[#121118] flex justify-end flex-none">
              <button
                type="button"
                onClick={() => setShowRulesTable(false)}
                className="py-1.5 px-4 rounded-lg bg-surface border border-line hover:border-gold/50 text-xs font-mono font-bold text-muted hover:text-gold transition-colors cursor-pointer"
              >
                {curLang === 'en' ? 'Close Rules' : curLang === 'es' ? 'Cerrar Reglas' : 'Fechar Regras'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CELEBRAÇÃO / ANIMAÇÃO DE NÍVEL */}
      {levelUpModalTier && (
        <WarriorLevelUpModal
          tier={levelUpModalTier}
          currentDays={d}
          lang={curLang}
          onClose={() => setLevelUpModalTier(null)}
        />
      )}
    </div>
  );
}
