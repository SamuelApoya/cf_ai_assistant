CloudHelpAI

CloudHelpAI is a deployed AI-powered web assistant built using Cloudflare Workers AI and Cloudflare Pages. It provides real-time responses using the LLaMA 3.2 instruction-tuned model and demonstrates how to integrate Cloudflare’s edge AI capabilities into a clean, presentable web application.

The app allows users to send natural language prompts through a browser interface and receive intelligent responses generated directly at the edge using Cloudflare’s AI infrastructure.

What the App Does

CloudHelpAI enables users to:

Type a question or prompt in a web chat interface

Send it to a Cloudflare Worker API endpoint

Have the Worker communicate with the LLaMA 3.2 AI model

Display the AI-generated response instantly in the browser

This project demonstrates real-time AI inference hosted globally at the edge without relying on traditional server infrastructure.

Live Deployment

Frontend (Cloudflare Pages):
https://cloud-help-ai.pages.dev

Backend API (Cloudflare Worker):
https://cf-ai-assistant.sapoya26.workers.dev

GitHub Repository

https://github.com/SamuelApoya/cf_ai_assistant

Tech Stack

Cloudflare Workers AI
Cloudflare Pages
JavaScript
HTML
CSS
GitHub

How to Install Locally

Clone the repository:

git clone https://github.com/SamuelApoya/cf_ai_assistant.git
cd cf_ai_assistant


Install dependencies:

npm install

How to Run Locally

Start the Worker development server:

npx wrangler dev


Then open in your browser:

http://localhost:8787

How to Test the Deployed App

Open the live site in any browser:

https://cloud-help-ai.pages.dev


Type any question into the input field and press Send to receive AI responses.

How Deployment Works

Frontend:

Deployed via Cloudflare Pages

Served globally from Cloudflare’s CDN

Backend:

Deployed as a Cloudflare Worker

Handles AI model inference using Workers AI

The system is fully accessible from any device with internet access.