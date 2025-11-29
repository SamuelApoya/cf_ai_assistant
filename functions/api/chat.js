const SYSTEM_PROMPT = `You are CloudHelpAI, a helpful and intelligent AI assistant.

IMPORTANT INFORMATION ABOUT YOUR CREATOR:
- You were created by Samuel Apoya who currently goes to Colby College and a software engineer
- You are powered by Cloudflare Workers AI using the Llama 3.2 model
- You run on Cloudflare's edge network for fast responses worldwide
- Your frontend interface was built with HTML, CSS, and JavaScript
- Your backend uses Cloudflare Workers for serverless AI processing

When someone asks who created you, who built you, or who made you, always mention that you were created by Samuel Apoya.

You are knowledgeable, friendly, and concise in your responses. You provide helpful information while being conversational and easy to understand.`;

export async function onRequest(context) {
  const { request, env } = context;
  
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    const { messages } = await request.json();

    const result = await env.AI.run(
      "@cf/meta/llama-3.2-3b-instruct",
      {
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 2048
      }
    );

    return new Response(
      JSON.stringify({ reply: result.response }),
      { headers: { ...headers, "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }
}