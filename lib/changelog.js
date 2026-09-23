// lib/changelog.js
// Registro de Decretos da Forja (Notas de Atualização & Versionamento Multilíngue)

export const CURRENT_APP_VERSION = 'v1.4.4';
export const LAST_SEEN_VERSION_KEY = 'fg_last_seen_version';

export const CHANGELOG_I18N = {
  headerTitle: {
    pt: 'DECRETOS DA FORJA',
    en: 'FORGE DECREES',
    es: 'DECRETOS DE LA FORJA',
  },
  headerSub: {
    pt: 'Suas conquistas e dias permanecem 100% intactos. Veja as melhorias ativas:',
    en: 'Your achievements and streak days remain 100% intact. See active upgrades:',
    es: 'Tus conquistas y días de racha permanecen 100% intactos. Mira las mejoras activas:',
  },
  latestBadge: {
    pt: 'NOVA ATUALIZAÇÃO',
    en: 'NEW UPDATE',
    es: 'NUEVA ACTUALIZACIÓN',
  },
  stabilityBadge: {
    pt: 'ESTABILIDADE',
    en: 'STABILITY',
    es: 'ESTABILIDAD',
  },
  seePrevious: {
    pt: 'Ver Decretos Anteriores',
    en: 'View Previous Decrees',
    es: 'Ver Decretos Anteriores',
  },
  hidePrevious: {
    pt: 'Ocultar Decretos Anteriores',
    en: 'Hide Previous Decrees',
    es: 'Ocultar Decretos Anteriores',
  },
  btnConfirm: {
    pt: 'ENTENDIDO, VOLTAR À BATALHA',
    en: 'UNDERSTOOD, RETURN TO BATTLE',
    es: 'ENTENDIDO, VOLVER A LA BATALLA',
  },
};

