/**
 * Validation Utilities
 *
 * This demonstrates:
 * - Pure functions for validation logic
 * - Regular expressions for email validation
 * - Object manipulation and validation patterns
 * - Separation of concerns (validation logic separate from components)
 */

/**
 * Email validation using regex
 * Demonstrates regular expressions and string validation
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Name validation
 * Demonstrates string validation and business rules
 */
const isValidName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 50
}

/**
 * Course validation
 * Demonstrates required field validation
 */
const isValidCourse = (course) => {
  return course && course.trim().length > 0
}

/**
 * Main validation function for student data
 * Demonstrates object validation and error collection
 *
 * @param {Object} studentData - The student data to validate
 * @returns {Object} - Object containing validation errors
 */
export const validateStudent = (studentData) => {
  const errors = {}

  // Name validation
  if (!studentData.name || !studentData.name.trim()) {
    errors.name = "Name is required"
  } else if (!isValidName(studentData.name)) {
    errors.name = "Name must be between 2 and 50 characters"
  }

  // Email validation
  if (!studentData.email || !studentData.email.trim()) {
    errors.email = "Email is required"
  } else if (!isValidEmail(studentData.email)) {
    errors.email = "Please enter a valid email address"
  }

  // Course validation
  if (!studentData.course || !studentData.course.trim()) {
    errors.course = "Please select a course"
  }

  return errors
}

/**
 * Check if student data is valid
 * Demonstrates validation helper functions
 */
export const isStudentValid = (studentData) => {
  const errors = validateStudent(studentData)
  return Object.keys(errors).length === 0
}

/**
 * Sanitize student data
 * Demonstrates data cleaning and sanitization
 */
export const sanitizeStudentData = (studentData) => {
  return {
    ...studentData,
    name: studentData.name?.trim() || "",
    email: studentData.email?.trim().toLowerCase() || "",
    course: studentData.course?.trim() || "",
    profileImage: studentData.profileImage?.trim() || "",
  }
}
