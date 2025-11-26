export const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CloudHelpAI</title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <div class="app">
    <div class="sidebar">
      <div>
        <h1>CloudHelpAI</h1>
        <p>AI assistant powered by Cloudflare Workers & LLMs</p>
      </div>
      <small>Live Edge AI Demo</small>
    </div>

    <div class="main">
      <div class="chat" id="chat"></div>

      <form id="form">
        <input id="input" type="text" placeholder="Ask anything..." required />
        <button type="submit">Send</button>
      </form>
    </div>
  </div>

  <script>
    const chatEl = document.getElementById('chat');
    const formEl = document.getElementById('form');
    const inputEl = document.getElementById('input');

    const messages = [];

    function addMessage(role, content) {
      const div = document.createElement('div');
      div.className = 'message ' + role;
      div.textContent = content;
      chatEl.appendChild(div);
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
          body: JSON.stringify({ messages })
        });

        const data = await res.json();
        const reply = data.reply || data.error || '(no reply)';
        messages.push({ role: 'assistant', content: reply });
        addMessage('assistant', reply);
      } catch {
        addMessage('assistant', 'Error talking to AI.');
      } finally {
        inputEl.disabled = false;
        inputEl.focus();
      }
    });
  </script>
</body>
</html>`;
