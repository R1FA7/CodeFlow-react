export const GradientButton = ({
  className = "",
  onClick,
  children,
  disabled = false,
  loading = false,
}) => {
  console.log("HI", disabled);
  return (
    <button
      className={`
        relative flex justify-center items-center
        rounded-lg 
        bg-linear-to-r from-purple-600 to-pink-600 
        text-white font-bold 
        transition-all duration-300 
        shadow-lg shadow-indigo-500/50 
        hover:shadow-indigo-500/80 hover:scale-105
        ${
          !disabled && !loading
            ? "hover:from-indigo-900 hover:to-purple-700"
            : "cursor-not-allowed shadow-none"
        }
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="w-4 h-4 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};
