# Police Awareness Quiz

A TV-friendly quiz application for police awareness events. Participants register with their name and phone number, answer randomized Tamil questions, and are eliminated immediately upon a wrong answer. Police staff manage questions and view results through a protected dashboard.

## Tech Stack

- **Next.js** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui
- **Convex** — database and real-time backend
- **Clerk** — authentication for police staff

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Clerk

1. Create an application at [clerk.com](https://clerk.com)
2. Copy your API keys into `.env.local`:

```bash
cp .env.local.example .env.local
```

### 3. Set up Convex

```bash
npx convex dev
```

This will prompt you to log in, create a project, and write `NEXT_PUBLIC_CONVEX_URL` to `.env.local`.

### 4. Run the app

In a second terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Public | Landing page |
| `/register` | Public | Participant registration |
| `/quiz` | Public | Quiz interface (TV/projector) |
| `/result` | Public | Score and thank-you screen |
| `/dashboard` | Staff (Clerk) | Statistics and overview |
| `/questions` | Staff (Clerk) | Question management |

## Quiz Rules

- Questions are in Tamil
- 100 randomized questions per attempt (or fewer if bank is smaller)
- 1 point per correct answer
- Wrong answer ends the quiz immediately
- Results stored in Convex

## Staff Features

- View total participants, attempts, and highest score
- Manage questions (add, edit, delete, enable/disable)
- View recent participants and quiz results
