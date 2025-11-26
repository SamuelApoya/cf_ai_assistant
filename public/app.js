const chatEl = document.getElementById('chat');
const formEl = document.getElementById('form');
const inputEl = document.getElementById('input');

const API_URL = "https://cloud-help-ai.sapoya26.workers.dev/api/chat";

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
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    });

    const data = await res.json();
    const reply = data.reply || '(no reply)';
    addMessage('assistant', reply);

  } catch (err) {
    console.error(err);
    addMessage('assistant', 'AI connection failed.');
  } finally {
    inputEl.disabled = false;
    inputEl.focus();
  }
});
