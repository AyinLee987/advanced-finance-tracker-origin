"use strict";

export default function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.status(200).end();
    return;
  }

  try {
    if (request.method === "GET") {
      response.status(200).json({ items: [] });
      return;
    }

    if (request.method === "POST") {
      const body = typeof request.body === "string" ? JSON.parse(request.body) : (request.body || {});
      console.log(`[API] POST /api/notifications -`, JSON.stringify(body));
      response.status(201).json({ success: true });
      return;
    }

    response.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(`[API] /api/notifications error:`, err && err.message);
    response.status(500).json({ error: "Internal server error" });
  }
}
