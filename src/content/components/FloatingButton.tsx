import { useState } from "react";
import { AssistantPanel } from "./AssistantPanel";
import { highlightSearchMatches, searchPage } from "../services/browserActions";
import { getPageContext, getPageSummary } from "../services/pageContext";
import { executeToolAction } from "../services/tools";
import type { ChatMessage, PageContext } from "../types";

const createMessage = (role: "user" | "assistant", content: string): ChatMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  role,
  content,
  timestamp: Date.now(),
});

const buildResponse = (content: string, pageContext: PageContext | null): string => {
  if (!pageContext) {
    return "I’m checking the page structure now.";
  }

  const query = content.toLowerCase();

  if (
    (query.includes("what") && (query.includes("page") || query.includes("site"))) ||
    query.includes("understand this page") ||
    query.includes("understand the page") ||
    query.includes("page summary") ||
    query.includes("summarize this page")
  ) {
    return getPageSummary(pageContext);
  }

  if (query.includes("admissions")) {
    const match = pageContext.links.find(
      (link) =>
        link.text.toLowerCase().includes("admissions") || link.href.toLowerCase().includes("admissions"),
    );

    if (match) {
      return `I found an Admissions link in the visible page content: ${match.text}.`;
    }

    const searchMatches = searchPage("admissions");

    if (searchMatches.length > 0) {
      return `I found a visible Admissions-related element on this page: ${searchMatches[0].text}.`;
    }

    return "I did not find an obvious Admissions element in the visible page content.";
  }

  if (query.includes("find") || query.includes("search") || query.includes("where is") || query.includes("where can i find")) {
    const cleanedQuery = query.replace(/^(find|search|where is|where can i find)\s+/i, "").trim();
    const searchMatches = searchPage(cleanedQuery || query);

    if (searchMatches.length > 0) {
      highlightSearchMatches(searchMatches[0].text);
      return `I found a matching element: “${searchMatches[0].text}”. It appears to be a ${searchMatches[0].type} in the visible page content.`;
    }

    return "I did not find a clear match for that term in the visible content of this page.";
  }

  if (query.includes("scroll") || query.includes("jump to")) {
    const cleanedQuery = query.replace(/^(scroll|jump to)\s+/i, "").trim();
    const result = executeToolAction("scroll_to_element", { query: cleanedQuery || "main" });
    return result.ok ? result.message : "I could not safely scroll to that element.";
  }

  if (query.includes("back")) {
    return executeToolAction("go_back", {}).message;
  }

  if (query.includes("forward") || query.includes("next page")) {
    return executeToolAction("go_forward", {}).message;
  }

  if (query.includes("summarize") || query.includes("summary")) {
    return getPageSummary(pageContext);
  }

  if (pageContext.headings.length > 0) {
    return `I can see these page sections: ${pageContext.headings.slice(0, 5).join(", ")}.`;
  }

  return "I’ve inspected the current page and I’m ready to help with navigation, search, or summaries.";
};

export function FloatingButton() {
  const [open, setOpen] = useState(false);
  const [pageContext, setPageContext] = useState<PageContext | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      "assistant",
      "Hi! I can inspect this page and help you understand what’s visible on the current website.",
    ),
  ]);

  const handleNewMessage = (content: string) => {
    const trimmed = content.trim();

    if (!trimmed) {
      return;
    }

    const nextContext = getPageContext();
    setPageContext(nextContext);

    const userMessage = createMessage("user", trimmed);
    const assistantMessage = createMessage("assistant", buildResponse(trimmed, nextContext));

    setMessages((previous) => [...previous, userMessage, assistantMessage]);
  };

  return (
    <div className="must-ai-container">
      {open && (
        <AssistantPanel
          pageContext={pageContext}
          messages={messages}
          onClose={() => setOpen(false)}
          onNewMessage={handleNewMessage}
        />
      )}

      <button
        type="button"
        className="must-ai-button"
        onClick={() => {
          const nextContext = getPageContext();
          setPageContext(nextContext);
          setOpen((value) => !value);
        }}
        aria-label={open ? "Close MUST AI" : "Open MUST AI"}
      >
        {open ? "×" : "⚡"}
      </button>
    </div>
  );
}
