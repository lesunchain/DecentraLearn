"use client"

import { Link } from "react-router-dom";
import { useState } from 'react'
import { BookOpen, BookMarkedIcon, UserIcon } from 'lucide-react'
import { Button } from './ui/button'
import SearchInput from './SearchInput'

interface NavbarProps {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

function Header({ isAuthenticated, login, logout }: NavbarProps): JSX.Element {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className='sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <Link
              to='/'
              className='flex items-center space-x-2 hover:opacity-90 transition-opacity'>
              <BookOpen className="w-6 h-6 text-primary" />
              <span className='text-xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent'>DecentraLearn</span>
            </Link>
            <SearchInput />
          </div>
          <div className='flex items-center space-x-2 md:space-x-4'>
            {isAuthenticated && (
              <nav>
                <Link
                  to="/my-courses"
                  className="flex space-x-2 items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors md:border md:border-border md:rounded-md md:px-4 md:py-2"
                >
                  <BookMarkedIcon className="h-4 w-4" />
                  <span className="hidden md:block">My Courses</span>
                </Link>
              </nav>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <UserIcon className="h-5 w-5" />
                </Button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border z-50">
                    <div className="py-1">
                      <Link
                        to="/admin"
                        className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        <span>Go to Admin Dashboard</span>
                      </Link>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground"
                        onClick={() => { logout() }}
                      >
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button className='text-white' variant='outline' onClick={() => { login() }}>Sign In</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header