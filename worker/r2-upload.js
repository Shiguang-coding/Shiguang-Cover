export default {
  async fetch(request, env) {
    const CORS = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (request.method === 'GET') {
      return new Response(JSON.stringify({ message: 'R2 Upload Worker is running' }), {
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ message: 'Method not allowed' }), {
        status: 405, headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    const auth = request.headers.get('Authorization');
    if (auth !== `Bearer ${env.AUTH_TOKEN}`) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401, headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    try {
      const formData = await request.formData();
      const file = formData.get('file');
      if (!file) {
        return new Response(JSON.stringify({ message: 'No file provided' }), {
          status: 400, headers: { 'Content-Type': 'application/json', ...CORS },
        });
      }

      const key = `uploads/${Date.now()}_${file.name || 'image'}`;
      const bucket = env.R2_BUCKET;

      await bucket.put(key, file.stream(), {
        httpMetadata: { contentType: file.type || 'application/octet-stream' },
      });

      const publicUrl = env.CUSTOM_DOMAIN
        ? `${env.CUSTOM_DOMAIN.replace(/\/+$/, '')}/${key}`
        : '';

      return new Response(JSON.stringify({ url: publicUrl, key }), {
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    } catch (err) {
      return new Response(JSON.stringify({ message: err.message || 'Upload failed' }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }
  },
};
