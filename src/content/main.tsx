import { createRoot } from "react-dom/client";
import stylesText from "./styles.css?raw";
import { FloatingButton } from "./components/FloatingButton";

const mountAssistant = () => {
  const targetRoot = document.body ?? document.documentElement;

  if (!targetRoot) {
    return;
  }

  const existing = document.getElementById("must-ai-root");

  if (existing) {
    return;
  }

  const host = document.createElement("div");
  host.id = "must-ai-root";

  host.style.position = "fixed";
  host.style.left = "20px";
  host.style.bottom = "20px";
  host.style.zIndex = "2147483647";
  host.style.pointerEvents = "none";

  const shadowRoot = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = stylesText;
  shadowRoot.appendChild(style);

  const mountPoint = document.createElement("div");
  shadowRoot.appendChild(mountPoint);

  targetRoot.appendChild(host);
  createRoot(mountPoint).render(<FloatingButton />);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountAssistant, { once: true });
} else {
  mountAssistant();
}