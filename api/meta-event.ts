// Vercel Serverless Function — Meta Conversions API (CAPI)
// Esta função recebe dados do formulário e envia eventos server-side para o Meta

export const config = {
  runtime: 'edge',
};

const META_PIXEL_ID = '1472969447740954';
const CAPI_URL = `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events`;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!accessToken) {
    console.error('META_ACCESS_TOKEN não configurado nas variáveis de ambiente da Vercel');
    return new Response(JSON.stringify({ error: 'Configuração incompleta' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { eventName, email, phone, name, sourceUrl, testCode, eventId } = body;

    // Hash dos dados pessoais (exigido pela Meta para privacidade)
    const hashData = async (value: string): Promise<string> => {
      const normalized = value.trim().toLowerCase();
      const encoded = new TextEncoder().encode(normalized);
      const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    };

    const userData: Record<string, string> = {};
    if (email) userData['em'] = await hashData(email);
    if (phone) userData['ph'] = await hashData(phone.replace(/\D/g, ''));
    if (name) {
      const parts = name.trim().split(' ');
      userData['fn'] = await hashData(parts[0]);
      if (parts.length > 1) userData['ln'] = await hashData(parts[parts.length - 1]);
    }

    const eventPayload = {
      data: [
        {
          event_name: eventName || 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: sourceUrl || 'https://gratuito-31.institutodespertamente.site',
          user_data: userData,
          event_id: eventId,
        },
      ],
      ...(testCode ? { test_event_code: testCode } : {}),
    };

    const metaResponse = await fetch(
      `${CAPI_URL}?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload),
      }
    );

    const metaResult = await metaResponse.json();

    if (!metaResponse.ok) {
      console.error('Erro ao enviar evento para Meta CAPI:', metaResult);
      return new Response(JSON.stringify({ error: 'Erro ao enviar para Meta', details: metaResult }), {
        status: metaResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, result: metaResult }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro na função CAPI:', error);
    return new Response(JSON.stringify({ error: 'Erro interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
