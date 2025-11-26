const SYSTEM_PROMPT = "You are a helpful Cloudflare AI assistant.";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve static assets
    if (request.method === "GET") {
      return env.ASSETS.fetch(request);
    }

    // AI endpoint
    if (url.pathname === "/api/chat") {
      try {
        const { messages } = await request.json();

        const result = await env.AI.run(
          "@cf/meta/llama-3.2-3b-instruct",
          {
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages
            ]
          }
        );

        return new Response(
          JSON.stringify({ reply: result.response }),
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ error: err.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};
