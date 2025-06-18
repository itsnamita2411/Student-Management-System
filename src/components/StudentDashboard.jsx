"use client"

import { useState, useMemo } from "react"
import { useStudents } from "../context/StudentContext"
import { useTheme } from "../context/ThemeContext"
import StudentList from "./StudentList"
import StudentForm from "./StudentForm"
import LoadingSpinner from "./LoadingSpinner"
import ErrorMessage from "./ErrorMessage"
import DashboardStats from "./DashboardStats"
import SearchAndFilters from "./SearchAndFilters"
import Header from "./Header"
import ExportModal from "./ExportModal"
import AnalyticsModal from "./AnalyticsModal"
import { useCourses } from "../hooks/useCourses"

/**
 * Enhanced Dashboard Component without Sidebar
 */
const StudentDashboard = () => {
  const { students, loading: studentsLoading, error: studentsError } = useStudents()
  const { courses, loading: coursesLoading, error: coursesError } = useCourses()
  const { theme } = useTheme()

  // UI State
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [notification, setNotification] = useState("")
  const [showExportModal, setShowExportModal] = useState(false)
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)

  // Filter and Search State
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [viewMode, setViewMode] = useState("grid")

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(""), 4000)
  }

  const filteredAndSortedStudents = useMemo(() => {
    const filtered = students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCourse = !selectedCourse || student.course === selectedCourse

      return matchesSearch && matchesCourse
    })

    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [students, searchTerm, selectedCourse, sortBy, sortOrder])

  const handleFormSuccess = (message) => {
    setShowForm(false)
    setEditingStudent(null)
    showNotification(message, "success")
  }

  const handleEditStudent = (student) => {
    setEditingStudent(student)
    setShowForm(true)
  }

  const handleAddStudent = () => {
    setEditingStudent(null)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingStudent(null)
  }

  if (studentsLoading || coursesLoading) {
    return <LoadingSpinner />
  }

  // Only show error if both students and courses fail AND we have no data
  if (studentsError && students.length === 0) {
    return <ErrorMessage message={studentsError} />
  }

  // If courses error but we have courses data, just log it and continue
  if (coursesError && courses.length === 0) {
    console.warn("Courses loading issue:", coursesError)
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      }`}
    >
      <Header onAddStudent={handleAddStudent} />

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 transform transition-all duration-300 animate-slide-in ${
            notification.type === "success" ? "bg-emerald-500" : "bg-red-500"
          } text-white px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm`}
        >
          <div className="flex items-center space-x-3">
            {notification.type === "success" ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <main className="w-full">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <DashboardStats students={students} courses={courses} filteredCount={filteredAndSortedStudents.length} />

          {/* Student Form Section */}
          {showForm && (
            <div
              className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-xl border ${
                theme === "dark" ? "border-gray-700" : "border-gray-100"
              } overflow-hidden animate-fade-in`}
            >
              <div className={`p-6 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{editingStudent ? "Edit Student" : "Add New Student"}</h2>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {editingStudent ? "Update student information" : "Fill in the details to add a new student"}
                    </p>
                  </div>
                  <button
                    onClick={handleCancelForm}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === "dark" ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <StudentForm
                  courses={courses}
                  editingStudent={editingStudent}
                  onSuccess={handleFormSuccess}
                  onCancel={handleCancelForm}
                />
              </div>
            </div>
          )}

          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCourse={selectedCourse}
            onCourseChange={setSelectedCourse}
            courses={courses}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <div
            className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-xl border ${
              theme === "dark" ? "border-gray-700" : "border-gray-100"
            } overflow-hidden`}
          >
            <div className={`p-6 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Students ({filteredAndSortedStudents.length})</h2>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {searchTerm || selectedCourse
                      ? `Filtered from ${students.length} total students`
                      : "Manage your student database"}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                  <button
                    onClick={() => setShowExportModal(true)}
                    className={`inline-flex items-center px-4 py-2 border rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                      theme === "dark"
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Export
                  </button>
                  <button
                    onClick={() => setShowAnalyticsModal(true)}
                    className={`inline-flex items-center px-4 py-2 border rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                      theme === "dark"
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Analytics
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <StudentList
                students={filteredAndSortedStudents}
                onEdit={handleEditStudent}
                searchTerm={searchTerm}
                viewMode={viewMode}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showExportModal && (
        <ExportModal
          students={filteredAndSortedStudents}
          onClose={() => setShowExportModal(false)}
          onSuccess={(message) => {
            setShowExportModal(false)
            showNotification(message, "success")
          }}
        />
      )}

      {showAnalyticsModal && (
        <AnalyticsModal students={students} courses={courses} onClose={() => setShowAnalyticsModal(false)} />
      )}
    </div>
  )
}

export default StudentDashboard
