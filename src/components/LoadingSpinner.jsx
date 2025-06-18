/**
 * Enhanced Loading Spinner Component
 */
const LoadingSpinner = ({ size = "large", message = "Loading..." }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        {/* Main Spinner */}
        <div className="relative mb-8">
          <div
            className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 mx-auto`}
          ></div>

          {/* Outer Ring */}
          <div
            className={`${sizeClasses[size]} absolute top-0 left-1/2 transform -translate-x-1/2 rounded-full border-4 border-indigo-100 animate-pulse`}
          ></div>
        </div>

        {/* Loading Message */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 animate-pulse">{message}</h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">Please wait while we prepare your dashboard...</p>

        {/* Loading Dots Animation */}
        <div className="flex space-x-2 justify-center">
          <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner
