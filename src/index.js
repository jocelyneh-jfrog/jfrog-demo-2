const express = require('express');
const _ = require('lodash');
const minimist = require('minimist');
const fetch = require('node-fetch');
const handlebars = require('handlebars');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const ejs = require('ejs');
const marked = require('marked');
const ws = require('ws');

// ═══════════════════════════════════════════════════════════════════════════════
// ⚠️  DEMO: Hardcoded secrets — intentionally embedded for JFrog Secret Detection
//    All values are fake/non-functional, using realistic formats for scan demo
// ═══════════════════════════════════════════════════════════════════════════════
const DB_PASSWORD      = 'P@ssw0rd!DemoSecret123';
const AWS_ACCESS_KEY   = 'AKIAIOSFODNN7EXAMPLE';                    // AWS documented example key
const AWS_SECRET_KEY   = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'; // AWS documented example
const JWT_SECRET       = 'demo$uper$ecretJWTkey_notForProduction';
const STRIPE_KEY       = 'sk_test_DEMO_NOT_REAL_00000000000000000000000';
const GITHUB_TOKEN     = 'ghp_DEMO00000000000000000000000000000000';
const SENDGRID_KEY     = 'SG.DEMO_KEY_NOT_REAL.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── CVE-2019-10744 · lodash 4.17.4 · Prototype Pollution ────────────────────
app.post('/merge', (req, res) => {
  const result = _.merge({}, req.body);
  res.json(result);
});

// ─── CVE-2020-7598 · minimist 1.2.0 · Prototype Pollution ────────────────────
app.get('/parse', (req, res) => {
  const args = minimist(req.query.args ? req.query.args.split(' ') : []);
  res.json(args);
});

// ─── CVE-2022-0235 · node-fetch 2.6.0 · Open Redirect / SSRF ────────────────
app.get('/fetch', async (req, res) => {
  try {
    const response = await fetch(req.query.url);
    res.send(await response.text());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ─── CVE-2019-19919 · handlebars 4.0.11 · RCE via template injection ─────────
app.get('/template', (req, res) => {
  const template = handlebars.compile(req.query.tpl || 'Hello {{name}}');
  res.send(template({ name: req.query.name || 'World' }));
});

// ─── CVE-2018-3721 · jsonwebtoken 8.0.0 · Algorithm confusion (alg:none) ──────
app.post('/login', (req, res) => {
  const token = jwt.sign(
    { user: req.body.username, role: 'admin' },
    JWT_SECRET,   // ⚠️  hardcoded secret
    { expiresIn: '1h' }
  );
  res.json({ token });
});

app.get('/verify', (req, res) => {
  try {
    // ⚠️  no algorithm restriction — vulnerable to alg:none bypass
    const decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    res.json(decoded);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

// ─── CVE-2020-28168 · axios 0.18.0 · SSRF via redirect ───────────────────────
app.get('/proxy', async (req, res) => {
  try {
    const { data } = await axios.get(req.query.url);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── CVE-2017-16114 · marked 0.3.6 · ReDoS ───────────────────────────────────
app.post('/markdown', (req, res) => {
  res.send(marked(req.body.content || ''));
});

// ─── CVE-2022-29078 · ejs 2.6.1 · RCE via template injection ─────────────────
app.get('/render', (req, res) => {
  ejs.renderFile(
    `./views/${req.query.page}.ejs`,
    { user: req.query.user },
    (err, html) => {
      if (err) return res.status(500).send(err.message);
      res.send(html);
    }
  );
});

// ─── CVE-2018-16487 · lodash · Deep clone prototype pollution ────────────────
app.post('/clone', (req, res) => {
  const cloned = _.cloneDeep(req.body);
  res.json(cloned);
});

// ─── CVE-2021-23337 · lodash · Command injection via template ────────────────
app.get('/lodash-template', (req, res) => {
  const compiled = _.template(req.query.tpl || 'Hello <%= name %>');
  res.send(compiled({ name: req.query.name || 'World' }));
});

// ─── CVE-2021-32640 · ws 5.1.1 · ReDoS ──────────────────────────────────────
const wss = new ws.Server({ port: 8080 });
wss.on('connection', (socket) => {
  socket.on('message', (msg) => socket.send(`Echo: ${msg}`));
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`Demo app running on port ${PORT}`);
  console.log(`WebSocket server on port 8080`);
});

module.exports = app;
