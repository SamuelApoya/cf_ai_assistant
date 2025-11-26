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
