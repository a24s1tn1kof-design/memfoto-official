export default {
  async fetch(request) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return new Response('No', { status: 405, headers: cors });
    
    try {
      const body = await request.json();
      const b64 = body.photo.split(',')[1];
      const str = atob(b64);
      const arr = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) arr[i] = str.charCodeAt(i);
      
      const form = new FormData();
      form.append('chat_id', body.ref);
      form.append('photo', new Blob([arr], { type: 'image/jpeg' }), 'meme.jpg');
      form.append('caption', 'Твой друг прошел квест! 🎉');
      
      const token = '9165437482:AAGtRVqX8RBj2NbbuTbl_08grvFBZaN6MH0';
      const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'POST',
        body: form
      });
      
      return new Response(JSON.stringify({ ok: res.ok }), { 
        headers: { ...cors, 'Content-Type': 'application/json' } 
      });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: e.message }), { 
        status: 500, headers: { ...cors, 'Content-Type': 'application/json' } 
      });
    }
  }
};
