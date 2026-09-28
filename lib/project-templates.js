// lib/project-templates.js
// Modelos Estratégicos Predefinidos e Categorias Guiadas com Hábitos, Mandamentos e Etapas da Forja
// Trilíngue: Português, Inglês e Espanhol

export const PROJECT_CATEGORIES = [
  {
    id: 'body',
    icon: '🗿',
    label: {
      pt: 'Corpo & Físico',
      en: 'Body & Physical',
      es: 'Cuerpo y Físico',
    },
    desc: {
      pt: 'Treino de força, shape, queima de gordura, postura de combate, água e alimentação limpa.',
      en: 'Strength training, physique, fat loss, warrior posture, hydration, and clean nutrition.',
      es: 'Entrenamiento de fuerza, físico, quema de grasa, postura de combate, hidratación y comida limpia.',
    },
    commandmentsSuggestions: {
      pt: [
        'O corpo é o templo do guerreiro: não tolero fraqueza física nem sedentarismo.',
        'A dor do treino é passageira; a vergonha de um corpo decadente é eterna.',
        'Comida limpa e água abundante: minha máquina exige combustível de primeira.',
        'Minha postura corporal reflete a autoridade de quem governa a si mesmo.',
        'Consistência diária vence o entusiasmo esporádico.',
      ],
      en: [
        'The body is the warrior\'s temple: I do not tolerate physical weakness or sloth.',
        'Workout pain is fleeting; the shame of a decaying body lasts forever.',
        'Clean nutrition and abundant water: my machine demands premium fuel.',
        'My body posture reflects the authority of a man who rules himself.',
        'Daily consistency beats sporadic enthusiasm.',
      ],
      es: [
        'El cuerpo es el templo del guerrero: no tolero debilidad física ni pereza.',
        'El dolor del entrenamiento pasa; la vergüenza de un cuerpo decadente dura para siempre.',
        'Comida limpia y agua abundante: mi máquina exige combustible de primera.',
        'Mi postura corporal refleja la autoridad de quien se gobierna a sí mismo.',
        'La constancia diaria vence al entusiasmo esporádico.',
      ],
    },
    habitSuggestions: [
      { id: 2, name: { pt: 'Treino de Força', en: 'Strength Workout', es: 'Entrenamiento de Fuerza' }, icon: '🏋️' },
      { id: 13, name: { pt: '3L de Água', en: '3L Water', es: '3L de Agua' }, icon: '💧' },
      { id: 7, name: { pt: 'Cortar Açúcar', en: 'Cut Sugar', es: 'Cortar Azúcar' }, icon: '🍯' },
      { id: 1, name: { pt: 'Banho Gelado', en: 'Cold Shower', es: 'Ducha Fría' }, icon: '🧊' },
    ],
    stepSuggestions: {
      pt: [
        'Definir divisão de treino semanal (mínimo 5 dias na semana)',
        'Bater a meta de 3 litros de água diariamente sem falhar',
        'Eliminar refrigerantes, doces e ultraprocessados da despensa',
        'Tirar fotos de evolução no Dia 1, Dia 30 e Dia 90 para registro de honra',
      ],
      en: [
        'Define weekly training split (minimum 5 days per week)',
        'Hit the 3-liter daily water target without fail',
        'Eliminate sodas, junk sweets, and ultra-processed food from the pantry',
        'Take progress photos on Day 1, Day 30, and Day 90 for honor tracking',
      ],
      es: [
        'Definir rutina de entrenamiento semanal (mínimo 5 días por semana)',
        'Alcanzar la meta de 3 litros de agua diarios sin falta',
        'Eliminar refrescos, dulces y ultraprocesados de la despensa',
        'Tomar fotos de progreso en el Día 1, Día 30 y Día 90 para el registro de honor',
      ],
    },
  },
  {
    id: 'mind',
    icon: '🧠',
    label: {
      pt: 'Mente',
      en: 'Mind',
      es: 'Mente',
    },
    desc: {
      pt: 'Autocontrole estoico, foco frio, autoimagem inabalável, leitura e clareza mental.',
      en: 'Stoic self-control, razor focus, unshakeable self-image, reading, and mental clarity.',
      es: 'Autocontrol estoico, enfoque frío, autoimagen inquebrantable, lectura y claridad mental.',
    },
    commandmentsSuggestions: {
      pt: [
        'EU SOU O PRÊMIO: Minha energia e atenção não são dadas de graça.',
        'Não me curvo à aprovação ou validação alheia.',
        'Silêncio estratégico: menos conversa vazia, mais aço forjado.',
        'O desconforto é meu campo de treino; corro na direção do difícil.',
        'Mantenho a mente pura: zero devaneio ou consumo degenerado.',
      ],
      en: [
        'I AM THE PRIZE: My energy and attention are never given away for free.',
        'I do not bow to external validation or other people\'s approval.',
        'Strategic silence: less idle talk, more forged steel.',
        'Discomfort is my training ground; I run towards the hard task.',
        'I keep my mind pure: zero daydreaming, zero degenerate consumption.',
      ],
      es: [
        'YO SOY EL PREMIO: Mi energía y atención no se regalan jamás.',
        'No me inclino ante la aprobación o validación ajena.',
        'Silencio estratégico: menos charla vacía, más acero forjado.',
        'La incomodidad es mi campo de entrenamiento; corro hacia lo difícil.',
        'Mantengo mi mente pura: cero divagación y cero consumo degenerado.',
      ],
    },
    habitSuggestions: [
      { id: 3, name: { pt: 'Leitura Estoica', en: 'Stoic Reading', es: 'Lectura Estoica' }, icon: '📜' },
      { id: 9, name: { pt: 'Meditação (10-15m)', en: 'Meditation (10-15m)', es: 'Meditación (10-15m)' }, icon: '🧘' },
      { id: 8, name: { pt: 'Caminhada Sem Fones', en: 'Walk Without Headphones', es: 'Caminata Sin Auriculares' }, icon: '🚶' },
      { id: 19, name: { pt: 'Tarefa Mais Difícil Primeiro', en: 'Hardest Task First', es: 'Tarea Más Difícil Primeiro' }, icon: '🗿' },
    ],
    stepSuggestions: {
      pt: [
        'Desinstalar ou silenciar redes sociais de distração',
        'Ler 20 páginas de um livro estoico ou de autoimagem por dia',
        'Caminhada matinal diária de 30 minutos em silêncio total',
        'Escrever meu novo código de conduta pessoal no diário',
      ],
      en: [
        'Uninstall or mute distracting social media apps',
        'Read 20 pages of a stoic or personal mastery book daily',
        'Daily 30-minute morning walk in complete silence',
        'Write my new personal warrior code in the journal',
      ],
      es: [
        'Desinstalar o silenciar redes sociales de distracción',
        'Leer 20 páginas de un libro estoico o de autoimagen por día',
        'Caminata matutina diaria de 30 minutos en silencio total',
        'Escribir mi nuevo código de honor personal en el diario',
      ],
    },
  },
  {
    id: 'finance',
    icon: '💼',
    label: {
      pt: 'Carreira & Finanças',
      en: 'Career & Wealth',
      es: 'Carrera y Finanzas',
    },
    desc: {
      pt: 'Construção de império, trabalho profundo, aumento de renda, investimentos e execução implacável.',
      en: 'Empire building, deep work, income growth, investments, and relentless execution.',
      es: 'Construcción de imperio, trabajo profundo, aumento de ingresos, inversiones y ejecución implacable.',
    },
    commandmentsSuggestions: {
      pt: [
        'Trabalho focado e sem interrupções constrói o império.',
        'Dinheiro respeita quem tem disciplina, reserva e visão fria.',
        'Não gasto para impressionar pessoas que não importam.',
        'Minha energia vital é convertida em riqueza e maestria profissional.',
        'A tarefa mais difícil é a primeira a ser abatida.',
      ],
      en: [
        'Focused and uninterrupted deep work builds the empire.',
        'Money respects those with discipline, reserves, and cold vision.',
        'I do not spend to impress people who do not matter.',
        'My vital energy is converted into wealth and professional mastery.',
        'The hardest task is the first to be eliminated.',
      ],
      es: [
        'El trabajo enfocado y sin interrupciones construye el imperio.',
        'El dinero respeta a quien tiene disciplina, reservas y visión fría.',
        'No gasto para impresionar a personas que no importan.',
        'Mi energía vital se convierte en riqueza y maestría profesional.',
        'La tarea más difícil es la primera en ser abatida.',
      ],
    },
    habitSuggestions: [
      { id: 19, name: { pt: 'Tarefa Mais Difícil Primeiro', en: 'Hardest Task First', es: 'Tarea Más Difícil Primeiro' }, icon: '🗿' },
      { id: 4, name: { pt: 'Acordar 05:59', en: 'Wake Up at 05:59', es: 'Despertar a las 05:59' }, icon: '⏰' },
      { id: 16, name: { pt: 'Foco Profundo 90m', en: 'Deep Focus 90m', es: 'Enfoque Profundo 90m' }, icon: '🎯' },
      { id: 20, name: { pt: 'Ação de Valor Silenciosa', en: 'Silent Value Action', es: 'Acción de Valor Silenciosa' }, icon: '🤝' },
    ],
    stepSuggestions: {
      pt: [
        'Mapear e cortar todos os custos supérfluos do mês',
        'Dedicar 3 blocos diários de 90 minutos de foco profundo no projeto de renda',
        'Construir a primeira reserva de emergência inegociável',
        'Finalizar a entrega do principal projeto ou produto da temporada',
      ],
      en: [
        'Audit and eliminate all superfluous monthly expenses',
        'Dedicate 3 daily 90-minute deep work blocks to income-producing projects',
        'Build the first non-negotiable emergency reserve',
        'Deliver the primary project or product of the season',
      ],
      es: [
        'Auditar y eliminar todos los gastos superfluos del mes',
        'Dedicar 3 bloques diarios de 90 minutos de trabajo profundo al proyecto de ingresos',
        'Construir la primera reserva de emergencia innegociable',
        'Finalizar la entrega del proyecto o producto principal de la temporada',
      ],
    },
  },
  {
    id: 'spirit',
    icon: '🏛️',
    label: {
      pt: 'Espiritual',
      en: 'Spiritual',
      es: 'Espiritual',
    },
    desc: {
      pt: 'Propósito elevado, paz interior, força da alma, meditação/oração e retidão moral.',
      en: 'Higher purpose, inner peace, strength of soul, meditation/prayer, and moral integrity.',
      es: 'Propósito elevado, paz interior, fuerza del alma, meditación/oración y rectitud moral.',
    },
    commandmentsSuggestions: {
      pt: [
        'Minha alma é inabalável perante o caos do mundo exterior.',
        'A paz interior vem do alinhamento entre o que penso, falo e executo.',
        'Gratidão diária pelo fôlego de vida e pela oportunidade de lutar.',
        'Governo minhas fraquezas com reverência ao sagrado.',
        'O silêncio diário e a contemplação renovam minhas forças.',
      ],
      en: [
        'My soul remains unshaken amidst the chaos of the outside world.',
        'Inner peace comes from total alignment of thought, word, and deed.',
        'Daily gratitude for the breath of life and the honor to battle.',
        'I govern my weaknesses with deep reverence for the sacred.',
        'Daily silence and contemplation renew my inner fire.',
      ],
      es: [
        'Mi alma permanece inquebrantable ante el caos del mundo exterior.',
        'La paz interior nace de alinear lo que pienso, digo y hago.',
        'Gratitud diaria por el aliento de vida y el honor de luchar.',
        'Gobierno mis debilidades con reverencia por lo sagrado.',
        'El silencio diario y la contemplación renuevan mi fuego interior.',
      ],
    },
    habitSuggestions: [
      { id: 9, name: { pt: 'Meditação (10-15m)', en: 'Meditation (10-15m)', es: 'Meditación (10-15m)' }, icon: '🧘' },
      { id: 14, name: { pt: 'Sol Matinal', en: 'Morning Sunlight', es: 'Sol Matinal' }, icon: '☀️' },
      { id: 8, name: { pt: 'Caminhada Sem Fones', en: 'Walk Without Headphones', es: 'Caminata Sin Auriculares' }, icon: '🚶' },
      { id: 20, name: { pt: 'Ação de Valor Silenciosa', en: 'Silent Value Action', es: 'Acción de Valor Silenciosa' }, icon: '🤝' },
    ],
    stepSuggestions: {
      pt: [
        'Praticar 15 minutos diários de silêncio, oração ou meditação ao acordar',
        'Afastar-se de ambientes tóxicos, fofocas e conversas degeneradas',
        'Fazer uma ação silenciosa de bem a alguém sem buscar aplauso',
        'Escrever no diário de bordo os aprendizados espirituais do projeto',
      ],
      en: [
        'Practice 15 minutes of silence, prayer, or meditation upon waking',
        'Step away from toxic spaces, idle gossip, and corrupt discussions',
        'Perform a quiet act of service for someone without seeking praise',
        'Record spiritual revelations and lessons in the warrior journal',
      ],
      es: [
        'Practicar 15 minutos de silencio, oración o meditación al despertar',
        'Apartarse de entornos tóxicos, chismes y charlas degeneradas',
        'Hacer un acto silencioso de bien a alguien sin buscar aplausos',
        'Escribir en el diario de a bordo los aprendizajes espirituales del proyecto',
      ],
    },
  },
  {
    id: 'personal',
    icon: '⚡',
    label: {
      pt: 'Desenvolvimento Pessoal',
      en: 'Personal Growth',
      es: 'Desarrollo Personal',
    },
    desc: {
      pt: 'Rotina impecável, hábitos de ferro, ordem diária, livros, postura de respeito e maturidade.',
      en: 'Flawless routine, iron habits, daily order, books, commanding presence, and maturity.',
      es: 'Rutina impecable, hábitos de hierro, orden diario, libros, presencia y madurez.',
    },
    commandmentsSuggestions: {
      pt: [
        'Como faço uma coisa é como faço todas as coisas.',
        'Minha palavra é sagrada: compromisso assumido é compromisso cumprido.',
        'Ordem no ambiente, ordem na mente: cama arrumada, espaço limpo.',
        'Invisto na minha mente todos os dias através de leitura e estudo.',
        'Não perco tempo discutindo; minha resposta é minha evolução visível.',
      ],
      en: [
        'How I do one thing is how I do everything.',
        'My word is sacred: a commitment made is a commitment honored.',
        'Order in my space brings order to my mind: bed made, clutter eliminated.',
        'I invest in my mind every single day through books and study.',
        'I waste zero time arguing; my answer is visible personal growth.',
      ],
      es: [
        'Cómo hago una cosa es cómo hago todas las cosas.',
        'Mi palabra es sagrada: compromiso asumido es compromiso cumplido.',
        'Orden en mi espacio trae orden a mi mente: cama hecha, espacio limpio.',
        'Invierto en mi mente todos los días a través de libros y estudio.',
        'No pierdo tiempo discutiendo; mi respuesta es mi crecimiento visible.',
      ],
    },
    habitSuggestions: [
      { id: 3, name: { pt: 'Leitura Estoica', en: 'Stoic Reading', es: 'Lectura Estoica' }, icon: '📜' },
      { id: 4, name: { pt: 'Acordar 05:59', en: 'Wake Up at 05:59', es: 'Despertar a las 05:59' }, icon: '⏰' },
      { id: 11, name: { pt: 'Arrumar a Cama', en: 'Make Bed', es: 'Hacer la Cama' }, icon: '🛏️' },
      { id: 15, name: { pt: 'Diário de Bordo', en: 'Log Journal', es: 'Diario de Bordo' }, icon: '✍️' },
    ],
    stepSuggestions: {
      pt: [
        'Ler pelo menos 15 páginas de um livro de desenvolvimento todos os dias',
        'Eliminar a procrastinação matinal: levantar no primeiro toque do alarme',
        'Organizar o quarto, mesa de trabalho e rotina sem acúmulo de bagunça',
        'Mapear e corrigir 3 comportamentos imaturos ou reativos na convivência diária',
      ],
      en: [
        'Read at least 15 pages of a personal development book every day',
        'Eliminate morning procrastination: rise at the very first alarm',
        'Organize bedroom, workspace, and routine without clutter build-up',
        'Audit and correct 3 immature or reactive habits in daily interactions',
      ],
      es: [
        'Leer al menos 15 páginas de un libro de desarrollo todos los días',
        'Eliminar la procrastinación matutina: levantarse al primer toque de alarma',
        'Organizar habitación, escritorio y rutina sin acumular desorden',
        'Mapear y corregir 3 comportamientos inmaduros o reactivos en la convivencia',
      ],
    },
  },
  {
    id: 'hard',
    icon: '🔥',
    label: {
      pt: 'Desenvolvimento Hard (Guerra Total)',
      en: 'Hardcore Growth (Total War)',
      es: 'Desarrollo Hard (Guerra Total)',
    },
    desc: {
      pt: 'Foco total em crescer em todas as áreas simultaneamente: corpo forjado, mente afiada, trabalho implacável e espírito inabalável.',
      en: 'All-out focus on leveling up in every area simultaneously: forged physique, razor mind, ruthless work, and unbreakable spirit.',
      es: 'Enfoque total en crecer en todas las áreas simultáneamente: cuerpo forjado, mente afilada, trabajo implacable y espíritu inquebrantable.',
    },
    commandmentsSuggestions: {
      pt: [
        'GUERRA TOTAL: Subo a régua em todas as frentes ao mesmo tempo.',
        'Zero concessões: corpo, mente, trabalho e espírito marchando juntos.',
        'O homem que sou hoje é o inimigo que preciso superar para vencer.',
        'Abraço o desconforto diário como combustível para minha metamorfose.',
        'Não descanso até que meus resultados superem todas as minhas expectativas.',
      ],
      en: [
        'TOTAL WAR: I raise the standard on all fronts at the same time.',
        'Zero concessions: body, mind, work, and spirit marching together.',
        'The man I am today is the enemy I must conquer to win.',
        'I embrace daily discomfort as pure fuel for my metamorphosis.',
        'I do not stop until my results shatter every previous expectation.',
      ],
      es: [
        'GUERRA TOTAL: Subo el estándar en todos los frentes al mismo tiempo.',
        'Cero concesiones: cuerpo, mente, trabajo y espíritu marchando juntos.',
        'El hombre que soy hoy es el enemigo que debo conquistar para vencer.',
        'Abrazo la incomodidad diaria como combustible de mi metamorfosis.',
        'No me detengo hasta que mis resultados superen toda expectativa.',
      ],
    },
    habitSuggestions: [
      { id: 2, name: { pt: 'Treino de Força', en: 'Strength Workout', es: 'Entrenamiento de Fuerza' }, icon: '🏋️' },
      { id: 1, name: { pt: 'Banho Gelado', en: 'Cold Shower', es: 'Ducha Fría' }, icon: '🧊' },
      { id: 19, name: { pt: 'Tarefa Mais Difícil Primeiro', en: 'Hardest Task First', es: 'Tarea Más Difícil Primeiro' }, icon: '🗿' },
      { id: 4, name: { pt: 'Acordar 05:59', en: 'Wake Up at 05:59', es: 'Despertar a las 05:59' }, icon: '⏰' },
      { id: 3, name: { pt: 'Leitura Estoica', en: 'Stoic Reading', es: 'Lectura Estoica' }, icon: '📜' },
      { id: 13, name: { pt: '3L de Água', en: '3L Water', es: '3L de Agua' }, icon: '💧' },
    ],
    stepSuggestions: {
      pt: [
        'Estabelecer o pacto inquebrantável de honra para todo o período do projeto',
        'Executar 100% dos hábitos diários e treino sem falhar sequer um dia',
        'Trabalhar 4 horas diárias com foco implacável nas metas de carreira',
        'Chegar ao dia final transformado em uma nova referência de homem',
      ],
      en: [
        'Establish the unbreakable covenant of honor for the entire project term',
        'Execute 100% of daily habits and training without missing a single day',
        'Deliver 4 hours of ruthless deep work daily towards career targets',
        'Reach the final day transformed into a completely new benchmark of a man',
      ],
      es: [
        'Establecer el pacto inquebrantable de honor para todo el período del proyecto',
        'Ejecutar el 100% de los hábitos diarios y entrenamiento sin fallar ni un día',
        'Cumplir 4 horas de trabajo profundo implacable diario hacia metas profesionales',
        'Llegar al día final transformado en un referente de hombre totalmente nuevo',
      ],
    },
  },
];

