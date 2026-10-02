export type SearchMatch = {
  text: string;
  type: "link" | "button" | "heading" | "text";
  href?: string;
  selector: string;
};

const MAX_MATCHES = 5;

const normalize = (value: string): string => value.replace(/\s+/g, " ").trim().toLowerCase();

const isVisible = (element: Element): boolean => {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  const style = window.getComputedStyle(element);

  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
    return false;
  }

  const rect = element.getBoundingClientRect();

  return rect.width > 0 || rect.height > 0 || (element.textContent ?? "").trim().length > 0;
};

const getText = (element: Element): string => {
  if (element instanceof HTMLInputElement) {
    if (element.type === "password" || element.type === "hidden" || element.type === "file") {
      return "";
    }

    return element.value || element.getAttribute("aria-label") || "";
  }

  return normalize((element.textContent ?? element.getAttribute("aria-label") ?? "").trim());
};

const findCandidates = (): Element[] => {
  const selectors = [
    "a[href]",
    "button",
    "[role='button']",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "li",
    "span",
    "div",
  ];

  return selectors.flatMap((selector) => Array.from(document.querySelectorAll(selector))).filter(isVisible);
};

export const findElement = (query: string): SearchMatch[] => {
  const searchTerm = normalize(query);

  if (!searchTerm) {
    return [];
  }

  const matches: SearchMatch[] = [];

  for (const element of findCandidates()) {
    const text = getText(element);
    const ariaLabel = normalize(element.getAttribute("aria-label") ?? "");
    const href = element instanceof HTMLAnchorElement ? element.href : undefined;
    const label = text || ariaLabel;

    if (!label || !label.includes(searchTerm)) {
      continue;
    }

    const type = element instanceof HTMLAnchorElement
      ? "link"
      : element instanceof HTMLButtonElement || element.getAttribute("role") === "button"
        ? "button"
        : element.tagName.toLowerCase().startsWith("h")
          ? "heading"
          : "text";

    matches.push({
      text: (element.textContent ?? element.getAttribute("aria-label") ?? "").replace(/\s+/g, " ").trim(),
      type,
      href,
      selector: element.tagName.toLowerCase(),
    });

    if (matches.length >= MAX_MATCHES) {
      break;
    }
  }

  return matches;
};

export const searchPage = (query: string): SearchMatch[] => {
  return findElement(query);
};

export const highlightSearchMatches = (query: string): SearchMatch[] => {
  const matches = searchPage(query);

  document.querySelectorAll("[data-must-ai-highlight]").forEach((element) => {
    if (!(element instanceof HTMLElement)) {
      return;
    }

    element.removeAttribute("data-must-ai-highlight");
    element.style.outline = "";
    element.style.boxShadow = "";
  });

  matches.forEach((match) => {
    const candidates = Array.from(document.querySelectorAll(match.selector));

    const target = candidates.find((element) => {
      const text = (element.textContent ?? "").replace(/\s+/g, " ").trim();
      return text === match.text || text.toLowerCase().includes(query.toLowerCase());
    });

    if (target instanceof HTMLElement) {
      target.setAttribute("data-must-ai-highlight", "true");
      target.style.outline = "2px solid rgba(59, 130, 246, 0.95)";
      target.style.boxShadow = "0 0 0 4px rgba(96, 165, 250, 0.25)";
      target.style.transition = "outline 0.2s ease, box-shadow 0.2s ease";
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  return matches;
};
