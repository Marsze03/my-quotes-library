# Resonance - Quotes Library

A minimalist quotes library web application built with Next.js 16, TypeScript, Tailwind CSS 4, and Supabase.

## Features

- 🔐 Authentication (Supabase)
- 📝 Add and manage quotes
- 👤 Author attribution
- 🏷️ Categories/tags system
- 🔍 Search functionality
- ⭐ Favorites system
- 🎲 Random quote generator
- 🎨 Quote card generator
- 🌙 Dark mode support
- 📴 PWA (offline support)

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Supabase** - Authentication and database
- **next-themes** - Dark mode support

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
resonance-quotes/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/             # Utilities and helpers
├── public/          # Static assets
└── README.md
```

## License

MIT
