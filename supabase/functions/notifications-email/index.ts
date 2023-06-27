import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// console.log('Hello from Functions!!');

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'

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
  // console.log('the email we got...', email);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      // from: 'contact@wenmewn.app',
      from: 'onboarding@resend.dev',
      // to: 'delivered@resend.dev',
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
