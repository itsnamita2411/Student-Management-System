"use client"

import { useState } from "react"
import { useTheme } from "../context/ThemeContext"

/**
 * Complete Export Modal Implementation
 */
const ExportModal = ({ students, onClose, onSuccess }) => {
  const { theme } = useTheme()
  const [exportFormat, setExportFormat] = useState("csv")
  const [exportFields, setExportFields] = useState({
    name: true,
    email: true,
    course: true,
    createdAt: true,
    profileImage: false,
  })
  const [isExporting, setIsExporting] = useState(false)

  const handleFieldChange = (field) => {
    setExportFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const exportToCSV = (data, fields) => {
    const headers = Object.keys(fields).filter((key) => fields[key])
    const csvContent = [
      headers.join(","),
      ...data.map((student) =>
        headers
          .map((header) => {
            const value = student[header] || ""
            // Escape commas and quotes in CSV
            return typeof value === "string" && (value.includes(",") || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value
          })
          .join(","),
      ),
    ].join("\n")

    return csvContent
  }

  const exportToJSON = (data, fields) => {
    const filteredData = data.map((student) => {
      const filtered = {}
      Object.keys(fields).forEach((key) => {
        if (fields[key]) {
          filtered[key] = student[key]
        }
      })
      return filtered
    })
    return JSON.stringify(filteredData, null, 2)
  }

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const selectedFields = Object.keys(exportFields).filter((key) => exportFields[key])

      if (selectedFields.length === 0) {
        throw new Error("Please select at least one field to export")
      }

      let content, filename, mimeType

      if (exportFormat === "csv") {
        content = exportToCSV(students, exportFields)
        filename = `students_export_${new Date().toISOString().split("T")[0]}.csv`
        mimeType = "text/csv"
      } else if (exportFormat === "json") {
        content = exportToJSON(students, exportFields)
        filename = `students_export_${new Date().toISOString().split("T")[0]}.json`
        mimeType = "application/json"
      }

      downloadFile(content, filename, mimeType)
      onSuccess(`Successfully exported ${students.length} students as ${exportFormat.toUpperCase()}`)
    } catch (error) {
      console.error("Export error:", error)
      onSuccess(error.message || "Export failed. Please try again.", "error")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div
        className={`${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } rounded-2xl max-w-md w-full p-6 transform transition-all border shadow-2xl`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Export Student Data
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark" ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Export Format */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Export Format
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="csv"
                  checked={exportFormat === "csv"}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="mr-3 text-indigo-600"
                />
                <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                  CSV (Comma Separated Values)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="json"
                  checked={exportFormat === "json"}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="mr-3 text-indigo-600"
                />
                <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                  JSON (JavaScript Object Notation)
                </span>
              </label>
            </div>
          </div>

          {/* Fields Selection */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Fields to Export
            </label>
            <div className="space-y-2">
              {Object.entries(exportFields).map(([field, checked]) => (
                <label key={field} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleFieldChange(field)}
                    className="mr-3 text-indigo-600"
                  />
                  <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Info */}
          <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
            <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              <strong>{students.length}</strong> students will be exported with{" "}
              <strong>{Object.values(exportFields).filter(Boolean).length}</strong> fields each.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              disabled={isExporting || Object.values(exportFields).every((v) => !v)}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
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
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export Data
                </>
              )}
            </button>

            <button
              onClick={onClose}
              disabled={isExporting}
              className={`px-6 py-3 border rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              } disabled:opacity-50`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportModal
