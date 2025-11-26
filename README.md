# cf_ai_assistant

Minimal Cloudflare Workers AI chat app for the Cloudflare Software Engineering Internship AI optional assignment.

## What it does

- Serves a tiny web page with a single-input chat box.
- Sends your messages (plus previous conversation history) to a Workers AI LLM.
- Shows the AI's reply in the browser.
- Keeps conversation **memory** in the browser and sends it on each request so the model has context.

This satisfies the assignment requirements:

- **LLM:** Cloudflare Workers AI (`@cf/meta/llama-3-8b-instruct`)
- **Workflow / coordination:** Cloudflare Worker handling the chat API
- **User input:** Chat interface in a simple HTML page
- **Memory / state:** In-browser conversation history passed to the LLM on each request

## Tech

- Cloudflare Workers
- Workers AI
- Plain HTML + JavaScript (no additional frameworks)
- ES module Worker with small helper modules (`constants.js`, `ui.js`)

## Setup

1. Install Wrangler (if you do not already have it):

   ```bash
   npm install -D wrangler
