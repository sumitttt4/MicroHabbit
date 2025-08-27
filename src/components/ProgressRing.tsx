import React from 'react';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  color?: 'orange' | 'green';
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 'md',
  showPercentage = true,
  color = 'orange'
}) => {
  const sizes = {
    sm: { dimension: 60, strokeWidth: 4, fontSize: 'text-xs' },
    md: { dimension: 80, strokeWidth: 6, fontSize: 'text-sm' },
    lg: { dimension: 120, strokeWidth: 8, fontSize: 'text-lg' }
  };

  const { dimension, strokeWidth, fontSize } = sizes[size];
  const radius = (dimension - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colorClasses = {
    orange: 'stroke-orange-500',
    green: 'stroke-green-500'
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={dimension}
        height={dimension}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-stone-200"
        />
        
        {/* Progress circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${colorClasses[color]} transition-all duration-500 ease-out`}
          style={{
            filter: progress === 100 ? 'drop-shadow(0 0 8px rgb(249 115 22 / 0.5))' : 'none'
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {showPercentage ? (
          <div className="text-center">
            <div className={`font-semibold text-stone-900 ${fontSize}`}>
              {Math.round(progress)}%
            </div>
            {progress === 100 && (
              <div className="text-xl animate-bounce">🎉</div>
            )}
          </div>
        ) : (
          progress === 100 && (
            <div className="text-2xl animate-pulse">✨</div>
          )
        )}
      </div>
    </div>
  );
};

export default ProgressRing;
