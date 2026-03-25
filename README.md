# ShipYard — Build, Share, Connect

**A social platform for makers and developers**

GitHub: [https://github.com/Leenpwas/Shipyard](https://github.com/Leenpwas/Shipyard)

---

## Introduction

ShipYard is a social platform where makers and developers can showcase projects, post build updates, and connect with communities. It features a mobile-first, dark-themed UI with a TikTok-inspired explore experience.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16.2 | Full-stack React framework (App Router) |
| React 19.2 | UI component library |
| Vanilla CSS | Custom dark-mode design system |
| Next.js API Routes | RESTful backend (12 endpoints) |
| In-memory mock store | Simulated database layer |
| Google Fonts | Inter + Space Grotesk typography |
| ESLint | Code quality |

---

## Features

| Feature | Description |
|---|---|
| **Authentication** | Login, Signup, localStorage session, route protection |
| **Activity Feed** | Chronological post feed with likes and skeleton loaders |
| **Explore (Reels)** | Full-screen, scroll-snap project cards with progress rings and action buttons |
| **Project Detail** | Project info, members, funding progress, posts, and chat |
| **Create Project** | Form for name, description, tech stack, type, and funding goal |
| **User Profile** | Avatar, bio, owned projects, joined communities, stats |
| **Social Actions** | Like/unlike, join/leave projects, in-project chat |

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Leenpwas/Shipyard.git
cd Shipyard

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Demo credentials are pre-filled on the login page.**

---

## Architecture

```
AuthProvider (wraps entire app)
  ├── AppShell (layout + bottom navigation)
  │     ├── Feed (/)
  │     ├── Explore Reels (/explore)
  │     ├── New Project (/projects/new)
  │     └── Profile (/profile)
  ├── Login (/login)
  ├── Signup (/signup)
  └── API Routes (/api/*)
        ├── auth/login, auth/signup
        ├── feed
        ├── projects, projects/[id], projects/[id]/posts, projects/[id]/chat
        ├── users/[id]
        └── Mock Data Store (lib/mock-data.js)
```

---

## License

This project is for educational/demo purposes.
