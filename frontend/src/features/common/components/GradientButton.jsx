export const GradientButton = ({ className = "", onClick, children }) => {
  return (
    <button
      className={`rounded-lg bg-linear-to-r from-indigo-600 to-purple-500 hover:from-indigo-900 hover:to-purple-700 text-white font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/80 hover:scale-105 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
