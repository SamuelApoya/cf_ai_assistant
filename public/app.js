const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("input");

const messages = [];

function appendMessage(role, text) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  div.innerHTML = `<span>${text}</span>`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  messages.push({ role: "user", content: text });
  appendMessage("user", text);

  input.value = "";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  });

  const data = await res.json();
  const reply = data.reply || "(No response)";

  messages.push({ role: "assistant", content: reply });
  appendMessage("ai", reply);
});
