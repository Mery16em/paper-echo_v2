"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Quote, Tag, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface Book {
  id: string
  title: string
  author: string
}

export default function AddQuote() {
  const { user } = useAuth()
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBookId, setSelectedBookId] = useState("")
  const [quoteText, setQuoteText] = useState("")
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [suggestingTags, setSuggestingTags] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      fetchBooks()
    }
  }, [user])

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from("books")
        .select("id, title, author")
        .eq("user_id", user?.id)
        .order("title")

      if (error) throw error
      setBooks(data || [])
    } catch (error) {
      console.error("Error fetching books:", error)
    } finally {
      setLoadingBooks(false)
    }
  }

  const suggestTags = async () => {
    if (!quoteText.trim()) return

    setSuggestingTags(true)
    try {
      // This would integrate with OpenAI API
      // For now, we'll use a simple keyword extraction
      const words = quoteText.toLowerCase().split(/\s+/)
      const commonWords = [
        "the",
        "a",
        "an",
        "and",
        "or",
        "but",
        "in",
        "on",
        "at",
        "to",
        "for",
        "of",
        "with",
        "by",
        "is",
        "are",
        "was",
        "were",
        "be",
        "been",
        "have",
        "has",
        "had",
        "do",
        "does",
        "did",
        "will",
        "would",
        "could",
        "should",
        "may",
        "might",
        "can",
        "must",
        "shall",
        "this",
        "that",
        "these",
        "those",
        "i",
        "you",
        "he",
        "she",
        "it",
        "we",
        "they",
        "me",
        "him",
        "her",
        "us",
        "them",
      ]

      const keywords = words
        .filter((word) => word.length > 3 && !commonWords.includes(word))
        .slice(0, 5)
        .join(", ")

      if (keywords) {
        setTags(keywords)
      }
    } catch (error) {
      console.error("Error suggesting tags:", error)
    } finally {
      setSuggestingTags(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError("")

    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const { error } = await supabase.from("quotes").insert([
        {
          book_id: selectedBookId,
          text: quoteText.trim(),
          tags: tagsArray.length > 0 ? tagsArray : null,
          user_id: user.id,
        },
      ])

      if (error) throw error

      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loadingBooks) {
    return (
      <ProtectedRoute>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </ProtectedRoute>
    )
  }

  if (books.length === 0) {
    return (
      <ProtectedRoute>
        <Navigation />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardContent className="text-center py-12">
                <Quote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Books Found</h2>
                <p className="text-gray-600 mb-6">You need to add books before you can save quotes.</p>
                <Button onClick={() => router.push("/add-book")}>Add Your First Book</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Quote</h1>
            <p className="text-gray-600">Save a memorable quote from your books</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Quote className="h-5 w-5 mr-2" />
                Quote Details
              </CardTitle>
              <CardDescription>Add a quote and organize it with tags</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="book">Book</Label>
                  <Select value={selectedBookId} onValueChange={setSelectedBookId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a book" />
                    </SelectTrigger>
                    <SelectContent>
                      {books.map((book) => (
                        <SelectItem key={book.id} value={book.id}>
                          {book.title} by {book.author}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quote">Quote</Label>
                  <Textarea
                    id="quote"
                    value={quoteText}
                    onChange={(e) => setQuoteText(e.target.value)}
                    placeholder="Enter the quote text..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tags">Tags (Optional)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={suggestTags}
                      disabled={suggestingTags || !quoteText.trim()}
                      className="flex items-center space-x-1 bg-transparent"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>{suggestingTags ? "Suggesting..." : "Suggest Tags"}</span>
                    </Button>
                  </div>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Enter tags separated by commas (e.g., love, wisdom, life)"
                  />
                  <p className="text-sm text-gray-500">
                    <Tag className="h-3 w-3 inline mr-1" />
                    Separate multiple tags with commas
                  </p>
                </div>

                {error && <div className="text-red-600 text-sm">{error}</div>}

                <div className="flex space-x-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving Quote..." : "Save Quote"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
