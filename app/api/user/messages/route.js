import { NextResponse } from 'next/server';
import { inMemoryAdminReplies } from '@/app/api/admin/reply/route';
import { createClient } from '@supabase/supabase-js';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = (searchParams.get('email') || '').toLowerCase().trim();
    const userId = (searchParams.get('userId') || '').trim();

    if (!email && !userId) {
      return NextResponse.json({ messages: [], unreadCount: 0 });
    }

    // 1. Busca mensagens em memória
    let matchedReplies = inMemoryAdminReplies.filter((r) => {
      const matchEmail = email && r.targetEmail && r.targetEmail === email;
      const matchUserId = userId && r.targetUserId && r.targetUserId === userId;
      return matchEmail || matchUserId;
    });

    // 2. Busca também no perfil do Supabase caso exista
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const sb = createClient(supabaseUrl, supabaseKey);
        let query = sb.from('warrior_profiles').select('data');
        if (userId) {
          query = query.eq('user_id', userId);
        } else {
          query = query.eq('email', email);
        }

        const { data: profile } = await query.maybeSingle();
        if (profile && profile.data && Array.isArray(profile.data.commandReplies)) {
          // Mescla sem duplicar por id
          const existingIds = new Set(matchedReplies.map((m) => m.id));
          profile.data.commandReplies.forEach((r) => {
            if (!existingIds.has(r.id)) {
              matchedReplies.push(r);
              existingIds.add(r.id);
            }
          });
        }
      } catch (e) {
        console.warn('Erro ao consultar respostas no Supabase:', e);
      }
    }

    const unreadCount = matchedReplies.filter((m) => !m.read).length;

    return NextResponse.json({
      success: true,
      messages: matchedReplies,
      unreadCount,
    });
  } catch (error) {
    console.error('Erro ao buscar mensagens do guerreiro:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar mensagens.' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { messageId, email, userId } = body;

    if (!messageId) {
      return NextResponse.json({ error: 'ID da mensagem não informado.' }, { status: 400 });
    }

    // Marca como lida em memória
    const found = inMemoryAdminReplies.find((r) => r.id === messageId);
    if (found) {
      found.read = true;
    }

    // Marca no Supabase se possível
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && (email || userId)) {
      try {
        const sb = createClient(supabaseUrl, supabaseKey);
        let query = sb.from('warrior_profiles').select('user_id, data');
        if (userId) query = query.eq('user_id', userId);
        else query = query.eq('email', email.toLowerCase().trim());

        const { data: profile } = await query.maybeSingle();
        if (profile && profile.data && Array.isArray(profile.data.commandReplies)) {
          const item = profile.data.commandReplies.find((r) => r.id === messageId);
          if (item) item.read = true;

          const anyUnread = profile.data.commandReplies.some((r) => !r.read);
          profile.data.hasUnreadCommandReply = anyUnread;

          await sb.from('warrior_profiles').update({
            data: profile.data,
            updated_at: new Date().toISOString(),
          }).eq('user_id', profile.user_id);
        }
      } catch (e) {}
    }

    return NextResponse.json({ success: true, message: 'Mensagem marcada como lida.' });
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao marcar leitura.' }, { status: 500 });
  }
}
