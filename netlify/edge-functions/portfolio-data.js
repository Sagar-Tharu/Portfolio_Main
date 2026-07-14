import { getStore } from '@netlify/blobs';

// Edge function to persist and serve portfolio data globally
export default async (request) => {
  const store = getStore('portfolio-data');

  // Basic CORS headers so the frontend can call this from the same origin
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method === 'GET') {
    const data = await store.get('data', { type: 'json' });
    return new Response(JSON.stringify(data ?? null), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }

  if (request.method === 'PUT') {
    const body = await request.json();
    await store.set('data', JSON.stringify(body));

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
};

// Expose this function at /api/portfolio-data
export const config = {
  path: '/api/portfolio-data',
};

