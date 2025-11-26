# CloudHelpAI
CloudHelpAI is an AI-powered web assistant built using Cloudflare Workers AI and Cloudflare Pages. It provides real-time responses using the LLaMA 3.2 instruction-tuned model and demonstrates how to integrate Cloudflare's edge AI capabilities into a clean, modern web application.

The app allows users to send natural language prompts through a browser interface and receive intelligent responses generated directly at the edge using Cloudflare's AI infrastructure.


## Live Deployment link
https://cloud-help-ai-samuel.sapoya26.workers.dev/


**GitHub Repository:**
https://github.com/SamuelApoya/cf_ai_assistant

---

## What the App Does
CloudHelpAI enables users to:

- Type a question or prompt in a web chat interface
- Send it to a Cloudflare Worker API endpoint
- Have the Worker communicate with the LLaMA 3.2 AI model
- Display the AI-generated response instantly in the browser with formatted code blocks, lists, and styling
- Maintain conversation history for contextual responses
- Display loading animations while processing requests

This project demonstrates real-time AI inference hosted globally at the edge without relying on traditional server infrastructure.


## Tech Stack
- **Cloudflare Workers AI** - Edge AI inference using LLaMA 3.2
- **Cloudflare Pages** - Static site hosting with global CDN
- **JavaScript (ES6+)** - Frontend & backend logic
- **HTML5 & CSS3** - Modern UI design with gradient backgrounds
- **GitHub** - Version control and collaboration


## Features
- Real-time AI responses powered by LLaMA 3.2 (3B parameters)
- Beautiful UI with gradient backgrounds and smooth animations
- Conversation history - Maintains context throughout the chat session
- Responsive design - Works on desktop and mobile devices
- Custom scrollbar - Styled chat interface
- Auto-scroll - Automatically scrolls to latest messages



## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)
- Cloudflare account (free tier works)
- Wrangler CLI (Cloudflare's deployment tool)

### Step 1: Clone the Repository
```bash
git clone https://github.com/SamuelApoya/cf_ai_assistant.git
cd cf_ai_assistant
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Wrangler
Make sure you're logged into Cloudflare:
```bash
npx wrangler login
```

## Local Development

### Run the Worker Locally
```bash
npx wrangler dev
```

This will start the development server at:
```
http://localhost:8787
```

### Test Locally
1. Open your browser to `http://localhost:8787`
2. Type a question in the chat interface
3. Press Send to receive AI responses



## Resources

- Cloudflare Workers AI Documentation: https://developers.cloudflare.com/workers-ai/
- Cloudflare Pages Documentation: https://developers.cloudflare.com/pages/
- Wrangler CLI Documentation: https://developers.cloudflare.com/workers/wrangler/
- LLaMA Model Information: https://ai.meta.com/llama/


Star this repo if you find it helpful!
