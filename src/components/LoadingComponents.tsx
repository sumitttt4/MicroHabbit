import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    primary: 'border-green-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 border-t-transparent'
  };

  return (
    <div 
      className={`border-2 rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    />
  );
};

interface LoadingSkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className = '',
  width = 'w-full',
  height = 'h-4'
}) => {
  return (
    <div 
      className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${width} ${height} ${className}`}
    />
  );
};

interface LoadingCardProps {
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg ${className}`}>
      <div className="flex items-center gap-4 mb-3">
        <LoadingSkeleton width="w-12" height="h-12" className="rounded-full" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton width="w-3/4" height="h-5" />
          <LoadingSkeleton width="w-1/2" height="h-4" />
        </div>
        <LoadingSkeleton width="w-10" height="h-10" className="rounded-lg" />
      </div>
      <LoadingSkeleton width="w-full" height="h-3" className="mb-2" />
      <LoadingSkeleton width="w-2/3" height="h-3" />
    </div>
  );
};

interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  children,
  disabled = false,
  className = '',
  onClick,
  type = 'button'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading && (
        <LoadingSpinner size="sm" color="white" />
      )}
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>
    </button>
  );
};

interface ProgressBarProps {
  progress: number;
  className?: string;
  color?: 'green' | 'blue' | 'purple' | 'yellow';
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = '',
  color = 'green',
  showPercentage = false
}) => {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500'
  };

  const boundedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`relative ${className}`}>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${boundedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {Math.round(boundedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Loading...',
  children
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center rounded-2xl backdrop-blur-sm">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-gray-400 mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

interface ErrorBoundaryStateProps {
  error: Error;
  resetError: () => void;
}

export const ErrorBoundaryState: React.FC<ErrorBoundaryStateProps> = ({
  error,
  resetError
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h2>
        
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          We encountered an unexpected error. Don't worry, your data is safe!
        </p>
        
        <div className="space-y-3">
          <button
            onClick={resetError}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Refresh Page
          </button>
        </div>
        
        <details className="mt-6 text-left">
          <summary className="text-sm text-gray-500 cursor-pointer">
            Technical Details
          </summary>
          <pre className="mt-2 text-xs text-gray-400 bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto">
            {error.message}
          </pre>
        </details>
      </div>
    </div>
  );
};

// Animated number counter
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const start = Date.now();
    const startValue = displayValue;
    const difference = value - startValue;

    const updateCounter = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (difference * easedProgress);
      setDisplayValue(Math.round(currentValue));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    updateCounter();
  }, [value, duration, displayValue]);

  return <span className={className}>{displayValue}</span>;
};

export default {
  LoadingSpinner,
  LoadingSkeleton,
  LoadingCard,
  LoadingButton,
  ProgressBar,
  LoadingOverlay,
  EmptyState,
  ErrorBoundaryState,
  AnimatedCounter
};
