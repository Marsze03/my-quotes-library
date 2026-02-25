'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useTheme } from 'next-themes'

type Quote = {
  id: number
  quote_text: string
  author: string
  source?: string
  category?: string
  is_favorite: boolean
  created_at: string
}

export default function QuotesPage() {
  const { setTheme, resolvedTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newQuote, setNewQuote] = useState({
    quote_text: '',
    author: '',
    source: '',
    category: ''
  })

  useEffect(() => {
    setIsMounted(true)
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuotes(data || [])
    } catch (error) {
      console.error('Error fetching quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuote = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newQuote.quote_text || !newQuote.author) {
      return
    }

    try {
      const { error } = await supabase
        .from('quotes')
        .insert([{ 
          ...newQuote,
          is_favorite: false 
        }])

      if (error) throw error
      
      setNewQuote({ quote_text: '', author: '', source: '', category: '' })
      setShowAddForm(false)
      fetchQuotes()
    } catch (error) {
      console.error('Error adding quote:', error)
    }
  }

  const handleToggleFavorite = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ is_favorite: !currentStatus })
        .eq('id', id)

      if (error) throw error
      fetchQuotes()
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleDeleteQuote = async (id: number) => {
    if (!confirm('Delete this quote?')) return

    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchQuotes()
    } catch (error) {
      console.error('Error deleting quote:', error)
    }
  }

  const getRandomQuote = () => {
    if (quotes.length === 0) return
    const randomIndex = Math.floor(Math.random() * quotes.length)
    const randomQuote = quotes[randomIndex]
    alert(`"${randomQuote.quote_text}"\n\n— ${randomQuote.author}`)
  }

  const filteredQuotes = quotes.filter(q =>
    q.quote_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px] opacity-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        
        {/* Header */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-16">
            <div className="text-xs tracking-widest uppercase text-neutral-400 dark:text-neutral-600">Library</div>
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
              aria-label="Toggle Theme"
            >
              {isMounted && resolvedTheme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
          </div>
          
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-normal tracking-tight text-neutral-900 dark:text-neutral-100">
              Citatio
            </h1>
            <div className="w-16 h-px bg-neutral-300 dark:bg-neutral-700 mx-auto"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-16">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="group px-8 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium tracking-wider uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all"
          >
            {showAddForm ? 'Close' : 'New Quote'}
          </button>
          <button
            onClick={getRandomQuote}
            disabled={quotes.length === 0}
            className="px-8 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium tracking-wider uppercase hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Random
          </button>
        </div>

        {/* Add Quote Form */}
        {showAddForm && (
          <div className="max-w-3xl mx-auto mb-20 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-10">
            <h2 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-8 tracking-widest uppercase">
              New Entry
            </h2>
            <form onSubmit={handleAddQuote} className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-3 tracking-wider uppercase">
                  Quote *
                </label>
                <textarea
                  value={newQuote.quote_text}
                  onChange={(e) => setNewQuote({ ...newQuote, quote_text: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-0 py-3 bg-transparent border-b border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-300 dark:placeholder:text-neutral-700 transition-colors resize-none"
                  placeholder="Enter the quote..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-3 tracking-wider uppercase">
                    Author *
                  </label>
                  <input
                    type="text"
                    value={newQuote.author}
                    onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
                    required
                    className="w-full px-0 py-3 bg-transparent border-b border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-300 dark:placeholder:text-neutral-700 transition-colors"
                    placeholder="Author name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-3 tracking-wider uppercase">
                    Source
                  </label>
                  <input
                    type="text"
                    value={newQuote.source}
                    onChange={(e) => setNewQuote({ ...newQuote, source: e.target.value })}
                    className="w-full px-0 py-3 bg-transparent border-b border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-300 dark:placeholder:text-neutral-700 transition-colors"
                    placeholder="Book, speech, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-3 tracking-wider uppercase">
                  Category
                </label>
                <input
                  type="text"
                  value={newQuote.category}
                  onChange={(e) => setNewQuote({ ...newQuote, category: e.target.value })}
                  className="w-full px-0 py-3 bg-transparent border-b border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-300 dark:placeholder:text-neutral-700 transition-colors"
                  placeholder="Wisdom, Inspiration, etc."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                >
                  Save Quote
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        {quotes.length > 0 && (
          <div className="max-w-3xl mx-auto mb-16">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quotes, authors, or categories..."
              className="w-full px-0 py-4 bg-transparent border-b border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 transition-colors text-sm"
            />
          </div>
        )}

        {/* Quotes Grid */}
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block h-6 w-6 animate-spin border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100"></div>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-neutral-400 dark:text-neutral-600 text-sm tracking-wide">
              {quotes.length === 0 ? 'No quotes yet. Start your collection.' : 'No quotes found'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuotes.map((quote) => (
              <div
                key={quote.id}
                className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <button
                    onClick={() => handleToggleFavorite(quote.id, quote.is_favorite)}
                    className="text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-sm"
                  >
                    {quote.is_favorite ? '♥' : '♡'}
                  </button>
                  <button
                    onClick={() => handleDeleteQuote(quote.id)}
                    className="opacity-0 group-hover:opacity-100 text-neutral-300 dark:text-neutral-700 hover:text-neutral-600 dark:hover:text-neutral-400 transition-all text-xs"
                  >
                    ×
                  </button>
                </div>

                <blockquote className="text-base text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                  "{quote.quote_text}"
                </blockquote>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 tracking-wider uppercase">
                    {quote.author}
                  </p>
                  {quote.source && (
                    <p className="text-xs text-neutral-400 dark:text-neutral-600">
                      {quote.source}
                    </p>
                  )}
                  {quote.category && (
                    <span className="inline-block mt-3 px-3 py-1 text-[10px] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 tracking-widest uppercase">
                      {quote.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {quotes.length > 0 && (
          <div className="mt-20 pt-12 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-400 dark:text-neutral-600 tracking-wider uppercase">
            {quotes.length} {quotes.length === 1 ? 'quote' : 'quotes'} • {quotes.filter(q => q.is_favorite).length} favorites
          </div>
        )}
      </div>
    </div>
  )
}
