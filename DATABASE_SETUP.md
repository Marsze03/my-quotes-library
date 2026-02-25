# Database Setup for Resonance Quotes

## Supabase Setup

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key

### 2. Create `.env.local` file

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Create Database Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create quotes table
CREATE TABLE quotes (
  id BIGSERIAL PRIMARY KEY,
  quote_text TEXT NOT NULL,
  author TEXT NOT NULL,
  source TEXT,
  category TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster searches
CREATE INDEX idx_quotes_author ON quotes(author);
CREATE INDEX idx_quotes_category ON quotes(category);
CREATE INDEX idx_quotes_favorite ON quotes(is_favorite);
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);

-- Enable Row Level Security (optional - for multi-user support)
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for now (update for authentication later)
CREATE POLICY "Enable all access for now" 
  ON quotes 
  FOR ALL 
  USING (true)
  WITH CHECK (true);
```

### 4. Test Your Connection

After setting up:
1. Make sure `.env.local` file exists with your credentials
2. Restart your dev server: `npm run dev`
3. Visit http://localhost:3000/quotes
4. Try adding a quote!

## Database Schema

```
quotes
├── id (bigserial, primary key)
├── quote_text (text, required)
├── author (text, required)
├── source (text, optional)
├── category (text, optional)
├── is_favorite (boolean, default: false)
└── created_at (timestamp, auto)
```

## Future Enhancements

### For Authentication Support

When you add user authentication, update the schema:

```sql
-- Add user_id column
ALTER TABLE quotes ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Update RLS policies
DROP POLICY "Enable all access for now" ON quotes;

CREATE POLICY "Users can view own quotes"
  ON quotes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quotes"
  ON quotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quotes"
  ON quotes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quotes"
  ON quotes FOR DELETE
  USING (auth.uid() = user_id);
```
