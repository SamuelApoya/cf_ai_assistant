const SYSTEM_PROMPT = "You are a helpful Cloudflare AI assistant.";

export default {
  async fetch(request, env) {

    if (request.method === "GET") {
      return env.ASSETS.fetch(request);
    }

    if (request.url.endsWith("/api/chat")) {
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
    }

    return new Response("Not Found", { status: 404 });
  }
};
