import http from 'node:http';

const queues = new Map();
const reply = (res, status, body) => {
  res.writeHead(status, { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
};

http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' });
    return res.end();
  }
  if (req.method === 'GET' && req.url?.startsWith('/signal?')) {
    const client = new URL(req.url, 'http://localhost').searchParams.get('client');
    const messages = queues.get(client) || [];
    queues.set(client, []);
    return reply(res, 200, messages);
  }
  if (req.method === 'POST' && req.url === '/signal') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { to, payload } = JSON.parse(body);
        queues.set(to, [...(queues.get(to) || []), payload]);
        reply(res, 200, { ok: true });
      } catch { reply(res, 400, { ok: false }); }
    });
    return;
  }
  reply(res, 404, { error: 'Not found' });
}).listen(8787, () => console.log('Nirakshak call signalling: http://localhost:8787'));
