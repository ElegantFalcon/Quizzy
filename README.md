# Quizzy

**Quizzy** is a modern, interactive quiz and presentation platform built with [Next.js](https://nextjs.org), [Firebase](https://firebase.google.com/), and [Tailwind CSS](https://tailwindcss.com/). Create, host, and join live quizzes with real-time leaderboards, analytics, and engaging UI.

---

## ✨ Features

- **Create Quizzes**: Design quizzes with multiple question types, categories, and custom settings.
- **Live Participation**: Users can join quizzes using a unique room code and answer in real-time.
- **Leaderboard**: Dynamic, animated leaderboard updates as participants answer questions.
- **Analytics**: View quiz performance, participant stats, and export results.
- **Authentication**: Secure login/signup with Firebase Auth (Google/email).
- **Responsive UI**: Beautiful, accessible design with dark mode support.
- **Admin Dashboard**: Manage your quizzes, view analytics, and edit or delete quizzes.

---

## 🚀 Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/quizzy.git
cd quizzy
```

### 2. Install dependencies

```sh
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project and add your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
```

### 4. Run the development server

```sh
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

---

## 🗂️ Project Structure

```
.
├── app/                # Next.js app directory (routing, pages)
│   ├── page.tsx        # Home page
│   ├── create/         # Quiz creation flow
│   ├── join/           # Join quiz flow
│   ├── leaderboard/    # Leaderboard demo
│   └── my-quizzes/     # User's quizzes dashboard
├── components/         # Reusable UI and feature components
│   ├── ui/            
│   ├── dashboard-sidebar.tsx
│   ├── create-quiz.tsx
│   ├── leaderboard.tsx
│   └── ...
├── contexts/           # React context providers 
├── hooks/              # Custom React hooks
├── lib/                # Utilities and Firebase config
├── public/             # Static assets
├── tailwind.config.ts  # Tailwind CSS config
├── next.config.ts      # Next.js config
└── ...
```

---

## 🛠️ Main Technologies

- [Next.js App Router](https://nextjs.org/docs/app)
- [React](https://react.dev/)
- [Firebase (Firestore, RTDB, Auth)](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (animations)
- [Radix UI](https://www.radix-ui.com/) (accessible UI primitives)

---

## 🧑‍💻 Key Files & Components

- **Home Page**: `app/page.tsx`
- **Create Quiz**: `components/create-quiz.tsx`
- **Join Quiz**: `app/join/page.tsx`
- **Leaderboard**: `components/leaderboard.tsx`
- **Dashboard Sidebar**: `components/dashboard-sidebar.tsx`
- **UI Primitives**: `components/ui/`
- **Firebase Config**: `lib/firebase.ts`

---

## 📦 Deployment

Deploy easily on [Vercel](https://vercel.com/) or any platform supporting Next.js.

1. Push your code to GitHub.
2. Connect your repo on [Vercel](https://vercel.com/new).
3. Set the same environment variables as in `.env.local`.
4. Deploy!

---


## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📧 Contact

For questions or feedback, open an issue or contact [nikhil.mecheril@gmail.com](nikhil.mecheril@gmail.com) , [nanduprakash2004@gmail.com](nanduprakash2004@gmail.com) , [aswinipriya2004@gmail.com](aswinipriya2004@gmail.com])

---
