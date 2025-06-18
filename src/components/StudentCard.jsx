"use client"

import { useState } from "react"
import { useStudents } from "../context/StudentContext"
import { useTheme } from "../context/ThemeContext"

/**
 * Enhanced Student Card Component
 *
 * Features:
 * - Modern card design
 * - Hover animations
 * - Grid and list view support
 * - Improved accessibility
 * - Better mobile experience
 */
const StudentCard = ({ student, onEdit, searchTerm, viewMode = "grid" }) => {
  const { deleteStudent } = useStudents()
  const { theme } = useTheme()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      await deleteStudent(student.id)
    } catch (error) {
      console.error("Error deleting student:", error)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const highlightText = (text, highlight) => {
    if (!highlight) return text

    const parts = text.split(new RegExp(`(${highlight})`, "gi"))
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  if (viewMode === "list") {
    return (
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
            : "bg-white border-gray-200 hover:bg-gray-50"
        } rounded-xl border transition-all duration-300 hover:shadow-lg`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img
                  src={student.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                  alt={`${student.name}'s profile`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  onError={(e) => {
                    e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`
                  }}
                />
              </div>

              {/* Student Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <h3 className={`text-lg font-semibold truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {highlightText(student.name, searchTerm)}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    {student.course}
                  </span>
                </div>
                <p className={`text-sm truncate mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {highlightText(student.email, searchTerm)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onEdit(student)}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
                title="Edit student"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-105 bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400"
                title="Delete student"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view (default)
  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } rounded-2xl border shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group`}
    >
      {/* Card Header with Gradient */}
      <div className="h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-90 text-gray-800">
            {student.course}
          </span>
        </div>
      </div>

      {/* Profile Section */}
      <div className="relative px-6 pb-6">
        {/* Profile Image */}
        <div className="flex justify-center -mt-12 mb-4">
          <img
            src={student.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
            alt={`${student.name}'s profile`}
            className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            onError={(e) => {
              e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`
            }}
          />
        </div>

        {/* Student Info */}
        <div className="text-center mb-6">
          <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {highlightText(student.name, searchTerm)}
          </h3>
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} break-all`}>
            {highlightText(student.email, searchTerm)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => onEdit(student)}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className={`px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg ${
              theme === "dark"
                ? "bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-800"
                : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div
            className={`${
              theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            } rounded-2xl max-w-md w-full p-6 transform transition-all border shadow-2xl`}
          >
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Delete Student
                </h3>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Are you sure you want to delete <strong>{student.name}</strong>? All associated data will be permanently
              removed.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Student
                  </>
                )}
              </button>

              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                } disabled:opacity-50`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentCard
