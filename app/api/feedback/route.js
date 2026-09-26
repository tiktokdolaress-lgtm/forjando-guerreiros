import { NextResponse } from 'next/server';

// Armazenamento em memória para rápida recuperação no servidor / container
let inMemoryFeedbacks = [];

export async function POST(req) {
  try {
    const body = await req.json();
    const { category, message, contact, appVersion, userId } = body;

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'A mensagem de feedback deve conter pelo menos 5 caracteres.' },
        { status: 400 }
      );
    }

    const feedbackRecord = {
      id: 'fb_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      category: category || 'suggestion',
      message: message.trim(),
      contact: contact ? contact.trim() : null,
      appVersion: appVersion || 'v1.4.0',
      userId: userId || null,
      createdAt: new Date().toISOString(),
    };

    inMemoryFeedbacks.unshift(feedbackRecord);
    if (inMemoryFeedbacks.length > 200) {
      inMemoryFeedbacks = inMemoryFeedbacks.slice(0, 200);
    }

    // Registro seguro em console/logs do servidor Cloud Run
    console.log('[CONSELHO DE GUERRA - FEEDBACK RECEBIDO]', JSON.stringify(feedbackRecord));

    // Opcional: Enviar para Webhook (Discord / Slack / Telegram) caso configurado nas variáveis de ambiente
    const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🛡️ **Novo Feedback - Forjando Guerreiros**\n**Tipo:** ${feedbackRecord.category.toUpperCase()}\n**Mensagem:** ${feedbackRecord.message}\n**Contato:** ${feedbackRecord.contact || 'Anônimo'}\n**Versão:** ${feedbackRecord.appVersion}\n**Data:** ${new Date().toLocaleString('pt-BR')}`,
          }),
        }).catch((err) => console.error('Erro ao disparar webhook de feedback:', err));
      } catch (webhookErr) {
        console.error('Falha silenciosa no envio do webhook:', webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      id: feedbackRecord.id,
      createdAt: feedbackRecord.createdAt,
      message: 'Feedback forjado e recebido com sucesso!',
    });
  } catch (error) {
    console.error('Erro na rota de feedback:', error);
    return NextResponse.json(
      { error: 'Falha ao processar o feedback.' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const adminEmail = (
      req.headers.get('x-admin-email') ||
      new URL(req.url).searchParams.get('admin_email') ||
      ''
    ).toLowerCase().trim();

    const ADMIN_EMAILS = ['micheldiemeson@gmail.com', 'diemesonmd@gmail.com'];
    if (!ADMIN_EMAILS.includes(adminEmail)) {
      return NextResponse.json(
        { error: 'Acesso restrito ao Comando da Forja.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      total: inMemoryFeedbacks.length,
      feedbacks: inMemoryFeedbacks,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao listar feedbacks.' },
      { status: 500 }
    );
  }
}
