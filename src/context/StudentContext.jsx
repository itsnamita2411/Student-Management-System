"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
const API_URL = "https://68543ffc6a6ef0ed662e8993.mockapi.io/api/v1/students"
const initialState = {
  students: [],
  loading: false,
  error: null,
}

const actionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_STUDENTS: "SET_STUDENTS",
  ADD_STUDENT: "ADD_STUDENT",
  UPDATE_STUDENT: "UPDATE_STUDENT",
  DELETE_STUDENT: "DELETE_STUDENT",
  CLEAR_ERROR: "CLEAR_ERROR",
}

const studentReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null,
      }

    case actionTypes.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }

    case actionTypes.SET_STUDENTS:
      return {
        ...state,
        loading: false,
        error: null,
        students: action.payload,
      }

    case actionTypes.ADD_STUDENT:
      return {
        ...state,
        students: [...state.students, action.payload],
      }

    case actionTypes.UPDATE_STUDENT:
      return {
        ...state,
        students: state.students.map((student) => (student.id === action.payload.id ? action.payload : student)),
      }

    case actionTypes.DELETE_STUDENT:
      return {
        ...state,
        students: state.students.filter((student) => student.id !== action.payload),
      }

    default:
      return state
  }
}

const StudentContext = createContext()

export const StudentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(studentReducer, initialState)

  // Load initial data from API
  useEffect(() => {
    const loadStudents = async () => {
      dispatch({ type: actionTypes.SET_LOADING, payload: true })
      try {
        const response = await fetch(API_URL)
        if (!response.ok) throw new Error("Failed to fetch students")
        const students = await response.json()
        dispatch({ type: actionTypes.SET_STUDENTS, payload: students })
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
        dispatch({ type: actionTypes.SET_STUDENTS, payload: [] })
      }
    }
    loadStudents()
  }, [])

  const addStudent = async (studentData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      })
      if (!response.ok) throw new Error("Failed to add student")
      const newStudent = await response.json()
      dispatch({ type: actionTypes.ADD_STUDENT, payload: newStudent })
      return newStudent
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
      throw error
    }
  }

  const updateStudent = async (studentData) => {
    try {
      const response = await fetch(`${API_URL}/${studentData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      })
      if (!response.ok) throw new Error("Failed to update student")
      const updatedStudent = await response.json()
      dispatch({ type: actionTypes.UPDATE_STUDENT, payload: updatedStudent })
      return updatedStudent
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
      throw error
    }
  }

  const deleteStudent = async (studentId) => {
    try {
      const response = await fetch(`${API_URL}/${studentId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete student")
      dispatch({ type: actionTypes.DELETE_STUDENT, payload: studentId })
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
      throw error
    }
  }
  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR })
  }

  const value = {
    students: state.students,
    loading: state.loading,
    error: state.error,
    addStudent,
    updateStudent,
    deleteStudent,
    clearError,
  }

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
}

export const useStudents = () => {
  const context = useContext(StudentContext)

  if (!context) {
    throw new Error("useStudents must be used within a StudentProvider")
  }

  return context
}
