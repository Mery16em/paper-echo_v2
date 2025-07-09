"use client"

import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, Home, Plus, Search, LogOut } from "lucide-react"

export function Navigation() {
  const { signOut } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Paper Echo</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button
                variant={isActive("/dashboard") ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-1"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>

            <Link href="/add-book">
              <Button
                variant={isActive("/add-book") ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Book</span>
              </Button>
            </Link>

            <Link href="/search">
              <Button
                variant={isActive("/search") ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-1"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
