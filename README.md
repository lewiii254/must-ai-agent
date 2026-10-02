# ⚡ MUST AI Agent

> An intelligent browser-based AI assistant for navigating and interacting with university websites.

MUST AI Agent is an experimental browser extension that adds an AI-powered assistant as a floating layer on top of existing websites.

The project explores how an AI agent can understand a webpage, answer questions about its content, navigate the site, and eventually perform safe browser actions through natural language and voice.

## 🚀 Vision

Imagine visiting a university website and having an AI assistant available directly inside the browser:

> 💬 "Where can I find admissions?"

> 🤖 "Admissions is available in the main navigation. Would you like me to open it?"

Or:

> 🎙️ "Open the academic calendar."

The assistant understands the current webpage and can interact with it through controlled browser tools.

The long-term goal is to create a reusable AI layer that can be adapted to university portals, schools, organizations, and other websites.

The website itself does not need to contain MUST AI in its source code.

The browser extension injects the assistant into the page at runtime.

---

## 🏗️ Architecture

The project is being developed in phases.

### Browser Extension

Responsible for:

- Floating assistant UI
- Reading page context
- Searching visible page content
- Controlled browser interactions
- Voice interface

### AI Backend

The future backend will handle:

- AI model communication
- Conversation management
- Tool calling
- Authentication
- Rate limiting
- Knowledge retrieval

API keys will never be exposed inside the browser extension.

### Knowledge Layer

A future RAG system will provide access to approved public university information such as:

- Academic calendars
- Admissions information
- Public notices
- Student guidelines
- FAQs
- University documents

---

## 🛠️ Tech Stack

### Frontend / Extension

- React
- TypeScript
- Vite
- pnpm
- Chrome Extension Manifest V3
- CRXJS

### Planned Backend

- Node.js
- TypeScript
- AI API
- PostgreSQL
- pgvector

### Planned AI Capabilities

- LLM-powered conversations
- Tool calling
- Retrieval-Augmented Generation (RAG)
- Speech-to-text
- Text-to-speech
- Browser automation

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/must-ai-agent.git
cd must-ai-agent
```

Install dependencies:

```bash
pnpm install
```

Build the extension:

```bash
pnpm build
```

---

## 🌐 Load the Extension

After building:

1. Open Chrome, Chromium, or Brave.
2. Navigate to:

```text
chrome://extensions
```

For Brave:

```text
brave://extensions
```

3. Enable Developer mode.
4. Select Load unpacked.
5. Choose the project's `dist/` directory.
6. Open a webpage.

The MUST AI floating assistant should appear in the bottom-left corner.

---

## 🧪 Development

Run the development environment:

```bash
pnpm dev
```

Build the extension:

```bash
pnpm build
```

Type-check the project:

```bash
pnpm exec tsc --noEmit
```

---

## 🔐 Security & Privacy

MUST AI is currently an independent prototype.

The project does not attempt to:

- Bypass authentication
- Extract passwords
- Extract cookies
- Access private university databases
- Circumvent access controls
- Submit sensitive transactions without authorization

Potentially consequential actions will require explicit user confirmation.

Production integration with private university systems would require authorized APIs, authentication, security review, and approval from the relevant institution.

---

## 🎯 Roadmap

### Phase 1 — Browser Extension

- Floating assistant
- Expandable chat interface
- Browser injection
- Independent UI layer

### Phase 2 — Page Intelligence

- Page context extraction
- Page summarization
- Page search
- Element discovery

### Phase 3 — Browser Agent

- Safe navigation
- Find elements
- Scroll to elements
- Open links
- Controlled clicking
- Tool execution

### Phase 4 — AI

- AI backend
- Conversation API
- Tool calling
- Agent loop
- Context-aware responses

### Phase 5 — Knowledge

- MUST public information ingestion
- Embeddings
- Vector search
- RAG
- Source-aware answers

### Phase 6 — Voice

- Speech recognition
- Voice commands
- Text-to-speech
- Voice conversation

### Phase 7 — Production Integration

- Authorized university APIs
- Authentication
- Secure student data access
- Confirmation workflows
- Institutional deployment

---

## 🧪 Demo Concept

The current prototype can operate independently from the target website's codebase.

For example:

```text
Open MUST website
       ↓
Install MUST AI extension
       ↓
Floating ⚡ button appears
       ↓
Open assistant
       ↓
"What's on this page?"
       ↓
AI reads the current webpage
       ↓
"Open Admissions"
       ↓
Controlled browser action
```

This allows the concept to be demonstrated before any official institutional integration.

---

## ⚠️ Project Status

**Experimental / Proof of Concept**

MUST AI is not an official Meru University of Science and Technology system.

The project is currently being developed as an independent technical prototype exploring AI-powered browser agents and university digital assistants.

Official deployment or integration with university systems would require authorization and appropriate technical/security review.

---

## 👨‍💻 Author

**Marklewis Mutugi**

Full-Stack Software Engineer & AI Developer

- GitHub: [https://github.com/lewiii254](https://github.com/lewiii254)
- Portfolio: [https://marklewis.tech]()

---

## ⭐ Future Vision

MUST AI is being developed with a broader idea in mind:

> **An AI layer that can sit on top of any website and help users understand and interact with it using natural language.**

The university use case is the first practical implementation.

The longer-term vision is a reusable platform for intelligent website interaction.

```text
### One small GitHub tip

For the repo description, I'd use:

> **AI-powered browser agent that understands webpages and helps users navigate and interact with websites using natural language.**

And topics:

ai
ai-agent
browser-extension
browser-automation
react
typescript
vite
llm
rag
voice-ai
web-agents
chrome-extension
```

This makes the project look like a real AI-agent engineering project, rather than simply "a chatbot for MUST."

---

## ✨ Current Features

- ⚡ Floating AI assistant injected into webpages
- 💬 Expandable chat interface
- 🎨 Independent UI layer that does not require modifying the target website
- 🌐 Works through a Chromium browser extension
- 📄 Page context extraction
- 🔎 Webpage content and navigation discovery
- 🧭 Page-aware assistance
- 🛠️ Foundation for controlled browser actions

---

## 🧠 How It Works

MUST AI runs as a browser extension.

```text
                    Existing Website
                           │
                           ▼
                  ┌─────────────────┐
                  │ Browser         │
                  │ Extension       │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ MUST AI Widget  │
                  │                 │
                  │ 💬 Chat         │
                  │ 🎙️ Voice        │
                  │ 🧭 Navigation   │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Page Context    │
                  │ Engine          │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ AI Agent        │
                  └────────┬────────┘
                           │
                    ┌──────┴──────┐
                    ▼             ▼
                 Knowledge      Browser
                   Tools         Tools
