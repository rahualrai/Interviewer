# Project Technical Documentation

## 1. Introduction

### 1.1 Purpose
This project is designed to provide a chat assistant powered by OpenAI. It allows users to interact with an AI assistant, upload files for analysis, and receive concise summaries of their chat interactions.

### 1.2 Scope
The project includes a web-based user interface, API routes for processing chat and file uploads, and backend modules for interfacing with the OpenAI API. It covers assistant creation, file management, and chat summarization.

### 1.3 Audience
- Frontend and backend developers
- DevOps engineers responsible for deployment and maintenance
- Stakeholders interested in the application’s architecture and features

## 2. System Overview

### 2.1 Architecture
- **Frontend:** Built with Next.js and React, featuring pages (e.g. [app/page.tsx](app/page.tsx)) and reusable UI components (e.g. [components/ui/index.ts](components/ui/index.ts)).
- **Backend:** Uses Next.js API routes (e.g. [app/api/generate-summary/route.ts](app/api/generate-summary/route.ts), [app/api/createAssistant/route.ts](app/api/createAssistant/route.ts)) to process chat messages, upload files, and interact with the OpenAI API.
- **Modules:** Contains business logic for managing assistant interactions (e.g. [app/modules/assistantModules.ts](app/modules/assistantModules.ts)).

### 2.2 Technologies Used
- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenAI API
- Various utility libraries (e.g., `react-markdown`, `zod`)

### 2.3 Dependencies
- Backend: `openai`, `next`, and API helper libraries.
- Frontend: Shadcn UI components, Radix UI, and Tailwind CSS.
- Build Tools: TypeScript, Prettier, PostCSS.

## 3. Installation Guide

### 3.1 Prerequisites
- Node.js (version 14.x or above)
- npm

### 3.2 Installation Steps
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Set up environment variables using `.env` (see [`.env.example`](.env.example)).
4. Run `npm run dev` to start the development server.

## 4. Configuration Guide

### 4.1 Configuration Parameters
- **OPENAI_API_KEY:** (Set in `.env`) Your OpenAI API key.
- Other configuration options can be defined in `next.config.js`.

### 4.2 Environment Setup
- Duplicate `.env.example` to `.env` and fill in the required parameters.
- Ensure the Node environment is set up correctly (development vs production).

### 4.3 External Services Integration
- OpenAI API for chat summarization and assistant interactions.
- Any file storage services if required for file uploads.

## 5. Usage Guide

### 5.1 User Interface Overview
- The main UI components reside under [app/components/](app/components/).
- Demographic surveys (e.g. [DemographicsForm.tsx](#FILE:DEMOGRAPHICSFORM.TSX CONTEXT)) and consent forms ([app/components/ConsentForm.tsx](app/components/ConsentForm.tsx)) are used to collect user information.

### 5.2 User Authentication
- User authentication (if applicable) can be integrated using NextAuth or similar libraries. Current project structure may need additional authentication integration.

### 5.3 Core Functionality
- **Chat Assistant:** The API routes ([app/api/createAssistant/route.ts](app/api/createAssistant/route.ts)) create and manage the assistant.
- **File Uploads:** Helpers provided in [app/modules/assistantModules.ts](app/modules/assistantModules.ts) handle file conversion and uploading.
- **Chat Summary:** The summarization endpoint ([app/api/generate-summary/route.ts](app/api/generate-summary/route.ts)) processes chat logs and returns summarized responses.

### 5.4 Advanced Features
- Dynamic module loading for different assistant configurations.
- Real-time status updates during file uploads and assistant processing.

### 5.5 Troubleshooting
- Check browser console logs for client-side issues.
- Review server logs in the integrated terminal for API errors.
- Refer to README documentation in [app/README.md](app/README.md) for common issues.

## 6. API Documentation

### 6.1 Endpoints
- **POST /api/createAssistant:** Creates a new AI assistant.
- **POST /api/generate-summary:** Generates a summary from chat messages.
- Additional endpoints exist for file upload and message handling ([app/api/addMessage/route.ts](app/api/addMessage/route.ts)).

### 6.2 Request and Response Formats
- *Create Assistant:* Expects JSON with `assistantName`, `assistantModel`, `assistantDescription`, and optional `fileIds`; responds with `assistantId`.
- *Generate Summary:* Accepts a chat object and returns a generated summary.
- Refer to individual API routes in [app/api/README.md](app/api/README.md) for details.

### 6.3 Authentication and Authorization
- API endpoints do not currently enforce authentication; however, hooks could be added based on project requirements.

## 7. Database Schema

### 7.1 Entity-Relationship Diagram
- **Entities:** Assistant, Chat Thread, File Upload.
- An ER diagram can be generated from the project’s data model using your preferred tool.

### 7.2 Table Definitions
- **Assistant Table:** Contains columns such as id, name, model, instructions.
- **File Table:** Contains fileID and metadata associated with uploads.

### 7.3 Relationships and Constraints
- Assistants can have multiple associated chat threads and files.
- Foreign key constraints ensure data integrity between related records.

## 8. Testing

### 8.1 Test Plan
- Unit tests for utility functions (e.g. file conversion in [app/modules/assistantModules.ts](app/modules/assistantModules.ts)).
- Integration tests for API endpoints.
- End-to-end testing on the user interface components.

### 8.2 Test Cases
- Validate correct rendering of UI components (e.g. [DemographicsForm.tsx](#FILE:DEMOGRAPHICSFORM.TSX CONTEXT)).
- Simulate API calls for assistant creation and summary generation.
- Ensure file upload and conversion logic works as expected.

### 8.3 Test Results
- Results are recorded in your continuous integration pipeline.
- Use the terminal output and test coverage reports for detailed analysis.

## 9. Deployment

### 9.1 Deployment Process
- Deploy the app using Vercel (see [package.json](package.json) for deployment scripts).
- Ensure environment variables are configured on the deployment platform.

### 9.2 Release Notes
- Document changes in each release in the Change Log.
- Include updates on feature improvements and bug fixes.

### 9.3 Known Issues and Limitations
- Current deployment does not include user authentication.
- File upload size limitations may apply based on your hosting provider.

## 10. Support and Maintenance

### 10.1 Troubleshooting Guide
- Regularly monitor server and client logs.
- Use git commands (see [app/README.md](app/README.md)) for troubleshooting code issues.

### 10.2 Frequently Asked Questions (FAQs)
- A dedicated FAQ section can be added in future documentation updates.

### 10.3 Contact Information
- Contact the development team via your project’s communication channels (e.g., Slack, Teams).

## 11. Change Log

### 11.1 Version History
- Maintain a log of all project versions and significant changes in the repository.

### 11.2 Change Summary
- Summarize bug fixes, feature additions, and architectural changes in each release.

## 12. Glossary

### 12.1 Terms and Definitions
- **Assistant:** The AI that handles chat interactions.
- **Chat Thread:** A conversation session between the user and the AI assistant.
- **Upload:** The process of sending files for analysis by the assistant.
- **Summary:** A concise overview generated from the chat conversation.
