import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mergeS, progressDays, tierNow, currentStreak } from '@/lib/logic';

const HONOR_WARRIORS = [
  { name: 'Sentinela_do_Aço', days: 395, streak: 98, tier: 'PATRIARCA IMORTAL', tierIcon: '👑', score: 6200, purity: 100 },
  { name: 'Guardião_da_Aurora', days: 294, streak: 122, tier: 'SOBERANO DO TEMPLO', tierIcon: '🦅', score: 5120, purity: 100 },
  { name: 'Espartano_77', days: 201, streak: 72, tier: 'GRÃO-MESTRE DA ORDEM', tierIcon: '⚡', score: 3980, purity: 99 },
  { name: 'Forja_Invicta', days: 146, streak: 49, tier: 'LORDE COMANDANTE', tierIcon: '🔥', score: 2940, purity: 100 },
  { name: 'Aço_Valiriano', days: 104, streak: 42, tier: 'CAMPEÃO DA FORJA', tierIcon: '🐉', score: 2260, purity: 98 },
  { name: 'Lobo_Solitário', days: 82, streak: 33, tier: 'CAMPEÃO DA FORJA', tierIcon: '🐉', score: 1840, purity: 100 },
  { name: 'Vontade_de_Ferro', days: 54, streak: 26, tier: 'CAVALEIRO DA ORDEM', tierIcon: '🏛️', score: 1390, purity: 100 },
  { name: 'Cavaleiro_Sem_Manto', days: 39, streak: 19, tier: 'CAVALEIRO DA ORDEM', tierIcon: '🏛️', score: 1080, purity: 97 },
  { name: 'Fênix_Ressurgida', days: 27, streak: 18, tier: 'HOMEM-DE-ARMAS', tierIcon: '🛡️', score: 810, purity: 100 },
  { name: 'Gladiador_do_Norte', days: 19, streak: 16, tier: 'HOMEM-DE-ARMAS', tierIcon: '🛡️', score: 650, purity: 96 },
  { name: 'Tempestade_Calma', days: 14, streak: 14, tier: 'ESCUDEIRO FORJADO', tierIcon: '⚔️', score: 490, purity: 100 },
  { name: 'Escudeiro_Valente', days: 9, streak: 9, tier: 'PAJEM DE ARMAS', tierIcon: '🗡️', score: 340, purity: 100 },
];

/* Salão da Fama anônimo (opt-in): pseudônimo + dias + patamar + pontuação de glória. Sem nome, e-mail ou dados privados. */
export async function GET() {
  const list = [];

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txtvusttcbdkcXgsdazm.supabase.co',
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      const { data } = await sb.from('warrior_profiles').select('data');
      if (Array.isArray(data)) {
        for (const row of data) {
          const d = row.data;
          if (!d || !d.v || !d.hallOptIn) continue;
          const S2 = mergeS(d);
          const days = progressDays(S2);
          const streak = currentStreak(S2);
          const t = tierNow(S2);
          const habitCount = (d.forge?.done ? Object.values(d.forge.done).flat().length : 0);
          const score = Math.round(days * 10 + streak * 20 + habitCount * 5);
          list.push({
            name: (d.hallName || 'Guerreiro Anônimo').trim(),
            days,
            streak,
            tier: t.name || 'HOMEM-DE-ARMAS',
            tierIcon: t.icon || '🛡️',
            score,
            purity: d.purity || 100,
          });
        }
      }
    } catch {
      // Falha graciosa mantendo a lista
    }
  }

  // Se não houver perfis suficientes ainda, mescla com guerreiros de honra para manter o leaderboard vibrante
  if (list.length < 5) {
    const existingNames = new Set(list.map((w) => w.name.toLowerCase()));
    for (const h of HONOR_WARRIORS) {
      if (!existingNames.has(h.name.toLowerCase())) {
        list.push(h);
      }
    }
  }

  list.sort((a, b) => b.days - a.days || b.score - a.score);
  return NextResponse.json(list.slice(0, 50));
}
