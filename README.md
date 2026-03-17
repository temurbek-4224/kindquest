# KindQuest 🌟

A multilingual educational quiz game for children that teaches virtues like respect, honesty, kindness, and discipline — in **Uzbek**, **Russian**, and **English**.

Built with **Next.js 16**, **Supabase**, **Tailwind CSS v4**, and **Framer Motion**.

---

## Features

- 🎮 **Interactive quiz game** — 10 randomly selected questions per session, instant answer feedback with explanations
- 🌍 **Trilingual** — Uzbek, Russian, and English (switch language anytime)
- 📊 **Result tracking** — scores saved to Supabase for logged-in users, full answer review at the end
- 👤 **Auth** — sign up / sign in with email & password via Supabase Auth
- 🧑‍💼 **Admin panel** — full CRUD for questions, results monitoring, user management
- 📱 **Responsive** — works on mobile, tablet, and desktop

---

## Tech Stack

| Layer     | Technology                       |
|-----------|----------------------------------|
| Framework | Next.js 16.1 (App Router)        |
| Language  | TypeScript                       |
| Styling   | Tailwind CSS v4                  |
| UI        | shadcn/ui + Framer Motion v12    |
| Backend   | Supabase (Postgres + Auth + RLS) |
| Deploy    | Vercel (recommended)             |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase project credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

Get these from: **Supabase Dashboard → Your Project → Settings → API**

### 3. Set up the database

Run the SQL files in **Supabase Dashboard → SQL Editor**:

```
supabase/schema.sql                  ← full schema (fresh install)
supabase/fix-questions-table.sql     ← run if upgrading questions schema
supabase/fix-profiles-trigger.sql    ← run if user profiles aren't auto-creating
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Admin Panel

1. Create an account at `/register`
2. In Supabase SQL Editor, promote your user to admin:
   ```sql
   update public.profiles
   set role = 'admin'
   where email = 'your@email.com';
   ```
3. The **Admin Panel** button appears in the navbar automatically
4. At `/admin` you can add/edit/delete questions, view results, and manage users

---

## Project Structure

```
src/
├── app/
│   ├── game/        # Quiz game (fetches live from Supabase)
│   ├── result/      # End-of-game results + answer review
│   ├── profile/     # User profile + game history
│   ├── admin/       # Admin panel (role-protected server layout)
│   ├── login/
│   └── register/
├── components/
│   ├── game/        # GameCard, AnswerButton, ProgressBar
│   └── layout/      # Navbar, Footer, LanguageSwitcher
├── context/
│   ├── AuthContext  # Auth state + isAdmin role check
│   ├── GameContext  # Game state machine (reducer)
│   └── LanguageContext
├── types/
│   ├── game.ts      # GameQuestion type
│   └── admin.ts     # DBQuestion, DBProfile, DBGameResult
├── lib/supabase/    # browser + server Supabase clients
└── data/questions.ts # Static seed data + CATEGORY_META
supabase/
├── schema.sql
├── fix-questions-table.sql
└── fix-profiles-trigger.sql
```

---

## Question Categories

| Category   | Icon | Colour  |
|------------|------|---------|
| Respect    | 👴   | Orange  |
| Honesty    | ✅   | Emerald |
| Kindness   | 💝   | Pink    |
| School     | 🏫   | Blue    |
| Home       | 🏠   | Violet  |
| Discipline | ⭐   | Amber   |
| General    | 📚   | Gray    |

---

## Deployment (Vercel)

1. Push this repo to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Add env vars in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — done ✓

---

## License

MIT
