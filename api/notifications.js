"use strict";
const fs = require('fs');
const path = require('path');

const notificationsFile = path.join(process.cwd(), 'notifications.json');

function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.status(200).end();
    return;
  }

  try {
    if (request.method === "GET") {
      try {
        if (!fs.existsSync(notificationsFile)) {
          return response.status(200).json({ items: [] });
        }
        const raw = fs.readFileSync(notificationsFile, 'utf8') || '[]';
        const items = JSON.parse(raw);
        return response.status(200).json({ items });
      } catch (e) {
        console.error(`[API] /api/notifications GET error:`, e && e.message);
        return response.status(500).json({ error: 'Failed to read notifications' });
      }
    }

    if (request.method === "POST") {
      try {
        const body = typeof request.body === "string" ? JSON.parse(request.body) : (request.body || {});

        let data = [];
        if (fs.existsSync(notificationsFile)) {
          data = JSON.parse(fs.readFileSync(notificationsFile, 'utf8') || '[]');
        }
        data.unshift(body);
        data = data.slice(0, 200);
        fs.writeFileSync(notificationsFile, JSON.stringify(data, null, 2));
        return response.status(201).json({ success: true });
      } catch (e) {
        console.error(`[API] POST /api/notifications error:`, e && e.message);
        return response.status(500).json({ error: 'Failed to persist notification' });
      }
    }

    response.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(`[API] /api/notifications error:`, err && err.message);
    response.status(500).json({ error: "Internal server error" });
  }
}

module.exports = handler;
module.exports.default = handler;
