const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const fs = require('fs');
const rootDir = __dirname;
const notificationsFile = path.join(rootDir, 'notifications.json');

app.use(express.json({ limit: '1mb' }));
const port = Number(process.env.PORT) || 4173;
const shouldOpen = process.argv.includes("--open");

app.use(express.static(rootDir, { extensions: ["html"] }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    ok: true,
    service: 'advanced-finance-tracker',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/notifications', (req, res) => {
  try {
    if (!fs.existsSync(notificationsFile)) {
      fs.writeFileSync(notificationsFile, JSON.stringify([]));
    }
    const raw = fs.readFileSync(notificationsFile, 'utf8');
    const data = JSON.parse(raw || '[]');
    res.json({ ok: true, items: data });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.post('/api/notifications', (req, res) => {
  try {
    const body = req.body;
    if (!body || !body.id) {
      return res.status(400).json({ ok: false, error: 'Invalid payload' });
    }
    let data = [];
    if (fs.existsSync(notificationsFile)) {
      data = JSON.parse(fs.readFileSync(notificationsFile, 'utf8') || '[]');
    }
    data.unshift(body);
    data = data.slice(0, 200);
    fs.writeFileSync(notificationsFile, JSON.stringify(data, null, 2));
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.listen(port, () => {
  const url = `http://localhost:${port}/`;
  console.log(`Serving ${rootDir} at ${url}`);

  if (!shouldOpen) {
    return;
  }

  const opener =
    process.platform === "win32"
      ? ["cmd", ["/c", "start", "", url]]
      : process.platform === "darwin"
        ? ["open", [url]]
        : ["xdg-open", [url]];

  const child = spawn(opener[0], opener[1], {
    detached: true,
    stdio: "ignore",
  });

  child.unref();
});
