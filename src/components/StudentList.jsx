"use client"

import StudentCard from "./StudentCard"
import { useTheme } from "../context/ThemeContext"

/**
 * Enhanced Student List Component
 *
 * Features:
 * - Grid and list view modes
 * - Responsive layout
 * - Empty states
 * - Smooth animations
 */
const StudentList = ({ students, onEdit, searchTerm, viewMode = "grid" }) => {
  const { theme } = useTheme()

  // Show empty state if no students
  if (students.length === 0) {
    return (
      <div className="text-center py-16">
        <div
          className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <svg
            className={`w-12 h-12 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>
          No students found
        </h3>
        <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {searchTerm ? (
            <>
              No students match your search for "<strong>{searchTerm}</strong>"
            </>
          ) : (
            "Get started by adding your first student to the system"
          )}
        </p>
        {searchTerm && (
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Clear Search
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Students Grid/List */}
      <div
        className={
          viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6" : "space-y-4"
        }
      >
        {students.map((student, index) => (
          <div key={student.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <StudentCard student={student} onEdit={onEdit} searchTerm={searchTerm} viewMode={viewMode} />
          </div>
        ))}
      </div>

      {/* Results Summary */}
      <div className={`text-center pt-6 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Showing <strong>{students.length}</strong> student{students.length !== 1 ? "s" : ""}
          {searchTerm && (
            <>
              {" "}
              matching "<strong>{searchTerm}</strong>"
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export default StudentList
