var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/constants.js
var MODEL_NAME = "@cf/meta/llama-3-8b-instruct";
var SYSTEM_PROMPT = `
You are a concise, friendly assistant. You answer clearly in a few sentences.
If relevant, you may relate examples to networking, web performance, or edge computing.
`.trim();

// src/ui.js
var HTML = `<!DOCTYPE html>
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
    // This will be sent to the Worker so the model has context.
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
        const reply = data.reply || '(no reply from AI)';
        messages.push({ role: 'assistant', content: reply });
        addMessage('assistant', reply);
      } catch (err) {
        addMessage('assistant', 'Error talking to AI.');
      } finally {
        inputEl.disabled = false;
        inputEl.focus();
      }
    });
  <\/script>
</body>
</html>`;

// src/index.js
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const { messages = [] } = await request.json();
        const aiResponse = await env.AI.run(MODEL_NAME, {
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages
          ]
        });
        const text = aiResponse?.response || aiResponse?.output || aiResponse?.output_text || JSON.stringify(aiResponse);
        return new Response(JSON.stringify({ reply: text }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ error: "Something went wrong." }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }
    return new Response(HTML, {
      headers: { "Content-Type": "text/html; charset=UTF-8" }
    });
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-iHMFTu/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-iHMFTu/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
