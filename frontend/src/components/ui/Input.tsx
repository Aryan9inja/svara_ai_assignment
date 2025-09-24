"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div className="relative w-full">
      {label && (
        <label htmlFor={props.id || props.name} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`peer w-full rounded-lg border px-3 py-3 bg-white text-base transition-all duration-200
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200
          ${error ? 'border-red-500 ring-red-100' : 'border-gray-300'}
          disabled:bg-gray-100 disabled:cursor-not-allowed`}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.name}-error` : undefined}
        {...props}
      />
      {error && (
        <div className="absolute right-3 top-3 flex items-center gap-1 text-red-600 animate-shake">
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          <span id={`${props.name}-error`} className="text-xs font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};
