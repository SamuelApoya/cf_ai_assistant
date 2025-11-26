// Minimal HTML UI for the assistant as a template string

export const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>cf_ai_assistant</title>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 1rem; max-width: 600px; }
    h1 { font-size: 1.3rem; margin-bottom: 0.25rem; }
    p { font-size: 0.9rem; color: #444; }
    #chat { border: 1px solid #ddd; border-radius: 4px; padding: 0.5rem; height: 60vh; overflow-y: auto; margin: 0.5rem 0; font-size: 0.9rem; }
    .msg-user { text-align: right; margin: 0.25rem 0; }
    .msg-ai { text-align: left; margin: 0.25rem 0; }
    .msg-user span, .msg-ai span { display: inline-block; padding: 0.3rem 0.5rem; border-radius: 4px; }
    .msg-user span { background: #e0f2ff; }
    .msg-ai span { background: #f5f5f5; }
    form { display: flex; gap: 0.5rem; }
    input[type="text"] { flex: 1; padding: 0.4rem; font-size: 0.9rem; }
    button { padding: 0.4rem 0.7rem; font-size: 0.9rem; cursor: pointer; }
    small { color: #666; font-size: 0.8rem; }
  </style>
</head>
<body>
  <h1>cf_ai_assistant</h1>
  <p><small>Minimal Cloudflare Workers AI chat with in-browser memory.</small></p>
  <div id="chat"></div>
  <form id="form">
    <input id="input" type="text" placeholder="Ask something..." required />
    <button type="submit">Send</button>
  </form>

  <script>
    const chatEl = document.getElementById('chat');
    const formEl = document.getElementById('form');
    const inputEl = document.getElementById('input');

    // Simple session "memory" stored in the browser.
    const messages = [];

    function addMessage(role, content) {
      const wrapper = document.createElement('div');
      wrapper.className = role === 'user' ? 'msg-user' : 'msg-ai';

      const bubble = document.createElement('span');
      bubble.textContent = content;

      wrapper.appendChild(bubble);
      chatEl.appendChild(wrapper);
      chatEl.scrollTop = chatEl.scrollHeight;
    }

    formEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = inputEl.value.trim();
      if (!text) return;

      messages.push({ role: 'user', content: text });
      addMessage('user', text);
      inputEl.value = '';
      inputEl.disabled = true;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
        });

        const data = await res.json();
        const reply = data.reply || data.error || '(no reply from AI)';
        messages.push({ role: 'assistant', content: reply });
        addMessage('assistant', reply);
      } catch (err) {
        addMessage('assistant', 'Error talking to AI.');
      } finally {
        inputEl.disabled = false;
        inputEl.focus();
      }
    });
  </script>
</body>
</html>`;
