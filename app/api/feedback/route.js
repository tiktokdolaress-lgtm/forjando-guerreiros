import { NextResponse } from 'next/server';

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

    // Registro seguro em console/logs do servidor
    console.log('[CONSELHO DE GUERRA - FEEDBACK RECEBIDO]', JSON.stringify(feedbackRecord));

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
