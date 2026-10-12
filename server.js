/*
 * Proxy Server — Am Premium by KaaOffc
 * Implementasi logika AES bypass dari bot WhatsApp ke web
 *
 * Cara pakai:
 *   npm install node-fetch
 *   node server.js
 *
 * Lalu buka http://localhost:3000
 */

const http    = require('http');
const https   = require('https');
const crypto  = require('crypto');
const fs      = require('fs');
const path    = require('path');

// ── Konfigurasi ────────────────────────────────────────────────
const PORT    = process.env.PORT || 3000;
const TARGET  = 'https://alight-motion-premium.site.je';
const UA      = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
                '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Session store (in-memory, reset saat server restart)
const sessions = {};

// ── Helpers AES (sama persis dengan logika bot) ────────────────
function toNumbers(d) {
  const e = [];
  d.replace(/(..)/g, (chunk) => { e.push(parseInt(chunk, 16)); });
  return e;
}

function toHex(d) {
  let e = '';
  for (let i = 0; i < d.length; i++) {
    e += (d[i] < 16 ? '0' : '') + d[i].toString(16);
  }
  return e.toLowerCase();
}

function decryptAES(encryptedHex, keyHex, ivHex) {
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const key       = Buffer.from(keyHex, 'hex');
  const iv        = Buffer.from(ivHex, 'hex');
  const decipher  = crypto.createDecipheriv('aes-128-cbc', key, iv);
  decipher.setAutoPadding(false);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return Array.from(decrypted);
}

// ── Fetch wrapper dengan cookie support ────────────────────────
function fetchURL(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const u       = new URL(url);
    const isHttps = u.protocol === 'https:';
    const lib     = isHttps ? https : http;

    const reqOpts = {
      hostname: u.hostname,
      port    : u.port || (isHttps ? 443 : 80),
      path    : u.pathname + u.search,
      method  : opts.method  || 'GET',
      headers : opts.headers || {},
      timeout : 15000,
    };

    const req = lib.request(reqOpts, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        resolve({ status: res.statusCode, headers: res.headers, text: body });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });

    if (opts.body) req.write(opts.body);
    req.end();
  });
}

// ── Step 1 : ambil cookie AES dari target ─────────────────────
async function getCookie() {
  const res  = await fetchURL(TARGET + '/', {
    headers: { 'User-Agent': UA }
  });
  const html = res.text;

  const aMatch = html.match(/a=toNumbers\("([^"]+)"\)/);
  const bMatch = html.match(/b=toNumbers\("([^"]+)"\)/);
  const cMatch = html.match(/c=toNumbers\("([^"]+)"\)/);

  if (!aMatch || !bMatch || !cMatch) {
    throw new Error('Gagal mengambil AES params dari target');
  }

  const a = toNumbers(aMatch[1]);
  const b = toNumbers(bMatch[1]);
  const c = toNumbers(cMatch[1]);

  const decrypted = decryptAES(
    Buffer.from(c).toString('hex'),
    Buffer.from(a).toString('hex'),
    Buffer.from(b).toString('hex')
  );

  return toHex(decrypted);
}

// ── Step 2 : hit API target dengan cookie ─────────────────────
async function fetchAPI(apiPath, cookie, method = 'GET', body = null) {
  const headers = {
    'User-Agent': UA,
    'Cookie'    : `__test=${cookie}`,
  };
  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetchURL(TARGET + apiPath, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  try {
    return JSON.parse(res.text);
  } catch {
    return res.text;
  }
}

// ── HTTP Server ────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {

  // CORS headers (untuk dev)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204); res.end(); return;
  }

  // ── Static files ──────────────────────────────────────────
  if (req.method === 'GET' && !req.url.startsWith('/api')) {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath.split('?')[0]);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const mime = {
        '.html': 'text/html; charset=utf-8',
        '.js'  : 'application/javascript',
        '.css' : 'text/css',
        '.png' : 'image/png',
        '.jpg' : 'image/jpeg',
        '.ico' : 'image/x-icon',
        '.mp3' : 'audio/mpeg',
        '.mp4' : 'video/mp4',
      }[ext] || 'application/octet-stream';

      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': mime });
      res.end(data);
      return;
    }

    res.writeHead(404); res.end('Not Found'); return;
  }

  // ── API routes ────────────────────────────────────────────
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', async () => {

      let payload = {};
      try { payload = JSON.parse(body); } catch { /* ignore */ }

      const sendJSON = (statusCode, obj) => {
        const json = JSON.stringify(obj);
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(json);
      };

      // ── POST /api/send ──────────────────────────────────
      if (req.url === '/api/send') {
        const { email } = payload;
        if (!email || !email.includes('@')) {
          return sendJSON(400, { ok: false, error: 'Email tidak valid' });
        }

        console.log(`[SEND] ${email}`);
        try {
          const cookie  = await getCookie();
          const apiRes  = await fetchAPI('/index.php?action=send_eceran', cookie, 'POST', { email });

          // simpan session (15 menit)
          sessions[email] = { cookie, timestamp: Date.now() };

          console.log(`[SEND OK] ${email} →`, apiRes);
          sendJSON(200, { ok: true, raw: apiRes });

        } catch (err) {
          console.error('[SEND ERR]', err.message);
          sendJSON(500, { ok: false, error: err.message });
        }
        return;
      }

      // ── POST /api/verify ────────────────────────────────
      if (req.url === '/api/verify') {
        const { email, link } = payload;
        if (!email || !link) {
          return sendJSON(400, { ok: false, error: 'Email dan link diperlukan' });
        }

        console.log(`[VERIFY] ${email}`);

        // Ambil cookie dari session atau buat baru
        let cookie;
        const sess = sessions[email];
        if (sess && Date.now() - sess.timestamp < 15 * 60 * 1000) {
          cookie = sess.cookie;
        } else {
          // session expired atau tidak ada → buat cookie baru
          try {
            cookie = await getCookie();
          } catch (err) {
            return sendJSON(500, { ok: false, error: 'Gagal mendapatkan cookie: ' + err.message });
          }
        }

        try {
          const apiRes = await fetchAPI('/index.php?action=verify_eceran', cookie, 'POST', {
            email,
            link,
          });

          // hapus session setelah verify
          delete sessions[email];

          console.log(`[VERIFY OK] ${email} →`, apiRes);
          sendJSON(200, { ok: true, raw: apiRes });

        } catch (err) {
          console.error('[VERIFY ERR]', err.message);
          sendJSON(500, { ok: false, error: err.message });
        }
        return;
      }

      sendJSON(404, { ok: false, error: 'Route tidak ditemukan' });
    });
    return;
  }

  res.writeHead(404); res.end('Not Found');
});

server.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║   Am Premium Proxy — by KaaOffc      ║');
  console.log(`║   http://localhost:${PORT}               ║`);
  console.log('╚══════════════════════════════════════╝');
  console.log('');
  console.log('  Buka browser → http://localhost:' + PORT);
  console.log('  Tekan Ctrl+C untuk berhenti\n');
});