export const CHANGELOG_RELEASES = [
  {
    version: 'v1.4.4',
    date: {
      pt: '23 de Setembro, 2026',
      en: 'September 23, 2026',
      es: '23 de Septiembre, 2026',
    },
    title: {
      pt: 'Notificações de Horário Fora e Dentro do App · Tarefas, Projetos & Hábitos com Alerta Tático Duplo',
      en: 'Scheduled Time Notifications Outside & Inside App · Tasks, Projects & Habits with Dual Tactical Alert',
      es: 'Notificaciones de Horario Fuera y Dentro de la App · Tareas, Proyectos y Hábitos con Alerta Táctica Doble',
    },
    badge: 'latest',
    isLatest: true,
    highlights: [
      {
        icon: '🎯',
        title: {
          pt: 'Tarefas e Operações com Horário',
          en: 'Tasks and Operations with Scheduled Time',
          es: 'Tareas y Operaciones con Horario Programado',
        },
        desc: {
          pt: 'Ao agendar o horário de uma operação tática, você recebe notificação na tela do celular/PC e alerta sonoro + banner visual dentro do app no minuto exato.',
          en: 'When scheduling a tactical operation time, you receive a notification on mobile/PC plus an in-app audio chime and visual banner at the exact minute.',
          es: 'Al programar la hora de una operación táctica, recibes una notificación en tu móvil/PC y un acorde sonoro + banner dentro de la app al minuto exacto.',
        },
      },
      {
        icon: '⏰',
        title: {
          pt: 'Horários dos Hábitos da Forja',
          en: 'Forge Habit Times & Discipline Alarms',
          es: 'Horarios de los Hábitos de la Forja',
        },
        desc: {
          pt: 'Cada hábito ativo com horário cadastrado dispara o alerta duplo de execução para você não quebrar sua rotina matinal ou noturna.',
          en: 'Each active habit with a set time triggers the dual execution alert so you never break your morning or evening routine.',
          es: 'Cada hábito activo con horario registrado activa la alerta doble de ejecución para no romper tu rutina matutina o nocturna.',
        },
      },
      {
        icon: '🏛️',
        title: {
          pt: 'Projetos: Janela de Foco & Prazo Final',
          en: 'Projects: Focus Window & Deadline Alarms',
          es: 'Proyectos: Ventana de Enfoque y Plazo Final',
        },
        desc: {
          pt: 'Lembretes automáticos no início do seu bloco de foco diário e alerta matinal no dia de encerramento do projeto.',
          en: 'Automatic reminders at the start of your daily focus block and morning notice on the day of project deadline.',
          es: 'Recordatorios automáticos al inicio de tu bloque de enfoque diario y aviso matutino en el día del plazo final.',
        },
      },
      {
        icon: '⚙️',
        title: {
          pt: 'Controle Total & Teste em Configurações',
          en: 'Full Control & Test in Settings',
          es: 'Control Total y Prueba en Ajustes',
        },
        desc: {
          pt: 'Em Configurações > Notificações, gerencie individualmente hábitos, tarefas, projetos e som tático, com botão para testar os alertas na hora.',
          en: 'In Settings > Notifications, individually manage habits, tasks, projects, and tactical sound, with a one-click button to test alerts instantly.',
          es: 'En Ajustes > Notificaciones, gestiona individualmente hábitos, tareas, proyectos y sonido táctico, con un botón para probar alertas al instante.',
        },
      },
    ],
  },
  {
    version: 'v1.4.3',
    date: {
      pt: '23 de Setembro, 2026',
      en: 'September 23, 2026',
      es: '23 de Septiembre, 2026',
    },
    title: {
      pt: 'Tradução Completa dos Relatórios de Guerra · Notificações 100% In-App · Botão de Fechar Único',
      en: 'Complete Combat Reports Localization · 100% In-App Notifications · Single Close Button',
      es: 'Traducción Completa de Informes de Guerra · Notificaciones 100% In-App · Botón de Cierre Único',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🌐',
        title: {
          pt: 'Sub-abas de Relatórios em 3 Idiomas',
          en: 'Report Sub-tabs in 3 Languages',
          es: 'Subpestañas de Informes en 3 Idiomas',
        },
        desc: {
          pt: 'As abas Geral & Consistência, Linha do Tempo, Risco & S.O.S e Salão da Fama & Honra agora se adaptam perfeitamente ao Português, Inglês e Espanhol.',
          en: 'General & Consistency, Timeline, Risk & S.O.S, and Hall of Fame & Honor sub-tabs now switch seamlessly across Portuguese, English, and Spanish.',
          es: 'Las subpestañas General y Consistencia, Línea de Tiempo, Riesgo y S.O.S y Salón de la Fama y Honor ahora se adaptan al Portugués, Inglés y Español.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Notificações Estritamente Internas (In-App)',
          en: 'Strictly In-App Notifications',
          es: 'Notificaciones Estrictamente Internas (In-App)',
        },
        desc: {
          pt: 'Privacidade e sigilo total: nenhum aviso é enviado para fora do aplicativo na tela do celular ou do PC. Todas as novidades ficam restritas à navegação interna.',
          en: 'Total privacy and discretion: no alerts are sent outside the app to the mobile lockscreen or PC desktop. Everything stays strictly inside the app.',
          es: 'Privacidad y sigilo total: ningún aviso se envía fuera de la aplicación a la pantalla del celular o PC. Todas las novedades quedan dentro de la navegación interna.',
        },
      },
      {
        icon: '✨',
        title: {
          pt: 'Botão de Fechar Único e Polido',
          en: 'Single & Clean Close Button',
          es: 'Botón de Cierre Único y Limpio',
        },
        desc: {
          pt: 'Eliminado o duplo "X" de fechamento nos modais, proporcionando uma experiência visual limpa e elegante.',
          en: 'Eliminated the duplicate "X" close buttons on modals, providing a clean and polished visual experience.',
          es: 'Eliminado el doble "X" de cierre en los modales, brindando una experiencia visual limpia y elegante.',
        },
      },
    ],
  },
  {
    version: 'v1.4.2',
    date: {
      pt: '23 de Setembro, 2026',
      en: 'September 23, 2026',
      es: '23 de Septiembre, 2026',
    },
    title: {
      pt: 'Cronômetro de Precisão Real · Blindagem Anti-Burla · Retenção Seminal Oficial',
      en: 'Real Precision Stopwatch · Anti-Cheat Shield · Official Semen Retention',
      es: 'Cronómetro de Precisión Real · Blindaje Anti-Trampas · Retención Seminal Oficial',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⏱️',
        title: {
          pt: 'Cronômetro de Precisão Contínua no QG',
          en: 'Continuous Precision Stopwatch in HQ',
          es: 'Cronómetro de Precisión Continua en el QG',
        },
        desc: {
          pt: 'Exibição completa de dias, horas, minutos e segundos em tempo real no pedestal do guerreiro (ex: 4d 15h:48m:06s). Cada segundo de vigília é honrado.',
          en: 'Complete real-time display of days, hours, minutes, and seconds on the warrior pedestal (e.g. 4d 15h:48m:06s). Every second of vigilance is honored.',
          es: 'Visualización completa de días, horas, minutos y segundos en tiempo real en el pedestal del guerrero (ej: 4d 15h:48m:06s). Cada segundo de vigilia es honrado.',
        },
      },
      {
        icon: '🔥',
        title: {
          pt: 'Retenção Seminal & Transmutação',
          en: 'Semen Retention & Transmutation',
          es: 'Retención Seminal y Transmutación',
        },
        desc: {
          pt: 'Terminologia unificada para Retenção Seminal em todas as telas, cards 3D, perguntas de entrada e HUD de combate nos 3 idiomas (PT/EN/ES).',
          en: 'Unified terminology for Semen Retention across all screens, 3D cards, onboarding questions, and combat HUD in all 3 languages (PT/EN/ES).',
          es: 'Terminología unificada para Retención Seminal en todas las pantallas, tarjetas 3D, preguntas de entrada y HUD de combate en los 3 idiomas (PT/EN/ES).',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Blindagem Anti-Burla: Evolução Genuína',
          en: 'Anti-Cheat Shield: Genuine Evolution',
          es: 'Blindaje Anti-Trampas: Evolución Genuina',
        },
        desc: {
          pt: 'A história do guerreiro não pode ser adulterada. Quedas são registradas estritamente no tempo real e sem brechas para manipulação manual de datas.',
          en: 'A warrior\'s history cannot be forged. Relapses are logged strictly in real-time with no loopholes for manual date manipulation.',
          es: 'La historia del guerrero no puede ser adulterada. Las caídas se registran estrictamente en tiempo real sin brechas para la manipulación manual de fechas.',
        },
      },
    ],
  },
  {
    version: 'v1.4.1',
    date: {
      pt: '23 de Setembro, 2026',
      en: 'September 23, 2026',
      es: '23 de Septiembre, 2026',
    },
    title: {
      pt: 'Varredura Multilíngue (PT/EN/ES) & Sistema de Notificações no App',
      en: 'Complete Multilingual Sweep (PT/EN/ES) & In-App Update Notifications',
      es: 'Barrido Multilingüe (PT/EN/ES) y Sistema de Notificaciones en la App',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🌐',
        title: {
          pt: 'Tradução Integral em Todas as Abas',
          en: 'Full Translation Across All Tabs',
          es: 'Traducción Integral en Todas las Pestañas',
        },
        desc: {
          pt: 'Varredura completa em Configurações, Relatórios, Inimigo, Forja e Tarefas. Suporte nativo aos 3 idiomas (Português, Inglês e Espanhol).',
          en: 'Full sweep across Settings, Reports, Enemy, Forge, and Tasks. Native support for all 3 languages (Portuguese, English, and Spanish).',
          es: 'Barrido completo en Ajustes, Informes, Enemigo, Forja y Tareas. Soporte nativo para los 3 idiomas (Portugués, Inglés y Español).',
        },
      },
      {
        icon: '🔔',
        title: {
          pt: 'Notificações de Atualizações no App',
          en: 'In-App & Device Update Notifications',
          es: 'Notificaciones de Actualizaciones en la App',
        },
        desc: {
          pt: 'Alertas automáticos para novos Decretos da Forja, indicador pulsante no topo e notificações locais no dispositivo quando uma versão é lançada.',
          en: 'Automatic alerts for new Forge Decrees, pulsing header indicator, and local device notifications whenever a new version is released.',
          es: 'Alertas automáticas para nuevos Decretos de la Forja, indicador parpadeante en el encabezado y notificaciones locales en el dispositivo cuando se lanza una nueva versión.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Forja & Slots de Tarefas Estabilizados',
          en: 'Stabilized Forge & Task Slots',
          es: 'Forja y Slots de Tareas Estabilizados',
        },
        desc: {
          pt: 'Correção do seletor de slots, regras de combate sincronizadas e modais de tarefas com visualização instantânea no idioma ativo.',
          en: 'Fixed slot picker, synchronized combat rules, and task modals with instant rendering in the active language.',
          es: 'Corrección del selector de slots, reglas de combate sincronizadas y modales de tareas con visualización instantánea en el idioma activo.',
        },
      },
      {
        icon: '📊',
        title: {
          pt: 'Auditoria de Risco e Dossiês Científicos',
          en: 'Risk Audit & Scientific Dossiers',
          es: 'Auditoría de Riesgo y Dosieres Científicos',
        },
        desc: {
          pt: 'Dossiês médicos de DEIP e plasticidade neural, mapa de risco por horário e ranking de gatilhos 100% traduzidos.',
          en: 'Medical dossiers on PIED and neural plasticity, risk map by hour, and trigger ranking 100% translated.',
          es: 'Dosieres médicos de DEIP y plasticidad neural, mapa de riesgo por horario y clasificación de detonantes 100% traducidos.',
        },
      },
    ],
  },
  {
    version: 'v1.4.0',
    date: {
      pt: '22 de Setembro, 2026',
      en: 'September 22, 2026',
      es: '22 de Septiembre, 2026',
    },
    title: {
      pt: 'Decretos da Forja: Estandartes 3D & Conselho de Guerra',
      en: 'Forge Decrees: 3D Banners & War Council',
      es: 'Decretos de la Forja: Estandartes 3D y Consejo de Guerra',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🛡️',
        title: {
          pt: 'Estandartes Heráldicos 3D',
          en: '3D Heraldic Banners',
          es: 'Estandartes Heráldicos 3D',
        },
        desc: {
          pt: 'Pedestal com os 3 Pilares Sagrados em puro brasão medieval, rotação tática pelo caminho mais curto e seleção por toque direto no 3D.',
          en: 'Pedestal with the 3 Sacred Pillars in medieval heraldry, tactical shortest-path rotation, and direct touch selection in 3D.',
          es: 'Pedestal con los 3 Pilares Sagrados en puro blasón medieval, rotación táctica por el camino más corto y selección táctil en 3D.',
        },
      },
      {
        icon: '💬',
        title: {
          pt: 'Conselho de Guerra & Feedback',
          en: 'War Council & Feedback Channel',
          es: 'Consejo de Guerra y Canal de Feedback',
        },
        desc: {
          pt: 'Área dedicada na aba Configurações para enviar sugestões de novos recursos, relatar bugs e propor melhorias para o aplicativo.',
          en: 'Dedicated area in Settings tab to send suggestions, report bugs, and propose improvements for the app.',
          es: 'Área dedicada en la pestaña Ajustes para enviar sugerencias, reportar errores y proponer mejoras para la aplicación.',
        },
      },
      {
        icon: '🔔',
        title: {
          pt: 'Notificações de Horários & Cronograma',
          en: 'Scheduled Notifications & Timeline',
          es: 'Notificaciones de Horarios y Cronograma',
        },
        desc: {
          pt: 'Lembretes táticos no PC e Mobile para tarefas, hábitos e projetos com horário, além de painel de cronograma em tempo real no QG.',
          en: 'Tactical reminders on PC and Mobile for tasks, habits, and projects with scheduled times, plus a real-time timeline in HQ.',
          es: 'Recordatorios tácticos en PC y Móvil para tareas, hábitos y proyectos con horario, además de un cronograma en tiempo real en el QG.',
        },
      },
      {
        icon: '⚡',
        title: {
          pt: 'Otimização e Estabilidade Total',
          en: 'Optimization & Full Stability',
          es: 'Optimización y Estabilidad Total',
        },
        desc: {
          pt: 'Carregamento instantâneo do motor 3D, correção de loops angulares e temporizadores de precisão ao vivo sem perda de dados.',
          en: 'Instant loading of the 3D engine, angle loop correction, and live precision timers with zero data loss.',
          es: 'Carga instantánea del motor 3D, corrección de bucles angulares y temporizadores de precisión en vivo sin pérdida de datos.',
        },
      },
    ],
  },
  {
    version: 'v1.3.0',
    date: {
      pt: 'Setembro, 2026',
      en: 'September, 2026',
      es: 'Septiembre, 2026',
    },
    title: {
      pt: 'Forja em Alta Definição & Vigilância dos Três Pilares',
      en: 'High-Definition Forge & Three Pillars Vigilance',
      es: 'Forja en Alta Definición y Vigilancia de los Tres Pilares',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⚔️',
        title: {
          pt: 'HUD Tático em Alta Resolução',
          en: 'High-Resolution Tactical HUD',
          es: 'HUD Táctico en Alta Resolución',
        },
        desc: {
          pt: 'Estatísticas de dias, metas e cronômetro de precisão ao vivo com nitidez vetorial nativa em qualquer dispositivo.',
          en: 'Day statistics, goals, and live precision stopwatch with native vector clarity on any device.',
          es: 'Estadísticas de días, metas y cronómetro de precisión en vivo con nitidez vectorial en cualquier dispositivo.',
        },
      },
      {
        icon: '🔥',
        title: {
          pt: 'Vigilância Independente dos Pilares',
          en: 'Independent Pillars Vigilance',
          es: 'Vigilancia Independiente de los Pilares',
        },
        desc: {
          pt: 'Acompanhamento simultâneo de Retenção Seminal, Sem Pornografia e Sem Masturbação com pureza calculada.',
          en: 'Simultaneous tracking of Semen Retention, No Porn, and No Masturbation with calculated purity.',
          es: 'Seguimiento simultáneo de Retención Seminal, Sin Pornografía y Sin Masturbación con pureza calculada.',
        },
      },
    ],
  },
];

