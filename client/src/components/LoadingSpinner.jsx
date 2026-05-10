import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-200 border-t-primary animate-spin`}></div>
      {message && <p className="text-text-subtle text-sm">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
