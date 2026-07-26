import { getStore } from "@netlify/blobs";

export default async () => {
  try {
    const store = getStore("campaign");
    const data = await store.get("progress", { type: "json" });
    const percent = data?.percent ?? 35;
    return new Response(JSON.stringify({ percent }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ percent: 35 }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
