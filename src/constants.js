// Constants for the AI assistant

// Use the latest recommended model (3.1, which is free while in beta). :contentReference[oaicite:0]{index=0}
export const MODEL_NAME = "@cf/meta/llama-3.1-8b-instruct";

export const SYSTEM_PROMPT = `
You are a concise, friendly assistant. You answer clearly in a few sentences.
If relevant, you may relate examples to networking, web performance, or edge computing.
`.trim();
