"use client";

export const Loader = ({ fullScreen = false, message = "Loading..." }) => {
  const baseClasses = "flex flex-col items-center justify-center gap-4";
  const containerClasses = fullScreen
    ? `${baseClasses} min-h-screen bg-gray-100 w-full`
    : `${baseClasses} py-12`;

  return (
    <div className={containerClasses}>
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-600 font-semibold text-lg">{message}</p>
    </div>
  );
};
