const SYSTEM_PROMPT = "You are a helpful, intelligent Cloudflare AI assistant.";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/api/chat" || request.method !== "POST") {
      return new Response("Not found", { status: 404 });
    }

    const { messages } = await request.json();

    try {
      const aiResponse = await env.AI.run(
        "@cf/meta/llama-3.2-3b-instruct",
        {
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages
          ],
          temperature: 0.5,
          max_tokens: 500
        }
      );

      return new Response(JSON.stringify(aiResponse), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
