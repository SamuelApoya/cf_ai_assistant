import { describe, expect, it, vi } from "vitest";
import worker from "../src/worker.js";

describe("CloudHelpAI worker", () => {
  it("handles CORS preflight requests", async () => {
    const request = new Request("https://example.com/api/chat", {
      method: "OPTIONS",
    });

    const env = {
      AI: {
        run: vi.fn(),
      },
      ASSETS: {
        fetch: vi.fn(),
      },
    };

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(200);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "POST,OPTIONS"
    );
    expect(env.AI.run).not.toHaveBeenCalled();
  });

  it("returns an AI reply for a chat request", async () => {
    const request = new Request("https://example.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello" }],
      }),
    });

    const env = {
      AI: {
        run: vi.fn().mockResolvedValue({
          response: "Hello! How can I help?",
        }),
      },
      ASSETS: {
        fetch: vi.fn(),
      },
    };

    const response = await worker.fetch(request, env);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      reply: "Hello! How can I help?",
    });

    expect(env.AI.run).toHaveBeenCalledWith(
      "@cf/meta/llama-3.2-3b-instruct",
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: "system",
          }),
          {
            role: "user",
            content: "Hello",
          },
        ]),
        max_tokens: 2048,
      })
    );
  });

  it("returns 500 when the AI request fails", async () => {
    const request = new Request("https://example.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello" }],
      }),
    });

    const env = {
      AI: {
        run: vi.fn().mockRejectedValue(new Error("AI service unavailable")),
      },
      ASSETS: {
        fetch: vi.fn(),
      },
    };

    const response = await worker.fetch(request, env);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      error: "AI service unavailable",
    });
  });

  it("forwards non-API requests to static assets", async () => {
    const assetResponse = new Response("<h1>Home page</h1>", {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    });

    const request = new Request("https://example.com/");

    const env = {
      AI: {
        run: vi.fn(),
      },
      ASSETS: {
        fetch: vi.fn().mockResolvedValue(assetResponse),
      },
    };

    const response = await worker.fetch(request, env);

    expect(env.ASSETS.fetch).toHaveBeenCalledWith(request);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("Home page");
  });
});