const SYSTEM_PROMPT = "You are a helpful Cloudflare AI assistant.";

export default {
  async fetch(request, env) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST,OPTIONS"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    const url = new URL(request.url);

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
          { headers: { ...headers, "Content-Type": "application/json" } }
        );

      } catch (err) {
        return new Response(
          JSON.stringify({ error: err.message }),
          { status: 500, headers }
        );
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};
