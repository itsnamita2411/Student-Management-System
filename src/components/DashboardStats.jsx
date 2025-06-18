"use client"

import { useMemo } from "react"
import { useTheme } from "../context/ThemeContext"

/**
 * Enhanced Dashboard Statistics Component
 */
const DashboardStats = ({ students, courses, filteredCount }) => {
  const { theme } = useTheme()

  const stats = useMemo(() => {
    const totalStudents = students.length
    const activeCourses = new Set(students.map((s) => s.course)).size
    const recentStudents = students.filter((s) => {
      const createdAt = new Date(s.createdAt || Date.now())
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return createdAt > weekAgo
    }).length

    const completionRate = courses.length > 0 ? Math.round((activeCourses / courses.length) * 100) : 0

    return [
      {
        title: "Total Students",
        value: totalStudents,
        change: recentStudents > 0 ? `+${recentStudents} this week` : "No new students this week",
        icon: "users",
        color: "blue",
        trend: recentStudents > 0 ? "up" : "neutral",
        bgGradient: "from-blue-500 to-blue-600",
      },
      {
        title: "Active Courses",
        value: activeCourses,
        change: `${courses.length} total available`,
        icon: "book",
        color: "green",
        trend: activeCourses > 0 ? "up" : "neutral",
        bgGradient: "from-emerald-500 to-emerald-600",
      },
      {
        title: "Filtered Results",
        value: filteredCount,
        change:
          filteredCount === totalStudents
            ? "Showing all students"
            : `${totalStudents - filteredCount} hidden by filters`,
        icon: "filter",
        color: "purple",
        trend: "neutral",
        bgGradient: "from-purple-500 to-purple-600",
      },
      {
        title: "Course Coverage",
        value: completionRate,
        change: "Percentage of courses with students",
        icon: "chart",
        color: "orange",
        trend: completionRate > 50 ? "up" : "neutral",
        suffix: "%",
        bgGradient: "from-orange-500 to-orange-600",
      },
    ]
  }, [students, courses, filteredCount])

  const getIcon = (iconName) => {
    const icons = {
      users: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      ),
      book: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      ),
      filter: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
        />
      ),
      chart: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      ),
    }
    return icons[iconName]
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.title}
          className={`relative overflow-hidden ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          } rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Background Gradient Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
          ></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {getIcon(stat.icon)}
                </svg>
              </div>
              {stat.trend === "up" && (
                <div className="flex items-center text-emerald-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3
                className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} uppercase tracking-wide`}
              >
                {stat.title}
              </h3>
              <div className="flex items-baseline space-x-2">
                <span
                  className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${stat.bgGradient} group-hover:bg-clip-text transition-all duration-300`}
                >
                  {stat.value.toLocaleString()}
                </span>
                {stat.suffix && (
                  <span className={`text-lg font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {stat.suffix}
                  </span>
                )}
              </div>
              <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"} leading-relaxed`}>
                {stat.change}
              </p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-10 -translate-y-10">
            <div className={`w-full h-full rounded-full bg-gradient-to-br ${stat.bgGradient} opacity-10`}></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardStats
