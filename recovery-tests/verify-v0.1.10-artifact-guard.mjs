import fs from "node:fs";
import path from "node:path";

let failures = 0;
function check(condition, message) {
  if (!condition) {
    failures += 1;
    console.error("FAIL:", message);
  }
}

for (let i = 1; i <= 10; i += 1) {
  const nn = String(i).padStart(2, "0");
  const dir = path.join("extensions", `chat-queue-runner-${nn}`);
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8"));
  const content = fs.readFileSync(path.join(dir, "content.js"), "utf8");
  const recovery = fs.readFileSync(path.join(dir, "artifact-recovery.js"), "utf8");

  check(manifest.version === "0.1.10", `${nn}: manifest version`);
  check(manifest.content_scripts[0].js.includes("artifact-recovery.js"), `${nn}: recovery loaded`);
  check(!content.includes("main div[contenteditable='true'][role='textbox']"), `${nn}: global main contenteditable removed`);
  check(!content.includes("button[aria-label*='Send' i]"), `${nn}: global wildcard Send removed`);
  check(content.includes("getSendButton(composer"), `${nn}: send scoped to composer`);
  check(content.includes("conversationUrl: window.location.href"), `${nn}: conversation URL captured`);
  check(!recovery.includes(".click()"), `${nn}: recovery has no programmatic UI click`);
  check(recovery.includes("event.isTrusted"), `${nn}: synthetic artifact guard`);
  check(recovery.includes("window.location.assign(targetUrl)"), `${nn}: route recovery`);
}

if (failures) process.exit(1);
console.log("PASS: v0.1.10 artifact/composer guard checks");
