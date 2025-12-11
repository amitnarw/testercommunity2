import React from "react";

const ErrorDiv = ({
  message,
  className,
}: {
  message: string;
  className: string;
}) => {
  return (
    <div
      className={`absolute bg-red-500 dark:bg-red-500/40 p-4 rounded-xl mt-2 border-l-4 border-red-300 dark:border-red-500 ${className}`}
    >
      <p className="italic text-sm text-white">{message}</p>
    </div>
  );
};

export default ErrorDiv;
