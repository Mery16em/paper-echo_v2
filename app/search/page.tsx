"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Quote, BookOpen, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface QuoteWithBook {
  id: string
  text: string
  tags: string[] | null
  created_at: string
  books: {
    id: string
    title: string
    author: string
    cover_url: string | null
  }
}

interface Book {
  id: string
  title: string
  author: string
}

export default function SearchPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBook, setSelectedBook] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [quotes, setQuotes] = useState<QuoteWithBook[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (user) {
      fetchBooksAndTags()
    }
  }, [user])

  const fetchBooksAndTags = async () => {
    try {
      // Fetch books
      const { data: booksData } = await supabase
        .from("books")
        .select("id, title, author")
        .eq("user_id", user?.id)
        .order("title")

      // Fetch all quotes to extract unique tags
      const { data: quotesData } = await supabase.from("quotes").select("tags").eq("user_id", user?.id)

      setBooks(booksData || [])

      // Extract unique tags
      const tagsSet = new Set<string>()
      quotesData?.forEach((quote) => {
        quote.tags?.forEach((tag) => tagsSet.add(tag))
      })
      setAllTags(Array.from(tagsSet).sort())
    } catch (error) {
      console.error("Error fetching books and tags:", error)
    }
  }

  const handleSearch = async () => {
    if (!user) return

    setLoading(true)
    setHasSearched(true)

    try {
      let query = supabase
        .from("quotes")
        .select(`
          id,
          text,
          tags,
          created_at,
          books (
            id,
            title,
            author,
            cover_url
          )
        `)
        .eq("user_id", user.id)

      // Apply filters
      if (selectedBook) {
        query = query.eq("book_id", selectedBook)
      }

      if (selectedTag) {
        query = query.contains("tags", [selectedTag])
      }

      if (searchQuery.trim()) {
        query = query.ilike("text", `%${searchQuery.trim()}%`)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error
      setQuotes(data || [])
    } catch (error) {
      console.error("Error searching quotes:", error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedBook("")
    setSelectedTag("")
    setQuotes([])
    setHasSearched(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <ProtectedRoute>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Quotes</h1>
            <p className="text-gray-600">Find quotes by text, book, or tags</p>
          </div>

          {/* Search Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Search Filters
              </CardTitle>
              <CardDescription>Use the filters below to find specific quotes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Text</label>
                  <Input
                    placeholder="Search in quote text..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Book</label>
                  <Select value={selectedBook} onValueChange={setSelectedBook}>
                    <SelectTrigger>
                      <SelectValue placeholder="All books" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All books</SelectItem>
                      {books.map((book) => (
                        <SelectItem key={book.id} value={book.id}>
                          {book.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tag</label>
                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger>
                      <SelectValue placeholder="All tags" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All tags</SelectItem>
                      {allTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleSearch} disabled={loading}>
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? "Searching..." : "Search"}
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {hasSearched && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Quote className="h-5 w-5 mr-2" />
                  Search Results
                </CardTitle>
                <CardDescription>
                  {quotes.length} quote{quotes.length !== 1 ? "s" : ""} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quotes.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No quotes found matching your search criteria</p>
                    <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {quotes.map((quote) => (
                      <div key={quote.id} className="border-l-4 border-blue-200 pl-6 py-4">
                        <blockquote className="text-lg text-gray-900 mb-4 leading-relaxed">"{quote.text}"</blockquote>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            <span className="font-medium">{quote.books.title}</span>
                          </div>
                          <span>by {quote.books.author}</span>
                          <span>•</span>
                          <span>{new Date(quote.created_at).toLocaleDateString()}</span>
                        </div>

                        {quote.tags && quote.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {quote.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
