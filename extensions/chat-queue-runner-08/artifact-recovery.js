(() => {
  if (window.__CQR_ARTIFACT_RECOVERY_LOADED__) return;
  window.__CQR_ARTIFACT_RECOVERY_LOADED__ = true;

  const STATE_KEY = "cqr_state";
  const LAST_CONVERSATION_URL_KEY = "cqr_last_conversation_url";
  const CHECK_INTERVAL_MS = 750;
  const RECOVERY_DELAY_MS = 4000;
  const RECOVERY_COOLDOWN_MS = 5000;

  const COMPOSER_SELECTORS = [
    "#prompt-textarea[contenteditable='true']",
    "textarea[name='prompt-textarea']",
    "textarea[data-testid='prompt-textarea']",
    "form[data-chatgpt-composer] [data-composer-markdown][contenteditable='true'][role='textbox']",
    "form[data-chatgpt-composer] .ProseMirror[contenteditable='true']",
    "div[contenteditable='true'][data-lexical-editor='true']",
    "main div[contenteditable='true'][role='textbox']",
    "[contenteditable='true'][role='textbox'][aria-label*='Chat' i]"
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
  let missingComposerSince = null;
  let recoveryLocked = false;
  let lastRecoveryAttemptAt = 0;
  let lastRememberedUrl = "";

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

  function firstVisible(selectors, root = document) {
    for (const selector of selectors) {
      const match = [...root.querySelectorAll(selector)].find(isVisible);
      if (match) return match;
    }
    return null;
  }

  function getComposer() {
    return firstVisible(COMPOSER_SELECTORS);
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

  async function rememberConversationUrl() {
    const url = cleanChatUrl(window.location.href);
    if (!url || url === lastRememberedUrl) return;
    lastRememberedUrl = url;
    await chrome.storage.local.set({ [LAST_CONVERSATION_URL_KEY]: url });
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

  function findArtifactCloseButton() {
    const containers = [...document.querySelectorAll("[role='dialog'], [aria-modal='true']")]
      .filter(isVisible);
    const closePattern = /^(close|close preview|close document|back|tutup|kembali)$/i;

    for (const container of containers) {
      const buttons = [...container.querySelectorAll("button")].filter(isVisible);
      const match = buttons.find((button) => {
        const text = `${button.getAttribute("aria-label") || ""} ${button.getAttribute("title") || ""} ${button.textContent || ""}`
          .replace(/\s+/g, " ")
          .trim();
        return closePattern.test(text);
      });
      if (match) return match;
    }
    return null;
  }

  async function tryCloseArtifactView() {
    dispatchEscape();
    await sleep(300);
    if (getComposer()) return true;

    const closeButton = findArtifactCloseButton();
    if (!closeButton) return false;
    closeButton.click();
    await sleep(600);
    return Boolean(getComposer());
  }

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
      missingComposerSince = null;
      return;
    }

    if (getComposer()) {
      missingComposerSince = null;
      if (state.status === "running") await rememberConversationUrl();
      return;
    }

    const ownQueuedPrompt = state.status === "running" &&
      state.inFlight &&
      state.inFlight.external !== true;

    if (!ownQueuedPrompt || isGenerating() || hasBlockingConfirmation()) {
      missingComposerSince = null;
      return;
    }

    if (!missingComposerSince) {
      missingComposerSince = Date.now();
      return;
    }

    const now = Date.now();
    if (now - missingComposerSince < RECOVERY_DELAY_MS) return;
    if (now - lastRecoveryAttemptAt < RECOVERY_COOLDOWN_MS) return;

    recoveryLocked = true;
    lastRecoveryAttemptAt = now;
    try {
      if (await tryCloseArtifactView()) {
        missingComposerSince = null;
        await rememberConversationUrl();
        return;
      }

      const targetUrl = cleanChatUrl(stored[LAST_CONVERSATION_URL_KEY]);
      const currentUrl = cleanChatUrl(window.location.href);
      if (!targetUrl || !currentUrl || targetUrl === currentUrl) return;

      const target = new URL(targetUrl);
      if (target.origin !== window.location.origin) return;

      // A generated DOCX/artifact can move ChatGPT into a viewer route that has
      // no composer. Return to the exact conversation URL that was active just
      // before the queued prompt, while cqr_state keeps the in-flight progress.
      window.location.assign(targetUrl);
    } finally {
      recoveryLocked = false;
      missingComposerSince = Date.now();
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
