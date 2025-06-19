"use client"

import { useState, useEffect } from "react"

const API_URL = "https://68543ffc6a6ef0ed662e8993.mockapi.io/api/v1/courses";
export const useCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(API_URL)
        if (!response.ok) throw new Error("Failed to fetch courses")
        const data = await response.json()
        setCourses(data)
      } catch (err) {
        setError(err.message)
        setCourses([])
      } finally {
        setLoading(false)
      }
    }
    loadCourses()
  }, [])

  const retryCourses = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error("Failed to fetch courses")
      const data = await response.json()
      setCourses(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    courses,
    loading,
    error,
    retryCourses,
  }
}