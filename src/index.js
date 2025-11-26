const SYSTEM_PROMPT = "You are a helpful AI assistant.";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      const { messages } = await request.json();

      const aiResponse = await env.AI.run(
        "@cf/meta/llama-3.2-3b-instruct",
        {
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages
          ],
          temperature: 0.6,
          max_tokens: 400
        }
      );

      return new Response(JSON.stringify(aiResponse), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Not Found", { status: 404 });
  }
};
