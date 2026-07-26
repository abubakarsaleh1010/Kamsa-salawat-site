import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  const { password, percent } = body;

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Wrong password" }), { status: 401 });
  }

  const p = Number(percent);
  if (Number.isNaN(p) || p < 0 || p > 100) {
    return new Response(JSON.stringify({ error: "Percent must be a number between 0 and 100" }), { status: 400 });
  }

  const store = getStore("campaign");
  await store.setJSON("progress", { percent: p, updatedAt: new Date().toISOString() });

  return new Response(JSON.stringify({ ok: true, percent: p }), {
    headers: { "Content-Type": "application/json" }
  });
};
