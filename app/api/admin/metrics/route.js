import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mergeS, progressDays, tierNow, currentStreak, sosWins } from '@/lib/logic';
import { CURRENT_APP_VERSION } from '@/lib/changelog';
import { inMemoryFeedbacks } from '@/app/api/feedback/route';

const ADMIN_EMAILS = ['micheldiemeson@gmail.com', 'diemesonmd@gmail.com'];

export async function GET(req) {
  try {
    const adminEmail = (
      req.headers.get('x-admin-email') ||
      new URL(req.url).searchParams.get('admin_email') ||
      ''
    ).toLowerCase().trim();

    if (!ADMIN_EMAILS.includes(adminEmail)) {
      return NextResponse.json(
        { error: 'Acesso restrito ao Comando Supremo da Forja.' },
        { status: 403 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txtvusttcbdkcXgsdazm.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let profiles = [];
    let dbStatus = 'disconnected';

    if (supabaseUrl && supabaseKey) {
      try {
        const sb = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await sb
          .from('warrior_profiles')
          .select('user_id, email, subscription_status, updated_at, data')
          .order('updated_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          profiles = data;
          dbStatus = 'connected';
        } else if (error) {
          dbStatus = 'error: ' + error.message;
        }
      } catch (err) {
        dbStatus = 'exception: ' + (err.message || String(err));
      }
    }

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    let totalSosVictories = 0;
    let sumDays = 0;
    let maxStreak = 0;
    let active24h = 0;
    let active7d = 0;

    const subCounts = {
      active: 0,
      trialing: 0,
      inactive: 0,
      local: 0,
      other: 0,
    };

    const tierCounts = {};
    const lifeModeCounts = {
      single: 0,
      committedA: 0,
      committedB: 0,
    };

    const warriorList = profiles.map((row) => {
      const d = row.data || {};
      const S2 = mergeS(d);
      const days = progressDays(S2);
      const streak = currentStreak(S2);
      const tier = tierNow(S2);
      const sosCount = sosWins(S2);
      const subStatus = row.subscription_status || (String(row.user_id).startsWith('local:') ? 'local' : 'inactive');

      totalSosVictories += sosCount;
      sumDays += days;
      if (streak > maxStreak) maxStreak = streak;

      const updatedTime = row.updated_at ? new Date(row.updated_at).getTime() : 0;
      if (updatedTime >= oneDayAgo) active24h++;
      if (updatedTime >= sevenDaysAgo) active7d++;

      if (subCounts[subStatus] !== undefined) {
        subCounts[subStatus]++;
      } else {
        subCounts.other++;
      }

      const tName = tier.name || 'Iniciante';
      tierCounts[tName] = (tierCounts[tName] || 0) + 1;

      const lm = S2.lifeStatus || 'single';
      if (lifeModeCounts[lm] !== undefined) lifeModeCounts[lm]++;

      return {
        id: row.user_id,
        email: row.email || d.email || 'Guerreiro da Forja',
        days,
        streak,
        tierName: tier.name,
        tierIcon: tier.icon,
        tierSlots: tier.slots,
        purity: S2.purity ?? 100,
        sosCount,
        subStatus,
        lifeStatus: lm,
        activeHabitsCount: (S2.forge?.active || []).length,
        tasksCount: (S2.tasks || []).length,
        lastActive: row.updated_at || null,
        createdAt: S2.created || null,
      };
    });

    const totalWarriors = warriorList.length;
    const avgDays = totalWarriors > 0 ? Math.round((sumDays / totalWarriors) * 10) / 10 : 0;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      server: {
        version: CURRENT_APP_VERSION,
        supabaseStatus: dbStatus,
        stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
        stripePrices: {
          brl: Boolean(process.env.STRIPE_PRICE_ID_BRL),
          usd: Boolean(process.env.STRIPE_PRICE_ID_USD),
        },
        webhookConfigured: Boolean(process.env.FEEDBACK_WEBHOOK_URL),
      },
      kpis: {
        totalWarriors,
        active24h,
        active7d,
        avgDays,
        maxStreak,
        totalSosVictories,
        subs: subCounts,
      },
      tierCounts,
      lifeModeCounts,
      warriors: warriorList,
      feedbacks: inMemoryFeedbacks,
    });
  } catch (error) {
    console.error('Erro na API de métricas do Admin:', error);
    return NextResponse.json(
      { error: 'Falha interna ao gerar métricas do Comando.' },
      { status: 500 }
    );
  }
}
