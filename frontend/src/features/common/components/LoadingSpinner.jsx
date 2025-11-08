export const LoadingSpinner = ({ size = 10, minHeight = "200px" }) => {
  return (
    <div className={`flex justify-center items-center`} style={{ minHeight }}>
      <div
        className={`w-${size} h-${size} rounded-full animate-spin border-4   border-t-purple-600 border-gray-300`}
      />
    </div>
  );
};
