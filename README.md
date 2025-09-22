# TaskEase - AI-Powered Task Management App

TaskEase is a modern, full-stack task management application built with Next.js and Firebase. It leverages the power of Google's Gemini AI to help users create and prioritize their tasks intelligently.

![TaskEase Screenshot](https://picsum.photos/seed/1/600/400)

## Features

- **User Authentication**: Secure sign-up and login with Firebase Authentication.
- **Task Management**: Create, Read, Update, and Delete (CRUD) tasks.
- **AI-Powered Title Suggestions**: Automatically suggest task titles based on a description using Genkit and the Gemini 2.5 Flash model.
- **AI Task Prioritization**: Uses AI to analyze a list of tasks and suggest priorities based on urgency and importance.
- **Real-time Updates**: Tasks are updated in real-time across devices using Firebase Firestore.
- **Modern UI**: Sleek and responsive interface built with Shadcn/UI and Tailwind CSS.
- **Offline Persistence**: Tasks are available even with an unstable or no internet connection thanks to Firestore's offline capabilities.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **AI**: [Genkit](https://firebase.google.com/docs/genkit) with [Google's Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/flash/)
- **Database & Authentication**: [Firebase](https://firebase.google.com/) (Firestore & Auth)
- **UI**: [React](https://reactjs.org/), [Shadcn/UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Styling**: [Lucide React](https://lucide.dev/guide/packages/lucide-react) for icons
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

- Node.js (v18 or later recommended)
- `npm` or `yarn`

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/<your-username>/taskease.git
    cd taskease
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up Firebase:**
    The project is pre-configured to connect to a Firebase project. The necessary configuration is in `src/lib/firebase.ts`.

4.  **Run the development server:**
    The application uses two development servers: one for the Next.js frontend and one for the Genkit AI flows.

    -   **Start the Next.js app:**
        ```sh
        npm run dev
        ```
        Your application will be available at `http://localhost:9002`.

    -   **Start the Genkit flows:**
        Open a new terminal and run:
        ```sh
        npm run genkit:dev
        ```
        This starts the Genkit development UI at `http://localhost:4000`, which you can use to inspect and test your AI flows.

## Project Structure

The project follows a standard Next.js App Router structure. Key directories include:

-   `src/app`: Contains all routes and UI pages.
-   `src/ai`: Houses all Genkit-related code, including AI flows.
-   `src/components`: Contains reusable React components.
-   `src/lib`: Includes Firebase configuration and other core utilities.
-   `src/hooks`: Custom React hooks, such as `useAuth`.

For a detailed breakdown of the file structure, see [repository-layout.md](./repository-layout.md).

## Firebase Integration

-   **Authentication**: Managed in `src/hooks/use-auth.tsx`, providing session management and route protection.
-   **Firestore**: The Firebase SDK is initialized in `src/lib/firebase.ts`. Task operations (CRUD) are performed directly from the client-side components in `src/components/tasks/` and the main tasks page at `src/app/(main)/tasks/page.tsx`.
-   **Security Rules**: For a production application, you would need to configure Firestore Security Rules to ensure users can only access their own data.
