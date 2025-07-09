"use client"

import type React from "react"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { BookOpen, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface OpenLibraryBook {
  title: string
  author_name?: string[]
  cover_i?: number
  isbn?: string[]
}

export default function AddBook() {
  const { user } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [coverUrl, setCoverUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<OpenLibraryBook[]>([])
  const [error, setError] = useState("")

  const searchOpenLibrary = async () => {
    if (!title.trim()) return

    setSearching(true)
    try {
      const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=5`)
      const data = await response.json()
      setSearchResults(data.docs || [])
    } catch (error) {
      console.error("Error searching Open Library:", error)
    } finally {
      setSearching(false)
    }
  }

  const selectBook = (book: OpenLibraryBook) => {
    setTitle(book.title)
    setAuthor(book.author_name?.[0] || "")
    if (book.cover_i) {
      setCoverUrl(`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`)
    }
    setSearchResults([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.from("books").insert([
        {
          title: title.trim(),
          author: author.trim(),
          cover_url: coverUrl.trim() || null,
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

  return (
    <ProtectedRoute>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Book</h1>
            <p className="text-gray-600">Add a book to your collection</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Book Details
              </CardTitle>
              <CardDescription>Enter book information or search using Open Library</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter book title"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={searchOpenLibrary}
                      disabled={searching || !title.trim()}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    <Label>Search Results</Label>
                    <div className="border rounded-md max-h-60 overflow-y-auto">
                      {searchResults.map((book, index) => (
                        <div
                          key={index}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onClick={() => selectBook(book)}
                        >
                          <div className="flex items-center space-x-3">
                            {book.cover_i && (
                              <Image
                                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                                alt={book.title}
                                width={40}
                                height={60}
                                className="rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium">{book.title}</p>
                              {book.author_name && <p className="text-sm text-gray-600">by {book.author_name[0]}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter author name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverUrl">Cover Image URL (Optional)</Label>
                  <Input
                    id="coverUrl"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="Enter cover image URL"
                    type="url"
                  />
                  {coverUrl && (
                    <div className="mt-2">
                      <Image
                        src={coverUrl || "/placeholder.svg"}
                        alt="Book cover preview"
                        width={120}
                        height={180}
                        className="rounded border"
                      />
                    </div>
                  )}
                </div>

                {error && <div className="text-red-600 text-sm">{error}</div>}

                <div className="flex space-x-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Adding Book..." : "Add Book"}
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
