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
- **Dark Mode**: Supports light, dark, and system themes.
- **Animations**: Subtle animations for a more engaging user experience.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **AI**: [Genkit](https://firebase.google.com/docs/genkit) with [Google's Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/flash/)
- **Database & Authentication**: [Firebase](https://firebase.google.com/) (Firestore & Auth)
- **UI**: [React](https://reactjs.org/), [Shadcn/UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

- Node.js (v18 or later recommended)
- `npm` or `yarn`
- A Firebase project.

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

3.  **Set up Environment Variables:**
    Create a file named `.env.local` in the root of your project and add your Firebase project's configuration keys. You can find these in your Firebase project settings.
    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development servers:**
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

5.  **Run Tests:**
    To run the automated tests, use the following command:
    ```sh
    npm test
    ```
    This will start Jest in watch mode, automatically re-running tests as you make changes to the code.

## Design Decisions & Trade-offs

- **Framework Choice**: **Next.js** was chosen for its robust feature set, including the App Router for clean routing, Server Components for performance, and seamless integration with Vercel for deployment.
- **Database**: **Firebase Firestore** was selected for its real-time capabilities, excellent offline persistence, and tight integration with Firebase Authentication. The choice to use the client-side SDK directly simplifies the architecture by removing the need for a separate backend API layer for CRUD operations.
    - **Trade-off**: While simpler, this approach means that data validation and security rely more heavily on Firestore Security Rules rather than a server-side API.
- **AI Integration**: **Genkit** provides a structured and maintainable way to define and manage AI flows. It simplifies calling the Google Gemini models and allows for easy testing and monitoring of AI functionality through its developer UI.
- **UI & Styling**: **Shadcn/UI** and **Tailwind CSS** were chosen for their modern, utility-first approach to building a consistent and responsive user interface. Shadcn provides beautiful, accessible, and unstyled components that are easy to customize.

## Firestore Data Structure

The application uses a single Firestore collection named `tasks`. Each document within this collection represents a single task and has the following structure:

| Field         | Type      | Description                                               |
|---------------|-----------|-----------------------------------------------------------|
| `title`       | `string`  | The title of the task.                                    |
| `description` | `string`  | A more detailed description of the task (optional).       |
| `completed`   | `boolean` | `true` if the task is completed, otherwise `false`.       |
| `ownerId`     | `string`  | The UID of the user who owns the task. Used for security. |
| `priority`    | `number`  | The AI-assigned priority (1 is highest). Optional.        |
| `reason`      | `string`  | The AI-generated reason for the assigned priority. Optional.|
| `createdAt`   | `Timestamp`| The server timestamp when the task was created.           |
| `updatedAt`   | `Timestamp`| The server timestamp when the task was last updated.      |

## Deployment

This application is configured for easy deployment with **Vercel**.

1.  **Push to GitHub:**
    Push your project's code to a GitHub repository.

2.  **Import Project on Vercel:**
    - Go to your [Vercel dashboard](https://vercel.com/dashboard) and click "Add New... > Project".
    - Select your GitHub repository. Vercel will automatically detect that you're using Next.js.

3.  **Configure Environment Variables:**
    - In your Vercel project settings, navigate to the "Environment Variables" section.
    - Add the Firebase configuration keys that you have in your `.env.local` file. Make sure to name them exactly the same (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`).
    
4.  **Deploy:**
    - Click the "Deploy" button. Vercel will build your application and deploy it. Any subsequent pushes to your main branch will automatically trigger new deployments.
