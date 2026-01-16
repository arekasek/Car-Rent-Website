import React from "react";
import { MdError } from "react-icons/md";

export default function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  maxLength,
  autoComplete,
  className = "",
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={`w-full px-4 py-2 border rounded-lg transition ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent bg-red-50"
              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        />

        {error && (
          <MdError className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}
