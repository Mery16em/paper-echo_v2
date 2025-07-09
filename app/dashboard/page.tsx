"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Quote, Plus, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Book {
  id: string
  title: string
  author: string
  cover_url: string | null
  created_at: string
}

interface QuoteWithBook {
  id: string
  text: string
  tags: string[] | null
  created_at: string
  books: {
    title: string
    author: string
  }
}

export default function Dashboard() {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [recentQuotes, setRecentQuotes] = useState<QuoteWithBook[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch recent books
      const { data: booksData } = await supabase
        .from("books")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(6)

      // Fetch recent quotes with book info
      const { data: quotesData } = await supabase
        .from("quotes")
        .select(`
          id,
          text,
          tags,
          created_at,
          books (
            title,
            author
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5)

      setBooks(booksData || [])
      setRecentQuotes(quotesData || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-gray-600">Manage your book collection and quotes</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link href="/add-book">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center p-6">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Add Book</h3>
                    <p className="text-sm text-gray-600">Add a new book to your collection</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/add-quote">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center p-6">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Quote className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Add Quote</h3>
                    <p className="text-sm text-gray-600">Save a memorable quote</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/search">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center p-6">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <Search className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Search</h3>
                    <p className="text-sm text-gray-600">Find quotes and books</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Books */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Recent Books
                </CardTitle>
                <CardDescription>Your recently added books</CardDescription>
              </CardHeader>
              <CardContent>
                {books.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No books yet</p>
                    <Link href="/add-book">
                      <Button>Add Your First Book</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {books.map((book) => (
                      <div key={book.id} className="flex items-center space-x-3">
                        <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                          {book.cover_url ? (
                            <Image
                              src={book.cover_url || "/placeholder.svg"}
                              alt={book.title}
                              width={48}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{book.title}</p>
                          <p className="text-sm text-gray-600 truncate">by {book.author}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Quotes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Quote className="h-5 w-5 mr-2" />
                  Recent Quotes
                </CardTitle>
                <CardDescription>Your recently saved quotes</CardDescription>
              </CardHeader>
              <CardContent>
                {recentQuotes.length === 0 ? (
                  <div className="text-center py-8">
                    <Quote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No quotes yet</p>
                    <Link href="/add-quote">
                      <Button>Add Your First Quote</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentQuotes.map((quote) => (
                      <div key={quote.id} className="border-l-4 border-blue-200 pl-4">
                        <p className="text-gray-900 mb-2 line-clamp-3">"{quote.text}"</p>
                        <p className="text-sm text-gray-600">
                          — {quote.books.title} by {quote.books.author}
                        </p>
                        {quote.tags && quote.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {quote.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
