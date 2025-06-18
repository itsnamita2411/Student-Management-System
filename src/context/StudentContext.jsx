"use client"

import { createContext, useContext, useReducer, useEffect } from "react"

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

  // Load initial data
  useEffect(() => {
    const loadStudents = async () => {
      dispatch({ type: actionTypes.SET_LOADING, payload: true })

      try {
        // Shorter delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 600))

        const savedStudents = localStorage.getItem("students")
        let students = []

        if (savedStudents) {
          students = JSON.parse(savedStudents)
        } else {
          // Initialize with sample data
          students = [
            {
              id: 1,
              name: "Alice Johnson",
              email: "alice.johnson@email.com",
              course: "React In Depth",
              profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 2,
              name: "Bob Smith",
              email: "bob.smith@gmail.com",
              course: "JavaScript Pro",
              profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 3,
              name: "Carol Davis",
              email: "carol.davis@company.com",
              course: "CSS Mastery",
              profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 4,
              name: "David Wilson",
              email: "david.wilson@university.edu",
              course: "Python Programming",
              profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 5,
              name: "Emma Brown",
              email: "emma.brown@startup.io",
              course: "Web Design",
              profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ]
          localStorage.setItem("students", JSON.stringify(students))
        }

        dispatch({ type: actionTypes.SET_STUDENTS, payload: students })
      } catch (error) {
        console.error("Failed to load students:", error)
        // Even on error, provide empty array so app doesn't crash
        dispatch({ type: actionTypes.SET_STUDENTS, payload: [] })
      }
    }

    loadStudents()
  }, [])

  // Save to localStorage whenever students change
  useEffect(() => {
    if (state.students.length > 0) {
      localStorage.setItem("students", JSON.stringify(state.students))
    }
  }, [state.students])

  const addStudent = async (studentData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newStudent = {
        ...studentData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      }

      dispatch({ type: actionTypes.ADD_STUDENT, payload: newStudent })
      return newStudent
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: "Failed to add student" })
      throw error
    }
  }

  const updateStudent = async (studentData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedStudent = {
        ...studentData,
        updatedAt: new Date().toISOString(),
      }

      dispatch({ type: actionTypes.UPDATE_STUDENT, payload: updatedStudent })
      return updatedStudent
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: "Failed to update student" })
      throw error
    }
  }

  const deleteStudent = async (studentId) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      dispatch({ type: actionTypes.DELETE_STUDENT, payload: studentId })
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: "Failed to delete student" })
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
