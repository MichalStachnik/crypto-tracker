import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const handler = async (_request: Request): Promise<Response> => {
  const { email, message } = await _request.json();
  if (!email || !message) {
    return new Response(JSON.stringify({ error: 'no email or message' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      // from: 'contact@wenmewn.app',
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'hello world',
      html: `<strong>it works! ${message}</strong>`,
    }),
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

serve(handler);
