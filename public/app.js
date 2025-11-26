const chatEl = document.getElementById('chat');
const formEl = document.getElementById('form');
const inputEl = document.getElementById('input');

const API_URL = "https://cloud-help-ai.sapoya26.workers.dev/api/chat";

const messages = [];

function formatMessage(content) {
  // Split by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);
  
  return parts.map(part => {
    if (part.startsWith('```') && part.endsWith('```')) {
      // Extract language and code
      const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
      if (match) {
        const lang = match[1] || '';
        const code = match[2];
        return `<pre><code>${escapeHtml(code)}</code></pre>`;
      }
      return part;
    }
    
    // Format inline code
    part = part.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Format bold
    part = part.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Format headers
    part = part.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    
    // Format numbered lists
    part = part.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
    if (part.includes('<li>')) {
      part = part.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
    }
    
    // Format bullet points
    part = part.replace(/^[•\-*]\s+(.+)$/gm, '<li>$1</li>');
    if (part.includes('<li>') && !part.includes('<ol>')) {
      part = part.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    }
    
    return part;
  }).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function addMessage(role, content) {
  const div = document.createElement('div');
  div.className = 'message ' + role;
  
  if (role === 'assistant') {
    div.innerHTML = formatMessage(content);
  } else {
    div.textContent = content;
  }
  
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function showLoading() {
  const div = document.createElement('div');
  div.className = 'message loading';
  div.id = 'loading-message';
  div.innerHTML = '<div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div>';
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function removeLoading() {
  const loading = document.getElementById('loading-message');
  if (loading) loading.remove();
}

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();

  const text = inputEl.value.trim();
  if (!text) return;

  messages.push({ role: 'user', content: text });
  addMessage('user', text);
  inputEl.value = '';
  inputEl.disabled = true;
  
  showLoading();

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
    
    removeLoading();
    messages.push({ role: 'assistant', content: reply });
    addMessage('assistant', reply);

  } catch (err) {
    console.error(err);
    removeLoading();
    addMessage('assistant', 'AI connection failed. Please try again.');
  } finally {
    inputEl.disabled = false;
    inputEl.focus();
  }
});

// Welcome message
addMessage('assistant', 'Hello! I\'m CloudHelpAI, Ask me anything!');