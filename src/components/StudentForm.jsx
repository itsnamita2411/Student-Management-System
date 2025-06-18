"use client"

import { useState, useEffect, useMemo } from "react"
import { useStudents } from "../context/StudentContext"
import { useTheme } from "../context/ThemeContext"
import { validateStudent } from "../utils/validation"

/**
 * Enhanced Student Form Component
 *
 * Features:
 * - Modern form design
 * - Real-time validation
 * - Better UX with loading states
 * - Improved accessibility
 * - Dark mode support
 */
const StudentForm = ({ courses, editingStudent, onSuccess, onCancel }) => {
  const { addStudent, updateStudent } = useStudents()
  const { theme } = useTheme()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    profileImage: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || "",
        email: editingStudent.email || "",
        course: editingStudent.course || "",
        profileImage: editingStudent.profileImage || "",
      })
    }
  }, [editingStudent])

  const validationErrors = useMemo(() => {
    return validateStudent(formData)
  }, [formData])

  useEffect(() => {
    const newErrors = {}
    Object.keys(validationErrors).forEach((key) => {
      if (touched[key]) {
        newErrors[key] = validationErrors[key]
      }
    })
    setErrors(newErrors)
  }, [validationErrors, touched])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
  }

  const generateRandomImage = async () => {
    try {
      const imageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
      setFormData((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }))
    } catch (error) {
      console.error("Error generating image:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})
    setTouched(allTouched)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const studentData = {
        ...formData,
        id: editingStudent ? editingStudent.id : Date.now(),
        profileImage: formData.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
      }

      if (editingStudent) {
        await updateStudent(studentData)
        onSuccess("Student updated successfully!")
      } else {
        await addStudent(studentData)
        onSuccess("Student added successfully!")
      }

      setFormData({
        name: "",
        email: "",
        course: "",
        profileImage: "",
      })
      setTouched({})
      setErrors({})
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrors({ submit: "Failed to save student. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
        >
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
            errors.name
              ? "border-red-500 focus:ring-red-500"
              : theme === "dark"
                ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
          }`}
          placeholder="Enter student's full name"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
        >
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
            errors.email
              ? "border-red-500 focus:ring-red-500"
              : theme === "dark"
                ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
          }`}
          placeholder="Enter email address"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {errors.email}
          </p>
        )}
      </div>

      {/* Course Selection */}
      <div>
        <label
          htmlFor="course"
          className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
        >
          Enrolled Course *
        </label>
        <select
          id="course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
            errors.course
              ? "border-red-500 focus:ring-red-500"
              : theme === "dark"
                ? "border-gray-600 bg-gray-700 text-white"
                : "border-gray-300 bg-white text-gray-900"
          }`}
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.name}>
              {course.name}
            </option>
          ))}
        </select>
        {errors.course && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {errors.course}
          </p>
        )}
      </div>

      {/* Profile Image */}
      <div>
        <label
          htmlFor="profileImage"
          className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
        >
          Profile Image URL
        </label>
        <div className="flex space-x-3">
          <input
            type="url"
            id="profileImage"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`flex-1 px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
              theme === "dark"
                ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
            }`}
            placeholder="Enter image URL or generate random"
          />
          <button
            type="button"
            onClick={generateRandomImage}
            className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
            }`}
          >
            Random
          </button>
        </div>
        {formData.profileImage && (
          <div className="mt-3 flex items-center space-x-3">
            <img
              src={formData.profileImage || "/placeholder.svg"}
              alt="Profile preview"
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || "default"}`
              }}
            />
            <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Preview</span>
          </div>
        )}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div
          className={`p-4 rounded-xl border ${
            theme === "dark" ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"
          }`}
        >
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {errors.submit}
          </p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || Object.keys(validationErrors).length > 0}
          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center transform hover:scale-105 shadow-lg"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {editingStudent ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {editingStudent ? "Update Student" : "Add Student"}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className={`px-6 py-3 border rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
            theme === "dark"
              ? "border-gray-600 text-gray-300 hover:bg-gray-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default StudentForm
