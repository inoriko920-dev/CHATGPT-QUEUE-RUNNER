(() => {
  if (window.__CQR_ARTIFACT_RECOVERY_LOADED__) return;
  window.__CQR_ARTIFACT_RECOVERY_LOADED__ = true;

  const STATE_KEY = "cqr_state";
  const LAST_CONVERSATION_URL_KEY = "cqr_last_conversation_url";
  const CHECK_INTERVAL_MS = 600;
  const RECOVERY_DELAY_MS = 1800;
  const RECOVERY_COOLDOWN_MS = 5000;

  const COMPOSER_SELECTORS = [
    "#prompt-textarea[contenteditable='true']",
    "textarea[name='prompt-textarea']",
    "textarea[data-testid='prompt-textarea']",
    "form[data-chatgpt-composer] [data-composer-markdown][contenteditable='true'][role='textbox']",
    "form[data-chatgpt-composer] .ProseMirror[contenteditable='true']",
    "form[data-chatgpt-composer] div[contenteditable='true'][data-lexical-editor='true']",
    "form[data-chatgpt-composer] [contenteditable='true'][role='textbox'][aria-label*='Chat' i]"
  ];

  const STOP_SELECTORS = [
    "button[data-testid='stop-button']",
    "form[data-chatgpt-composer] button[type='button'][aria-label='Stop']",
    "button[aria-label*='Stop streaming' i]",
    "button[aria-label*='Stop generating' i]",
    "button[aria-label*='Hentikan' i]"
  ];

  const BLOCKING_CONFIRMATION_SELECTORS = [
    "button[data-testid*='confirm' i]",
    "button[data-testid*='approve' i]",
    "button[aria-label*='Confirm' i]",
    "button[aria-label*='Allow' i]",
    "button[aria-label*='Approve' i]",
    "button[aria-label*='Konfirmasi' i]",
    "button[aria-label*='Izinkan' i]",
    "button[aria-label*='Setujui' i]"
  ];

  let localTabId = null;
  let recoverySince = null;
  let recoveryLocked = false;
  let lastRecoveryAttemptAt = 0;
  let lastRememberedUrl = "";
  let activeOwnQueuedPrompt = false;

  function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  function isVisible(element) {
    if (!element) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" &&
      style.visibility !== "hidden" &&
      rect.width > 0 &&
      rect.height > 0;
  }

  function isUsableComposer(element) {
    if (!isVisible(element)) return false;
    if (element.closest("[role='dialog'], [aria-modal='true']")) return false;

    const rect = element.getBoundingClientRect();
    const x = Math.min(window.innerWidth - 1, Math.max(0, rect.left + rect.width / 2));
    const y = Math.min(window.innerHeight - 1, Math.max(0, rect.top + rect.height / 2));
    const top = document.elementFromPoint(x, y);
    if (!top) return true;

    const form = element.closest("form");
    return element === top || element.contains(top) || (form && form.contains(top));
  }

  function firstVisible(selectors, root = document) {
    for (const selector of selectors) {
      const match = [...root.querySelectorAll(selector)].find(isVisible);
      if (match) return match;
    }
    return null;
  }

  function getComposer() {
    for (const selector of COMPOSER_SELECTORS) {
      const match = [...document.querySelectorAll(selector)].find(isUsableComposer);
      if (match) return match;
    }
    return null;
  }

  function isGenerating() {
    if (firstVisible(STOP_SELECTORS)) return true;
    return Boolean(firstVisible([
      "section[data-turn='assistant'][aria-busy='true']",
      "[data-message-author-role='assistant'][aria-busy='true']",
      "[data-turn='assistant'] [aria-busy='true']"
    ]));
  }

  function hasBlockingConfirmation() {
    return Boolean(firstVisible(BLOCKING_CONFIRMATION_SELECTORS));
  }

  function cleanChatUrl(rawUrl) {
    try {
      const url = new URL(rawUrl, window.location.href);
      if (!/^(chatgpt\.com|chat\.openai\.com)$/i.test(url.hostname)) return "";
      url.searchParams.delete("cqr_runner");
      url.searchParams.delete("cqr_port");
      return url.toString();
    } catch (_error) {
      return "";
    }
  }

  function looksLikeConversationUrl(rawUrl) {
    try {
      const url = new URL(rawUrl, window.location.href);
      return url.pathname === "/" || /\/c\/[^/]+/.test(url.pathname);
    } catch (_error) {
      return false;
    }
  }

  async function rememberConversationUrl() {
    const url = cleanChatUrl(window.location.href);
    if (!url || !looksLikeConversationUrl(url) || url === lastRememberedUrl) return;
    lastRememberedUrl = url;
    await chrome.storage.local.set({ [LAST_CONVERSATION_URL_KEY]: url });
  }

  function getTargetConversationUrl(state, stored) {
    const inFlightUrl = cleanChatUrl(state?.inFlight?.conversationUrl || "");
    if (inFlightUrl && looksLikeConversationUrl(inFlightUrl)) return inFlightUrl;

    const storedUrl = cleanChatUrl(stored[LAST_CONVERSATION_URL_KEY] || "");
    return storedUrl && looksLikeConversationUrl(storedUrl) ? storedUrl : "";
  }

  function dispatchEscape() {
    const options = {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      which: 27,
      bubbles: true,
      cancelable: true
    };
    document.activeElement?.dispatchEvent(new KeyboardEvent("keydown", options));
    document.dispatchEvent(new KeyboardEvent("keydown", options));
    window.dispatchEvent(new KeyboardEvent("keydown", options));
    document.activeElement?.dispatchEvent(new KeyboardEvent("keyup", options));
    document.dispatchEvent(new KeyboardEvent("keyup", options));
    window.dispatchEvent(new KeyboardEvent("keyup", options));
  }

  function artifactSurfaceVisible() {
    const direct = firstVisible([
      "[data-testid*='artifact' i]",
      "[data-testid*='canvas' i]",
      "[aria-label*='artifact' i]",
      "[aria-label*='document preview' i]",
      "[aria-label*='preview document' i]"
    ]);
    if (direct) return true;

    const dialogs = [...document.querySelectorAll("[role='dialog'], [aria-modal='true']")].filter(isVisible);
    return dialogs.some((dialog) => {
      const text = `${dialog.getAttribute("aria-label") || ""} ${dialog.getAttribute("title") || ""} ${dialog.textContent || ""}`
        .replace(/\s+/g, " ")
        .slice(0, 3000);
      return /(\.docx\b|artifact|document preview|preview document|dokumen|canvas)/i.test(text);
    });
  }

  function syntheticArtifactTarget(target) {
    if (!(target instanceof Element)) return null;
    const control = target.closest("a, button, [role='button']");
    if (!control) return null;
    if (control.closest("form[data-chatgpt-composer]")) return null;

    const text = `${control.getAttribute("href") || ""} ${control.getAttribute("aria-label") || ""} ${control.getAttribute("title") || ""} ${control.textContent || ""}`
      .replace(/\s+/g, " ")
      .trim();

    return /(\.docx\b|open document|preview document|open artifact|dokumen.*buka|buka.*dokumen)/i.test(text)
      ? control
      : null;
  }

  document.addEventListener("click", (event) => {
    if (!activeOwnQueuedPrompt || event.isTrusted) return;
    if (!syntheticArtifactTarget(event.target)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  async function tick() {
    if (recoveryLocked || localTabId === null) return;

    let stored;
    try {
      stored = await chrome.storage.local.get([STATE_KEY, LAST_CONVERSATION_URL_KEY]);
    } catch (_error) {
      return;
    }

    const state = stored[STATE_KEY];
    if (!state || state.ownerTabId !== localTabId) {
      activeOwnQueuedPrompt = false;
      recoverySince = null;
      return;
    }

    const ownQueuedPrompt = state.status === "running" &&
      state.inFlight &&
      state.inFlight.external !== true;
    activeOwnQueuedPrompt = Boolean(ownQueuedPrompt);

    if (!ownQueuedPrompt) {
      recoverySince = null;
      if (state.status === "running" && getComposer()) await rememberConversationUrl();
      return;
    }

    const targetUrl = getTargetConversationUrl(state, stored);
    const currentUrl = cleanChatUrl(window.location.href);
    const routeMovedAway = Boolean(targetUrl && currentUrl && targetUrl !== currentUrl);
    const artifactOpen = artifactSurfaceVisible();
    const composer = getComposer();

    if (!routeMovedAway && !artifactOpen && composer) {
      recoverySince = null;
      await rememberConversationUrl();
      return;
    }

    if (isGenerating() || hasBlockingConfirmation()) {
      recoverySince = null;
      return;
    }

    if (!recoverySince) {
      recoverySince = Date.now();
      return;
    }

    const now = Date.now();
    if (now - recoverySince < RECOVERY_DELAY_MS) return;
    if (now - lastRecoveryAttemptAt < RECOVERY_COOLDOWN_MS) return;

    recoveryLocked = true;
    lastRecoveryAttemptAt = now;
    try {
      if (artifactOpen) {
        dispatchEscape();
        await sleep(350);
        if (getComposer() && !artifactSurfaceVisible()) {
          recoverySince = null;
          await rememberConversationUrl();
          return;
        }
      }

      if (routeMovedAway && targetUrl) {
        window.location.assign(targetUrl);
        return;
      }

      if (!getComposer() && targetUrl && cleanChatUrl(window.location.href) === targetUrl) {
        window.location.reload();
      }
    } finally {
      recoveryLocked = false;
      recoverySince = Date.now();
    }
  }

  chrome.runtime.sendMessage({ type: "CQR_GET_TAB_ID" })
    .then((response) => {
      localTabId = response?.tabId ?? null;
      void tick();
    })
    .catch(() => {});

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes[STATE_KEY]) void tick();
  });

  setInterval(() => void tick(), CHECK_INTERVAL_MS);
})();