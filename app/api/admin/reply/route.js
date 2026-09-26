import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { inMemoryFeedbacks } from '@/app/api/feedback/route';

// Armazenamento em memória das respostas do Administrador para rápido retorno
export let inMemoryAdminReplies = [];

const ADMIN_EMAILS = ['micheldiemeson@gmail.com', 'diemesonmd@gmail.com'];

export async function POST(req) {
  try {
    const body = await req.json();
    const { feedbackId, targetEmail, targetUserId, originalMessage, replyText, adminEmail } = body;

    const callerEmail = (adminEmail || req.headers.get('x-admin-email') || '').toLowerCase().trim();

    if (!ADMIN_EMAILS.includes(callerEmail)) {
      return NextResponse.json(
        { error: 'Acesso restrito ao Comando Supremo da Forja.' },
        { status: 403 }
      );
    }

    if (!replyText || typeof replyText !== 'string' || replyText.trim().length < 2) {
      return NextResponse.json(
        { error: 'A resposta deve conter pelo menos 2 caracteres.' },
        { status: 400 }
      );
    }

    const replyRecord = {
      id: 'rep_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      feedbackId: feedbackId || null,
      targetEmail: targetEmail ? targetEmail.toLowerCase().trim() : null,
      targetUserId: targetUserId || null,
      originalMessage: originalMessage ? originalMessage.trim() : '',
      replyText: replyText.trim(),
      author: 'Comando Supremo da Forja',
      createdAt: new Date().toISOString(),
      read: false,
    };

    // 1. Atualiza no array em memória das respostas
    inMemoryAdminReplies.unshift(replyRecord);
    if (inMemoryAdminReplies.length > 300) {
      inMemoryAdminReplies = inMemoryAdminReplies.slice(0, 300);
    }

    // 2. Atualiza o feedback original em memória para constar como respondido
    if (feedbackId) {
      const fb = inMemoryFeedbacks.find((f) => f.id === feedbackId);
      if (fb) {
        fb.reply = {
          id: replyRecord.id,
          text: replyRecord.replyText,
          createdAt: replyRecord.createdAt,
          author: replyRecord.author,
        };
      }
    }

    // 3. Tenta salvar diretamente no perfil do usuário no Supabase se houver conexão
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && (replyRecord.targetEmail || replyRecord.targetUserId)) {
      try {
        const sb = createClient(supabaseUrl, supabaseKey);

        let query = sb.from('warrior_profiles').select('user_id, email, data');
        if (replyRecord.targetUserId) {
          query = query.eq('user_id', replyRecord.targetUserId);
        } else {
          query = query.eq('email', replyRecord.targetEmail);
        }

        const { data: profiles, error } = await query.maybeSingle();

        if (!error && profiles && profiles.data) {
          const profileData = profiles.data;
          profileData.commandReplies = profileData.commandReplies || [];
          profileData.commandReplies.unshift(replyRecord);
          profileData.hasUnreadCommandReply = true;

          await sb
            .from('warrior_profiles')
            .update({
              data: profileData,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', profiles.user_id);
        }
      } catch (dbErr) {
        console.warn('Aviso: Falha ao persistir resposta no perfil Supabase:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      reply: replyRecord,
      message: 'Resposta decretada e enviada com honra ao guerreiro!',
    });
  } catch (error) {
    console.error('Erro ao enviar resposta do admin:', error);
    return NextResponse.json(
      { error: 'Falha ao decretar resposta no servidor.' },
      { status: 500 }
    );
  }
}