export function getLocalizedRelease(release, lang = 'pt') {
  if (!release) return null;
  const l = (lang === 'en' || lang === 'es') ? lang : 'pt';
  return {
    version: release.version,
    date: typeof release.date === 'object' ? (release.date[l] || release.date.pt) : release.date,
    title: typeof release.title === 'object' ? (release.title[l] || release.title.pt) : release.title,
    badge: release.badge === 'latest' ? CHANGELOG_I18N.latestBadge[l] : CHANGELOG_I18N.stabilityBadge[l],
    isLatest: release.isLatest,
    highlights: (release.highlights || []).map((h) => ({
      icon: h.icon,
      title: typeof h.title === 'object' ? (h.title[l] || h.title.pt) : h.title,
      desc: typeof h.desc === 'object' ? (h.desc[l] || h.desc.pt) : h.desc,
    })),
  };
}

export function hasUnreadUpdates() {
  if (typeof window === 'undefined') return false;
  try {
    const last = localStorage.getItem(LAST_SEEN_VERSION_KEY);
    return last !== CURRENT_APP_VERSION;
  } catch (e) {
    return false;
  }
}

export function markUpdatesAsRead() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LAST_SEEN_VERSION_KEY, CURRENT_APP_VERSION);
  } catch (e) {}
}

export function getLastSeenVersion() {
  if (typeof window === 'undefined') return CURRENT_APP_VERSION;
  try {
    return localStorage.getItem(LAST_SEEN_VERSION_KEY) || 'v1.0.0';
  } catch (e) {
    return CURRENT_APP_VERSION;
  }
}

export async function dispatchUpdateNotification() {
  // Notificações estritamente dentro do app (in-app) para preservar sigilo, privacidade e foco do guerreiro.
  return;
}

