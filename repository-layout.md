# Repository Layout

This document outlines the structure of the TaskEase project.

/
├── .env.local            # Local environment variables for Firebase config
├── README.md             # Project overview and setup instructions
├── apphosting.yaml       # Configuration for Firebase App Hosting
├── components.json       # Shadcn UI configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
│
└── src/
    ├── ai/
    │   ├── dev.ts                # Genkit development server entry point
    │   ├── flows/                # Genkit AI flows
    │   │   ├── suggest-task-titles.ts   # AI flow for suggesting task titles
    │   │   └── task-prioritization.ts # AI flow for prioritizing tasks
    │   └── genkit.ts             # Genkit configuration and initialization
    │
    ├── app/
    │   ├── (auth)/             # Route group for authentication pages
    │   │   ├── layout.tsx      # Layout for auth pages
    │   │   ├── login/page.tsx  # Login page component
    │   │   └── signup/page.tsx # Signup page component
    │   │
    │   ├── (main)/             # Route group for main application pages
    │   │   ├── layout.tsx      # Layout for main app (requires auth)
    │   │   └── tasks/page.tsx  # Main task management page
    │   │
    │   ├── globals.css         # Global styles and Shadcn theme variables
    │   ├── layout.tsx          # Root layout for the entire application
    │   └── page.tsx            # Landing page component
    │
    ├── components/
    │   ├── header.tsx            # Main application header
    │   ├── logo.tsx              # Logo component
    │   ├── tasks/                # Components related to task management
    │   │   ├── add-task.tsx      # Dialog for adding a new task
    │   │   ├── ai-prioritizer.tsx# Dialog for AI task prioritization
    │   │   ├── delete-task-alert.tsx # Alert dialog for deleting a task
    │   │   ├── edit-task.tsx     # Dialog for editing a task
    │   │   ├── task-item.tsx     # Component for a single task item
    │   │   └── task-list.tsx     # Component to display the list of tasks
    │   └── ui/                   # Reusable UI components from Shadcn
    │       ├── accordion.tsx
    │       ├── alert-dialog.tsx
    │       ├── alert.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── calendar.tsx
    │       ├── card.tsx
    │       ├── ... (and other Shadcn components)
    │
    ├── hooks/
    │   ├── use-auth.tsx          # Authentication context, provider, and guard
    │   └── use-toast.ts          # Hook for showing toast notifications
    │
    └── lib/
        ├── firebase.ts           # Firebase SDK initialization and configuration
        ├── placeholder-images.json # Data for placeholder images
        ├── placeholder-images.ts # Logic to load placeholder image data
        ├── types.ts              # TypeScript type definitions (e.g., Task)
        └── utils.ts              # Utility functions (e.g., `cn` for classnames)
