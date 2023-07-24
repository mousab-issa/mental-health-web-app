import React from "react";

const SpinnerButton = ({ onClick, loading, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className={`bg-indigo-500 text-white py-2 px-4 rounded ${
      loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-600"
    }`}
  >
    {loading ? (
      <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
        {/* Replace this comment with your spinner SVG path */}
      </svg>
    ) : (
      children
    )}
  </button>
);

export default SpinnerButton;
