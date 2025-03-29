"use client"

import { useState, useEffect } from "react"
import { AuthClient } from "@dfinity/auth-client"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import Explore from "./pages/Explore"
import SearchPage from "./pages/SearchPage"
import CoursePage from "./pages/CoursePage"
import NotFound from "./pages/NotFound"
import Header from "./components/Header"
import AdminLayout from "./pages/AdminLayout"
import Dashboard from "./pages/Dashboard"
import AdminUsers from "./pages/AdminUsers"
import AdminCourses from "./pages/AdminCourses"
import AdminModules from "./pages/AdminModules"
import NewCourse from "./pages/NewCourse"
import MyCoursesPage from "./pages/MyCoursesPage"
import LearnLayout from "./pages/LearnLayout"
import CourseLayout from "./pages/CourseLayout"
import LessonPage from "./pages/LessonPage"
import Admin from "./pages/Admin"

const network = import.meta.env.DFX_NETWORK
const identityProvider =
  network === "ic"
    ? "https://identity.ic0.app" // Mainnet
    : "http://be2us-64aaa-aaaaa-qaabq-cai.localhost:4943" // Local

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authClient, setAuthClient] = useState<AuthClient | null>(null)

  useEffect(() => {
    async function initAuth() {
      const client = await AuthClient.create()
      setAuthClient(client)
      setIsAuthenticated(await client.isAuthenticated())
    }
    initAuth()
  }, [])

  const login = async () => {
    if (!authClient) return
    await authClient.login({
      identityProvider,
      onSuccess: async () => {
        setIsAuthenticated(await authClient.isAuthenticated())
      },
    })
  }

  const logout = async () => {
    if (!authClient) return
    await authClient.logout()
    setIsAuthenticated(false)
  }

  return (
    <Router>
      <MainContent isAuthenticated={isAuthenticated} login={login} logout={logout} />
    </Router>
  )
}

function MainContent({
  isAuthenticated,
  login,
  logout,
}: { isAuthenticated: boolean; login: () => void; logout: () => void }) {
  const location = useLocation()
  const showNavbar =
    location.pathname === "/explore" ||
    location.pathname.startsWith("/search") ||
    location.pathname.startsWith("/course") ||
    location.pathname === "/my-courses"

  return (
    <>
      {showNavbar && <Header isAuthenticated={isAuthenticated} login={login} logout={logout} />}
      <div>
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} login={login} />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/search/:term" element={<SearchPage />} />
          <Route path="/course/:slug" element={<CoursePage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />

          <Route path="/learn" element={<LearnLayout />}>
            <Route path=":slug" element={<CourseLayout isAuthenticated={isAuthenticated} login={login} />}>
              <Route path=":lessonId" element={<LessonPage />} />
            </Route>
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Admin />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="courses/new" element={<NewCourse />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="courses/:slug" element={<AdminModules />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App

