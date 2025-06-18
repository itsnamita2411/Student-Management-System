"use client"

import { useMemo } from "react"
import { useTheme } from "../context/ThemeContext"

/**
 * Complete Analytics Modal Implementation
 */
const AnalyticsModal = ({ students, courses, onClose }) => {
  const { theme } = useTheme()

  const analytics = useMemo(() => {
    // Course enrollment distribution
    const courseDistribution = courses
      .map((course) => {
        const enrolledCount = students.filter((s) => s.course === course.name).length
        return {
          course: course.name,
          count: enrolledCount,
          percentage: students.length > 0 ? Math.round((enrolledCount / students.length) * 100) : 0,
        }
      })
      .sort((a, b) => b.count - a.count)

    // Email domain analysis
    const emailDomains = students.reduce((acc, student) => {
      const domain = student.email.split("@")[1]
      acc[domain] = (acc[domain] || 0) + 1
      return acc
    }, {})

    const topDomains = Object.entries(emailDomains)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Registration timeline (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentRegistrations = students.filter((student) => {
      const createdAt = new Date(student.createdAt || Date.now())
      return createdAt > thirtyDaysAgo
    })

    // Daily registrations for the last 7 days
    const dailyRegistrations = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))

      const count = students.filter((student) => {
        const createdAt = new Date(student.createdAt || Date.now())
        return createdAt >= dayStart && createdAt <= dayEnd
      }).length

      return {
        date: dayStart.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        count,
      }
    }).reverse()

    return {
      totalStudents: students.length,
      totalCourses: courses.length,
      activeCourses: courseDistribution.filter((c) => c.count > 0).length,
      courseDistribution,
      topDomains,
      recentRegistrations: recentRegistrations.length,
      dailyRegistrations,
      averageStudentsPerCourse: courses.length > 0 ? Math.round(students.length / courses.length) : 0,
    }
  }, [students, courses])

  const getMaxCount = (data) => Math.max(...data.map((item) => item.count), 1)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div
        className={`${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 transform transition-all border shadow-2xl`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Analytics Dashboard
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark" ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Key Metrics */}
          <div className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-700" : "bg-blue-50"}`}>
            <div className="text-2xl font-bold text-blue-600">{analytics.totalStudents}</div>
            <div className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Total Students</div>
          </div>

          <div className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-700" : "bg-green-50"}`}>
            <div className="text-2xl font-bold text-green-600">{analytics.activeCourses}</div>
            <div className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Active Courses</div>
          </div>

          <div className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-700" : "bg-purple-50"}`}>
            <div className="text-2xl font-bold text-purple-600">{analytics.recentRegistrations}</div>
            <div className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>New (30 days)</div>
          </div>

          <div className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-700" : "bg-orange-50"}`}>
            <div className="text-2xl font-bold text-orange-600">{analytics.averageStudentsPerCourse}</div>
            <div className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Avg per Course</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Distribution */}
          <div className={`p-6 rounded-xl ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
            <h4 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Course Enrollment Distribution
            </h4>
            <div className="space-y-3">
              {analytics.courseDistribution.map((course, index) => (
                <div key={course.course} className="flex items-center">
                  <div className={`w-24 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"} truncate`}>
                    {course.course}
                  </div>
                  <div className="flex-1 mx-3">
                    <div className={`h-2 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"}`}>
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                        style={{ width: `${course.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className={`w-16 text-sm text-right ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    {course.count} ({course.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Timeline */}
          <div className={`p-6 rounded-xl ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
            <h4 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Daily Registrations (Last 7 Days)
            </h4>
            <div className="space-y-3">
              {analytics.dailyRegistrations.map((day, index) => {
                const maxCount = getMaxCount(analytics.dailyRegistrations)
                const percentage = maxCount > 0 ? (day.count / maxCount) * 100 : 0

                return (
                  <div key={index} className="flex items-center">
                    <div className={`w-20 text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      {day.date}
                    </div>
                    <div className="flex-1 mx-3">
                      <div className={`h-2 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"}`}>
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-600"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className={`w-8 text-sm text-right ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      {day.count}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Email Domains */}
          <div className={`p-6 rounded-xl ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
            <h4 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Top Email Domains
            </h4>
            <div className="space-y-3">
              {analytics.topDomains.map((domain, index) => {
                const maxCount = getMaxCount(analytics.topDomains)
                const percentage = maxCount > 0 ? (domain.count / maxCount) * 100 : 0

                return (
                  <div key={domain.domain} className="flex items-center">
                    <div className={`w-24 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"} truncate`}>
                      {domain.domain}
                    </div>
                    <div className="flex-1 mx-3">
                      <div className={`h-2 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"}`}>
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-red-600"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className={`w-8 text-sm text-right ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      {domain.count}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Summary Insights */}
          <div className={`p-6 rounded-xl ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
            <h4 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Key Insights
            </h4>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-600" : "bg-white"}`}>
                <div className={`text-sm font-medium ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                  Most Popular Course
                </div>
                <div className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {analytics.courseDistribution[0]?.course || "No courses"}
                </div>
                <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  {analytics.courseDistribution[0]?.count || 0} students enrolled
                </div>
              </div>

              <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-600" : "bg-white"}`}>
                <div className={`text-sm font-medium ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                  Growth Rate
                </div>
                <div className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {analytics.recentRegistrations > 0 ? "+" : ""}
                  {analytics.recentRegistrations}
                </div>
                <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  New students this month
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
          >
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsModal
