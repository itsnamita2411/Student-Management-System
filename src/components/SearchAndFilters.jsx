"use client"

import { useTheme } from "../context/ThemeContext"

/**
 * Enhanced Search and Filter Component
 */
const SearchAndFilters = ({
  searchTerm,
  onSearchChange,
  selectedCourse,
  onCourseChange,
  courses,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  viewMode,
  onViewModeChange,
}) => {
  const { theme } = useTheme()

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "course", label: "Course" },
    { value: "createdAt", label: "Date Added" },
  ]

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      } rounded-2xl p-6 border shadow-lg backdrop-blur-sm`}
    >
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-400"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`block w-full pl-12 pr-12 py-4 border rounded-xl text-lg leading-5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
            }`}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors ${
                theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
        {/* Left Side - Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Course Filter */}
          <div className="flex items-center space-x-3">
            <label
              className={`text-sm font-medium whitespace-nowrap ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              Course:
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => onCourseChange(e.target.value)}
              className={`px-4 py-2 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[150px] ${
                theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-3">
            <label
              className={`text-sm font-medium whitespace-nowrap ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              Sort by:
            </label>
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value)}
                className={`px-4 py-2 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-900"
                }`}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
                className={`p-2 border rounded-lg transition-all duration-200 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
                title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
              >
                <svg
                  className={`w-4 h-4 transform transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - View Mode Toggle */}
        <div className="flex items-center space-x-3">
          <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>View:</span>
          <div
            className={`flex rounded-lg border ${theme === "dark" ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"} p-1`}
          >
            <button
              onClick={() => onViewModeChange("grid")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                viewMode === "grid"
                  ? theme === "dark"
                    ? "bg-gray-600 text-white shadow-sm"
                    : "bg-white text-gray-900 shadow-sm"
                  : theme === "dark"
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span>Grid</span>
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                viewMode === "list"
                  ? theme === "dark"
                    ? "bg-gray-600 text-white shadow-sm"
                    : "bg-white text-gray-900 shadow-sm"
                  : theme === "dark"
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || selectedCourse) && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Active filters:
          </span>
          {searchTerm && (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                theme === "dark"
                  ? "bg-blue-900/30 text-blue-300 border border-blue-800"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              Search: "{searchTerm}"
              <button onClick={() => onSearchChange("")} className="ml-2 hover:text-blue-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {selectedCourse && (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                theme === "dark"
                  ? "bg-green-900/30 text-green-300 border border-green-800"
                  : "bg-green-100 text-green-800 border border-green-200"
              }`}
            >
              Course: {selectedCourse}
              <button onClick={() => onCourseChange("")} className="ml-2 hover:text-green-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchAndFilters
