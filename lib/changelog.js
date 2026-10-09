// lib/changelog.js
// Registro de Decretos da Forja (Notas de Atualização & Versionamento Multilíngue)

export const CURRENT_APP_VERSION = 'v2.1.9';
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
    version: 'v2.1.9',
    date: {
      pt: '9 de Outubro, 2026',
      en: 'October 9, 2026',
      es: '9 de Octubre, 2026',
    },
    title: {
      pt: 'Ajuste Retroativo na Forja: Marque Hábitos de Dias Anteriores com 1 Toque',
      en: 'Retroactive Forge Logging: Mark Past Days Habits with 1 Tap',
      es: 'Ajuste Retroactivo en la Forja: Marca Hábitos de Días Anteriores con 1 Toque',
    },
    badge: 'latest',
    isLatest: true,
    highlights: [
      {
        icon: '📅',
        title: {
          pt: 'Histórico dos 7 Dias 100% Interativo',
          en: '100% Interactive 7-Day History',
          es: 'Historial de 7 Días 100% Interactivo',
        },
        desc: {
          pt: 'Esqueceu de marcar ontem ou nos dias anteriores? Agora basta abrir "Detalhes" em qualquer hábito e tocar no círculo do dia para alternar entre Concluído (✓), Falhou (✕) e Limpar (·).',
          en: 'Forgot to log yesterday or past days? Now simply open "Details" on any habit and tap the day circle to toggle between Done (✓), Failed (✕), and Clear (·).',
          es: '¿Olvidaste marcar ayer o días anteriores? Ahora solo abre "Detalles" en cualquier hábito y toca el círculo del día para alternar entre Hecho (✓), Falló (✕) y Limpiar (·).',
        },
      },
      {
        icon: '🔥',
        title: {
          pt: 'Streaks e Fogo Contínuo Sincronizados',
          en: 'Streaks & Momentum Instantly Synchronized',
          es: 'Rachas y Momento Sincronizados al Instante',
        },
        desc: {
          pt: 'Ao registrar um hábito retroativo esquecido, a sua sequência contínua de dias é recalculada automaticamente sem perda de dados.',
          en: 'When logging a forgotten past habit, your consecutive day streak is recalculated instantly with zero data loss.',
          es: 'Al registrar un hábito retroactivo olvidado, tu racha continua de días se recalcula de inmediato sin pérdida de datos.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Honra e Justiça ao Guerreiro',
          en: 'Honor & Fairness for the Warrior',
          es: 'Honor y Justicia para el Guerrero',
        },
        desc: {
          pt: 'Se você cumpriu o hábito na vida real, sua vitória agora pode ser registrada com verdade e precisão no seu histórico.',
          en: 'If you completed the habit in real life, your victory can now be logged with truth and accuracy in your history.',
          es: 'Si cumpliste el hábito en la vida real, tu victoria ahora se puede registrar con verdad y precisión en tu historial.',
        },
      },
    ],
  },
  {
    version: 'v2.1.8',
    date: {
      pt: '9 de Outubro, 2026',
      en: 'October 9, 2026',
      es: '9 de Octubre, 2026',
    },
    title: {
      pt: 'A Forja Suprema: Selagem em 1 Toque, Termômetro Térmico, Streaks Individuais e Filtros de Combate',
      en: 'The Supreme Forge: 1-Tap Protocol Seal, Forge Heat Gauge, Individual Streaks & Combat Filters',
      es: 'La Forja Suprema: Sellado en 1 Toque, Termómetro Térmico, Rachas Individuales y Filtros de Combate',
    },
    badge: 'stable',
    isLatest: false,
    highlights: [
      {
        icon: '⚡',
        title: {
          pt: 'Forjar Protocolo em 1 Toque',
          en: '1-Tap Full Protocol Forge',
          es: 'Forjar Protocolo en 1 Toque',
        },
        desc: {
          pt: 'Com apenas um clique no topo da Forja, sele todos os seus hábitos ativos do dia com feedback tático e áudio de honra.',
          en: 'With a single tap at the top of the Forge, seal all your active habits for the day with tactical feedback and honor audio.',
          es: 'Con un solo toque en la cima de la Forja, sella todos tus hábitos activos del día con retroalimentación táctica y audio de honor.',
        },
      },
      {
        icon: '🔥',
        title: {
          pt: 'Termômetro da Forja (Carga Térmica)',
          en: 'Forge Heat Gauge & Real-Time Temperature',
          es: 'Termómetro de la Forja (Carga Térmica)',
        },
        desc: {
          pt: 'Acompanhe a temperatura do seu aço em tempo real: de Forja Fria até o lendário Aço de Damasco 100% temperado no fogo.',
          en: 'Track your steel temperature in real time: from Cold Forge to the legendary 100% fire-tempered Damascus Steel.',
          es: 'Sigue la temperatura de tu acero en tiempo real: de Forja Fría hasta el legendario Acero de Damasco 100% templado en fuego.',
        },
      },
      {
        icon: '🎯',
        title: {
          pt: 'Streaks Individuais & Filtros Rápidos',
          en: 'Individual Streaks & Quick Filters',
          es: 'Rachas Individuales y Filtros Rápidos',
        },
        desc: {
          pt: 'Veja a sequência de dias contínuos em cada hábito e alterne instantaneamente entre Todos, Pendentes e Concluídos.',
          en: 'View consecutive days of victory on each habit and switch instantly between All, Pending, and Completed.',
          es: 'Mira la racha de días continuos en cada hábito y cambia instantáneamente entre Todos, Pendientes y Concluidos.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Efeitos Biológicos do Patamar Integrados',
          en: 'Integrated Tier Biological Perks',
          es: 'Efectos Biológicos del Rango Integrados',
        },
        desc: {
          pt: 'Card dinâmico retrátil com as superpotências neurais e fisiológicas ativas no seu marco atual de retenção.',
          en: 'Dynamic retractable card displaying neural and physiological superpowers active at your current retention streak.',
          es: 'Tarjeta dinámica retráctil con las superpotencias neurales y fisiológicas activas en tu hito actual de retención.',
        },
      },
    ],
  },
  {
    version: 'v2.1.7',
    date: {
      pt: '9 de Outubro, 2026',
      en: 'October 9, 2026',
      es: '9 de Octubre, 2026',
    },
    title: {
      pt: 'Foco Puro nas 24 Horas: Conquista do Dia Atual & Interface Descomplicada',
      en: 'Pure 24-Hour Focus: Conquering Today & Streamlined Interface',
      es: 'Enfoque Puro en las 24 Horas: Conquista del Día Actual e Interfaz Simplificada',
    },
    badge: 'stable',
    isLatest: false,
    highlights: [
      {
        icon: '⚔️',
        title: {
          pt: 'Frase de Guerra Focada no Dia Atual',
          en: 'Battle Axiom Focused on Today',
          es: 'Lema de Batalla Enfocado en el Día Actual',
        },
        desc: {
          pt: 'A caixa redundante de citações gerais foi removida. O topo agora exibe com exclusividade a barra das 24 horas com lemas táticos para vencer o dia de hoje, sem distrações.',
          en: 'The redundant general quote box has been removed. The top now exclusively features the 24-hour progress bar with tactical axioms to conquer today without distractions.',
          es: 'La caja redundante de citas generales fue eliminada. La cima ahora presenta con exclusividad la barra de 24 horas con lemas tácticos para vencer el día de hoy, sin distracciones.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Configurações Simplificadas & Limpeza do Código',
          en: 'Streamlined Settings & Code Cleanup',
          es: 'Ajustes Simplificados y Limpieza de Código',
        },
        desc: {
          pt: 'A seção de frases customizadas foi removida de Configurações, mantendo a aba enxuta, focada em soberania de dados, backups e segurança.',
          en: 'The custom phrases section was removed from Settings, keeping the tab lean and centered on data sovereignty, backups, and security.',
          es: 'La sección de frases personalizadas se eliminó de Ajustes, manteniendo la pestaña limpia y enfocada en soberanía de datos, copias de seguridad y seguridad.',
        },
      },
      {
        icon: '💎',
        title: {
          pt: 'Métricas, Streaks e Projetos 100% Preservados',
          en: 'Metrics, Streaks & Projects 100% Intact',
          es: 'Métricas, Rachas y Proyectos 100% Intactos',
        },
        desc: {
          pt: 'Todos os seus registros, contadores de pureza, hábitos e projetos continuam íntegros e funcionando perfeitamente.',
          en: 'All your logs, purity meters, habits, and projects remain intact and operating seamlessly.',
          es: 'Todos tus registros, medidores de pureza, hábitos y proyectos continúan íntegros y funcionando a la perfección.',
        },
      },
    ],
  },
  {
    version: 'v2.1.6',
    date: {
      pt: '9 de Outubro, 2026',
      en: 'October 9, 2026',
      es: '9 de Octubre, 2026',
    },
    title: {
      pt: 'QG Definitivo: Performance Extrema, Layout Limpo e Produtividade Máxima',
      en: 'Definitive HQ: Extreme Performance, Clean Layout & Maximum Productivity',
      es: 'QG Definitivo: Rendimiento Extremo, Diseño Limpio y Máxima Productividad',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⚡',
        title: {
          pt: 'QG Leve, Fluido e Sem Travamentos',
          en: 'Lightweight, Smooth & Lag-Free HQ',
          es: 'QG Ligero, Fluido y Sin Bloqueos',
        },
        desc: {
          pt: 'Limpeza profunda de código redundante e renderização instantânea no celular e desktop, garantindo transições suaves de 60fps.',
          en: 'Deep cleanup of redundant code and instantaneous rendering on mobile and desktop, ensuring smooth 60fps transitions.',
          es: 'Limpieza profunda de código redundante y renderizado instantáneo en móvil y escritorio, garantizando transiciones suaves a 60fps.',
        },
      },
      {
        icon: '📜',
        title: {
          pt: 'Frase Motivacional & Linha das 24 Horas no Topo',
          en: 'Motivational Phrase & 24h Progress at the Top',
          es: 'Frase Motivacional y Línea de 24 Horas en la Cima',
        },
        desc: {
          pt: 'Frase inspiradora do dia com rotação dinâmica e barra das 24h com porcentagem e lemas de guerra integrados ao Brasão.',
          en: 'Daily inspirational quote with dynamic rotation and 24h progress bar with percentage and battle axioms integrated into the Crest.',
          es: 'Frase inspiradora del día con rotación dinámica y barra de 24h con porcentaje y axiomas de guerra integrados al Blasón.',
        },
      },
      {
        icon: '🎯',
        title: {
          pt: 'Agenda Operacional de Tarefas e Projetos em Foco',
          en: 'Combat Schedule: Tasks & Projects in Sharp Focus',
          es: 'Agenda de Operaciones: Tareas y Proyectos en Foco',
        },
        desc: {
          pt: 'Todas as tarefas, hábitos e projetos organizados em fila de prioridade com marcação de 1 clique e atalhos rápidos.',
          en: 'All tasks, forge habits, and projects prioritized in an operational queue with 1-click completion and quick shortcuts.',
          es: 'Todas las tareas, hábitos y proyectos organizados en cola de prioridad con marcado de 1 clic y accesos directos.',
        },
      },
      {
        icon: '💎',
        title: {
          pt: '100% das Métricas, Dias e Projetos Preservados',
          en: '100% of Metrics, Days & Projects Preserved',
          es: '100% de Métricas, Días y Proyectos Preservados',
        },
        desc: {
          pt: 'Nenhuma informação, histórico, tarefa ou projeto foi alterado ou perdido. Seus dias de racha e pureza seguem intocados.',
          en: 'No data, history, task, or project was changed or lost. Your streak days and purity remain untouched.',
          es: 'Ningún dato, historial, tarea o proyecto fue alterado o perdido. Tus días de racha y pureza siguen intactos.',
        },
      },
    ],
  },
  {
    version: 'v2.1.5',
    date: {
      pt: '9 de Outubro, 2026',
      en: 'October 9, 2026',
      es: '9 de Octubre, 2026',
    },
    title: {
      pt: 'QG Otimizado: Blindagem dos 3 Pilares Unificada e Acesso Direto às Operações',
      en: 'Optimized HQ: Unified 3 Pillars Shielding & Direct Access to Operations',
      es: 'QG Optimizado: Blindaje de los 3 Pilares Unificado y Acceso Directo a Operaciones',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🛡️',
        title: {
          pt: 'Blindagem dos 3 Pilares em 1 Toque Direto',
          en: '1-Tap Direct 3 Pillars Shielding',
          es: 'Blindaje de los 3 Pilares en 1 Toque Directo',
        },
        desc: {
          pt: 'Os 3 escudos (Retenção, Sem Pornô e Autodomínio) agora contam com botões diretos de 1 toque lado a lado, eliminando menus sanfonados e cliques extras.',
          en: 'All 3 shields (Retention, No Porn, and Self-Mastery) now feature direct 1-tap buttons side by side, eliminating accordion toggles and extra clicks.',
          es: 'Los 3 escudos (Retención, Sin Porno y Autodominio) cuentan ahora con botones táctiles directos lado a lado, eliminando menús desplegables y toques extra.',
        },
      },
      {
        icon: '⚡',
        title: {
          pt: 'Carga Tática Integrada & Fim de Blocos Duplicados',
          en: 'Integrated Tactical Charge & Removed Duplicate Blocks',
          es: 'Carga Táctica Integrada y Fin de Bloques Duplicados',
        },
        desc: {
          pt: 'A barra de foco e energia do dia foi fundida diretamente no topo da Blindagem, deixando o QG limpo, coeso e sem poluição visual.',
          en: 'The daily focus and energy progress indicator has been merged directly into the Shielding card, keeping HQ clean and cohesive.',
          es: 'La barra de enfoque y energía del día se fusionó dentro del propio Blindaje, manteniendo el QG limpio y ordenado.',
        },
      },
      {
        icon: '🎯',
        title: {
          pt: 'Agenda de Tarefas e Projetos Imediata',
          en: 'Immediate Access to Tasks & Projects',
          es: 'Acceso Inmediato a Tareas y Proyectos',
        },
        desc: {
          pt: 'Com a altura do QG reduzida pela metade, suas missões ativas, hábitos da forja e projetos ficam visíveis de imediato sem necessidade de rolagem longa.',
          en: 'With HQ vertical height cut in half, your active missions, forge habits, and projects are visible immediately without long scrolling.',
          es: 'Con la altura del QG reducida a la mitad, tus misiones activas, hábitos de la forja y proyectos quedan a la vista sin desplazamientos largos.',
        },
      },
    ],
  },
  {
    version: 'v2.1.4',
    date: {
      pt: '9 de Outubro, 2026',
      en: 'October 9, 2026',
      es: '9 de Octubre, 2026',
    },
    title: {
      pt: 'Evolução Medieval Leve & Modo Heráldico Otimizado',
      en: 'Lightweight Medieval Evolution & Optimized Heraldic Mode',
      es: 'Evolución Medieval Ligera y Modo Heráldico Optimizado',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🛡️',
        title: {
          pt: 'Modo Medieval Leve & Carregamento Instantâneo (0ms)',
          en: 'Lightweight Medieval Mode & Instant Loading (0ms)',
          es: 'Modo Medieval Ligero y Carga Instantánea (0ms)',
        },
        desc: {
          pt: 'Novo Estandarte e Brasão Heráldico da sua patente no QG. Elimina o aquecimento e consumo de bateria do 3D, reduz o uso de memória e torna a experiência instantânea no celular e PC.',
          en: 'New Heraldic Crest for your rank in HQ. Eliminates 3D battery drain, reduces memory usage, and makes the experience instant on mobile and PC.',
          es: 'Nuevo Blasón Heráldico para tu rango en el QG. Elimina el consumo de batería del 3D, reduce la memoria y hace la experiencia instantánea en móvil y PC.',
        },
      },
      {
        icon: '⚔️',
        title: {
          pt: 'Alternador de Visual 🛡️ Brasão / ⚔️ 3D',
          en: 'Visual Switcher 🛡️ Crest / ⚔️ 3D',
          es: 'Alternador Visual 🛡️ Blasón / ⚔️ 3D',
        },
        desc: {
          pt: 'Alterne entre o Brasão Medieval Leve e o Guerreiro 3D com um único clique. Sua preferência fica salva automaticamente.',
          en: 'Toggle between the Lightweight Medieval Crest and the 3D Warrior with a single click. Your preference is saved automatically.',
          es: 'Cambia entre el Blasón Medieval Ligero y el Guerrero 3D con un solo toque. Tu preferencia se guarda automáticamente.',
        },
      },
      {
        icon: '💎',
        title: {
          pt: 'Métricas, Frases e 24h 100% Intactas',
          en: 'Metrics, Quotes & 24h 100% Intact',
          es: 'Métricas, Frases y 24h 100% Intactas',
        },
        desc: {
          pt: 'Frase motivacional do dia, lema tático, barra de 24 horas, dias em vigília, pureza, cronômetro de precisão, tarefas e projetos permanecem rigorosamente preservados.',
          en: 'Motivational daily quote, tactical axiom, 24h progress bar, streak days, purity, precision timers, tasks, and projects remain strictly preserved.',
          es: 'Frase motivacional del día, lema táctico, barra de 24 horas, días de racha, pureza, cronómetro de precisión, tareas y proyectos permanecen rigurosamente preservados.',
        },
      },
    ],
  },
  {
    version: 'v2.1.3',
    date: {
      pt: '9 de Outubro, 2026',
      en: 'October 9, 2026',
      es: '9 de Octubre, 2026',
    },
    title: {
      pt: 'Otimização da Forja: Remoção da Aba O Inimigo Revelado',
      en: 'Forge Optimization: Removal of The Enemy Revealed Tab',
      es: 'Optimización de la Forja: Eliminación de la Pestaña El Enemigo Revelado',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⚡',
        title: {
          pt: 'Interface Mais Leve e Navegação Direta',
          en: 'Lighter Interface & Direct Navigation',
          es: 'Interfaz Más Liviana y Navegación Directa',
        },
        desc: {
          pt: 'A aba O Inimigo Revelado foi removida do aplicativo para reduzir peso, simplificar o menu e manter o guerreiro focado no combate prático diário.',
          en: 'The Enemy Revealed tab has been removed from the application to reduce weight, streamline menus, and keep the warrior focused on daily combat.',
          es: 'La pestaña El Enemigo Revelado ha sido eliminada de la aplicación para reducir peso, simplificar el menú y mantener al guerrero enfocado en el combate diario.',
        },
      },
      {
        icon: '📱',
        title: {
          pt: 'Barra Inferior Mobile Otimizada',
          en: 'Optimized Mobile Bottom Bar',
          es: 'Barra Inferior Móvil Optimizada',
        },
        desc: {
          pt: 'Com 6 abas essenciais, os botões ganharam melhor espaçamento e toque no celular, tornando a experiência mais fluida e ágil.',
          en: 'With 6 essential tabs, navigation buttons gained improved touch spacing on mobile, making the daily experience smoother and faster.',
          es: 'Con 6 pestañas esenciales, los botones obtuvieron un mejor espaciado táctil en el móvil, haciendo la experiencia más fluida y ágil.',
        },
      },
    ],
  },
  {
    version: 'v2.1.2',
    date: {
      pt: '8 de Outubro, 2026',
      en: 'October 8, 2026',
      es: '8 de Octubre, 2026',
    },
    title: {
      pt: 'Restauração de Hábitos da Forja: Nomes Visíveis, Edição Completa e Todos os Campos Restaurados',
      en: 'Forge Habits Restoration: Visible Names, Full Editing & Restored Advanced Options',
      es: 'Restauración de Hábitos de la Forja: Nombres Visibles, Edición Completa y Opciones Restauradas',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🛡️',
        title: {
          pt: 'Restauração Integral de Hábitos Anteriores',
          en: 'Full Restoration of Previous Habits',
          es: 'Restauración Integral de Hábitos Anteriores',
        },
        desc: {
          pt: 'Hábitos personalizados criados anteriormente (como HOMEM RARO) foram 100% recuperados com preservação total de métricas e unificação de dados.',
          en: 'Previously created custom habits (such as HOMEM RARO) have been 100% restored with full preservation of metrics and unified data.',
          es: 'Los hábitos personalizados creados anteriormente (como HOMEM RARO) han sido 100% recuperados con preservación total de métricas y datos unificados.',
        },
      },
      {
        icon: '⚙️',
        title: {
          pt: 'Todas as Opções Avançadas ao Criar & Editar',
          en: 'All Advanced Options when Creating & Editing',
          es: 'Todas las Opciones Avanzadas al Crear y Editar',
        },
        desc: {
          pt: 'Restauradas todas as opções da Forja: Pilar/Categoria (Corpo, Mente, Missão, Espírito), Impacto Fisiológico/Mental, Blindagem contra Recaídas, Alertas e seletor rápido de emojis guerreiros.',
          en: 'Restored all Forge options: Pillar/Category (Body, Mind, Mission, Spirit), Physiological/Mental Impact, Relapse Shielding, Alerts, and quick warrior emoji picker.',
          es: 'Restauradas todas las opciones de la Forja: Pilar/Categoría (Cuerpo, Mente, Misión, Espíritu), Impacto Fisiológico/Mental, Blindaje contra Recaídas, Alertas y selector rápido de emoticonos guerreros.',
        },
      },
      {
        icon: '✍️',
        title: {
          pt: 'Nome Visível & Botões Destacados de Editar e Excluir',
          en: 'Visible Name & Prominent Edit and Delete Buttons',
          es: 'Nombre Visible y Botones Destacados de Editar y Eliminar',
        },
        desc: {
          pt: 'Garantida a exibição instantânea do nome do hábito criado no Protocolo e na Reserva, acompanhado de botões táteis de Editar e Excluir com confirmação segura.',
          en: 'Guaranteed instant display of custom habit names across Protocol and Reserve, accompanied by tactile Edit and Delete buttons with safe confirmation.',
          es: 'Garantizada la visualización instantánea del nombre del hábito creado en Protocolo y Reserva, acompañado de botones táctiles de Editar y Eliminar con confirmación segura.',
        },
      },
    ],
  },
  {
    version: 'v2.1.1',
    date: {
      pt: '8 de Outubro, 2026',
      en: 'October 8, 2026',
      es: '8 de Octubre, 2026',
    },
    title: {
      pt: 'Correção no Formulário de Hábitos da Forja: Digitação e Criação Fluidas',
      en: 'Fix in Forge Habits Form: Seamless Typing & Habit Creation',
      es: 'Corrección en el Formulario de Hábitos de la Forja: Escritura y Creación Fluidas',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '✍️',
        title: {
          pt: 'Digitação Reativa no Nome, Ícone e Alertas',
          en: 'Reactive Typing in Name, Icon & Alerts',
          es: 'Escritura Reactiva en Nombre, Ícono y Alertas',
        },
        desc: {
          pt: 'Corrigido o estado interno dos campos de criação e edição de hábitos na Forja, permitindo digitar nomes, emojis e horários com fluidez instantânea.',
          en: 'Fixed internal input state in Forge habit creation and editing modals, allowing seamless and responsive typing of habit names, emojis, and alert times.',
          es: 'Corregido el estado interno de los campos de creación y edición de hábitos en la Forja, permitiendo escribir nombres, emojis y horarios con total fluidez.',
        },
      },
    ],
  },
  {
    version: 'v2.1.0',
    date: {
      pt: '7 de Outubro, 2026',
      en: 'October 7, 2026',
      es: '7 de Octubre, 2026',
    },
    title: {
      pt: 'Sincronização Trilíngue dos 3 Pilares: Blindagem e Ações 100% Traduzidas',
      en: 'Trilingual Synchronization of the 3 Pillars: 100% Translated Shielding & Actions',
      es: 'Sincronización Trilingüe de los 3 Pilares: Blindaje y Acciones 100% Traducidas',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🛡️',
        title: {
          pt: 'Ações dos 3 Pilares em Inglês e Espanhol',
          en: '3 Pillars Actions in English & Spanish',
          es: 'Acciones de los 3 Pilares en Inglés y Español',
        },
        desc: {
          pt: 'Os botões de ação e status dos 3 pilares agora exibem corretamente "MARK / SHIELDED / FAILED" em inglês e "MARCAR / BLINDADO / FALLÓ" em espanhol.',
          en: 'The action and status badges of the 3 pillars now properly display "MARK / SHIELDED / FAILED" in English and "MARCAR / BLINDADO / FALLÓ" in Spanish.',
          es: 'Los botones de acción y estado de los 3 pilares ahora muestran correctamente "MARK / SHIELDED / FAILED" en inglés y "MARCAR / BLINDADO / FALLÓ" en español.',
        },
      },
      {
        icon: '⚔️',
        title: {
          pt: 'Consistência Tática no QG (Mobile & Desktop)',
          en: 'Tactical Consistency at HQ (Mobile & Desktop)',
          es: 'Consistencia Táctica en el QG (Móvil y Escritorio)',
        },
        desc: {
          pt: 'Garantida a coerência linguística completa ao registrar e blindar os escudos diários em qualquer resolução de tela.',
          en: 'Guaranteed complete linguistic coherence when logging and shielding daily combat seals across all screen resolutions.',
          es: 'Garantizada la coherencia lingüística completa al registrar y blindar los escudos diarios en cualquier resolución de pantalla.',
        },
      },
    ],
  },
  {
    version: 'v2.0.9',
    date: {
      pt: '5 de Outubro, 2026',
      en: 'October 5, 2026',
      es: '5 de Octubre, 2026',
    },
    title: {
      pt: 'Novo Leaderboard de Guerra & Retenção: Pódio Top 3, Pontos de Glória e Filtros Táticos',
      en: 'New War & Retention Leaderboard: Top 3 Podium, Glory Points & Tactical Filters',
      es: 'Nuevo Leaderboard de Guerra y Retención: Podio Top 3, Puntos de Gloria y Filtros Tácticos',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🏆',
        title: {
          pt: 'Pódio dos 3 Maiores Guerreiros',
          en: 'Top 3 Supreme Warriors Podium',
          es: 'Podio de los 3 Mayores Guerreros',
        },
        desc: {
          pt: 'Pódio heroico em ouro, prata e bronze destacando os combatentes com maior tempo limpo e honra na Forja.',
          en: 'Heroic podium in gold, silver, and bronze highlighting fighters with the highest clean time and honor in the Forge.',
          es: 'Podio heroico en oro, plata y bronce destacando a los combatientes con mayor tiempo limpio y honor en la Forja.',
        },
      },
      {
        icon: '⚡',
        title: {
          pt: 'Ordenação por Retenção, Glória e Streak',
          en: 'Sorting by Retention, Glory, and Streak',
          es: 'Ordenación por Retención, Gloria y Racha',
        },
        desc: {
          pt: 'Alterne instantaneamente a classificação entre dias de retenção, pontuação de glória e série atual de vitórias.',
          en: 'Instantly toggle rankings across retention days, glory score, and current winning streak.',
          es: 'Alterna instantáneamente la clasificación entre días de retención, puntuación de gloria y racha actual de victorias.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Busca Tática e Tradução Trilíngue (PT, EN, ES)',
          en: 'Tactical Search & Trilingual Translation (PT, EN, ES)',
          es: 'Búsqueda Táctica y Traducción Trilingüe (PT, EN, ES)',
        },
        desc: {
          pt: 'Filtro por patamares, busca por pseudônimo e suporte integral aos 3 idiomas oficiais com 100% de privacidade anônima.',
          en: 'Filter by tiers, search by pseudonym, and full support for the 3 official languages with 100% anonymous privacy.',
          es: 'Filtro por patamares, búsqueda por seudónimo y soporte integral para los 3 idiomas oficiales con 100% de privacidad anónima.',
        },
      },
    ],
  },
  {
    version: 'v2.0.8',
    date: {
      pt: '5 de Outubro, 2026',
      en: 'October 5, 2026',
      es: '5 de Octubre, 2026',
    },
    title: {
      pt: 'Transição Neural: Promover Tarefas Diárias a Hábitos Oficiais da Forja',
      en: 'Neural Transition: Promote Daily Tasks to Official Forge Habits',
      es: 'Transición Neuronal: Promover Tareas Diarias a Hábitos Oficiales de la Forja',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⚡',
        title: {
          pt: 'Indicação Inteligente aos 14 Dias de Consistência',
          en: 'Smart Recommendation at 14 Days of Consistency',
          es: 'Recomendación Inteligente a los 14 Días de Consistencia',
        },
        desc: {
          pt: 'Missões diárias com 14 ou mais dias consecutivos recebem destaque dourado e recomendação para serem promovidas a Hábitos Oficiais da Forja.',
          en: 'Daily missions with 14 or more consecutive days receive a golden highlight and recommendation to be promoted to Official Forge Habits.',
          es: 'Misiones diarias con 14 o más días consecutivos reciben un destacado dorado y recomendación para ser promovidas a Hábitos Oficiales de la Forja.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Validação de Slots & Importação Integral de Métricas',
          en: 'Slot Validation & Full Metrics Import',
          es: 'Validación de Slots e Importación Integral de Métricas',
        },
        desc: {
          pt: 'Verificação em tempo real de vagas ativas na Forja e migração total de histórico de datas cumpridas, horário e streak sem perder nenhum dado.',
          en: 'Real-time validation of active Forge slots and complete migration of completed dates history, schedule, and streak without losing any data.',
          es: 'Validación en tiempo real de cupos activos en la Forja y migración total de historial de fechas cumplidas, horario y racha sin perder ningún dato.',
        },
      },
      {
        icon: '🎯',
        title: {
          pt: 'Desativação Operacional Automática e Segura',
          en: 'Automatic and Safe Operational Deactivation',
          es: 'Desactivación Operacional Automática y Segura',
        },
        desc: {
          pt: 'Ao confirmar a promoção, a tarefa sai da lista operacional de tarefas para evitar duplicidade de registros, passando a pontuar na Forja.',
          en: 'Upon confirming promotion, the task leaves the operational tasks list to prevent duplicate logs, now scoring in the Forge.',
          es: 'Al confirmar la promoción, la tarea sale de la lista operacional de tareas para evitar duplicidad de registros, pasando a puntuar en la Forja.',
        },
      },
    ],
  },
  {
    version: 'v2.0.7',
    date: {
      pt: '5 de Outubro, 2026',
      en: 'October 5, 2026',
      es: '5 de Octubre, 2026',
    },
    title: {
      pt: 'Projetos Estratégicos: Duplo Progresso Tático (Cronograma de Dias Reais e Execução de Tarefas)',
      en: 'Strategic Projects: Dual Tactical Progress (Real Days Timeline & Task Execution)',
      es: 'Proyectos Estratégicos: Doble Progreso Táctico (Cronograma de Días Reales y Ejecución de Tareas)',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '📅',
        title: {
          pt: 'Cronograma Temporal do Projeto (Dias Reais do Calendário)',
          en: 'Project Timeline (Real Calendar Days)',
          es: 'Cronograma del Proyecto (Días Reales del Calendario)',
        },
        desc: {
          pt: 'Barra dourada calculando precisamente os dias decorridos da data inicial até o prazo final (ex: até 31/12), exibindo os dias reais transcorridos e a porcentagem de tempo percorrida.',
          en: 'Golden bar precisely computing elapsed days from start date to deadline (e.g., until Dec 31), displaying actual calendar days elapsed and elapsed time percentage.',
          es: 'Barra dorada calculando con precisión los días transcurridos desde la fecha inicial hasta el plazo final (ej: hasta 31/12), mostrando los días reales transcurridos y el porcentaje de tiempo recorrido.',
        },
      },
      {
        icon: '🎯',
        title: {
          pt: 'Execução das Tarefas & Metas Cumpridas',
          en: 'Task Execution & Goals Accomplished',
          es: 'Ejecución de Tareas y Metas Cumplidas',
        },
        desc: {
          pt: 'Barra esmeralda dedicada exclusivamente ao volume de execuções de tarefas (ex: 94/936 execuções de tarefas diárias), eliminando ambiguidades entre dias de calendário e execuções.',
          en: 'Emerald bar dedicated exclusively to task execution volume (e.g., 94/936 daily task executions), eliminating ambiguity between calendar days and executions.',
          es: 'Barra esmeralda dedicada exclusivamente al volumen de ejecuciones de tareas (ej: 94/936 ejecuciones de tareas diarias), eliminando ambigüedades entre días de calendario y ejecuciones.',
        },
      },
      {
        icon: '⚡',
        title: {
          pt: 'Clareza Máxima nos Resumos e Badges',
          en: 'Maximum Clarity in Summaries & Badges',
          es: 'Máxima Claridad en Resúmenes y Badges',
        },
        desc: {
          pt: 'Badges compactos agora discriminam claramente execuções de tarefas e tarefas avulsas concluídas, com total sincronização nos 3 idiomas (PT, EN, ES).',
          en: 'Compact badges now clearly distinguish task executions from completed standalone tasks, fully synchronized across 3 languages (PT, EN, ES).',
          es: 'Las insignias compactas ahora discriminan claramente las ejecuciones de tareas y las tareas sueltas completadas, con sincronización total en 3 idiomas (PT, EN, ES).',
        },
      },
    ],
  },
  {
    version: 'v2.0.6',
    date: {
      pt: '3 de Outubro, 2026',
      en: 'October 3, 2026',
      es: '3 de Octubre, 2026',
    },
    title: {
      pt: 'Configurações no Padrão da Forja: 4 Sub-Abas em Aço Forjado, Banners Táticos e Blindagem de Dados',
      en: 'Settings in Forge Design: 4 Forged Steel Sub-Tabs, Tactical Banners & Data Armor',
      es: 'Configuraciones al Estilo Forja: 4 Sub-Pestañas en Acero Forjado, Banners Tácticos y Blindaje de Datos',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⚙️',
        title: {
          pt: 'Seletor em Aço Forjado com 4 Sub-Abas Táticas',
          en: 'Forged Steel Selector with 4 Tactical Sub-Tabs',
          es: 'Selector en Acero Forjado con 4 Sub-Pestañas Tácticas',
        },
        desc: {
          pt: 'Navegação minimalista e fluida entre Geral & Visual, Sugestões & Bugs, Segurança & Acesso e Conta & Dados com feedback tátil e áudio da Forja.',
          en: 'Minimalist and seamless navigation across General & Visual, Feedback & Bugs, Security & Access, and Account & Data with tactile audio.',
          es: 'Navegación minimalista y fluida entre General y Visual, Sugerencias y Errores, Seguridad y Acceso, y Cuenta y Datos con audio táctil.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Banners de Inteligência Militar & Cards de Metal Escuro',
          en: 'Military Intelligence Banners & Dark Metal Cards',
          es: 'Banners de Inteligencia Militar y Tarjetas de Metal Oscuro',
        },
        desc: {
          pt: 'Todas as seções de PIN, temas, alertas duplos, parceiro de responsabilidade e frases do código agora contam com o acabamento nobre de aço escuro e ouro.',
          en: 'All sections for PIN, themes, dual alerts, accountability partner, and code phrases now feature noble dark steel and gold finish.',
          es: 'Todas las secciones de PIN, temas, alertas dobles, compañero de responsabilidad y frases del código ahora cuentan con acabado noble en acero oscuro y oro.',
        },
      },
      {
        icon: '💀',
        title: {
          pt: 'Zona Crítica com Moldura Rubra Medieval',
          en: 'Critical Zone with Medieval Crimson Frame',
          es: 'Zona Crítica con Marco Carmesí Medieval',
        },
        desc: {
          pt: 'Destaque visual em vermelho brasa para as ações definitivas de reset local e exclusão conforme a LGPD, prevenindo toques acidentais.',
          en: 'Visual crimson ember highlight for definitive actions of local reset and LGPD deletion, preventing accidental clicks.',
          es: 'Destacado visual en rojo brasa para las acciones definitivas de reinicio local y eliminación LGPD, previniendo toques accidentales.',
        },
      },
    ],
  },
  {
    version: 'v2.0.5',
    date: {
      pt: '2 de Outubro, 2026',
      en: 'October 2, 2026',
      es: '2 de Octubre, 2026',
    },
    title: {
      pt: 'O Inimigo Revelado no Padrão da Forja: Dossiês Blindados, Quadro Clínico & Cronograma Neural Sincronizado',
      en: 'The Enemy Revealed in Forge Design: Armored Dossiers, Clinical Overview & Synced Neural Timeline',
      es: 'El Enemigo Revelado al Estilo Forja: Dosieres Blindados, Cuadro Clínico y Cronograma Neural Sincronizado',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🕳️',
        title: {
          pt: 'Sub-Abas em Aço Forjado & Banners Táticos de Inteligência',
          en: 'Forged Steel Sub-Tabs & Tactical Intelligence Banners',
          es: 'Sub-Pestañas en Acero Forjado y Banners Tácticos de Inteligencia',
        },
        desc: {
          pt: 'Navegação fluida entre Dossiês Científicos, Quadro Clínico e Cronograma Neural com a estética rústica e medieval da Forja e áudio tátil.',
          en: 'Seamless navigation across Scientific Dossiers, Clinical Overview, and Neural Timeline with rustic Forge aesthetics and tactile audio.',
          es: 'Navegación fluida entre Dosieres Científicos, Cuadro Clínico y Cronograma Neural con la estética rústica de la Forja y audio táctil.',
        },
      },
      {
        icon: '⚡',
        title: {
          pt: 'Cronograma Neural Sincronizado ao Streak Real',
          en: 'Neural Timeline Synced to Real Streak',
          es: 'Cronograma Neural Sincronizado a la Racha Real',
        },
        desc: {
          pt: 'Os 4 patamares de neuroplasticidade agora identificam dinamicamente a sua fase atual de recuperação biológica, exibindo progresso e status de conquista.',
          en: 'The 4 neuroplasticity tiers now dynamically identify your current phase of biological recovery, displaying progress and conquered status.',
          es: 'Los 4 niveles de neuroplasticidad ahora identifican dinámicamente tu fase actual de recuperación biológica, mostrando progreso y estatus conquistado.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Dossiês com Pergaminhos Científicos & Decreto de Retenção Seminal',
          en: 'Dossiers with Scientific Scrolls & Seminal Retention Decree',
          es: 'Dosieres con Pergaminos Científicos y Decreto de Retención Seminal',
        },
        desc: {
          pt: 'Evidências do Max Planck e Cleveland Clinic com formatação nobre, e destaque dourado explicando a diferença vital entre vício compulsivo e Retenção Consciente.',
          en: 'Max Planck and Cleveland Clinic evidence with noble formatting, plus gold highlight explaining the vital difference between addiction and Conscious Retention.',
          es: 'Evidencias de Max Planck y Cleveland Clinic con formato noble, y resalte dorado explicando la diferencia vital entre adicción y Retención Consciente.',
        },
      },
    ],
  },
  {
    version: 'v2.0.4',
    date: {
      pt: '2 de Outubro, 2026',
      en: 'October 2, 2026',
      es: '2 de Octubre, 2026',
    },
    title: {
      pt: 'Exportador de Guerra Unificado: 3 Períodos Táticos (7 Dias, 30 Dias e Todo o Período)',
      en: 'Unified War Exporter: 3 Tactical Periods (7 Days, 30 Days & All-Time)',
      es: 'Exportador de Guerra Unificado: 3 Períodos Tácticos (7 Días, 30 Días y Todo el Período)',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🛡️',
        title: {
          pt: 'Seletor Superior Unificado com 3 Opções de Exportação',
          en: 'Unified Top Selector with 3 Export Options',
          es: 'Selector Superior Unificado con 3 Opciones de Exportación',
        },
        desc: {
          pt: 'O botão superior Exportar Guerra agora abre um menu tático permitindo gerar o relatório oficial dos Últimos 7 Dias, Últimos 30 Dias ou de Todo o Período da jornada.',
          en: 'The top Export War Report button now opens a tactical menu allowing you to generate the official report for Last 7 Days, Last 30 Days, or All-Time journey.',
          es: 'El botón superior Exportar Guerra ahora abre un menú táctico que permite generar el informe oficial de los Últimos 7 Días, Últimos 30 Días o de Todo el Período.',
        },
      },
      {
        icon: '⚔️',
        title: {
          pt: 'Layout Mais Limpo & Remoção de Duplicidades',
          en: 'Cleaner Layout & Duplicate Removal',
          es: 'Diseño Más Limpio y Eliminación de Duplicados',
        },
        desc: {
          pt: 'Removido o botão redundante de dentro do card semanal em Geral & Consistência, centralizando toda a exportação visual no cabeçalho com feedback sonoro e notificações táteis.',
          en: 'Removed redundant button from inside the weekly card in General & Consistency, centralizing all visual exports in the header with audio feedback and notifications.',
          es: 'Eliminado el botón redundante dentro de la tarjeta semanal en General y Consistencia, centralizando la exportación en el encabezado con feedback sonoro y avisos.',
        },
      },
      {
        icon: '🖼️',
        title: {
          pt: 'Geração Dinâmica de Cartão Canvas de Alta Resolução',
          en: 'Dynamic High-Resolution Canvas Card Generation',
          es: 'Generación Dinámica de Tarjeta Canvas de Alta Resolución',
        },
        desc: {
          pt: 'Imagens quadradas em 1080x1080 com cálculo automático de vitórias, quedas, pureza, streak e consistência exatas para cada um dos 3 períodos selecionados.',
          en: '1080x1080 square images with automatic calculation of wins, falls, purity, streak, and exact consistency for each of the 3 selected periods.',
          es: 'Imágenes cuadradas en 1080x1080 con cálculo automático de victorias, caídas, pureza, racha y consistencia exactas para cada uno de los 3 períodos seleccionados.',
        },
      },
    ],
  },
  {
    version: 'v2.0.3',
    date: {
      pt: '1 de Outubro, 2026',
      en: 'October 1, 2026',
      es: '1 de Octubre, 2026',
    },
    title: {
      pt: 'Relatórios de Combate no Padrão da Forja: 4 Sub-Abas em Aço Forjado, Curva de Vitalidade & KPIs Blindados',
      en: 'Combat Reports in Forge Design: 4 Sub-Tabs in Forged Steel, Vitality Curve & Shielded KPIs',
      es: 'Informes de Combate al Estilo Forja: 4 Sub-Pestañas en Acero Forjado, Curva de Vitalidad y KPIs Blindados',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⚔️',
        title: {
          pt: '4 Sub-Abas de Inteligência em Aço Forjado & Ouro',
          en: '4 Intelligence Sub-Tabs in Forged Steel & Gold',
          es: '4 Sub-Pestañas de Inteligencia en Acero Forjado y Oro',
        },
        desc: {
          pt: 'Geral & Consistência, Linha do Tempo, Risco & S.O.S e Salão da Fama unificados na moldura rústica da Forja com botão de ação rápida para exportar o relatório semanal.',
          en: 'General & Consistency, Timeline, Risk & S.O.S, and Hall of Fame unified under the Forge rustic frame with quick export war report trigger.',
          es: 'General y Consistencia, Línea de Tiempo, Riesgo y S.O.S y Salón de la Fama unificados en el marco rústico de la Forja con acción rápida para exportar el informe semanal.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Grade de 7 KPIs e Relatório Semanal em Armadura Nobre',
          en: '7 KPI Grid & Weekly War Report in Noble Armor Frame',
          es: 'Rejilla de 7 KPIs e Informe Semanal en Armadura Noble',
        },
        desc: {
          pt: 'Cards de métricas essenciais com filete superior em ouro forjado, contraste elevado, heatmap mensal em aço escuro e barras de consistência de hábitos.',
          en: 'Essential metric cards with forged gold top highlight, elevated contrast, dark steel monthly heatmap, and habit consistency bars.',
          es: 'Tarjetas de métricas esenciales con filete superior en oro forjado, alto contraste, mapa de calor mensual en acero oscuro y barras de consistencia de hábitos.',
        },
      },
      {
        icon: '📈',
        title: {
          pt: 'Curva de Vitalidade, Mapeamento de Risco e Salão de Honra',
          en: 'Vitality Curve, Risk Mapping & Hall of Honor',
          es: 'Curva de Vitalidad, Mapeo de Riesgo y Salón de Honor',
        },
        desc: {
          pt: 'Gráficos interativos em alta definição, identificação imediata da janela crítica de perigo, ranking de gatilhos e exportação do cartão oficial de vitória.',
          en: 'Interactive high-definition graphs, immediate identification of critical urge windows, trigger ranking, and official victory card export.',
          es: 'Gráficos interactivos en alta definición, identificación inmediata de la ventana crítica de peligro, ranking de gatillos y exportación de la tarjeta oficial de victoria.',
        },
      },
    ],
  },
  {
    version: 'v2.0.2',
    date: {
      pt: '1 de Outubro, 2026',
      en: 'October 1, 2026',
      es: '1 de Octubre, 2026',
    },
    title: {
      pt: 'Diário de Bordo no Padrão da Forja: Auditoria Noturna, Aço Rústico & 3 Sub-Abas Táteis',
      en: "Ship's Log in Forge Design: Nightly Audit, Rustic Steel & 3 Tactile Sub-Tabs",
      es: 'Diario de a Bordo al Estilo Forja: Auditoría Nocturna, Acero Rústico y 3 Sub-Pestañas Táctiles',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '📜',
        title: {
          pt: 'Barra Superior e 3 Sub-Abas de Auditoria em Aço & Ouro',
          en: 'Top Navigation & 3 Audit Sub-Tabs in Steel & Gold',
          es: 'Barra Superior y 3 Sub-Pestañas de Auditoría en Acero y Oro',
        },
        desc: {
          pt: 'Novo Relatório, Histórico de Auditorias e Métricas & Vigor agora utilizam as molduras chanfradas e a navegação rústica minimalista da Forja com acesso rápido.',
          en: 'New Report, Audit History, and Metrics & Vigor now utilize bevelled frames and the Forge rustic minimalist navigation with fast action triggers.',
          es: 'Nuevo Informe, Historial de Auditorías y Métricas y Vigor ahora utilizan los marcos biselados y la navegación rústica minimalista de la Forja con acceso rápido.',
        },
      },
      {
        icon: '🔥',
        title: {
          pt: 'Auditoria Noturna com Seletor Tátil de Vigor e Estado de Espírito',
          en: 'Nightly Audit with Tactile Vigor & State of Mind Selector',
          es: 'Auditoría Nocturna con Selector Táctil de Vigor y Estado de Ánimo',
        },
        desc: {
          pt: 'Os 4 estados de espírito (Em Chamas, Firme, Cansado e Guerra/Fissura) ganharam botões medievais com feedback tátil e gravação protegida no diário.',
          en: 'The 4 states of mind (On Fire, Steady, Tired, and Urges/War) gained medieval tactile buttons with protected log recording.',
          es: 'Los 4 estados de ánimo (En Llamas, Firme, Cansado y Guerra/Ansiedad) obtuvieron botones medievales con retroalimentación táctil y registro protegido en el diario.',
        },
      },
      {
        icon: '📊',
        title: {
          pt: 'Histórico de Batalhas e Métricas com Presença Nobre',
          en: 'Battle History & Metrics with Noble Command Presence',
          es: 'Historial de Batallas y Métricas con Noble Presencia de Mando',
        },
        desc: {
          pt: 'Cards de relatos anteriores em gradiente de aço escuro com brasas e tags douradas, barras de distribuição reluzentes e 100% dos dados preservados.',
          en: 'Past report cards in dark steel gradient with embers and golden tags, shimmering distribution bars, and 100% of data preserved.',
          es: 'Tarjetas de reportes anteriores en gradiente de acero oscuro con brasas y etiquetas doradas, barras de distribución relucientes y 100% de datos preservados.',
        },
      },
    ],
  },
  {
    version: 'v2.0.1',
    date: {
      pt: '1 de Outubro, 2026',
      en: 'October 1, 2026',
      es: '1 de Octubre, 2026',
    },
    title: {
      pt: 'Projetos & Tarefas no Padrão da Forja: Visual Rústico Medieval & 3 Sub-Abas Táteis',
      en: 'Projects & Tasks in Forge Design: Medieval Rustic Polish & 3 Tactile Sub-Tabs',
      es: 'Proyectos y Tareas al Estilo Forja: Visual Rústico Medieval y 3 Sub-Pestañas Táctiles',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🎯',
        title: {
          pt: 'Barra Superior e 3 Sub-Abas em Aço Forjado & Ouro',
          en: 'Top Navigation & 3 Sub-Tabs in Forged Steel & Gold',
          es: 'Barra Superior y 3 Sub-Pestañas en Acero Forjado y Oro',
        },
        desc: {
          pt: 'As 3 sub-abas (Tarefas & Operações, Projetos Estratégicos e Arquivo & Concluídos) agora usam o mesmo acabamento nobre da Forja, com pílulas chanfradas e botões de ação rápida em ouro.',
          en: 'The 3 sub-tabs (Tasks & Operations, Strategic Projects, and Archive & Completed) now use the Forge noble finish, with bevelled pills and fast action buttons in gold.',
          es: 'Las 3 sub-pestañas (Tareas y Operaciones, Proyectos Estratégicos y Archivo y Concluídos) ahora usan el acabado noble de la Forja, con píldoras biseladas y botones de acción rápida en oro.',
        },
      },
      {
        icon: '⚔️',
        title: {
          pt: 'Cards de Operações com Feedback Tátil & Selo Medieval',
          en: 'Operation Cards with Tactile Feedback & Medieval Seal',
          es: 'Tarjetas de Operaciones con Retroalimentación Táctil y Sello Medieval',
        },
        desc: {
          pt: 'Caixas de tarefas com gradientes de carvão e armadura, botão tátil de conclusão estilo anel de aço e brasão dourado, e micro-ações suaves de adiar, analisar e arquivar.',
          en: 'Task cards with charcoal armor gradients, tactile steel-ring completion button with golden crest, and smooth micro-actions to postpone, analyze, and archive.',
          es: 'Tarjetas de tareas con gradientes de carbón y armadura, botón táctil de conclusión estilo anillo de acero y escudo dorado, y micro-acciones suaves para posponer, analizar y archivar.',
        },
      },
      {
        icon: '🏛️',
        title: {
          pt: 'Frentes Estratégicas e Arquivo Totalmente Harmonizados',
          en: 'Strategic Fronts & Combat Archive Fully Harmonized',
          es: 'Frentes Estratégicos y Archivo de Combate Totalmente Armonizados',
        },
        desc: {
          pt: 'Cards de projetos estratégicos com barras de progresso douradas, ícones em molduras de aço forjado, tags táticas refinadas e 100% dos dados preservados.',
          en: 'Strategic project cards with golden progress bars, forged steel icon frames, refined tactical tags, and 100% of data preserved.',
          es: 'Tarjetas de proyectos estratégicos con barras de progreso doradas, iconos en marcos de acero forjado, etiquetas tácticas refinadas y 100% de datos preservados.',
        },
      },
    ],
  },
  {
    version: 'v2.0.0',
    date: {
      pt: '1 de Outubro, 2026',
      en: 'October 1, 2026',
      es: '1 de Octubre, 2026',
    },
    title: {
      pt: 'Quartel-General no Padrão da Forja: Visual Rústico & Ações Táteis',
      en: 'Headquarters Aligned with Forge Design: Rustic Steel & Tactile Actions',
      es: 'Cuartel General Alineado con la Forja: Visual Rústico y Acciones Táctiles',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🛡️',
        title: {
          pt: 'Molduras Rústicas de Aço Forjado nos Ícones do QG',
          en: 'Rustic Forged Steel Icon Frames across HQ',
          es: 'Marcos Rústicos de Acero Forjado en Iconos del CG',
        },
        desc: {
          pt: 'Todos os cards do QG (Blindagem dos 3 Escudos, Carga Tática, Batalha 24h e Agenda de Hoje) agora exibem caixas chanfradas de aço escuro com brasas e ouro, igual à Forja.',
          en: 'All HQ cards (3 Shields, Tactical Charge, 24h Battle, and Today’s Schedule) now feature bevelled dark steel icon boxes with embers and gold, matching the Forge.',
          es: 'Todas las tarjetas del CG (3 Escudos, Carga Táctica, Batalla 24h y Agenda de Hoy) ahora exhiben cajas biseladas de acero oscuro con brasas y oro, igual a la Forja.',
        },
      },
      {
        icon: '⚔️',
        title: {
          pt: 'Botões Táteis & Ações Rápidas de Alta Resposta',
          en: 'Tactile Buttons & Fast Responsive Actions',
          es: 'Botones Táctiles y Acciones Rápidas de Alta Respuesta',
        },
        desc: {
          pt: 'Conclusão de missões, marcação dos 3 escudos e pacto diário de honra receberam feedback tátil com efeito de pressão física e acentos em ouro forjado.',
          en: 'Mission completion, 3 shields check, and daily honor pact received tactile feedback with physical press effect and forged gold accents.',
          es: 'Cumplimiento de misiones, marcación de los 3 escudos y pacto diario de honor recibieron retroalimentación táctil con efecto de presión física y acentos en oro forjado.',
        },
      },
      {
        icon: '🏛️',
        title: {
          pt: 'Identidade Visual 100% Unificada Sem Alterar Mecânicas',
          en: '100% Unified Visual Identity with Zero Logic Changes',
          es: 'Identidad Visual 100% Unificada Sin Modificar Mecánicas',
        },
        desc: {
          pt: 'O QG e a Forja agora conversam na mesma linguagem medieval rústica e minimalista. Dias limpos, dados e funcionalidades permanecem 100% intactos.',
          en: 'HQ and Forge now speak the exact same rustic minimalist medieval language. Clean days, data, and core features remain 100% intact.',
          es: 'El CG y la Forja ahora conversan en el mismo lenguaje medieval rústico y minimalista. Días limpios, datos y funcionalidades permanecen 100% intactos.',
        },
      },
    ],
  },
  {
    version: 'v1.9.9',
    date: {
      pt: '1 de Outubro, 2026',
      en: 'October 1, 2026',
      es: '1 de Octubre, 2026',
    },
    title: {
      pt: 'A Forja Rústica & Minimalista: 2 Sub-Abas Diretas e Acesso Rápido',
      en: 'Rustic & Minimalist Forge: 2 Direct Sub-Tabs and Quick Access',
      es: 'La Forja Rústica y Minimalista: 2 Sub-Pestañas Directas y Acceso Rápido',
    },
    badge: 'improvements',
    isLatest: false,
    highlights: [
      {
        icon: '⚔️',
        title: {
          pt: '2 Sub-Abas Essenciais: Protocolo Ativo e Reserva',
          en: '2 Essential Sub-Tabs: Active Protocol and Reserve Arsenal',
          es: '2 Sub-Pestañas Esenciales: Protocolo Activo y Reserva',
        },
        desc: {
          pt: 'A Forja foi simplificada com visual medieval rústico e minimalista. As 4 abas foram enxugadas para duas abas focadas em hábitos, com contadores de slots e arsenal em tempo real.',
          en: 'The Forge was simplified with a rustic medieval minimalist layout. The 4 tabs were streamlined into two habit-focused tabs with real-time slot and arsenal counters.',
          es: 'La Forja se simplificó con diseño medieval rústico y minimalista. Las 4 pestañas se redujeron a dos enfocadas en hábitos con contadores de slots y arsenal en tiempo real.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Acesso Rápido: 11 Armaduras e Regras da Forja',
          en: 'Quick Access: 11 Armors and Forge Rules',
          es: 'Acceso Rápido: 11 Armaduras y Reglas de la Forja',
        },
        desc: {
          pt: 'Botões rápidos no topo permitem inspecionar a Galeria 3D das 11 Armaduras Medievais e consultar o pergaminho de Regras de Slots e Diretrizes Táticas sem poluir a tela principal.',
          en: 'Quick top buttons allow instant inspection of the 11 Medieval Armors 3D Gallery and consulting the Slot Rules and Tactical Directives scroll without cluttering the screen.',
          es: 'Botones rápidos superiores permiten inspeccionar la Galería 3D de las 11 Armaduras Medievales y consultar el pergamino de Reglas de Slots y Directrices Tácticas sin saturar la pantalla.',
        },
      },
      {
        icon: '⚡',
        title: {
          pt: 'Cards de Hábito Táteis com Histórico 7D Discreto',
          en: 'Tactile Habit Cards with Discrete 7-Day History',
          es: 'Tarjetas de Hábitos Táctiles con Historial 7D Discreto',
        },
        desc: {
          pt: 'Bordas de aço escuro com detalhes em ouro forjado. Botões de conclusão rápida táteis e detalhes expansíveis sob demanda para um visual limpo e imersivo.',
          en: 'Dark forged steel borders with golden accents. Fast tactile completion buttons and discrete on-demand expandable details for a clean, immersive look.',
          es: 'Bordes de acero oscuro con acentos de oro forjado. Botones de conclusión rápida táctiles y detalles expandibles a demanda para una apariencia limpia e inmersiva.',
        },
      },
    ],
  },
  {
    version: 'v1.9.8',
    date: {
      pt: '1 de Outubro, 2026',
      en: 'October 1, 2026',
      es: '1 de Octubre, 2026',
    },
    title: {
      pt: 'A Forja Despoluída & Efeitos Biológicos nos Patamares',
      en: 'Streamlined Forge & Bio-Perks in Rank Inspection',
      es: 'La Forja Despejada y Bio-Beneficios en los Rangos',
    },
    badge: 'improvements',
    isLatest: false,
    highlights: [
      {
        icon: '🛡️',
        title: {
          pt: 'Efeitos Biológicos e Mentais Integrados às Armaduras',
          en: 'Biological & Mental Perks Integrated into Armors',
          es: 'Efectos Biológicos y Mentales Integrados a las Armaduras',
        },
        desc: {
          pt: 'Os benefícios neurológicos e físicos da retenção agora são inspecionados em cada um dos 11 Patamares e Armaduras Medievais (no modal e na aba de armaduras).',
          en: 'The neurological and physical benefits of retention can now be inspected directly inside each of the 11 Medieval Ranks and Armors (in the gallery modal and armors tab).',
          es: 'Los beneficios neurológicos y físicos de la retención ahora se inspeccionan directamente en cada uno de los 11 Rangos y Armaduras Medievales (en el modal y la pestaña de armaduras).',
        },
      },
      {
        icon: '🔨',
        title: {
          pt: 'Aba da Forja 100% Focada na Gestão de Hábitos',
          en: 'Forge Tab 100% Focused on Habit Management',
          es: 'Pestaña de la Forja 100% Enfocada en la Gestión de Hábitos',
        },
        desc: {
          pt: 'Removidos os cards duplicados de nível da forja e barra de progresso (que já estão ativos no QG). A aba agora é limpa, ágil e focada em slots e execução de hábitos.',
          en: 'Removed duplicate forge level card and progress bar (already active in the HQ 3D card). The tab is now ultra-clean, agile, and focused on habit execution and slots.',
          es: 'Eliminadas las tarjetas duplicadas de nivel de forja y barra de progreso (ya activas en el CG). La pestaña ahora está limpia, ágil y enfocada en hábitos y slots.',
        },
      },
    ],
  },
  {
    version: 'v1.9.7',
    date: {
      pt: '1 de Outubro, 2026',
      en: 'October 1, 2026',
      es: '1 de Octubre, 2026',
    },
    title: {
      pt: 'Polimento Mobile do QG & Barra de Carga Tática em Tempo Real',
      en: 'HQ Mobile Polish & Real-Time Tactical Charge Bar',
      es: 'Pulido Móvil del CG y Barra de Carga Táctica en Tiempo Real',
    },
    badge: 'improvements',
    isLatest: false,
    highlights: [
      {
        icon: '⚡',
        title: {
          pt: 'Barra de Carga Tática do Dia (Foco & Energia de Batalha)',
          en: "Today's Tactical Charge Bar (Focus & Battle Energy)",
          es: 'Barra de Carga Táctica del Día (Enfoque y Energía de Batalla)',
        },
        desc: {
          pt: 'Nova barra de progresso dinâmico integrando os 3 escudos de blindagem com as missões e hábitos operacionais de hoje, com feedback tátil e status visual imediato.',
          en: 'New dynamic progress gauge combining the 3 shielding barriers with today’s operational missions and habits, featuring haptic touch feedback and immediate visual status.',
          es: 'Nueva barra de progreso dinámico que integra los 3 escudos de blindaje con las misiones y hábitos operativos de hoy, con respuesta táctil y estado visual inmediato.',
        },
      },
      {
        icon: '📱',
        title: {
          pt: 'Interface de Alta Densidade com Pegada Nativa Mobile',
          en: 'High-Density Interface with Native Mobile Feel',
          es: 'Interfaz de Alta Densidad con Sensación Móvil Nativa',
        },
        desc: {
          pt: 'Botões com área de toque mínima confortável (48px), microinterações táteis ativas, status vibrantes e transições ultrarrápidas sem sobrecarregar a tela.',
          en: 'Comfortable touch target areas (48px), responsive active micro-interactions, vibrant status tags, and lightning-fast transitions optimized for one-hand operation.',
          es: 'Botones con área táctil cómoda (48px), microinteracciones táctiles activas, estados vibrantes y transiciones ultrarrápidas optimizadas para uso móvil.',
        },
      },
    ],
  },
  {
    version: 'v1.9.6',
    date: {
      pt: '1 de Outubro, 2026',
      en: 'October 1, 2026',
      es: '1 de Octubre, 2026',
    },
    title: {
      pt: 'Página de Vendas 100% Alinhada ao Arsenal da Forja',
      en: 'Sales Page 100% Aligned with The Forge Arsenal',
      es: 'Página de Ventas 100% Alineada con el Arsenal de la Forja',
    },
    badge: 'improvements',
    isLatest: false,
    highlights: [
      {
        icon: '🌐',
        title: {
          pt: 'Destaque Multilíngue (3 Idiomas) & Acesso Navegador (PC + Mobile)',
          en: 'Multilingual Highlight (3 Languages) & Browser Access (PC + Mobile)',
          es: 'Destacado Multilingüe (3 Idiomas) y Acceso en Navegador (PC + Celular)',
        },
        desc: {
          pt: 'A página de vendas agora destaca com clareza o suporte total aos 3 idiomas (PT · EN · ES), funcionamento direto no navegador de qualquer dispositivo (PWA) e os novos módulos do app: Dossiê Clínico do Inimigo, Missões Táticas e Bio-benefícios da Retenção.',
          en: 'The landing page now clearly highlights full 3-language support (PT · EN · ES), browser multiplatform access (PWA), and all current app modules: The Enemy Revealed Clinical Dossier, Tactical Missions, and Active Bio-Perks.',
          es: 'La página de ventas ahora destaca con claridad el soporte total a los 3 idiomas (PT · EN · ES), funcionamiento directo en el navegador de cualquier dispositivo (PWA) y los nuevos módulos: Dossier Clínico del Enemigo, Misiones Tácticas y Bio-beneficios de Retención.',
        },
      },
    ],
  },
  {
    version: 'v1.9.5',
    date: {
      pt: '30 de Setembro, 2026',
      en: 'September 30, 2026',
      es: '30 de Septiembre, 2026',
    },
    title: {
      pt: 'Remoção de Frases Duplicadas na Forja',
      en: 'Removal of Duplicate Quotes in The Forge',
      es: 'Eliminación de Frases Duplicadas en La Forja',
    },
    badge: 'latest',
    isLatest: false,
    highlights: [
      {
        icon: '🗡️',
        title: {
          pt: 'Interface da Forja Mais Focada e Limpa',
          en: 'Cleaner and More Focused Forge Interface',
          es: 'Interfaz de la Forja Más Enfocada y Limpia',
        },
        desc: {
          pt: 'As frases diárias e lemas de combate foram removidos da aba Forja, mantendo-os centralizados com elegância e dinamismo no QG do Guerreiro.',
          en: 'Daily quotes and battle focus axioms were removed from The Forge tab, keeping them elegantly and dynamically centralized in the Warrior HQ.',
          es: 'Las frases diarias y lemas de combate se eliminaron de la pestaña Forja, manteniéndolos centralizados con elegancia y dinamismo en el CG del Guerrero.',
        },
      },
    ],
  },
  {
    version: 'v1.9.4',
    date: {
      pt: '30 de Setembro, 2026',
      en: 'September 30, 2026',
      es: '30 de Septiembre, 2026',
    },
    title: {
      pt: 'Desarquivamento Independente de Tarefas de Projetos Arquivados',
      en: 'Independent Unarchiving of Tasks from Archived Projects',
      es: 'Desarchivado Independiente de Tareas de Proyectos Archivados',
    },
    badge: 'latest',
    isLatest: false,
    highlights: [
      {
        icon: '🎯',
        title: {
          pt: 'Restauração Precisa de Tarefas Arquivadas',
          en: 'Precise Restoration of Archived Tasks',
          es: 'Restauración Precisa de Tareas Archivadas',
        },
        desc: {
          pt: 'Ao desarquivar uma tarefa de um projeto arquivado, ela agora volta a rodar imediatamente na lista ativa de operações e no QG, enquanto o projeto pai continua com segurança arquivado.',
          en: 'When unarchiving a task from an archived project, it now resumes running immediately in the active operations list and HQ, while the parent project remains safely archived.',
          es: 'Al desarchivar una tarea de un proyecto archivado, ahora vuelve a correr de inmediato en la lista activa de operaciones y en el CG, mientras el proyecto padre permanece archivado con seguridad.',
        },
      },
    ],
  },
  {
    version: 'v1.9.3',
    date: {
      pt: '30 de Setembro, 2026',
      en: 'September 30, 2026',
      es: '30 de Septiembre, 2026',
    },
    title: {
      pt: 'Frases Completas em 2 Linhas & Build Estável na Vercel',
      en: 'Full 2-Line Phrases & Stable Vercel Build',
      es: 'Frases Completas en 2 Líneas y Build Estable en Vercel',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '📱',
        title: {
          pt: 'Frases sem Truncamento em Qualquer Smartphone',
          en: 'Untruncated Phrases Across Any Smartphone Screen',
          es: 'Frases sin Truncamiento en Cualquier Teléfono',
        },
        desc: {
          pt: 'O lema tático para vencer o dia e a frase do dia contam com linha dedicada de largura total sem reticências, garantindo legibilidade imediata em qualquer resolução mobile.',
          en: 'The tactical mantra to conquer the day and the quote of the day feature dedicated full-width lines with no ellipsis, ensuring immediate readability on any mobile screen.',
          es: 'El lema táctico para vencer el día y la frase del día cuentan con línea dedicada de ancho total sin puntos suspensivos, garantizando legibilidad inmediata en cualquier móvil.',
        },
      },
    ],
  },
  {
    version: 'v1.9.2',
    date: {
      pt: '30 de Setembro, 2026',
      en: 'September 30, 2026',
      es: '30 de Septiembre, 2026',
    },
    title: {
      pt: 'Ajuste de Tipografia & Frases Completas sem Cortes no Mobile',
      en: 'Typography & Full Uncut Phrases on Mobile',
      es: 'Ajuste de Tipografía y Frases Completas sin Cortes en Móvil',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '📱',
        title: {
          pt: 'Frases Inteiras com Quebra Fluida sem Reticências',
          en: 'Full Uncut Phrases with Fluid Line Wrapping',
          es: 'Frases Completas con Salto Fluido sin Puntos Suspensivos',
        },
        desc: {
          pt: 'Reestruturado o layout da frase do dia e do lema das 24 horas no mobile: as frases agora ocupam largura total dedicada e quebram linhas naturalmente, eliminando cortes de texto e reticências.',
          en: 'Restructured the mobile quote and 24-hour mantra layout: phrases now occupy full dedicated width and wrap naturally, completely eliminating cutoffs and ellipsis.',
          es: 'Reestructurado el diseño de la frase del día y del lema de 24 horas en móvil: las frases ahora ocupan ancho total dedicado y saltan de línea con fluidez, eliminando cortes y puntos suspensivos.',
        },
      },
    ],
  },
  {
    version: 'v1.9.1',
    date: {
      pt: '30 de Setembro, 2026',
      en: 'September 30, 2026',
      es: '30 de Septiembre, 2026',
    },
    title: {
      pt: 'Frases de Guerra Integradas no Contador das 24 Horas',
      en: 'Battle Mantras Embedded in the 24-Hour Counter',
      es: 'Frases de Batalla Integradas en el Contador de 24 Horas',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⚔️',
        title: {
          pt: 'Frases Motivacionais Dinâmicas: "Vença o Hoje"',
          en: 'Dynamic Motivational Phrases: "Conquer Today"',
          es: 'Frases Motivacionales Dinámicas: "Vence el Hoy"',
        },
        desc: {
          pt: 'Integradas frases táticas rotativas diretamente no centro da barra de 24 horas ("Vença o hoje", "Apenas as próximas 24h", "Um dia limpo por vez forja o império"). Elas alternam automaticamente a cada 9 segundos e também mudam ao tocar na frase.',
          en: 'Dynamic rotating tactical mantras embedded directly at the center of the 24-hour clock ("Conquer today", "Only the next 24h", "One clean day at a time builds the empire"). They cycle automatically every 9 seconds and rotate instantly upon tapping the quote.',
          es: 'Frases tácticas rotativas integradas directamente en el centro de la barra de 24 horas ("Vence el hoy", "Solo las próximas 24h", "Un día limpio a la vez forja el imperio"). Cambian automáticamente cada 9 segundos y también al tocar la frase.',
        },
      },
    ],
  },
  {
    version: 'v1.9.0',
    date: {
      pt: '30 de Setembro, 2026',
      en: 'September 30, 2026',
      es: '30 de Septiembre, 2026',
    },
    title: {
      pt: 'Pilares Retráteis por Toque & Notificação "Venceu o Dia?"',
      en: 'Collapsible Touch Pillars & "Did You Conquer Today?" Alert',
      es: 'Pilares Retráctiles por Toque y Notificación "¿Venciste el Día?"',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🛡️',
        title: {
          pt: 'Pilares Compactos Retráteis (Abrem com 1 Toque)',
          en: 'Compact Collapsible Pillars (Open on Tap)',
          es: 'Pilares Compactos Retráctiles (Se Abren al Tocar)',
        },
        desc: {
          pt: 'Os 3 pilares agora iniciam recolhidos para economizar espaço e manter o foco visual na tela, expandindo com 1 toque para você selar suas vitórias diárias. O botão de registrar queda/falha permanece 100% visível e acessível a qualquer momento.',
          en: 'The 3 pillars now start neatly collapsed to save screen space and preserve focus, expanding with a single tap to seal your daily victories. The battle fall/failure button remains 100% visible and instantly accessible at all times.',
          es: 'Los 3 pilares ahora inician replegados para ahorrar espacio y mantener el enfoque, expandiéndose con 1 toque para sellar tus victorias diarias. El botón de registrar caída/fallo permanece 100% visible y accesible en todo momento.',
        },
      },
      {
        icon: '⚔️',
        title: {
          pt: 'Notificação Tática: "Você Venceu o Dia Hoje?"',
          en: 'Tactical Prompt: "Did You Conquer Today, Warrior?"',
          es: 'Notificación Táctica: "¿Venciste el Día Hoy, Guerrero?"',
        },
        desc: {
          pt: 'Nova convocação noturna (notificações push e no app) perguntando se você venceu o dia de hoje, convidando a selar seus 3 pilares e manter seu streak inabalável.',
          en: 'New evening summons (push and in-app notifications) asking if you conquered today, inviting you to seal your 3 pillars and preserve your unshakable streak.',
          es: 'Nueva convocatoria nocturna (notificaciones push y en la app) preguntando si venciste el día hoy, invitándote a sellar tus 3 pilares y mantener tu racha inquebrantable.',
        },
      },
    ],
  },
  {
    version: 'v1.8.9',
    date: {
      pt: '30 de Setembro, 2026',
      en: 'September 30, 2026',
      es: '30 de Septiembre, 2026',
    },
    title: {
      pt: 'Acesso Direto e Focado aos Projetos da Agenda',
      en: 'Direct & Focused Deep-Link to Schedule Projects',
      es: 'Acceso Directo y Focalizado a los Proyectos de la Agenda',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🏛️',
        title: {
          pt: 'Deep-Link Direto ao Clicar no Projeto',
          en: 'Direct Deep-Link on Project Click',
          es: 'Enlace Directo al Hacer Clic en el Proyecto',
        },
        desc: {
          pt: 'Ao clicar em qualquer projeto ou no botão "VER PROJETO" na Agenda Operacional de Hoje, você vai direto para a sub-aba de Projetos Estratégicos, abrindo e expandindo o projeto específico sem passos intermediários em tarefas.',
          en: 'When clicking any project or the "VIEW PROJECT" button in Today’s Combat Schedule, you are taken straight to the Strategic Projects sub-tab, opening and auto-expanding that specific project without intermediate task steps.',
          es: 'Al hacer clic en cualquier proyecto o en el botón "VER PROYECTO" en la Agenda Operacional de Hoy, vas directo a la sub-pestaña de Proyectos Estratégicos, abriendo y expandiendo el proyecto específico sin pasos intermedios.',
        },
      },
      {
        icon: '⚡',
        title: {
          pt: 'Destaque Dourado Radiante e Rolagem Suave',
          en: 'Radiant Golden Highlight & Smooth Scroll',
          es: 'Destaque Dorado Radiante y Desplazamiento Suave',
        },
        desc: {
          pt: 'O card do projeto selecionado recebe um brilho dourado pulsante e a tela desliza suavemente até ele, colocando todos os mandamentos, hábitos e tarefas do projeto imediatamente à vista.',
          en: 'The selected project card receives a pulsing gold glow and the view smoothly scrolls right to it, putting all commandments, habits, and tasks of that project instantly in focus.',
          es: 'La tarjeta del proyecto seleccionado recibe un resplandor dorado pulsante y la vista se desplaza suavemente hacia ella, mostrando mandamientos, hábitos y tareas al instante.',
        },
      },
      {
        icon: '🎯',
        title: {
          pt: 'Navegação em Tarefas Vinculadas e Barra Rápida',
          en: 'Clickable Project Badges in Tasks & Quick Bar',
          es: 'Insignias de Proyecto Cliqueables en Tareas y Barra Rápida',
        },
        desc: {
          pt: 'Tarefas vinculadas a um projeto exibem o emblema clicável para abrir diretamente seu projeto-mãe, e a barra inferior da Agenda agora inclui o atalho direto para Projetos.',
          en: 'Tasks linked to a project display a clickable badge to jump directly into their parent project, and the schedule bottom bar now includes a direct Projects shortcut.',
          es: 'Las tareas vinculadas a un proyecto muestran la insignia cliqueable para saltar directo a su proyecto padre, y la barra inferior de la Agenda incluye un acceso directo a Proyectos.',
        },
      },
    ],
  },
  {
    version: 'v1.8.8',
    date: {
      pt: '30 de Setembro, 2026',
      en: 'September 30, 2026',
      es: '30 de Septiembre, 2026',
    },
    title: {
      pt: 'Agenda Operacional Unificada e Fila Dinâmica no QG',
      en: 'Unified Combat Schedule & Dynamic Queue in HQ',
      es: 'Agenda Operacional Unificada y Cola Dinámica en el QG',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⏰',
        title: {
          pt: 'Unificação Total: Sem Repetições de Cards',
          en: 'Total Unification: Zero Duplicate Cards',
          es: 'Unificación Total: Cero Tarjetas Duplicadas',
        },
        desc: {
          pt: 'Os cards e atalhos duplicados de "Hábitos da Forja" e "Operações do Dia" foram removidos do QG. Agora existe apenas a Agenda Operacional de Hoje, reunindo com clareza todas as tarefas, hábitos e projetos.',
          en: 'Duplicate cards and shortcuts for "Forge Habits" and "Daily Operations" were removed from HQ. Now there is only Today\'s Combat Schedule, cleanly uniting all tasks, habits, and projects.',
          es: 'Se eliminaron del QG las tarjetas y accesos directos duplicados de "Hábitos de la Forja" y "Operaciones del Día". Ahora solo existe la Agenda Operacional de Hoy, reuniendo con claridad todas las tareas, hábitos y proyectos.',
        },
      },
      {
        icon: '⚔️',
        title: {
          pt: 'Fila Dinâmica: Marcou, Saiu, Próxima Entrou',
          en: 'Dynamic Queue: Complete, Clears Out, Next Steps In',
          es: 'Cola Dinámica: Marcó, Sale, Siguiente Entra',
        },
        desc: {
          pt: 'Ao marcar qualquer tarefa ou hábito no card, ele sai imediatamente da visualização ativa e a próxima missão pendente do dia entra na lista para ser cumprida, mantendo o foco absoluto nas prioridades.',
          en: 'When completing any task or habit in the card, it immediately leaves the active view and the next pending mission of the day enters the list, maintaining absolute focus on priorities.',
          es: 'Al marcar cualquier tarea o hábito en la tarjeta, sale inmediatamente de la vista activa y la siguiente misión pendiente del día entra a la lista, manteniendo el enfoque absoluto en las prioridades.',
        },
      },
      {
        icon: '🏆',
        title: {
          pt: 'Histórico de Concluídas e Ações Rápidas',
          en: 'Completed Missions Drawer & Quick Actions',
          es: 'Historial de Completadas y Acciones Rápidas',
        },
        desc: {
          pt: 'Visualização rápida de missões concluídas com toggle expansível (permitindo desmarcar em caso de engano) e botões diretos para gerenciar Operações e Forja.',
          en: 'Quick view of completed missions with expandable toggle (allowing unmarking if needed) and direct buttons to manage Operations and Forge.',
          es: 'Vista rápida de misiones completadas con interruptor expandible (permitiendo desmarcar en caso de error) y botones directos para gestionar Operaciones y Forja.',
        },
      },
    ],
  },
  {
    version: 'v1.8.7',
    date: {
      pt: '29 de Setembro, 2026',
      en: 'September 29, 2026',
      es: '29 de Septiembre, 2026',
    },
    title: {
      pt: 'Lemas Táticos Transferidos para a Aba "A Forja"',
      en: 'Tactical Mantras Transferred to "The Forge" Tab',
      es: 'Lemas Tácticos Transferidos a la Pestaña "La Forja"',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⚔️',
        title: {
          pt: 'Foco Tático Dinâmico Centralizado na Forja',
          en: 'Dynamic Tactical Focus Centralized in The Forge',
          es: 'Enfoque Táctico Dinámico Centralizado en La Forja',
        },
        desc: {
          pt: 'Os lemas táticos rotativos ("Vença o hoje", "Hoje é o que importa", "Apenas as próximas 24h") foram movidos com perfeição para a aba "A Forja", em banner dinâmico e interativo com rotação a cada 10 segundos ou ao toque.',
          en: 'The rotating tactical mantras ("Conquer today", "Today is what matters", "Only the next 24h") have been cleanly moved to the "The Forge" tab into a dynamic and interactive banner rotating every 10 seconds or on tap.',
          es: 'Los lemas tácticos rotativos ("Vence el hoy", "Hoy es lo que importa", "Solo las próximas 24h") han sido trasladados a la pestaña "La Forja", en un banner dinámico e interactivo con rotación cada 10 segundos o al toque.',
        },
      },
      {
        icon: '⏳',
        title: {
          pt: 'Tela Inicial e Card do Guerreiro Ultra Limpos',
          en: 'Ultra Clean Home Screen & Warrior Card',
          es: 'Pantalla Inicial y Tarjeta del Guerrero Ultra Limpias',
        },
        desc: {
          pt: 'O relógio das 24 horas no Card do Guerreiro voltou ao layout minimalista e espaçoso de linha única (tempo restante, barra metálica e percentual do dia), sem sobrecarga visual.',
          en: 'The 24h timer in the Warrior Card has returned to its single-line minimalist layout (time left, metallic bar, and day percentage), without visual clutter.',
          es: 'El reloj de 24 horas en la Tarjeta del Guerrero volvió al diseño minimalista y espacioso de línea única (tiempo restante, barra metálica y porcentaje del día), sin sobrecarga visual.',
        },
      },
      {
        icon: '🧬',
        title: {
          pt: 'Efeitos Biológicos & Protocolo Tático na Forja',
          en: 'Biological Effects & Tactical Protocol in The Forge',
          es: 'Efectos Biológicos y Protocolo Táctico en La Forja',
        },
        desc: {
          pt: 'Os blocos de Efeitos Biológicos Ativos e Protocolo Tático de Guerra foram centralizados na aba "A Forja", mantendo o QG despoluído e com foco total de combate.',
          en: 'The Active Biological Effects and Tactical Protocol blocks are now centralized in "The Forge" tab, keeping HQ clean and fully battle-focused.',
          es: 'Los bloques de Efectos Biológicos Activos y Protocolo Táctico están centralizados en la pestaña "La Forja", manteniendo el QG despejado y con foco total de combate.',
        },
      },
    ],
  },
  {
    version: 'v1.8.6',
    date: {
      pt: '29 de Setembro, 2026',
      en: 'September 29, 2026',
      es: '29 de Septiembre, 2026',
    },
    title: {
      pt: 'Lemas Táticos Dinâmicos no Relógio das 24 Horas',
      en: 'Dynamic Tactical Mantras on 24-Hour Clock',
      es: 'Lemas Tácticos Dinámicos en el Reloj de 24 Horas',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⚔️',
        title: {
          pt: 'Mantras de Foco que Alternam Durante o Dia',
          en: 'Focus Mantras Rotating Throughout the Day',
          es: 'Mantras de Enfoque que Cambian Durante el Día',
        },
        desc: {
          pt: 'Incorporado texto tático dinâmico ("Vença o hoje", "Hoje é o que importa", "Apenas as próximas 24h") no centro do relógio das 24h. O texto alterna de forma automática e suave, com suporte a toque para avançar.',
          en: 'Embedded dynamic tactical text ("Conquer today", "Today is what matters", "Only the next 24h") at the center of the 24h clock. Phrases rotate automatically and smoothly, with tap-to-advance support.',
          es: 'Incorporado texto táctico dinámico ("Vence el hoy", "Hoy es lo que importa", "Solo las próximas 24h") en el centro del reloj de 24h. Las frases cambian de forma automática y suave, con soporte para tocar y avanzar.',
        },
      },
    ],
  },
  {
    version: 'v1.8.5',
    date: {
      pt: '29 de Setembro, 2026',
      en: 'September 29, 2026',
      es: '29 de Septiembre, 2026',
    },
    title: {
      pt: 'Integração do Contador 24h e Remoção do Botão de Pacto',
      en: '24h Timer Integration & Pact Button Removal',
      es: 'Integración del Contador 24h y Eliminación del Botón de Pacto',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⏳',
        title: {
          pt: 'Linha Tática das 24 Horas Integrada ao Guerreiro',
          en: '24-Hour Tactical Line Integrated into Warrior',
          es: 'Línea Táctica de 24 Horas Integrada al Guerrero',
        },
        desc: {
          pt: 'O contador de horas restantes e a barra de progresso do dia agora ficam incorporados de forma minimalista logo abaixo da Frase do Dia, acima da cabeça do guerreiro.',
          en: 'The remaining hours counter and day progress bar are now seamlessly embedded in a minimalist line right below the Quote of the Day, above the warrior\'s head.',
          es: 'El contador de horas restantes y la barra de progreso del día ahora están incorporados de forma minimalista justo debajo de la Frase del Día, sobre la cabeza del guerrero.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Fim do Botão Redundante de Pacto e Card Avulso',
          en: 'Removal of Redundant Pact Button & Extra Card',
          es: 'Eliminación del Botón Redundante de Pacto y Tarjeta Suelta',
        },
        desc: {
          pt: 'O card separado da Batalha das 24h e o botão de pacto foram removidos, liberando mais de 150px de espaço na tela e dando acesso direto aos 3 Escudos da Blindagem.',
          en: 'The separate 24h Battle card and the pact button were removed, saving over 150px of vertical space and providing direct access to the 3 Shield Checkins.',
          es: 'La tarjeta separada de la Batalla de las 24h y el botón de pacto fueron eliminados, liberando más de 150px de espacio vertical y dando acceso directo a los 3 Escudos de Blindaje.',
        },
      },
    ],
  },
  {
    version: 'v1.8.4',
    date: {
      pt: '29 de Setembro, 2026',
      en: 'September 29, 2026',
      es: '29 de Septiembre, 2026',
    },
    title: {
      pt: 'Unificação da Frase do Dia e Otimização Visual do QG',
      en: 'Quote of the Day Unification & HQ Visual Optimization',
      es: 'Unificación de la Frase del Día y Optimización Visual del CG',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⚡',
        title: {
          pt: 'Frase do Dia Integrada ao Card do Guerreiro',
          en: 'Quote of the Day Integrated into Warrior Card',
          es: 'Frase del Día Integrada a la Tarjeta del Guerrero',
        },
        desc: {
          pt: 'As frases motivacionais agora ficam unificadas e perfeitamente harmonizadas no card do Guerreiro 3D. Basta um toque na frase para alternar reflexões inspiradoras com rotação suave e contador diário.',
          en: 'Motivational quotes are now unified and seamlessly harmonized inside the 3D Warrior card. Simply tap the quote to rotate through inspiring reflections with smooth transitions and daily counter.',
          es: 'Las frases motivacionales ahora están unificadas y perfectamente armonizadas en la tarjeta del Guerrero 3D. Basta un toque en la frase para cambiar reflexiones inspiradoras con rotación suave y contador diario.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Eliminação da Poluição Visual e Foco Total',
          en: 'Zero Visual Clutter & Maximum Focus',
          es: 'Eliminación de Polución Visual y Foco Total',
        },
        desc: {
          pt: 'Removidos os blocos redundantes de frases avulsas do topo e das telas mobile e desktop. O Guerreiro da Forja e a Batalha das 24 Horas ganham destaque imediato e navegação muito mais limpa.',
          en: 'Removed redundant separate quote banners from the top of both mobile and desktop screens. The Forge Warrior and the 24-Hour Battle now receive immediate focus in a much cleaner layout.',
          es: 'Eliminados los bloques redundantes de frases sueltas de la parte superior en móvil y escritorio. El Guerrero de la Forja y la Batalla de las 24 Horas ganan protagonismo inmediato con un diseño mucho más limpio.',
        },
      },
    ],
  },
  {
    version: 'v1.8.3',
    date: {
      pt: '29 de Setembro, 2026',
      en: 'September 29, 2026',
      es: '29 de Septiembre, 2026',
    },
    title: {
      pt: 'Proteção do Histórico de Conclusões da Operação',
      en: 'Protection of Operation Completion History',
      es: 'Protección del Historial de Conclusiones de la Operación',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🛡️',
        title: {
          pt: 'Histórico Seguro Sem Botão de Exclusão Acidental',
          en: 'Safe History Without Accidental Deletion Button',
          es: 'Historial Seguro Sin Botón de Eliminación Accidental',
        },
        desc: {
          pt: 'Removido o botão de exclusão de datas na lista de datas cumpridas. Suas vitórias e dias honrados permanecem blindados contra toques acidentais, mantendo a integridade total do seu histórico.',
          en: 'Removed the date deletion button from the completed dates log. Your recorded victories and honored days remain shielded against accidental taps, maintaining the full integrity of your history.',
          es: 'Eliminado el botón de borrado de fechas en la lista de fechas cumplidas. Tus victorias y días honrados permanecen blindados contra toques accidentales, manteniendo la integridad total de tu historial.',
        },
      },
    ],
  },
  {
    version: 'v1.8.2',
    date: {
      pt: '29 de Setembro, 2026',
      en: 'September 29, 2026',
      es: '29 de Septiembre, 2026',
    },
    title: {
      pt: 'Refinamento Visual do Modal de Análise de Operações',
      en: 'Visual Refinement for Operation Analysis Modal',
      es: 'Refinamiento Visual del Modal de Análisis de Operaciones',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '✨',
        title: {
          pt: 'Topo Harmonizado e Botão de Fechar Único',
          en: 'Harmonized Header & Single Close Button',
          es: 'Encabezado Armonizado y Botón de Cierre Único',
        },
        desc: {
          pt: 'Eliminado o botão duplicado de fechar no topo do card de Análise da Operação. A interface agora conta com um único botão de fecho perfeitamente posicionado e alinhado.',
          en: 'Removed the duplicate close button at the top of the Operation Analysis card. The interface now features a single, perfectly positioned close button.',
          es: 'Eliminado el botón duplicado de cerrar en la parte superior de la tarjeta de Análisis de la Operación. La interfaz ahora cuenta con un único botón de cierre perfectamente posicionado.',
        },
      },
    ],
  },
  {
    version: 'v1.8.1',
    date: {
      pt: '29 de Setembro, 2026',
      en: 'September 29, 2026',
      es: '29 de Septiembre, 2026',
    },
    title: {
      pt: 'Cálculo de Progresso Real de Projetos & Análise Estratégica de Operações',
      en: 'Real Multi-Day Project Progress Calculation & Deep Operation Analysis',
      es: 'Cálculo Real del Progreso de Proyectos y Análisis Estratégico de Operaciones',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '📊',
        title: {
          pt: 'Progresso Real e Cumulativo em Projetos de 21 a 90 Dias',
          en: 'Real & Cumulative Progress in 21 to 90 Day Projects',
          es: 'Progreso Real y Acumulativo en Proyectos de 21 a 90 Días',
        },
        desc: {
          pt: 'Projetos com duração em dias (como 21 dias) agora calculam a evolução acumulada real conforme você cumpre suas operações diárias. O progresso não zera mais a cada novo dia e exibe com clareza os dias cumpridos da meta.',
          en: 'Projects with set duration (such as 21 days) now accurately compute real cumulative progress as you complete daily missions. Progress no longer resets to zero each morning and clearly displays completed days against the goal.',
          es: 'Los proyectos con duración en días (como 21 días) ahora calculan con exactitud el progreso acumulado real al cumplir tus misiones diarias. El progreso ya no se reinicia a cero cada mañana y muestra con claridad los días cumplidos de la meta.',
        },
      },
      {
        icon: '📈',
        title: {
          pt: 'Análise Estratégica Completa da Tarefa / Operação',
          en: 'Comprehensive Strategic Task & Operation Analysis',
          es: 'Análisis Estratégico Completo de la Tarea / Operación',
        },
        desc: {
          pt: 'Ao tocar no ícone de gráfico ou na sequência da missão, acesse um painel detalhado com 4 KPIs: Total de Conclusões, Sequência Ativa (Streak), Taxa de Consistência dos últimos 30 dias e Contribuição no Projeto, com calendário interativo dos últimos 14 dias.',
          en: 'Tap the chart icon or mission streak badge to access a detailed panel with 4 KPIs: Total Completions, Active Streak, 30-Day Consistency Rate, and Project Goal Contribution, featuring an interactive 14-day history heatmap.',
          es: 'Al tocar el icono de gráfico o la racha de la misión, accede a un panel detallado con 4 KPIs: Total de Conclusiones, Racha Activa (Streak), Tasa de Consistencia de los últimos 30 días y Contribución al Proyecto, con calendario interactivo de los últimos 14 días.',
        },
      },
      {
        icon: '🔗',
        title: {
          pt: 'Sugestão e Vínculo Inteligente com 1 Toque',
          en: 'Smart Matching & 1-Tap Task Linking',
          es: 'Sugerencia y Vinculación Inteligente con 1 Toque',
        },
        desc: {
          pt: 'Caso tenha criado uma operação avulsa com o nome do projeto (como o Salmo 139), um aviso inteligente no card permite vinculá-la com 1 toque para sincronizar o progresso imediatamente.',
          en: 'If you created a standalone operation matching your project title (like Psalm 139), an intelligent card banner lets you link it with 1 tap to instantly synchronize progress.',
          es: 'Si creaste una operación suelta con el nombre del proyecto (como el Salmo 139), un aviso inteligente en la tarjeta te permite vincularla con 1 toque para sincronizar el progreso de inmediato.',
        },
      },
    ],
  },
  {
    version: 'v1.8.0',
    date: {
      pt: '29 de Setembro, 2026',
      en: 'September 29, 2026',
      es: '29 de Septiembre, 2026',
    },
    title: {
      pt: 'Tour com Setas Indicativas na Tela Real e Tradução 100% Multilíngue',
      en: 'App Tour with Live Screen Pointer Arrows & 100% Multilingual Translations',
      es: 'Tour con Flechas Indicativas en Pantalla Real y Traducción 100% Multilingüe',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🎯',
        title: {
          pt: 'Setas Indicativas e Spotlights na Tela Real',
          en: 'Pointer Arrows & Spotlights on Live App Screen',
          es: 'Flechas Indicativas y Spotlights en la Pantalla Real',
        },
        desc: {
          pt: 'Assim como nos melhores apps, o manual agora exibe setas animadas pulsantes e anéis de radar apontando diretamente para as funções reais na interface (3 Torres, Hábitos da Forja, Missões de Operações, Botão S.O.S e Bússola).',
          en: 'Just like top applications, the manual now displays animated bouncing pointer arrows and radar spotlights pointing directly to live interface functions (3 Towers, Forge Habits, Operations Missions, S.O.S Button, and Compass).',
          es: 'Como en las mejores aplicaciones, el manual ahora muestra flechas animadas y radares de luz apuntando directamente a las funciones reales (3 Torres, Hábitos de la Forja, Misiones de Operaciones, Botón S.O.S y Brújula).',
        },
      },
      {
        icon: '🌐',
        title: {
          pt: '100% dos Textos e Previews Traduzidos (PT, EN, ES)',
          en: '100% Translated Texts & Previews (PT, EN, ES)',
          es: '100% de Textos y Previews Traducidos (PT, EN, ES)',
        },
        desc: {
          pt: 'Eliminado qualquer resquício em português ao selecionar Inglês ou Espanhol. Todos os cards de simulação, dicas de combate, badges e botões foram calibrados com precisão trilingue.',
          en: 'Eliminated all untranslated traces when English or Spanish is selected. All preview cards, combat directives, badges, and buttons are precisely translated.',
          es: 'Eliminado cualquier rastro en portugués al seleccionar inglés o español. Todas las tarjetas de simulación, directrices de combate, badges y botones están traducidos con precisión.',
        },
      },
      {
        icon: '👁️',
        title: {
          pt: 'Visualização Limpa sem Bloqueio de Tela',
          en: 'Clean View Without Screen Blur Obstruction',
          es: 'Visualización Limpia sin Obstrucción de Pantalla',
        },
        desc: {
          pt: 'O fundo escurecido agora possui transparência equilibrada sem borrão, permitindo que você veja o aplicativo funcionando perfeitamente atrás das explicações.',
          en: 'The dimmed backdrop now features balanced transparency without heavy blur, allowing you to clearly see the real app working behind the explanations.',
          es: 'El fondo oscurecido ahora tiene una transparencia equilibrada sin desenfoque excesivo, permitiéndote ver la aplicación funcionando claramente detrás de las explicaciones.',
        },
      },
    ],
  },
  {
    version: 'v1.7.9',
    date: {
      pt: '29 de Setembro, 2026',
      en: 'September 29, 2026',
      es: '29 de Septiembre, 2026',
    },
    title: {
      pt: 'Correção Visual: Manual do Guerreiro com Setas Indicativas e Simulação das Ferramentas',
      en: 'Visual Fix: Warrior Manual with Pointer Arrows & Tool Previews',
      es: 'Corrección Visual: Manual del Guerrero con Flechas Indicativas y Simulación de Herramientas',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🎯',
        title: {
          pt: 'Setas Indicativas Animadas e Visibilidade 100%',
          en: 'Animated Pointer Arrows & 100% Visibility',
          es: 'Flechas Indicativas Animadas y Visibilidad 100%',
        },
        desc: {
          pt: 'Corrigido o problema de visualização onde o fundo ficava escuro sem exibir o card. O manual agora renderiza com setas indicativas douradas animadas e simulação visual de cada ferramenta.',
          en: 'Fixed the issue where the screen darkened without showing the card. The manual now renders with animated gold pointer arrows and visual tool previews.',
          es: 'Corregido el problema donde la pantalla se oscurecía sin mostrar la tarjeta. El manual ahora se muestra con flechas doradas animadas y simulación visual de cada herramienta.',
        },
      },
      {
        icon: '⚡',
        title: {
          pt: 'Transição Suave de Abas em Tempo Real',
          en: 'Real-Time Live Tab Transitions',
          es: 'Transición en Vivo de Pestañas',
        },
        desc: {
          pt: 'Ao avançar no manual, a página no fundo muda para a aba correspondente (QG, Forja, Operações), guiando o guerreiro de forma imersiva.',
          en: 'As you navigate through the manual, the background page transitions to the corresponding tab (HQ, Forge, Operations), guiding the warrior immersively.',
          es: 'Al avanzar en el manual, la página de fondo cambia a la pestaña correspondiente (QG, Forja, Operaciones), guiando al guerrero de manera inmersiva.',
        },
      },
    ],
  },
  {
    version: 'v1.7.8',
    date: {
      pt: '29 de Setembro, 2026',
      en: 'September 29, 2026',
      es: '29 de Septiembre, 2026',
    },
    title: {
      pt: 'Tour com Setas Indicativas: Apresentação Visual nas Ferramentas Reais',
      en: 'Arrow Pointer Tour: Visual Walkthrough on Real Tools',
      es: 'Tour con Flechas Indicativas: Presentación Visual en Herramientas Reales',
    },
    badge: 'recent',
    isLatest: false,
    highlights: [
      {
        icon: '🎯',
        title: {
          pt: 'Setas Animadas Apontando Direto para Cada Ferramenta',
          en: 'Animated Arrows Pointing Directly to Each Tool',
          es: 'Flechas Animadas Apuntando Directo a Cada Herramienta',
        },
        desc: {
          pt: 'O tour agora ilumina o elemento exato da tela com efeito spotlight e uma seta indicativa dourada dinâmica que se posiciona acima ou abaixo do QG, Forja, Operações e do botão vermelho S.O.S.',
          en: 'The tour now illuminates the exact screen element with a spotlight effect and a dynamic gold pointer arrow positioned above or below HQ, Forge, Operations, and the red S.O.S button.',
          es: 'El tour ahora ilumina el elemento exacto con efecto spotlight y una flecha indicadora dorada dinámica posicionada arriba o abajo del QG, Forja, Operaciones y el botón rojo S.O.S.',
        },
      },
      {
        icon: '⚡',
        title: {
          pt: 'Navegação Automática de Abas',
          en: 'Automatic Tab Transition',
          es: 'Transición Automática de Pestañas',
        },
        desc: {
          pt: 'Ao avançar no manual, o app navega suavemente entre as abas em tempo real, mostrando na prática onde fica cada função em qualquer celular ou computador.',
          en: 'As you advance, the app smoothly switches between tabs in real time, visually showcasing where each feature lives on any mobile or desktop device.',
          es: 'Al avanzar, la app cambia de pestaña en tiempo real, mostrando visualmente dónde se encuentra cada función en cualquier dispositivo.',
        },
      },
    ],
  },
  {
    version: 'v1.7.7',
    date: {
      pt: '29 de Setembro, 2026',
      en: 'September 29, 2026',
      es: '29 de Septiembre, 2026',
    },
    title: {
      pt: 'Manual do Guerreiro: Tour Guiado Interativo de Apresentação',
      en: "Warrior's Manual: Interactive Guided App Tour",
      es: 'Manual del Guerrero: Tour Guiado Interactivo de Presentación',
    },
    badge: 'recent',
    isLatest: false,
    highlights: [
      {
        icon: '🧭',
        title: {
          pt: 'Tour Guiado em 5 Etapas Táticas',
          en: 'Guided Tour across 5 Tactical Steps',
          es: 'Tour Guiado en 5 Etapas Tácticas',
        },
        desc: {
          pt: 'Apresentação interativa que ensina em poucos segundos como dominar o QG (3 Torres), Forja de Hábitos, Missões Operacionais, Dossiê do Inimigo e o Botão de Emergência S.O.S.',
          en: 'Interactive walkthrough explaining within seconds how to master HQ (3 Towers), Habit Forge, Operations, Enemy Dossier, and the Emergency S.O.S Button.',
          es: 'Presentación interactiva que enseña en pocos segundos cómo dominar el QG (3 Torres), la Forja de Hábitos, Operaciones, el Dossier del Enemigo y el Botón de Emergencia S.O.S.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Acesso Rápido a Qualquer Momento',
          en: 'Instant Access at Any Time',
          es: 'Acceso Rápido en Cualquier Momento',
        },
        desc: {
          pt: 'Exibido automaticamente na primeira entrada e sempre disponível para rever no topo do app e na aba Ajustes, 100% traduzido para Português, Inglês e Espanhol.',
          en: 'Displayed automatically on first entry and always accessible from the app top header or Settings tab, fully translated in Portuguese, English, and Spanish.',
          es: 'Se muestra automáticamente al entrar por primera vez y siempre está disponible para revisar en la barra superior o en Ajustes, 100% traducido a Portugués, Inglés y Español.',
        },
      },
    ],
  },
  {
    version: 'v1.7.6',
    date: {
      pt: '28 de Setembro, 2026',
      en: 'September 28, 2026',
      es: '28 de Septiembre, 2026',
    },
    title: {
      pt: 'Padronização Visual: Blocos em Tela Cheia e Simetria entre Abas',
      en: 'Visual Standardization: Full-Width Blocks & Symmetrical Tabs',
      es: 'Estandarización Visual: Bloques a Pantalla Completa y Simetría entre Pestañas',
    },
    badge: 'recent',
    isLatest: false,
    highlights: [
      {
        icon: '📐',
        title: {
          pt: 'Blocos Ocupando a Largura Total da Tela',
          en: 'Full-Width Tool Blocks',
          es: 'Bloques Ocupando el Ancho Total',
        },
        desc: {
          pt: 'A aba de Operações agora segue o mesmo padrão consagrado do QG e da Forja: os sub-filtros de tarefas e cada operação ocupam a tela toda de forma límpida e sem recuos duplos desnecessários.',
          en: 'The Operations tab now follows the standard layout of HQ and Forge: task sub-filters and individual operations occupy the full width cleanly without unnecessary double card indentations.',
          es: 'La pestaña de Operaciones ahora sigue el estándar de QG y la Forja: los subfiltros y cada operación ocupan todo el ancho de forma limpia y sin sangrías dobles innecesarias.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Harmonia e Consistência Tática',
          en: 'Tactical Harmony & Consistency',
          es: 'Armonía y Consistencia Táctica',
        },
        desc: {
          pt: 'Cada missão operacional passa a ser um bloco independente em tela cheia com visual imersivo, cards proporcionais e alinhamento impecável em todos os dispositivos móveis e desktops.',
          en: 'Each operational mission is now an independent full-width block with immersive visuals, proportional cards, and flawless alignment across all mobile and desktop devices.',
          es: 'Cada misión operativa es ahora un bloque independiente a pantalla completa con diseño inmersivo, tarjetas proporcionales y alineación perfecta en todos los dispositivos.',
        },
      },
    ],
  },
  {
    version: 'v1.7.5',
    date: {
      pt: '28 de Setembro, 2026',
      en: 'September 28, 2026',
      es: '28 de Septiembre, 2026',
    },
    title: {
      pt: 'Otimização Mobile: Ajuste Fino para Telas Pequenas em Operações e QG',
      en: 'Mobile Optimization: Fine-Tuning for Small Screens in Operations & HQ',
      es: 'Optimización Móvil: Ajuste Fino para Pantallas Pequeñas en Operaciones y QG',
    },
    badge: 'recent',
    isLatest: false,
    highlights: [
      {
        icon: '📱',
        title: {
          pt: 'Zero Cortes em Celulares Compactos',
          en: 'Zero Clipping on Compact Phones',
          es: 'Cero Cortes en Celulares Compactos',
        },
        desc: {
          pt: 'Ajuste cirúrgico em telas estreitas (como iPhone SE e telas <380px): seletores de categorias, barra de ação "+ Nova Operação / + Novo Projeto" e filtros de tarefas e projetos agora utilizam layout flexível e títulos responsivos sem cortar nenhuma palavra ou botão.',
          en: 'Surgical adjustment on narrow screens (such as iPhone SE and screens <380px): category selectors, action bars, and task/project filters now utilize flexible layouts and responsive labels with zero clipping.',
          es: 'Ajuste quirúrgico en pantallas estrechas (como iPhone SE y pantallas <380px): selectores de categorías, barra de acción y filtros de tareas y proyectos ahora utilizan diseño flexible y etiquetas adaptativas sin cortes.',
        },
      },
      {
        icon: '⚔️',
        title: {
          pt: 'Filtros Simétricos e Quebra Suave no QG',
          en: 'Symmetrical Filters & Smooth Wrap in HQ',
          es: 'Filtros Simétricos y Ajuste Suave en QG',
        },
        desc: {
          pt: 'Os filtros de tarefas (Hoje, Todas, Adiadas, Feitas) e projetos (Ativos, Concluídos, Arquivados) agora se distribuem uniformemente em grid adaptável sem barra de rolagem cortando no canto da tela, e o card da Batalha das 24 Horas possui quebra de linha elegante.',
          en: 'Task filters (Today, All, Postponed, Done) and project filters (Active, Completed, Archived) now distribute evenly in adaptable grids without edge clipping, and the 24-Hour Battle card wraps gracefully.',
          es: 'Los filtros de tareas (Hoy, Todas, Posp., Hechas) y proyectos (Activos, Concluidos, Archivados) ahora se distribuyen uniformemente en cuadrículas adaptables sin cortes, y la tarjeta de 24 Horas se ajusta con fluidez.',
        },
      },
    ],
  },
  {
    version: 'v1.7.4',
    date: {
      pt: '28 de Setembro, 2026',
      en: 'September 28, 2026',
      es: '28 de Septiembre, 2026',
    },
    title: {
      pt: 'A Batalha das 24 Horas & Pacto de Honra Diário',
      en: 'The 24-Hour Battle & Daily Honor Pact',
      es: 'La Batalla de las 24 Horas y Pacto de Honor Diario',
    },
    badge: 'recent',
    isLatest: false,
    highlights: [
      {
        icon: '⚔️',
        title: {
          pt: 'Vença o Hoje: O Amanhã Não Existe',
          en: 'Conquer Today: Tomorrow Does Not Exist',
          es: 'Vence el Hoy: El Mañana No Existe',
        },
        desc: {
          pt: 'Ontem virou cinzas e estatística; o amanhã ainda não existe. Todo o seu combate se resume a vencer as próximas 24 horas. Novo módulo tático com relógio de combate regressivo e axiomas de soberania estoica.',
          en: 'Yesterday turned to ash and statistics; tomorrow does not yet exist. Your entire battle comes down to conquering the next 24 hours. New tactical module with a countdown combat clock and stoic sovereignty axioms.',
          es: 'El ayer se convirtió en cenizas y estadísticas; el mañana aún no existe. Todo tu combate se reduce a vencer las próximas 24 horas. Nuevo módulo táctico con reloj de combate regresivo y axiomas de soberanía estoica.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Pacto de Honra: "Hoje Eu Não Caio"',
          en: 'Honor Pact: "Today I Will Not Fall"',
          es: 'Pacto de Honor: "Hoy No Caigo"',
        },
        desc: {
          pt: 'Sele solenemente seu pacto de honra matinal com 1 clique para blindar a mente e registrar vitória inabalável sobre os 3 pilares da retenção ao longo do dia.',
          en: 'Solemnly seal your morning honor pact with 1 tap to guard the mind and register an unshakable victory across the 3 retention pillars throughout the day.',
          es: 'Sella solemnemente tu pacto de honor matutino con 1 toque para blindar la mente y registrar una victoria inquebrantable en los 3 pilares de retención durante el día.',
        },
      },
    ],
  },
  {
    version: 'v1.7.3',
    date: {
      pt: '28 de Setembro, 2026',
      en: 'September 28, 2026',
      es: '28 de Septiembre, 2026',
    },
    title: {
      pt: 'Projetos Compactos & Modo de Expansão Tática',
      en: 'Compact Projects & Tactical Expansion Mode',
      es: 'Proyectos Compactos y Modo de Expansión Táctica',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '📱',
        title: {
          pt: 'Visão Compacta & Organizada no Celular',
          en: 'Compact & Organized View on Mobile',
          es: 'Vista Compacta y Organizada en Móviles',
        },
        desc: {
          pt: 'Os cards de projetos agora se apresentam de forma compacta e objetiva no celular e desktop, exibindo progresso, status e contadores de itens sem ocupar todo o espaço da tela.',
          en: 'Project cards now appear in a streamlined, compact form on mobile and desktop, displaying progress, status, and summary counters without taking over your entire screen.',
          es: 'Las tarjetas de proyectos ahora se presentan de forma compacta y concisa en el móvil y escritorio, mostrando progreso, estado y contadores de resumen sin ocupar toda la pantalla.',
        },
      },
      {
        icon: '▾',
        title: {
          pt: 'Expandir para Adicionar e Gerenciar com 1 Toque',
          en: 'Expand to Add & Manage with 1 Tap',
          es: 'Expandir para Añadir y Gestionar con 1 Toque',
        },
        desc: {
          pt: 'Ao tocar em "Expandir Projeto", acesse instantaneamente todos os hábitos vinculados, leis gravadas, gerenciamento completo de tarefas e checklist de etapas.',
          en: 'Tap "Expand Project" to instantly access all linked habits, etched commandments, full task management, and milestone checklist.',
          es: 'Al tocar en "Expandir Proyecto", accede al instante a todos los hábitos vinculados, mandamientos grabados, gestión completa de tareas y lista de etapas.',
        },
      },
    ],
  },
  {
    version: 'v1.7.2',
    date: {
      pt: '28 de Setembro, 2026',
      en: 'September 28, 2026',
      es: '28 de Septiembre, 2026',
    },
    title: {
      pt: 'Blindagem de Slots da Forja & Seleção Inteligente de Hábitos',
      en: 'Forge Slot Shielding & Smart Habit Selection',
      es: 'Blindaje de Slots de la Forja y Selección Inteligente de Hábitos',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🔒',
        title: {
          pt: 'Bloqueio Inteligente com Slots Cheios',
          en: 'Smart Lockout when Slots are Full',
          es: 'Bloqueo Inteligente con Slots Llenos',
        },
        desc: {
          pt: 'Quando todos os slots do seu protocolo da Forja estiverem ocupados, novos hábitos não podem mais ser ativados nem na Reserva nem vinculados inadvertidamente em projetos, prevenindo sobrecarga e mantendo o foco absoluto. Os botões exibem o status de bloqueio com aviso sonoro e visual.',
          en: 'When all your Forge protocol slots are occupied, new habits can no longer be activated from the Reserve or inadvertently linked in projects, preventing cognitive overload and maintaining absolute focus. Buttons now display locked status with visual and audio alerts.',
          es: 'Cuando todos los slots de tu protocolo de la Forja estén ocupados, no se podrán activar nuevos hábitos de la Reserva ni vincular inadvertidamente en proyectos, previniendo sobrecarga y manteniendo el enfoque absoluto. Los botones muestran el estado bloqueado con avisos visuales y sonoros.',
        },
      },
      {
        icon: '⚡',
        title: {
          pt: 'Sincronização Tática nos Projetos',
          en: 'Tactical Synchronization in Projects',
          es: 'Sincronización Táctica en Proyectos',
        },
        desc: {
          pt: 'Ao criar ou editar projetos com os slots cheios, o guerreiro visualiza com clareza seus hábitos ativos no protocolo e fica blindado contra a adição de hábitos fora da sua cota disponível.',
          en: 'When creating or tailoring projects with full slots, warriors clearly view their active protocol habits and remain shielded from adding habits beyond their available allowance.',
          es: 'Al crear o editar proyectos con slots llenos, el guerrero visualiza con claridad sus hábitos activos en el protocolo y queda protegido contra la adición de hábitos fuera de su cuota disponible.',
        },
      },
    ],
  },
  {
    version: 'v1.7.1',
    date: {
      pt: '28 de Setembro, 2026',
      en: 'September 28, 2026',
      es: '28 de Septiembre, 2026',
    },
    title: {
      pt: 'Novas Áreas Mestras de Projetos & Modo Desenvolvimento Hard',
      en: 'New Project Mastery Areas & Hardcore Growth Mode',
      es: 'Nuevas Áreas Maestras de Proyectos y Modo Desarrollo Hard',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🔥',
        title: {
          pt: 'Modo Desenvolvimento Hard (Guerra Total)',
          en: 'Hardcore Growth Mode (Total War)',
          es: 'Modo Desarrollo Hard (Guerra Total)',
        },
        desc: {
          pt: 'Categoria especial para o guerreiro que decide virar a mesa em todas as frentes simultaneamente. Una corpo forjado, mente afiada, trabalho implacável e espírito inabalável dentro de um único projeto unificado.',
          en: 'Special master category engineered for warriors raising the standard on all fronts simultaneously. Combine a forged physique, razor mind, ruthless work, and unbreakable spirit in a single unified campaign.',
          es: 'Categoría especial diseñada para guerreros que deciden subir el nivel en todos los frentes simultáneamente. Une cuerpo forjado, mente afilada, trabajo implacable y espíritu inquebrantable en un solo proyecto unificado.',
        },
      },
      {
        icon: '🏛️',
        title: {
          pt: '6 Áreas Mestras Simplificadas',
          en: '6 Simplified Master Areas',
          es: '6 Áreas Maestras Simplificadas',
        },
        desc: {
          pt: 'Categorias limpas e objetivas: Corpo & Físico, Mente, Carreira & Finanças, Espiritual, Desenvolvimento Pessoal e Desenvolvimento Hard. Sem amarras com hábitos pontuais — você é quem escolhe o que conectar a cada projeto.',
          en: 'Clean and focused domains: Body & Physical, Mind, Career & Wealth, Spiritual, Personal Growth, and Hardcore Growth. No rigid habit dependencies — you freely choose what to connect to each project.',
          es: 'Categorías limpias y directas: Cuerpo y Físico, Mente, Carrera y Finanzas, Espiritual, Desarrollo Personal y Desarrollo Hard. Sin ataduras a hábitos individuales: tú eliges qué conectar a cada proyecto.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Liberdade Total com os 3 Pilares e Hábitos',
          en: 'Total Freedom with 3 Pillars and Habits',
          es: 'Libertad Total con los 3 Pilares y Hábitos',
        },
        desc: {
          pt: 'Você pode plugar o escudo dos 3 Pilares e os hábitos da sua rotina no projeto que achar necessário, acompanhando o cumprimento diário em tempo real direto nos cards.',
          en: 'You can attach the 3 Pillars shield and your daily habits to any project you see fit, monitoring real-time daily fulfillment right on the cards.',
          es: 'Puedes conectar el escudo de los 3 Pilares y los hábitos de tu rutina a cualquier proyecto que consideres necesario, siguiendo el cumplimiento diario en tiempo real en las tarjetas.',
        },
      },
    ],
  },
  {
    version: 'v1.7.0',
    date: {
      pt: '28 de Setembro, 2026',
      en: 'September 28, 2026',
      es: '28 de Septiembre, 2026',
    },
    title: {
      pt: 'Evolução dos Projetos: 6 Modelos Prontos, Duração Flexível & Áreas de Domínio',
      en: 'Projects Evolution: 6 Turnkey Templates, Flexible Duration & Mastery Areas',
      es: 'Evolución de Proyectos: 6 Plantillas Listas, Duración Flexible y Áreas de Dominio',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⚡',
        title: {
          pt: '6 Modelos Estratégicos Prontos da Forja (1 Clique)',
          en: '6 Turnkey Strategic Forge Templates (1 Click)',
          es: '6 Plantillas Estratégicas Listas de la Forja (1 Clic)',
        },
        desc: {
          pt: 'Agora você pode iniciar frentes táticas completas com um só toque: Operação Homem Novo (90 dias), Reta Final do Ano (Sprint dos Últimos Meses), Pacto dos 3 Pilares (Reset Sexual), O Monge de Ferro (Detox Dopaminérgico 30 dias), Forja do Império (Finanças 60 dias) e Armadura de Esparta (Protocolo Físico 60 dias).',
          en: 'You can now launch full tactical campaigns with a single tap: Operation New Man (90 days), Year-End Sprint (Final Months Transformation), 3 Pillars Pact (Sexual Reset), The Iron Monk (30-day Dopamine Detox), Empire Forge (Wealth & Career 60 days), and Spartan Armor (60-day Physical Protocol).',
          es: 'Ahora puedes iniciar campañas tácticas completas con un solo toque: Operación Hombre Nuevo (90 días), Recta Final del Año (Sprint de los Últimos Meses), Pacto de los 3 Pilares (Reset Sexual), El Monje de Hierro (Detox Dopaminérgico 30 días), Forja del Imperio (Finanzas 60 días) y Armadura de Esparta (Protocolo Físico 60 días).',
        },
      },
      {
        icon: '📅',
        title: {
          pt: 'Duração 100% Flexível à Sua Escolha',
          en: '100% Flexible Duration of Your Choice',
          es: 'Duración 100% Flexible a Tu Elección',
        },
        desc: {
          pt: 'Seus projetos não estão presos a períodos fixos. Defina livremente a quantidade exata de dias desejada (com atalhos para 21, 30, 60, 90, 100 dias ou qualquer prazo personalizado) com sincronização automática do cronograma.',
          en: 'Your projects are never locked into fixed timeframes. Freely set the exact number of days you want (with 21, 30, 60, 90, 100 day shortcuts or any custom duration) with automatic schedule and deadline synchronization.',
          es: 'Tus proyectos no están atados a plazos fijos. Define libremente la cantidad exacta de días que deseas (con atajos para 21, 30, 60, 90, 100 días o cualquier plazo personalizado) con sincronización automática del cronograma.',
        },
      },
      {
        icon: '🏛️',
        title: {
          pt: 'Divisão por Áreas & Sugestões Guiadas',
          en: 'Categorized Areas & Guided Suggestions',
          es: 'División por Áreas y Sugerencias Guiadas',
        },
        desc: {
          pt: 'Categorias estratégicas para cada dimensão da vida: Mente & Autoimagem, Retenção & Forja Espiritual, Carreira & Finanças, Detox Digital & Foco, e Corpo, Treino & Vitalidade. Ao escolher a área, a Forja carrega sugestões inteligentes de mandamentos e hábitos para você seguir.',
          en: 'Strategic categories for every dimension of life: Mind & Self-Image, Retention & Spiritual Forge, Career & Wealth, Digital Detox & Focus, and Body, Training & Vitality. Selecting an area loads intelligent suggestions for commandments and habits to adopt.',
          es: 'Categorías estratégicas para cada dimensión de la vida: Mente y Autoimagen, Retención y Forja Espiritual, Carrera y Finanzas, Detox Digital y Enfoque, y Cuerpo, Entrenamiento y Vitalidad. Al elegir el área, la Forja carga sugerencias inteligentes de mandamientos y hábitos a seguir.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Pacto dos 3 Pilares & Hábitos Ancorados ao Projeto',
          en: '3 Pillars Pact & Habits Anchored to the Project',
          es: 'Pacto de los 3 Pilares y Hábitos Anclados al Proyecto',
        },
        desc: {
          pt: 'Vincule seu projeto ao pacto de honra dos 3 Pilares (Sem Pornô, Sem Masturbação, Retenção Seminal) exibindo o escudo e a contagem de dias limpos diretamente no card. Hábitos da Forja vinculados mostram status em tempo real conforme você os cumpre no dia a dia.',
          en: 'Link your project directly to the 3 Pillars honor pact (No Porn, No Masturbation, Semen Retention) displaying the shield and clean days counter directly on the card. Linked Forge habits show real-time fulfillment status as you complete them daily.',
          es: 'Vincula tu proyecto directamente al pacto de honor de los 3 Pilares (Sin Porno, Sin Masturbación, Retención Seminal) mostrando el escudo y el conteo de días limpios directamente en la tarjeta. Los hábitos vinculados muestran el estado en tiempo real conforme los cumples día a día.',
        },
      },
    ],
  },
  {
    version: 'v1.6.3',
    date: {
      pt: '28 de Setembro, 2026',
      en: 'September 28, 2026',
      es: '28 de Septiembre, 2026',
    },
    title: {
      pt: 'Frases Exclusivas de Poder para Cada um dos 11 Estágios',
      en: 'Exclusive Power Quotes for Each of the 11 Warrior Stages',
      es: 'Frases Exclusivas de Poder para Cada uno de los 11 Rangos',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '📜',
        title: {
          pt: 'Voz Única para Cada Nível da Jornada',
          en: 'Unique Voice for Each Journey Level',
          es: 'Voz Única para Cada Nivel del Viaje',
        },
        desc: {
          pt: 'O pedestal do Guerreiro 3D agora entoa uma frase de glória e poder exclusiva para cada um dos 11 estágios da evolução (desde a quebra do impulso do Neófito até a soberania cósmica), totalmente traduzida em Português, Inglês e Espanhol.',
          en: 'The 3D Warrior pedestal now displays an exclusive motto of power and glory for each of the 11 evolution stages (from the Recruit overcoming initial impulse to cosmic sovereignty), fully translated into Portuguese, English, and Spanish.',
          es: 'El pedestal del Guerrero 3D ahora muestra una frase de gloria y poder exclusiva para cada uno de los 11 niveles de evolución (desde romper el impulso inicial hasta la soberanía cósmica), totalmente traducida al portugués, inglés y español.',
        },
      },
    ],
  },
  {
    version: 'v1.6.2',
    date: {
      pt: '27 de Setembro, 2026',
      en: 'September 27, 2026',
      es: '27 de Septiembre, 2026',
    },
    title: {
      pt: 'Janela de Foco Ativa na Agenda Operacional Diária',
      en: 'Active Focus Window in Daily Operational Schedule',
      es: 'Ventana de Enfoque Activa en el Cronograma Operativo Diario',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⏰',
        title: {
          pt: 'Exibição Inteligente por Horário de Execução',
          en: 'Smart Display by Execution Time Window',
          es: 'Visualización Inteligente por Horario de Ejecución',
        },
        desc: {
          pt: 'Projetos com Janela de Foco agora só ocupam a sua Agenda Operacional quando estiver exatamente no horário de executá-los (ou momentos antes). Ao término do horário diário, eles saem da visão para manter seu foco 100% limpo.',
          en: 'Projects with a Focus Window now only appear in your Combat Schedule during their active execution hours (or moments before). Once finished for the day, they clear out to keep your focus uncluttered.',
          es: 'Los proyectos con Ventana de Enfoque ahora solo aparecen en el Cronograma Operativo durante su horario activo de ejecución (o momentos antes). Al terminar el horario diario, se despejan para mantener tu enfoque limpio.',
        },
      },
    ],
  },
  {
    version: 'v1.6.1',
    date: {
      pt: '27 de Setembro, 2026',
      en: 'September 27, 2026',
      es: '27 de Septiembre, 2026',
    },
    title: {
      pt: 'Sincronização Imediata de Slots da Forja por Patamar (4+ Hábitos)',
      en: 'Instant Forge Habit Slots Sync by Tier (4+ Habits)',
      es: 'Sincronización Inmediata de Slots de la Forja por Rango (4+ Hábitos)',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⚔️',
        title: {
          pt: 'Liberação Automática dos Slots do Patamar',
          en: 'Automatic Tier Slots Unlocking',
          es: 'Desbloqueo Automático de Slots por Rango',
        },
        desc: {
          pt: 'Corrigido o cálculo de limites de hábitos na Forja: guerreiros com 8 dias agora têm 4 slots ativos liberados imediatamente no protocolo (2 de Recruta + 2 de Escudeiro), escalando até slots ilimitados conforme seu progresso.',
          en: 'Fixed habit limit calculation in the Forge: warriors with 8 days now immediately unlock 4 active protocol slots (2 Recruit + 2 Squire), scaling up to unlimited slots as you progress.',
          es: 'Corregido el cálculo de límites de hábitos en la Forja: guerreros con 8 días ahora desbloquean de inmediato 4 slots activos en el protocolo (2 Recluta + 2 Escudero), escalando hasta slots ilimitados según tu progreso.',
        },
      },
    ],
  },
  {
    version: 'v1.6.0',
    date: {
      pt: '27 de Setembro, 2026',
      en: 'September 27, 2026',
      es: '27 de Septiembre, 2026',
    },
    title: {
      pt: 'Nova Página de Vendas, Plano Anual e Arsenal Expandido',
      en: 'New Landing Page, Annual Plan & Expanded Arsenal',
      es: 'Nueva Página de Ventas, Plan Anual y Arsenal Expandido',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🛡️',
        title: {
          pt: 'Página de Apresentação Oficial Atualizada',
          en: 'Updated Official Presentation Page',
          es: 'Página de Presentación Oficial Actualizada',
        },
        desc: {
          pt: 'A página inicial agora apresenta todo o arsenal de elite: Pacto de Sangue com Guardião, Áudio Tático e Respiração 4×4, Onboarding Ágil e Sincronização em Nuvem.',
          en: 'The home presentation now showcases the full elite arsenal: Blood Pact & Wingman, Tactical 4×4 Audio, Fast Onboarding, and Cloud Sync.',
          es: 'La página principal ahora presenta todo el arsenal de élite: Pacto de Sangre con Guardián, Audio Táctico y Respiración 4×4, Onboarding Ágil y Sincronización en la Nube.',
        },
      },
      {
        icon: '💎',
        title: {
          pt: 'Novo Plano Anual com 27% de Desconto & Cupons',
          en: 'New Annual Plan with 27% Savings & Promo Codes',
          es: 'Nuevo Plan Anual con 27% de Descuento y Cupones',
        },
        desc: {
          pt: 'Seletor inteligente de planos no checkout com suporte a assinaturas Mensais ou Anuais econômicas, além de campo para aplicação de cupons promocionais.',
          en: 'Smart plan selector in checkout supporting Monthly or budget Annual subscriptions, plus built-in promo code support.',
          es: 'Selector inteligente de planes en el checkout con soporte para suscripciones Mensuales o Anuales con descuento, más soporte de códigos promocionales.',
        },
      },
    ],
  },
  {
    version: 'v1.5.7',
    date: {
      pt: '26 de Setembro, 2026',
      en: 'September 26, 2026',
      es: '26 de Septiembre, 2026',
    },
    title: {
      pt: 'Entrada Ágil de Datas & Botões Anatômicos no Onboarding',
      en: 'Fast Date Input & Ergonomic Buttons in Onboarding',
      es: 'Entrada Ágil de Fechas y Botones Ergonómicos en Onboarding',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⚡',
        title: {
          pt: 'Atalhos Rápidos e Seletores de 1 Toque',
          en: 'Quick Shortcuts & 1-Tap Selectors',
          es: 'Atajos Rápidos y Selectores de 1 Toque',
        },
        desc: {
          pt: 'Chega de digitar data ou lutar contra seletores difíceis: agora você tem atalhos instantâneos (Hoje, Ontem, 3 e 7 dias atrás) e seletores visuais de Dia, Mês e Ano.',
          en: 'No more fighting difficult date inputs: now you have instant shortcuts (Today, Yesterday, 3 and 7 days ago) plus visual Day, Month, and Year selectors.',
          es: 'Se acabó luchar con teclados difíciles para la fecha: ahora tienes atajos instantáneos (Hoy, Ayer, 3 y 7 días atrás) y selectores visuales de Día, Mes y Año.',
        },
      },
      {
        icon: '🎯',
        title: {
          pt: 'Botões Avançar/Voltar Próximos ao Conteúdo',
          en: 'Next/Back Buttons Close to Content',
          es: 'Botones Avanzar/Volver Cerca del Contenido',
        },
        desc: {
          pt: 'Os botões de navegação foram aproximados da área de digitação e opções, eliminando a distância desconfortável até o rodapé da tela.',
          en: 'Navigation buttons are now placed immediately below the questions, removing awkward scrolling down to the footer.',
          es: 'Los botones de navegación ahora se ubican inmediatamente debajo de las preguntas, eliminando la distancia incómoda hasta el pie de pantalla.',
        },
      },
    ],
  },
  {
    version: 'v1.5.4',
    date: {
      pt: '26 de Setembro, 2026',
      en: 'September 26, 2026',
      es: '26 de Septiembre, 2026',
    },
    title: {
      pt: 'Canal Direto de Comunicação (Decretos do Comando aos Guerreiros)',
      en: 'Direct Communication Channel (Command Decrees to Warriors)',
      es: 'Canal Directo de Comunicación (Decretos del Comando a los Guerreros)',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '✉️',
        title: {
          pt: 'Resposta Direta e Notificação de Decretos',
          en: 'Direct Reply & Decree Notifications',
          es: 'Respuesta Directa y Notificación de Decretos',
        },
        desc: {
          pt: 'O Criador da Forja agora pode responder diretamente a qualquer feedback, sugestão ou elogio pelo Painel do Dono. O guerreiro recebe alerta visual no topo e modal solene com som triunfal.',
          en: 'The Forge Creator can now reply directly to any feedback, suggestion or praise through the Owner Panel. The warrior receives visual alerts at the top and a solemn modal with triumphant sound.',
          es: 'El Creador de la Forja ahora puede responder directamente a cualquier comentario, sugerencia o elogio a través del Panel del Dueño. El guerrero recibe alerta visual en la parte superior y modal solemne con sonido triunfal.',
        },
      },
    ],
  },
  {
    version: 'v1.5.3',
    date: {
      pt: '26 de Setembro, 2026',
      en: 'September 26, 2026',
      es: '26 de Septiembre, 2026',
    },
    title: {
      pt: 'Painel do Comando Supremo (Métricas & Gestão de Guerreiros)',
      en: 'Supreme Command Panel (Metrics & Warrior Management)',
      es: 'Panel del Comando Supremo (Métricas y Gestión de Guerreros)',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '👑',
        title: {
          pt: 'Painel Administrativo Restrito ao Dono',
          en: 'Administrative Panel Restricted to Owner',
          es: 'Panel Administrativo Restringido al Dueño',
        },
        desc: {
          pt: 'Implementada central de inteligência e métricas em tempo real para monitorar total de guerreiros, assinaturas, vitórias no S.O.S e feedbacks, com acesso restrito e seguro.',
          en: 'Implemented intelligence and real-time metrics center to monitor total warriors, subscriptions, S.O.S victories and feedbacks, with secure restricted access.',
          es: 'Implementado centro de inteligencia y métricas en tiempo real para monitorear total de guerreros, suscripciones, victorias en S.O.S y feedbacks, con acceso restringido y seguro.',
        },
      },
    ],
  },
  {
    version: 'v1.5.2',
    date: {
      pt: '26 de Setembro, 2026',
      en: 'September 26, 2026',
      es: '26 de Septiembre, 2026',
    },
    title: {
      pt: 'Privacidade Total do Painel de Sugestões & Bugs',
      en: 'Total Privacy for Suggestions & Bugs Admin Panel',
      es: 'Privacidad Total del Panel de Sugerencias y Errores',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🔒',
        title: {
          pt: 'Canal Direto Restrito Exclusivamente ao Dono',
          en: 'Direct Channel Restricted Exclusively to Owner',
          es: 'Canal Directo Restringido Exclusivamente al Dueño',
        },
        desc: {
          pt: 'O botão de consulta e o painel de mensagens recebidas foram blindados e agora aparecem estritamente para o e-mail do Dono do app, ficando 100% invisíveis e inacessíveis para usuários comuns.',
          en: 'The review button and incoming messages panel have been locked down and now strictly appear for the app Owner\'s email, remaining 100% invisible and inaccessible to ordinary users.',
          es: 'El botón de consulta y el panel de mensajes recibidos han sido blindados y ahora aparecen estrictamente para el correo del Dueño de la app, permaneciendo 100% invisibles e inaccesibles para usuarios comunes.',
        },
      },
    ],
  },
  {
    version: 'v1.5.1',
    date: {
      pt: '26 de Setembro, 2026',
      en: 'September 26, 2026',
      es: '26 de Septiembre, 2026',
    },
    title: {
      pt: 'Blindagem Antifraude da Curva de Vitalidade',
      en: 'Anti-Cheat Lock on Vitality Curve',
      es: 'Blindaje Antifraude en la Curva de Vitalidad',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🛡️',
        title: {
          pt: 'Histórico de Combate Imutável na Curva',
          en: 'Immutable Combat History in Curve',
          es: 'Historial de Combate Inmutable en la Curva',
        },
        desc: {
          pt: 'Removido o atalho de alteração retroativa na Curva de Vitalidade & Força. O histórico de quedas e vitórias permanece blindado para garantir disciplina e verdade com a própria jornada.',
          en: 'Removed the retroactive edit button from the Vitality & Strength Curve. The history of falls and victories remains tamper-proof to ensure absolute discipline and truth.',
          es: 'Eliminado el botón de edición retroactiva en la Curva de Vitalidad y Fuerza. El historial de caídas y victorias permanece blindado para garantizar disciplina y verdad.',
        },
      },
    ],
  },
  {
    version: 'v1.5.0',
    date: {
      pt: '26 de Setembro, 2026',
      en: 'September 26, 2026',
      es: '26 de Septiembre, 2026',
    },
    title: {
      pt: 'Curva de Vitalidade & Força e Seletor de Datas Personalizadas',
      en: 'Vitality & Strength Curve and Custom Date Range Selector',
      es: 'Curva de Vitalidad y Fuerza y Selector de Fechas Personalizadas',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '📈',
        title: {
          pt: 'Curva de Vitalidade & Força Sincronizada aos 3 Pilares',
          en: 'Vitality & Strength Curve Synced to 3 Pillars',
          es: 'Curva de Vitalidad y Fuerza Sincronizada a los 3 Pilares',
        },
        desc: {
          pt: 'Novo gráfico dinâmico em linha na Linha do Tempo. A curva sobe continuamente com dias de vitória e reage de forma proporcional a cada pilar: queda leve com 1 deslize, queda acentuada com 2 deslizes e piso da forja se cair nos 3 pilares.',
          en: 'New dynamic line chart in the Timeline. The curve climbs steadily with victory days and responds proportionally to each pillar: mild drop with 1 slip, heavy drop with 2 slips, and forge floor if falling in all 3 pillars.',
          es: 'Nuevo gráfico dinámico de líneas en la Línea de Tiempo. La curva sube continuamente con días de victoria y reacciona de forma proporcional a cada pilar: caída leve con 1 desliz, caída pronunciada con 2 deslices y suelo de la forja si cae en los 3 pilares.',
        },
      },
      {
        icon: '📅',
        title: {
          pt: 'Seletor de Datas Personalizadas',
          en: 'Custom Date Range Selector',
          es: 'Selector de Fechas Personalizadas',
        },
        desc: {
          pt: 'Além dos atalhos rápidos (7d, 14d, 30d, 60d, 90d, 365d), filtre qualquer intervalo de combate com datas de início e fim personalizadas.',
          en: 'Alongside quick presets (7d, 14d, 30d, 60d, 90d, 365d), filter any combat timeframe with custom start and end date pickers.',
          es: 'Junto con los accesos rápidos (7d, 14d, 30d, 60d, 90d, 365d), filtra cualquier intervalo de combate con fechas de inicio y fin personalizadas.',
        },
      },
      {
        icon: '🔍',
        title: {
          pt: 'Inspeção Tática ao Toque',
          en: 'Interactive Day Tactical Inspection',
          es: 'Inspección Táctica al Tacto',
        },
        desc: {
          pt: 'Toque em qualquer ponto da curva para verificar os 3 pilares daquele dia, nível de vitalidade e editar o registro instantaneamente.',
          en: 'Tap any point on the curve to check that day\'s 3 pillars, vitality score, and edit the entry immediately.',
          es: 'Toca cualquier punto de la curva para revisar los 3 pilares de ese día, nivel de vitalidad y editar el registro al instante.',
        },
      },
    ],
  },
  {
    version: 'v1.4.9',
    date: {
      pt: '24 de Setembro, 2026',
      en: 'September 24, 2026',
      es: '24 de Septiembre, 2026',
    },
    title: {
      pt: 'Aprimoramento do Protocolo S.O.S: Interface Limpa & Letreiro Fluido',
      en: 'S.O.S Protocol Enhancement: Clean Interface & Fluid Ticker',
      es: 'Mejora del Protocolo S.O.S: Interfaz Limpia y Marquesina Fluida',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🛡️',
        title: {
          pt: 'Foco Total no Combate ao Impulso',
          en: 'Total Focus on Immediate Impulse Control',
          es: 'Enfoque Total en el Combate al Impulso',
        },
        desc: {
          pt: 'Interface do Protocolo S.O.S enxuta e focada: remoção de caixas de texto secundárias para resposta imediata ao impulso nos 5 minutos de protocolo.',
          en: 'Streamlined S.O.S Protocol interface: secondary text boxes removed to ensure instant action and maximum focus during the 5-minute protocol.',
          es: 'Interfaz del Protocolo S.O.S simplificada: eliminación de cuadros de texto secundarios para una respuesta inmediata durante los 5 minutos.',
        },
      },
      {
        icon: '⚔️',
        title: {
          pt: 'Letreiro de Batalha Contínuo e Sem Travamentos',
          en: 'Continuous, Seamless Battle Ticker',
          es: 'Marquesina de Combate Continua y Sin Saltos',
        },
        desc: {
          pt: 'As frases de intervenção de emergência agora deslizam em fluxo 100% contínuo e sem saltos visuais em todas as resoluções e dispositivos.',
          en: 'Emergency intervention phrases now glide in a 100% continuous flow without visual stutter or jumps across all devices and screen sizes.',
          es: 'Las frases de intervención de emergencia ahora se deslizan en flujo 100% continuo y sin saltos visuales en todos los dispositivos.',
        },
      },
      {
        icon: '⚡',
        title: {
          pt: 'Ajuste de Responsividade e Fechamento Direto',
          en: 'Direct Close & Mobile Fit',
          es: 'Cierre Directo y Ajuste Móvil',
        },
        desc: {
          pt: 'Adicionado botão de fechamento rápido e layout perfeitamente contido para telas pequenas sem transbordamento lateral.',
          en: 'Added quick close button and perfectly contained layout for mobile screens without side overflow.',
          es: 'Botón de cierre rápido añadido y diseño perfectamente ajustado para móviles sin desbordamiento lateral.',
        },
      },
    ],
  },
  {
    version: 'v1.4.8',
    date: {
      pt: '24 de Setembro, 2026',
      en: 'September 24, 2026',
      es: '24 de Septiembre, 2026',
    },
    title: {
      pt: 'Arsenal Completo das Operações: Adiar, Editar, Arquivar e Excluir',
      en: 'Complete Operations Arsenal: Postpone, Edit, Archive, and Delete',
      es: 'Arsenal Completo de Operaciones: Posponer, Editar, Archivar y Eliminar',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '⚔️',
        title: {
          pt: 'Todas as 4 Ações Disponíveis em Cada Tarefa',
          en: 'All 4 Actions Available on Every Task',
          es: 'Las 4 Acciones Disponibles en Cada Tarea',
        },
        desc: {
          pt: 'Cada operação diária e tarefa vinculada conta agora com acesso direto às 4 funções essenciais: Adiar (reprogramar data), Editar (modificar detalhes), Arquivar (guardar com segurança) e Excluir (com modal de confirmação).',
          en: 'Every daily operation and linked task now features direct access to all 4 vital tools: Postpone (reschedule date), Edit (modify details), Archive (secure storage), and Delete (with confirmation modal).',
          es: 'Cada operación diaria y tarea vinculada ahora cuenta con acceso directo a las 4 funciones esenciales: Posponer (reprogramar fecha), Editar (modificar detalles), Archivar (guardar de forma segura) y Eliminar (con modal de confirmación).',
        },
      },
      {
        icon: '📦',
        title: {
          pt: 'Arquivamento & Desarquivamento Tático',
          en: 'Tactical Archiving & Restoring',
          es: 'Archivado y Desarchivado Táctico',
        },
        desc: {
          pt: 'Arquive operações concluídas ou pausadas com confirmação imediata. As tarefas arquivadas ficam organizadas na seção dedicada onde podem ser restauradas ou excluídas a qualquer momento.',
          en: 'Archive completed or paused operations with instant confirmation. Archived tasks are organized in their dedicated section where they can be restored or deleted anytime.',
          es: 'Archiva operaciones concluidas o pausadas con confirmación inmediata. Las tareas archivadas quedan organizadas en su sección dedicada donde pueden ser restauradas o eliminadas en cualquier momento.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Segurança & Confirmação Reforçada',
          en: 'Reinforced Safety & Confirmations',
          es: 'Seguridad y Confirmaciones Reforzadas',
        },
        desc: {
          pt: 'Todas as ações críticas preservam diálogo de confirmação in-app com suporte nativo aos 3 idiomas (Português, Inglês e Espanhol).',
          en: 'All critical actions maintain native in-app confirmation dialogs fully translated into 3 languages (Portuguese, English, and Spanish).',
          es: 'Todas las acciones críticas mantienen diálogo de confirmación in-app con soporte nativo en los 3 idiomas (Portugués, Inglés y Español).',
        },
      },
    ],
  },
  {
    version: 'v1.4.7',
    date: {
      pt: '23 de Setembro, 2026',
      en: 'September 23, 2026',
      es: '23 de Septiembre, 2026',
    },
    title: {
      pt: 'Correção na Exclusão de Tarefas & Confirmações de Exclusão Blindadas',
      en: 'Task Deletion Fix & Fortified In-App Deletion Confirmations',
      es: 'Corrección en Eliminación de Tareas y Confirmaciones de Exclusión Blindadas',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🗑️',
        title: {
          pt: 'Exclusão de Operações & Tarefas Restaurada',
          en: 'Operation & Task Deletion Restored',
          es: 'Eliminación de Operaciones y Tareas Restaurada',
        },
        desc: {
          pt: 'Corrigido o botão de exclusão de tarefas no painel de Operações, na edição e nas tarefas de projetos. O diálogo de confirmação abre com precisão mantendo a segurança contra exclusões acidentais.',
          en: 'Fixed task deletion across Operations view, task edit modal, and project tasks. The confirmation dialog opens reliably, maintaining safety against accidental deletions.',
          es: 'Corregido el botón de eliminación de tareas en el panel de Operaciones, edición y tareas de proyectos. El diálogo de confirmación abre con precisión manteniendo la seguridad contra eliminaciones accidentales.',
        },
      },
      {
        icon: '🛡️',
        title: {
          pt: 'Confirmação In-App em Hábitos e Diário de Bordo',
          en: 'Universal In-App Confirmation for Habits & Log',
          es: 'Confirmación In-App Universal en Hábitos y Diario',
        },
        desc: {
          pt: 'Substituídos diálogos nativos por modais visuais táticos para exclusão de hábitos personalizados e relatórios do Diário, garantindo compatibilidade total no app e PWA em todos os dispositivos.',
          en: 'Replaced browser alerts with high-fidelity tactical dialogs for deleting custom habits and Ship’s Log entries, ensuring flawless compatibility in web and mobile PWA.',
          es: 'Reemplazados diálogos nativos por modales visuales tácticos para eliminar hábitos personalizados y reportes del Diario, asegurando compatibilidad total en la web y PWA móvil.',
        },
      },
      {
        icon: '⚔️',
        title: {
          pt: 'Gestão Completa de Projetos e Tarefas Arquivadas',
          en: 'Full Management of Projects & Archived Tasks',
          es: 'Gestión Completa de Proyectos y Tareas Archivadas',
        },
        desc: {
          pt: 'Total estabilidade na exclusão, arquivamento e restauração de projetos e tarefas arquivadas, com tradução completa em Português, Inglês e Espanhol.',
          en: 'Full stability when deleting, archiving, and restoring projects and archived tasks, completely translated into Portuguese, English, and Spanish.',
          es: 'Total estabilidad al eliminar, archivar y restaurar proyectos y tareas archivadas, con traducción completa en portugués, inglés y español.',
        },
      },
    ],
  },
  {
    version: 'v1.4.6',
    date: {
      pt: '23 de Setembro, 2026',
      en: 'September 23, 2026',
      es: '23 de Septiembre, 2026',
    },
    title: {
      pt: 'Correção de Idioma nos Hábitos do QG & Refinamento Multilíngue',
      en: 'HQ Habits Language Fix & Multilingual Refinement',
      es: 'Corrección de Idioma en Hábitos del QG y Refinamiento Multilingüe',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🌐',
        title: {
          pt: 'Tradução do Botão e Contador de Hábitos',
          en: 'Habit Button & Badge Translation',
          es: 'Traducción de Botón e Insignia de Hábitos',
        },
        desc: {
          pt: 'Corrigido o texto "A MARCAR" para exibir corretamente "TO MARK" em inglês e "POR MARCAR" em espanhol, juntamente com a contagem de hábitos pendentes traduzida.',
          en: 'Fixed "A MARCAR" to properly display "TO MARK" in English and "POR MARCAR" in Spanish, alongside fully translated pending habit count descriptions.',
          es: 'Corregido el texto "A MARCAR" para mostrar correctamente "TO MARK" en inglés y "POR MARCAR" en español, junto con la descripción de hábitos pendientes traducida.',
        },
      },
      {
        icon: '⚔️',
        title: {
          pt: 'Feedback Tático e Ações Rápidas no Idioma Selecionado',
          en: 'Tactical Feedback & Quick Actions in Chosen Language',
          es: 'Feedback Táctico y Acciones Rápidas en el Idioma Seleccionado',
        },
        desc: {
          pt: 'Notificações de conclusão direta e títulos de botões de marcação sincronizados perfeitamente com PT, EN e ES.',
          en: 'One-tap completion toasts and button action tooltips now seamlessly synchronized with PT, EN, and ES.',
          es: 'Notificaciones emergentes de conclusión y textos de acción sincronizados perfectamente con PT, EN y ES.',
        },
      },
    ],
  },
  {
    version: 'v1.4.5',
    date: {
      pt: '23 de Setembro, 2026',
      en: 'September 23, 2026',
      es: '23 de Septiembre, 2026',
    },
    title: {
      pt: 'Mini Card de Horários no QG & Notificações com Nome Exato da Missão',
      en: 'HQ Schedule Mini Card & Exact Mission Name Notifications',
      es: 'Mini Tarjeta de Horarios en QG y Notificaciones con Nombre Exacto',
    },
    badge: 'stability',
    isLatest: false,
    highlights: [
      {
        icon: '🎯',
        title: {
          pt: 'Nome Exato da Missão na Notificação',
          en: 'Exact Mission Name in Notifications',
          es: 'Nombre Exacto de la Misión en Notificaciones',
        },
        desc: {
          pt: 'As notificações agora mostram exatamente o nome da tarefa, hábito ou projeto agendado (e o projeto vinculado), acabando com títulos genéricos.',
          en: 'Notifications now clearly state the exact name of your scheduled task, habit, or project (plus linked project), eliminating generic labels.',
          es: 'Las notificaciones ahora muestran claramente el nombre exacto de la tarea, hábito o proyecto programado (y proyecto vinculado), eliminando títulos genéricos.',
        },
      },
      {
        icon: '⏰',
        title: {
          pt: 'Mini Card da Agenda Operacional no QG',
          en: 'Operational Schedule Mini Card on HQ',
          es: 'Mini Tarjeta de Agenda Operativa en el QG',
        },
        desc: {
          pt: 'Visualização tática dos horários de hoje na tela principal (mobile e PC), com ordenação cronológica, badges de status ("AGORA", "EM BREVE") e botão de conclusão em 1 clique.',
          en: 'Tactical overview of today’s scheduled times right on the main HQ screen (mobile & PC), featuring chronological ordering, status badges ("NOW", "SOON"), and 1-tap completion.',
          es: 'Vista táctica de los horarios de hoy directamente en el QG principal (móvil y PC), con orden cronológico, insignias de estado ("AHORA", "PRONTO") y botón de conclusión en 1 clic.',
        },
      },
      {
        icon: '🌐',
        title: {
          pt: 'Tradução Tríplice Completa (PT, EN, ES)',
          en: 'Full Triple Translation (PT, EN, ES)',
          es: 'Traducción Triple Completa (PT, EN, ES)',
        },
        desc: {
          pt: 'Todos os novos textos do mini card, notificações externas e alertas sonoros traduzidos com precisão cirúrgica.',
          en: 'All new strings in the mini card, external notifications, and sound alerts translated with surgical precision.',
          es: 'Todos los nuevos textos de la mini tarjeta, notificaciones externas y alertas sonoras traducidos con precisión quirúrgica.',
        },
      },
    ],
  },
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
    badge: 'stability',
    isLatest: false,
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

