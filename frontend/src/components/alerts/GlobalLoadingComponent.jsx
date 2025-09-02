import { createContext, useContext, useState } from "react";
import { Loader2, BookOpen, Brain, Target, Sparkles } from "lucide-react";

// Create Loading Context
const LoadingContext = createContext();

// Loading Provider Component
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  const showLoading = (message = "Loading...") => {
    setLoadingMessage(message);
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
    setLoadingMessage("Loading...");
  };

  return (
    <LoadingContext.Provider
      value={{ loading, loadingMessage, showLoading, hideLoading }}
    >
      {children}
      {loading && <GlobalLoadingOverlay message={loadingMessage} />}
    </LoadingContext.Provider>
  );
};

// Hook to use loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

// Global Loading Overlay Component
const GlobalLoadingOverlay = ({ message }) => {
  const loadingMessages = [
    { icon: Brain, text: "Analyzing your learning patterns..." },
    { icon: Target, text: "Optimizing your study schedule..." },
    { icon: BookOpen, text: "Preparing personalized content..." },
    { icon: Sparkles, text: "Creating magic for your success..." },
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = loadingMessages[currentMessage].icon;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg/90 dark:bg-bg-dark/90 backdrop-blur-md">
      <div className="flex flex-col items-center space-y-8 p-8 rounded-2xl bg-bg/95 dark:bg-bg-dark/95 border border-primary/20 dark:border-primary-dark/20 shadow-2xl max-w-md mx-4">
        {/* Animated Icons */}
        <div className="relative w-24 h-24">
          {/* Background Circle */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 dark:from-primary-dark/20 dark:via-secondary-dark/20 dark:to-accent-dark/20 animate-spin"></div>

          {/* Inner Circle */}
          <div className="absolute inset-2 rounded-full bg-bg dark:bg-bg-dark border-2 border-primary/30 dark:border-primary-dark/30"></div>

          {/* Icon Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <CurrentIcon className="w-10 h-10 text-primary dark:text-primary-dark animate-pulse" />
              <div className="absolute -inset-2 bg-primary/20 dark:bg-primary-dark/20 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Spinning Loader */}
        <div className="relative">
          <Loader2 className="w-8 h-8 text-accent dark:text-accent-dark animate-spin" />
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-3">
          <h3 className="text-xl font-bold text-text dark:text-text-dark">
            {message}
          </h3>

          <p className="text-text/70 dark:text-text-dark/70 text-sm font-medium animate-fade-in-out">
            {loadingMessages[currentMessage].text}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex space-x-2">
          {[0, 1, 2, 3].map((dot) => (
            <div
              key={dot}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                dot === currentMessage
                  ? "bg-primary dark:bg-primary-dark scale-125"
                  : "bg-text/20 dark:bg-text-dark/20"
              }`}
            />
          ))}
        </div>

        {/* Motivational Quote */}
        <div className="text-center px-4 py-3 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 dark:from-primary-dark/10 dark:to-secondary-dark/10 rounded-lg border border-primary/20 dark:border-primary-dark/20">
          <p className="text-xs text-text/60 dark:text-text-dark/60 font-medium italic">
            "Great things take time. Your success is in progress..."
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-out {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-fade-in-out {
          animation: fade-in-out 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Simple Loading Button Component
export const LoadingButton = ({
  loading,
  children,
  loadingText = "Loading...",
  className = "",
  ...props
}) => {
  return (
    <button
      disabled={loading}
      className={`relative ${
        loading ? "cursor-not-allowed opacity-70" : ""
      } ${className}`}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span>{loadingText}</span>
        </div>
      )}
      <div className={loading ? "invisible" : "visible"}>{children}</div>
    </button>
  );
};

// Card Loading Skeleton
export const CardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-bg dark:bg-bg-dark border border-primary/10 dark:border-primary-dark/10 rounded-xl p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/20 dark:bg-primary-dark/20 rounded-xl"></div>
            <div className="flex-1">
              <div className="h-4 bg-primary/20 dark:bg-primary-dark/20 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-text/20 dark:bg-text-dark/20 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-text/20 dark:bg-text-dark/20 rounded w-full"></div>
            <div className="h-3 bg-text/20 dark:bg-text-dark/20 rounded w-5/6"></div>
            <div className="h-3 bg-text/20 dark:bg-text-dark/20 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoadingOverlay;
