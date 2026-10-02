import type { PageContext, PageForm, PageLink } from "../types";

const MAX_VISIBLE_TEXT_LENGTH = 4000;

const normalizeWhitespace = (value: string): string =>
  value.replace(/\s+/g, " ").trim();

const ignoreSelector = [
  "script",
  "style",
  "noscript",
  "iframe",
  "svg",
  "template",
  "[type='hidden']",
  "[hidden]",
  "[aria-hidden='true']",
  "[data-tracking]",
].join(", ");

const isVisible = (element: Element): boolean => {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  const style = window.getComputedStyle(element);

  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
    return false;
  }

  const rect = element.getBoundingClientRect();

  return rect.width > 0 || rect.height > 0 || element.textContent?.trim().length !== 0;
};

const getTextContent = (element: Element): string => {
  if (!element || element.matches(ignoreSelector)) {
    return "";
  }

  if (element instanceof HTMLInputElement && element.type !== "submit" && element.type !== "button") {
    return "";
  }

  const text = element.textContent ?? "";
  return normalizeWhitespace(text);
};

const dedupeLinks = (items: PageLink[]): PageLink[] => {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = `${item.text.toLowerCase()}::${item.href}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const getLinkEntries = (selector: string): PageLink[] => {
  const nodes = Array.from(document.querySelectorAll(selector));

  return dedupeLinks(
    nodes
      .map((element) => {
        if (!(element instanceof HTMLAnchorElement)) {
          return null;
        }

        const text = normalizeWhitespace(element.textContent ?? "");
        const href = element.href || "";

        if (!text || !href || href.startsWith("javascript:") || href.startsWith("mailto:")) {
          return null;
        }

        return { text, href };
      })
      .filter((item): item is PageLink => item !== null),
  );
};

const getVisibleButtonLabels = (): string[] => {
  const selectors = ["button", "[role='button']", "input[type='button']", "input[type='submit']"];

  const buttons = selectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)));

  return Array.from(
    new Set(
      buttons
        .map((button) => {
          if (button instanceof HTMLInputElement) {
            return button.value || button.title || "";
          }

          const value = normalizeWhitespace(button.textContent ?? "");
          return value || button.getAttribute("aria-label") || "";
        })
        .filter((label) => label.length > 0 && buttons.some((button) => {
          if (button instanceof HTMLInputElement) {
            return button.value === label || button.title === label;
          }

          return normalizeWhitespace(button.textContent ?? "") === label || button.getAttribute("aria-label") === label;
        }) && buttons.some((button) => isVisible(button))),
    ),
  );
};

export const getPageContext = (): PageContext => {
  const title = normalizeWhitespace(document.title || "Untitled page");
  const description =
    document.querySelector('meta[name="description"]')?.getAttribute("content") ??
    document.querySelector('meta[property="og:description"]')?.getAttribute("content") ??
    "";

  const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"))
    .filter(isVisible)
    .map((heading) => normalizeWhitespace(heading.textContent ?? ""))
    .filter((heading) => heading.length > 0)
    .slice(0, 20);

  const navigation = dedupeLinks(
    getLinkEntries("nav a, header a, [role='navigation'] a").slice(0, 25),
  );

  const links = dedupeLinks(
    getLinkEntries("a[href]").slice(0, 50),
  );

  const buttons = getVisibleButtonLabels().slice(0, 25);

  const forms: PageForm[] = Array.from(document.querySelectorAll("form"))
    .filter((form) => isVisible(form))
    .map((form) => ({
      name: form.getAttribute("name") ?? "",
      action: form.getAttribute("action") ?? "",
      method: (form.getAttribute("method") ?? "get").toLowerCase(),
    }))
    .filter((form) => form.name.length > 0 || form.action.length > 0 || form.method.length > 0)
    .slice(0, 20);

  const textNodes = Array.from(document.body?.querySelectorAll("body *") ?? [])
    .filter((element) => !element.matches(ignoreSelector))
    .filter(isVisible)
    .map(getTextContent)
    .filter((text) => text.length > 0);

  const visibleText = normalizeWhitespace(textNodes.join(" ")).slice(0, MAX_VISIBLE_TEXT_LENGTH);

  return {
    url: window.location.href,
    title,
    description: normalizeWhitespace(description),
    headings,
    navigation,
    links,
    buttons,
    forms,
    visibleText,
  };
};

export const summarizePageContext = (pageContext: PageContext): string => {
  const primaryHeadings = pageContext.headings.slice(0, 5).join(", ");
  const primaryLinks = pageContext.links.slice(0, 5).map((link) => link.text).join(", ");

  const headingSummary = primaryHeadings.length > 0 ? `I found headings including ${primaryHeadings}.` : "I did not find clear headings on this page.";
  const linkSummary = primaryLinks.length > 0 ? `Notable links include ${primaryLinks}.` : "I did not find obvious primary links.";

  return `${headingSummary} ${linkSummary} This page appears to be about ${pageContext.title || "this website"}.`;
};

export const getPageSummary = (pageContext: PageContext): string => {
  const title = pageContext.title || "this page";
  const headingList = pageContext.headings.slice(0, 6);
  const navList = pageContext.navigation.slice(0, 5).map((item) => item.text);
  const linkList = pageContext.links.slice(0, 5).map((item) => item.text);

  const summaryLines = [
    `I can see that you're on ${title}.`,
    "",
  ];

  if (headingList.length > 0) {
    summaryLines.push("I found:");
    headingList.forEach((heading) => {
      summaryLines.push(`• ${heading}`);
    });
  } else {
    summaryLines.push("I did not find clear section headings on this page.");
  }

  if (navList.length > 0) {
    summaryLines.push("");
    summaryLines.push(`Key navigation items: ${navList.join(", ")}.`);
  }

  if (linkList.length > 0 && linkList.length !== navList.length) {
    summaryLines.push(`Notable links: ${linkList.slice(0, 4).join(", ")}.`);
  }

  if (pageContext.description) {
    summaryLines.push(`Page description: ${pageContext.description}.`);
  }

  summaryLines.push("");
  summaryLines.push("What would you like me to open?");

  return summaryLines.join("\n");
};
