export type ChatRole = "user" | "assistant";

export type PageLink = {
  text: string;
  href: string;
};

export type PageForm = {
  name: string;
  action: string;
  method: string;
};

export type PageContext = {
  url: string;
  title: string;
  description: string;
  headings: string[];
  navigation: PageLink[];
  links: PageLink[];
  buttons: string[];
  forms: PageForm[];
  visibleText: string;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
};
