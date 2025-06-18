import { StudentProvider } from "./context/StudentContext"
import { ThemeProvider } from "./context/ThemeContext"
import StudentDashboard from "./components/StudentDashboard"
import "./App.css"

/**
 * Main App Component with Theme Support
 *
 * This component demonstrates:
 * - Multiple context providers composition
 * - Theme management integration
 * - Clean architecture patterns
 */
function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <StudentProvider>
          <StudentDashboard />
        </StudentProvider>
      </ThemeProvider>
    </div>
  )
}

export default App
