# LLM Interview Tool

**Using Large Language Models to conduct semi-structured interviews.**

---

## Overview

This project implements an AI-powered chat assistant built with Next.js and React. It uses the OpenAI API to conduct semi-structured interviews and generate concise summaries of conversations, offering a scalable solution for qualitative data collection.

---

## Technical Documentation

### 1. Introduction

#### 1.1 Purpose
This project provides an AI-powered chat assistant that conducts semi-structured interviews and produces chat summaries.

#### 1.2 Scope
- **Frontend:** Web interface built with Next.js and React.
- **Backend:** API routes to process chat messages and interface with the OpenAI API.
- **Modules:** Business logic for managing assistant interactions.

---

### 2. System Overview

#### 2.1 Architecture
- **Frontend:**  
  - Built with Next.js and React (e.g., pages in `app/page.tsx` and UI components in `components/ui/`).
- **Backend:**  
  - API routes (e.g., `app/api/createAssistant/route.ts`, `app/api/generate-summary/route.ts`) handle chat interactions.
- **Modules:**  
  - Core logic is located in `app/modules/assistantModules.ts`.

#### 2.2 Technologies Used
- Next.js, React, TypeScript, Tailwind CSS, OpenAI API

#### 2.3 Dependencies
- **Backend:** `openai`, `next`, and various API helper libraries.
- **Frontend:** Shadcn UI components, Radix UI, and Tailwind CSS.

---

### 3. Installation Guide

#### 3.1 Prerequisites
- Node.js (v14 or above)
- npm or yarn package manager

#### 3.2 Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/llm-interview-tool.git
   cd llm-interview-tool
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. Duplicate `.env.example` to `.env` and set your `OPENAI_API_KEY`.

4. Start the development server:
   ```bash
   npm run dev
   ```

---

### 4. Configuration Guide

- **OPENAI_API_KEY:** Set in your `.env` file.
- Additional configuration options can be set in `next.config.js`.

---

### 5. Usage Guide

#### User Interface Overview
- The main interface is located in `app/components/`.
- The assistant is initiated via API endpoints and follows a predefined chat flow.

#### Core Features
- **Chat Assistant:** API endpoint `app/api/createAssistant/route.ts` initiates the interview.
- **Chat Summarization:** API endpoint `app/api/generate-summary/route.ts` generates conversation summaries.

---

### 6. API Documentation

Key endpoints include:
- **[upload/route.ts](app/api/upload/route.ts):** Handles file uploads.
- **[listMessages/route.ts](app/api/listMessages/route.ts):** Retrieves chat histories.
- **[createAssistant/route.ts](app/api/createAssistant/route.ts):** Creates a new AI assistant instance.
- **[createThread/route.ts](app/api/createThread/route.ts):** Initiates a new chat thread.
- **[runAssistant/route.ts](app/api/runAssistant/route.ts):** Executes chat interactions.
- **[addMessage/route.ts](app/api/addMessage/route.ts):** Adds messages to a chat thread.
- **[checkRunStatus/route.ts](app/api/checkRunStatus/route.ts):** Monitors the assistant's status.

---

### 7. Limitations
- User authentication is not currently implemented.

---

### 8. Glossary

- **Assistant:** The AI that conducts the interview.
- **Chat Thread:** A single conversation session between the user and the assistant.
- **Summary:** A concise overview generated from a chat conversation.

---

### 9. Links

- [Feedback Form](https://forms.gle/1RoSy4E72Kv7ciyK8)
- [Live Site](https://gpt.networks.howard.edu)