// OS 6 MODELOS PRÉ-CONFIGURADOS DA FORJA (ATIVÁVEIS COM 1 CLIQUE)
export const PREDEFINED_TEMPLATES = [
  {
    id: 'tpl_new_man_90',
    title: {
      pt: '🔥 Operação Homem Novo: Reconstrução em 90 Dias',
      en: '🔥 Operation New Man: 90-Day Complete Rebuild',
      es: '🔥 Operación Hombre Nuevo: Reconstrucción en 90 Días',
    },
    category: 'hard',
    days: 90,
    linkPillars: true,
    desc: {
      pt: 'Reset definitivo de autoimagem, energia seminal e mentalidade. Fazer tudo ao contrário do que fazia: corpo forjado, mente afiada e 3 pilares blindados até a vitória completa.',
      en: 'Definitive reset of self-image, seminal energy, and mindset. Doing the exact opposite of past failures: forged physique, sharp mind, and 3 shielded pillars to complete victory.',
      es: 'Reset definitivo de autoimagen, energía seminal y mentalidad. Hacer todo lo contrario a lo anterior: cuerpo forjado, mente afilada y 3 pilares blindados hasta la victoria.',
    },
    commandments: {
      pt: [
        'EU SOU O PRÊMIO: Minha energia e atenção são sagradas e caras.',
        'Não ligo para opinião alheia; focado exclusivamente na minha evolução.',
        'Não caçar nem implorar validação feminina; eu governo meu próprio destino.',
        'Falar menos, executar mais: o aço é forjado no silêncio.',
        'Zero pornografia, zero masturbação e retenção inabalável.',
      ],
      en: [
        'I AM THE PRIZE: My energy and attention are sacred and scarce.',
        'I do not care about others\' opinions; focused strictly on my evolution.',
        'Never chase or beg for female validation; I rule my own destiny.',
        'Speak less, execute more: steel is forged in silence.',
        'Zero pornography, zero masturbation, and unbreakable retention.',
      ],
      es: [
        'YO SOY EL PREMIO: Mi energía y atención son sagradas y caras.',
        'No me importa la opinión ajena; enfocado estrictamente en mi evolución.',
        'No perseguir ni rogar validación femenina; yo gobierno mi destino.',
        'Hablar menos, ejecutar más: el acero se forja en el silencio.',
        'Cero pornografía, cero masturbación y retención inquebrantable.',
      ],
    },
    habits: [
      { id: 2, name: { pt: 'Treino de Força', en: 'Strength Workout', es: 'Entrenamiento de Fuerza' }, icon: '🏋️' },
      { id: 3, name: { pt: 'Leitura Estoica', en: 'Stoic Reading', es: 'Lectura Estoica' }, icon: '📜' },
      { id: 1, name: { pt: 'Banho Gelado', en: 'Cold Shower', es: 'Ducha Fría' }, icon: '🧊' },
      { id: 8, name: { pt: 'Caminhada Sem Fones', en: 'Walk Without Headphones', es: 'Caminata Sin Auriculares' }, icon: '🚶' },
    ],
    steps: {
      pt: [
        'Excluir apps de namoro e limpar perfis de distração das redes',
        'Superar a primeira barreira crítica de 14 dias sem recaída',
        'Consolidar o hábito diário de leitura e treino sem nenhuma falta',
        'Atingir o marco supremo dos 90 dias com autoimagem reconstruída',
      ],
      en: [
        'Delete dating apps and purge distracting feeds from social media',
        'Overcome the first critical 14-day threshold without relapse',
        'Lock in daily reading and workout habits without a single miss',
        'Hit the supreme 90-day milestone with completely rebuilt self-image',
      ],
      es: [
        'Eliminar apps de citas y limpiar perfiles de distracción en redes',
        'Superar la primera barrera crítica de 14 días sin recaída',
        'Consolidar el hábito diario de lectura y entrenamiento sin fallos',
        'Alcanzar el hito supremo de 90 días con autoimagen reconstruida',
      ],
    },
  },
  {
    id: 'tpl_year_end_sprint',
    title: {
      pt: '🦅 Reta Final do Ano: Sprint dos Últimos Meses',
      en: '🦅 Year-End Sprint: Final Months Transformation',
      es: '🦅 Recta Final del Año: Sprint de los Últimos Meses',
    },
    category: 'hard',
    days: 90,
    linkPillars: true,
    desc: {
      pt: 'Chega de terminar o ano arrependido. Usar os últimos meses com intensidade implacável para mudar tudo e virar o ano como um homem novo e vitorioso.',
      en: 'No more ending the year in regret. Use these final months with ruthless intensity to change everything and enter the new year as a new, victorious man.',
      es: 'Basta de terminar el año con arrepentimiento. Usa los últimos meses con intensidad implacable para cambiar todo y recibir el año como un hombre victorioso.',
    },
    commandments: {
      pt: [
        'Cada dia restante do ano é uma trincheira ganha com honra.',
        'Não vou cruzar o Réveillon com a mente enfraquecida e os olhos dopados.',
        'Prioridade absoluta no que move minha vida: corpo, mente e trabalho.',
        'Minha palavra é lei: o que planejo pela manhã, executo até o anoitecer.',
      ],
      en: [
        'Every remaining day of the year is a trench won with honor.',
        'I will not cross into New Year\'s Eve with a weakened mind and dopaminergic haze.',
        'Absolute priority on what moves my life: body, mind, and work.',
        'My word is law: what I plan in the morning, I execute before dusk.',
      ],
      es: [
        'Cada día restante del año es una trinchera ganada con honor.',
        'No cruzaré el Año Nuevo con mente debilitada y niebla dopaminérgica.',
        'Prioridad absoluta en lo que mueve mi vida: cuerpo, mente y trabajo.',
        'Mi palabra es ley: lo que planeo en la mañana, lo ejecuto al anochecer.',
      ],
    },
    habits: [
      { id: 4, name: { pt: 'Acordar 05:59', en: 'Wake Up at 05:59', es: 'Despertar a las 05:59' }, icon: '⏰' },
      { id: 19, name: { pt: 'Tarefa Mais Difícil Primeiro', en: 'Hardest Task First', es: 'Tarea Más Difícil Primero' }, icon: '🗿' },
      { id: 2, name: { pt: 'Treino de Força', en: 'Strength Workout', es: 'Entrenamiento de Fuerza' }, icon: '🏋️' },
      { id: 13, name: { pt: '3L de Água', en: '3L Water', es: '3L de Agua' }, icon: '💧' },
    ],
    steps: {
      pt: [
        'Mapear e liquidar todas as pendências que venho arrastando o ano todo',
        'Blindar a reta final contra recaídas sexuais e desculpas de fim de ano',
        'Completar 60 dias de treino ininterrupto antes da virada do ano',
        'Chegar no dia 31 de dezembro no topo da forma física e mental',
      ],
      en: [
        'Audit and eliminate every loose end dragged throughout the year',
        'Shield this final sprint against relapses and holiday excuses',
        'Complete 60 days of uninterrupted training before year-end',
        'Arrive on December 31st at the peak of physical and mental readiness',
      ],
      es: [
        'Mapear y liquidar todos los pendientes arrastrados a lo largo del año',
        'Blindar la recta final contra recaídas y excusas de fin de año',
        'Completar 60 días de entrenamiento ininterrumpido antes de fin de año',
        'Llegar al 31 de diciembre en la cima física y mental',
      ],
    },
  },
  {
    id: 'tpl_three_pillars_pact',
    title: {
      pt: '🛡️ O Pacto dos 3 Pilares: Reset Sexual de 90 Dias',
      en: '🛡️ The 3 Pillars Pact: 90-Day Sexual Reset',
      es: '🛡️ El Pacto de los 3 Pilares: Reset Sexual de 90 Días',
    },
    category: 'spirit',
    days: 90,
    linkPillars: true,
    desc: {
      pt: 'Compromisso de aço puro: sem pornografia, sem masturbação e com retenção seminal absoluta. Cura dopaminérgica completa e restauração da presença masculina.',
      en: 'Pure steel commitment: no porn, no masturbation, and absolute semen retention. Complete dopaminergic healing and masculine presence restoration.',
      es: 'Compromiso de acero puro: sin porno, sin masturbación y retención seminal absoluta. Cura dopaminérgica completa y restauración de la presencia masculina.',
    },
    commandments: {
      pt: [
        'Nem um segundo de tela suja: o primeiro olhar é acidente, o segundo é traição.',
        'Minha energia sexual é meu motor criativo; transmuto em ferro e foco.',
        'Se o gatilho apertar, largo o celular e tomo banho gelado imediatamente.',
        'O guerreiro governa a carne; a carne jamais governa o guerreiro.',
      ],
      en: [
        'Not a single second of dirty screens: the first glance is accident, the second is betrayal.',
        'My sexual energy is my creative engine; I transmute into iron and focus.',
        'If a trigger strikes, I drop the phone and take a cold shower immediately.',
        'The warrior rules the flesh; the flesh never rules the warrior.',
      ],
      es: [
        'Ni un segundo de pantalla sucia: la primera mirada es accidente, la segunda traición.',
        'Mi energía sexual es mi motor creativo; transmuto en hierro y enfoque.',
        'Si aprieta el gatillo, suelto el celular y me ducho con agua fría al instante.',
        'El guerrero gobierna la carne; la carne jamás gobierna al guerrero.',
      ],
    },
    habits: [
      { id: 1, name: { pt: 'Banho Gelado', en: 'Cold Shower', es: 'Ducha Fría' }, icon: '🧊' },
      { id: 18, name: { pt: 'Mobilidade Pélvica', en: 'Pelvic Mobility', es: 'Movilidad Pélvica' }, icon: '🦴' },
      { id: 5, name: { pt: 'Apagão de Telas', en: 'Screen Blackout', es: 'Apagón de Pantallas' }, icon: '🌑' },
      { id: 9, name: { pt: 'Meditação (10-15m)', en: 'Meditation (10-15m)', es: 'Meditación (10-15m)' }, icon: '🧘' },
    ],
    steps: {
      pt: [
        'Semana 1: Quebra do impulso compulsivo automático',
        'Semana 4 (Dia 30): Saída da névoa mental e primeiro pico de clareza',
        'Semana 8 (Dia 60): Estabilização da flatline e autodomínio firme',
        'Semana 13 (Dia 90): Conquista da insígnia Campeão da Forja e reset neural',
      ],
      en: [
        'Week 1: Breaking the automatic compulsive loop',
        'Week 4 (Day 30): Lifting the brain fog and first wave of clarity',
        'Week 8 (Day 60): Stabilizing flatline with firm self-mastery',
        'Week 13 (Day 90): Unlocking Forge Champion badge and neural reset',
      ],
      es: [
        'Semana 1: Ruptura del impulso compulsivo automático',
        'Semana 4 (Día 30): Salida de la niebla mental y primera claridad',
        'Semana 8 (Día 60): Estabilización de la flatline y autodominio firme',
        'Semana 13 (Día 90): Conquista de la insignia Campeón de la Forja y reset neural',
      ],
    },
  },
  {
    id: 'tpl_monk_dopamine_30',
    title: {
      pt: '⚔️ O Monge de Ferro: Detox Dopaminérgico de 30 Dias',
      en: '⚔️ The Iron Monk: 30-Day Dopamine Detox',
      es: '⚔️ El Monje de Hierro: Detox Dopaminérgico de 30 Días',
    },
    category: 'mind',
    days: 30,
    linkPillars: true,
    desc: {
      pt: 'Desconexão brutal da estimulação vazia por 1 mês: zero redes sociais, zero comida lixo, zero dopamina barata. Recuperar a sensibilidade dos receptores e a fome de conquista.',
      en: 'Ruthless disconnection from cheap stimulation for 1 month: zero social media feeds, zero junk food, zero easy dopamine. Reclaiming dopamine sensitivity and hunger for real conquest.',
      es: 'Desconexión implacable de la estimulación vacía por 1 mes: cero redes sociales, cero comida chatarra, cero dopamina fácil. Recuperar la sensibilidad y el hambre de conquista.',
    },
    commandments: {
      pt: [
        'O tédio é a porta de entrada para a criatividade e a paz.',
        'Minha mente não é lixeira para algoritmos e reels.',
        'Abraço o silêncio e o esforço sem buscar recompensa instantânea.',
        'O controle sobre os meus olhos determina o controle sobre a minha vida.',
      ],
      en: [
        'Boredom is the gateway to creativity and genuine peace.',
        'My mind is not a trash bin for feeds and algorithmic noise.',
        'I embrace silence and effort without craving instant gratification.',
        'Controlling my gaze determines controlling my life.',
      ],
      es: [
        'El aburrimiento es la puerta hacia la creatividad y la paz genuina.',
        'Mi mente no es basurero para algoritmos ni reels.',
        'Abrazo el silencio y el esfuerzo sin buscar recompensa instantánea.',
        'El control sobre mis ojos determina el control sobre mi vida.',
      ],
    },
    habits: [
      { id: 5, name: { pt: 'Apagão de Telas', en: 'Screen Blackout', es: 'Apagón de Pantallas' }, icon: '🌑' },
      { id: 6, name: { pt: 'Limpeza de Redes', en: 'Social Media Cleanse', es: 'Limpieza de Redes' }, icon: '🧹' },
      { id: 7, name: { pt: 'Cortar Açúcar', en: 'Cut Sugar', es: 'Cortar Azúcar' }, icon: '🍯' },
      { id: 8, name: { pt: 'Caminhada Sem Fones', en: 'Walk Without Headphones', es: 'Caminata Sin Auriculares' }, icon: '🚶' },
    ],
    steps: {
      pt: [
        'Deletar apps viciantes do celular durante os 30 dias',
        'Trocar tela do celular para modo preto e branco',
        'Jantar e ler sem nenhuma tela por perto',
        'Completar 30 dias sem consumir açúcar refinado nem redes sociais',
      ],
      en: [
        'Delete addictive apps from smartphone for 30 full days',
        'Switch phone display to grayscale mode',
        'Dine and read without screens anywhere in sight',
        'Complete 30 days free from refined sugar and social media',
      ],
      es: [
        'Eliminar apps adictivas del celular durante los 30 días',
        'Cambiar la pantalla del teléfono a escala de grises',
        'Cenar y leer sin pantallas cerca',
        'Completar 30 días sin azúcar refinada ni redes sociales',
      ],
    },
  },
  {
    id: 'tpl_financial_forge_60',
    title: {
      pt: '💰 Forja do Império: 60 Dias de Execução Financeira',
      en: '💰 Empire Forge: 60 Days of Financial Execution',
      es: '💰 Forja del Imperio: 60 Días de Ejecución Financiera',
    },
    category: 'finance',
    days: 60,
    linkPillars: false,
    desc: {
      pt: '60 dias de foco implacável no aumento de renda, trabalho profundo e disciplina orçamentária. Cortar o supérfluo e transformar esforço focado em patrimônio e valor real.',
      en: '60 days of relentless focus on income generation, deep work, and budget discipline. Cutting waste and transmuting focused work into assets and real value.',
      es: '60 días de enfoque implacable en generar ingresos, trabajo profundo y disciplina de presupuesto. Cortar desperdicios y transformar el esfuerzo en patrimonio.',
    },
    commandments: {
      pt: [
        'Minha produtividade diária define a liberdade da minha família.',
        'Primeiro ganho e construo; os luxos vêm do excedente, nunca do suor inicial.',
        'Não negocio com a preguiça quando o dever financeiro me chama.',
        'Cada hora de foco profundo vale dez horas de distração disfarçada de trabalho.',
      ],
      en: [
        'My daily output defines my family\'s lasting freedom.',
        'First I earn and build; luxury comes from surplus, never initial sweat.',
        'I do not negotiate with laziness when financial duty calls.',
        'Each hour of deep work is worth ten hours of distraction masked as hustle.',
      ],
      es: [
        'Mi productividad diaria define la libertad de mi familia.',
        'Primero gano y construyo; los lujos vienen del excedente, jamás del sudor inicial.',
        'No negocio con la pereza cuando el deber financiero me llama.',
        'Cada hora de trabajo profundo vale diez horas de distracción disfrazada.',
      ],
    },
    habits: [
      { id: 19, name: { pt: 'Tarefa Mais Difícil Primeiro', en: 'Hardest Task First', es: 'Tarea Más Difícil Primero' }, icon: '🗿' },
      { id: 4, name: { pt: 'Acordar 05:59', en: 'Wake Up at 05:59', es: 'Despertar a las 05:59' }, icon: '⏰' },
      { id: 3, name: { pt: 'Leitura Estoica', en: 'Stoic Reading', es: 'Lectura Estoica' }, icon: '📜' },
      { id: 20, name: { pt: 'Ação de Valor Silenciosa', en: 'Silent Value Action', es: 'Acción de Valor Silenciosa' }, icon: '🤝' },
    ],
    steps: {
      pt: [
        'Definir a meta exata de faturamento ou economia dos 60 dias',
        'Organizar planilha de fluxo e eliminar 100% dos vazamentos financeiros',
        'Executar pelo menos 4 horas diárias de trabalho focado sem interrupções',
        'Consolidar a meta financeira proposta até o dia 60',
      ],
      en: [
        'Define the exact revenue or savings target for these 60 days',
        'Organize cashflow and plug 100% of financial leaks',
        'Execute at least 4 daily hours of uninterrupted deep work',
        'Reach the stated financial target by Day 60',
      ],
      es: [
        'Definir la meta exacta de facturación o ahorro para estos 60 días',
        'Organizar flujo de caja y eliminar el 100% de las fugas de dinero',
        'Ejecutar al menos 4 horas diarias de trabajo enfocado sin interrupciones',
        'Alcanzar la meta financiera propuesta al cumplir el día 60',
      ],
    },
  },
  {
    id: 'tpl_spartan_body_60',
    title: {
      pt: '🗿 Armadura de Esparta: Protocolo Físico de 60 Dias',
      en: '🗿 Spartan Armor: 60-Day Physical Protocol',
      es: '🗿 Armadura de Esparta: Protocolo Físico de 60 Días',
    },
    category: 'body',
    days: 60,
    linkPillars: true,
    desc: {
      pt: 'Construção de um físico imponente e resistente. 60 dias de treino de força pesado, alimentação limpa, 3L de água e transmutação diária da energia retida.',
      en: 'Forging a commanding and resilient physique. 60 days of heavy strength training, clean diet, 3L of water, and daily transmutation of retained vigor.',
      es: 'Construcción de un físico imponente y resistente. 60 días de entrenamiento pesado, comida limpia, 3L de agua y transmutación diaria de energía.',
    },
    commandments: {
      pt: [
        'Meu corpo obedece à minha vontade; a dor constrói a armadura.',
        'Alimentação é combustível para o combate, não refúgio emocional.',
        'Sem desculpas para a preguiça: o treino acontece faça sol ou chuva.',
        'Transmuto cada gota de energia seminal em força muscular e vigor.',
      ],
      en: [
        'My body obeys my will; pain forges the armor.',
        'Food is fuel for battle, not an emotional refuge.',
        'No excuses for sloth: the workout happens come rain or shine.',
        'I transmute every drop of seminal energy into muscular strength and vigor.',
      ],
      es: [
        'Mi cuerpo obedece a mi voluntad; el dolor construye la armadura.',
        'La comida es combustible de batalla, no refugio emocional.',
        'Sin excusas para la pereza: el entrenamiento ocurre llueva o truene.',
        'Transmuto cada gota de energía seminal en fuerza muscular y vigor.',
      ],
    },
    habits: [
      { id: 2, name: { pt: 'Treino de Força', en: 'Strength Workout', es: 'Entrenamiento de Fuerza' }, icon: '🏋️' },
      { id: 13, name: { pt: '3L de Água', en: '3L Water', es: '3L de Agua' }, icon: '💧' },
      { id: 7, name: { pt: 'Cortar Açúcar', en: 'Cut Sugar', es: 'Cortar Azúcar' }, icon: '🍯' },
      { id: 1, name: { pt: 'Banho Gelado', en: 'Cold Shower', es: 'Ducha Fría' }, icon: '🧊' },
    ],
    steps: {
      pt: [
        'Registrar peso, medidas e foto inicial do físico no Dia 1',
        'Cumprir 5 treinos semanais rigorosamente durante os 2 meses',
        'Bater meta diária de 3L de água e zero refrigerante por 60 dias',
        'Avaliação final no Dia 60: comparar fotos e celebrar a nova postura corporal',
      ],
      en: [
        'Record weight, measurements, and starting physique photo on Day 1',
        'Strictly complete 5 weekly workouts across both months',
        'Hit daily 3L water goal with zero soda for 60 consecutive days',
        'Final assessment on Day 60: compare photos and celebrate new warrior stance',
      ],
      es: [
        'Registrar peso, medidas y foto inicial del físico en el Día 1',
        'Cumplir 5 entrenamientos semanales rigurosamente durante los 2 meses',
        'Cumplir meta diaria de 3L de agua y cero refrescos por 60 días',
        'Evaluación final en el Día 60: comparar fotos y celebrar la nueva postura',
      ],
    },
  },
];
