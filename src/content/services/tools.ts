export type ToolActionName =
  | "read_page"
  | "search_page"
  | "find_element"
  | "scroll_to_element"
  | "open_link"
  | "go_back"
  | "go_forward";

export type ToolActionResult = {
  ok: boolean;
  action: ToolActionName;
  message: string;
  data?: Record<string, unknown>;
};

export type ToolDefinition = {
  name: ToolActionName;
  description: string;
  parameters: Record<string, { type: string; description: string; required?: boolean }>;
};

export const SAFE_BROWSER_TOOLS: ToolDefinition[] = [
  {
    name: "read_page",
    description: "Read the current page metadata and visible text in a limited, safe format.",
    parameters: {
      includeHeadings: { type: "boolean", description: "Whether to include visible headings in the result." },
    },
  },
  {
    name: "search_page",
    description: "Search the visible page content for relevant matching text.",
    parameters: {
      query: { type: "string", description: "Text to search for in the current page." },
    },
  },
  {
    name: "find_element",
    description: "Locate a visible page element based on a text query.",
    parameters: {
      query: { type: "string", description: "Text used to find the target element." },
    },
  },
  {
    name: "scroll_to_element",
    description: "Scroll the page to a matching visible element.",
    parameters: {
      query: { type: "string", description: "Text used to locate the element to scroll into view." },
    },
  },
  {
    name: "open_link",
    description: "Open a visible link from the current page if it is safe and explicit.",
    parameters: {
      href: { type: "string", description: "The destination URL to open." },
    },
  },
  {
    name: "go_back",
    description: "Move back to the previous browser history entry if available.",
    parameters: {},
  },
  {
    name: "go_forward",
    description: "Move forward to the next browser history entry if available.",
    parameters: {},
  },
];

const safeUrlCheck = (value: string): boolean => {
  try {
    const parsed = new URL(value, window.location.href);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export const executeToolAction = (action: ToolActionName, params: Record<string, unknown>): ToolActionResult => {
  switch (action) {
    case "read_page": {
      const page = document.title || "Untitled page";
      return {
        ok: true,
        action,
        message: `This page is currently: ${page}`,
        data: {
          url: window.location.href,
          title: page,
        },
      };
    }

    case "search_page": {
      const query = String(params.query ?? "").trim();
      if (!query) {
        return { ok: false, action, message: "A non-empty search query is required." };
      }

      const matches = Array.from(document.querySelectorAll("a, button, h1, h2, h3, p, li, span"))
        .map((element) => ({
          text: (element.textContent ?? "").replace(/\s+/g, " ").trim(),
          element,
        }))
        .filter(({ text }) => text.toLowerCase().includes(query.toLowerCase()));

      return {
        ok: matches.length > 0,
        action,
        message: matches.length > 0 ? `I found ${matches.length} matching result(s).` : "No visible matches were found.",
        data: { matches: matches.slice(0, 5).map(({ text }) => text) },
      };
    }

    case "find_element": {
      const query = String(params.query ?? "").trim();
      if (!query) {
        return { ok: false, action, message: "A query is required to find an element." };
      }

      const match = Array.from(document.querySelectorAll("a, button, h1, h2, h3, p, li, span"))
        .find((element) => (element.textContent ?? "").toLowerCase().includes(query.toLowerCase()));

      if (!match) {
        return { ok: false, action, message: "No matching visible element was found." };
      }

      return {
        ok: true,
        action,
        message: `I found a matching element: ${(match.textContent ?? "").replace(/\s+/g, " ").trim()}.`,
        data: { selector: match.tagName.toLowerCase(), text: (match.textContent ?? "").replace(/\s+/g, " ").trim() },
      };
    }

    case "scroll_to_element": {
      const query = String(params.query ?? "").trim();
      if (!query) {
        return { ok: false, action, message: "A query is required to scroll to an element." };
      }

      const match = Array.from(document.querySelectorAll("a, button, h1, h2, h3, p, li, span"))
        .find((element) => (element.textContent ?? "").toLowerCase().includes(query.toLowerCase()));

      if (!match) {
        return { ok: false, action, message: "No matching element is available to scroll to." };
      }

      if (match instanceof HTMLElement) {
        match.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      return {
        ok: true,
        action,
        message: `I scrolled to a matching element: ${(match.textContent ?? "").replace(/\s+/g, " ").trim()}.`,
      };
    }

    case "open_link": {
      const href = String(params.href ?? "").trim();
      if (!href || !safeUrlCheck(href)) {
        return { ok: false, action, message: "Only safe http(s) links may be opened." };
      }

      window.location.href = href;
      return {
        ok: true,
        action,
        message: `Opening ${href}.`,
        data: { href },
      };
    }

    case "go_back": {
      if (window.history.length > 1) {
        window.history.back();
        return { ok: true, action, message: "Going back to the previous page." };
      }

      return { ok: false, action, message: "There is no previous page in browser history." };
    }

    case "go_forward": {
      if (window.history.length > 1) {
        window.history.forward();
        return { ok: true, action, message: "Going forward to the next page." };
      }

      return { ok: false, action, message: "There is no next page in browser history." };
    }

    default:
      return { ok: false, action: "read_page", message: "Unsupported browser action." };
  }
};
