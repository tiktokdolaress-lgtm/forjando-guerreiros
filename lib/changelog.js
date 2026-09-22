// lib/changelog.js
// Registro de Decretos da Forja (Notas de Atualização & Versionamento)

export const CURRENT_APP_VERSION = 'v1.4.0';
export const LAST_SEEN_VERSION_KEY = 'fg_last_seen_version';

export const CHANGELOG_RELEASES = [
  {
    version: 'v1.4.0',
    date: '22 de Setembro, 2026',
    title: 'Decretos da Forja: Estandartes 3D & Conselho de Guerra',
    badge: 'NOVA ATUALIZAÇÃO',
    isLatest: true,
    highlights: [
      {
        icon: '🛡️',
        title: 'Estandartes Heráldicos 3D',
        desc: 'Pedestal com os 3 Pilares Sagrados em puro brasão medieval, rotação tática pelo caminho mais curto e seleção por toque direto no 3D.',
      },
      {
        icon: '💬',
        title: 'Conselho de Guerra & Feedback',
        desc: 'Área dedicada na aba Configurações para enviar sugestões de novos recursos, relatar bugs e propor melhorias para o aplicativo.',
      },
      {
        icon: '📜',
        title: 'Decretos & Notas de Atualização',
        desc: 'Notificações visuais elegantes informando o que mudou a cada lançamento, mantendo sua assinatura e seus dados 100% seguros.',
      },
      {
        icon: '⚡',
        title: 'Otimização e Estabilidade',
        desc: 'Carregamento instantâneo do motor 3D, correção de loops angulares e temporizadores de precisão ao vivo.',
      },
    ],
  },
  {
    version: 'v1.3.0',
    date: 'Setembro, 2026',
    title: 'Forja em Alta Definição & Vigilância dos Três Pilares',
    badge: 'ESTABILIDADE',
    isLatest: false,
    highlights: [
      {
        icon: '⚔️',
        title: 'HUD Tático em Alta Resolução',
        desc: 'Estatísticas de dias, metas e cronômetro de precisão ao vivo com nitidez vetorial nativa em qualquer dispositivo.',
      },
      {
        icon: '🔥',
        title: 'Vigilância Independente dos Pilares',
        desc: 'Acompanhamento simultâneo de Retenção Seminal, Sem Pornografia e Sem Masturbação com pureza calculada.',
      },
    ],
  },
];

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
