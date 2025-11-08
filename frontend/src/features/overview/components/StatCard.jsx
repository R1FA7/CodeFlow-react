import { useEffect, useState } from "react";

export const StatCard = ({ title, value, icon: Icon, gradient }) => {
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Counter
  useEffect(() => {
    const duration = 1500;
    const steps = 50;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div
      className={`relative bg-linear-to-br ${gradient} backdrop-blur-sm border border-purple-700/50 rounded-2xl p-6 transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl hover:shadow-purple-500/40 group overflow-hidden cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-300 text-xs font-semibold uppercase tracking-widest">
            {title}
          </h3>
        </div>

        {/* Animated icon */}
        <div
          className={`bg-purple-500/20 p-2 rounded-xl transition-all duration-500 ${
            isHovered ? "rotate-360 scale-110 bg-purple-500/40" : "rotate-20"
          }`}
        >
          <Icon className="w-10 h-10 text-purple-400 group-hover:text-purple-200 transition-colors" />
        </div>
      </div>
      <p className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-200 via-white to-purple-200 mb-2">
        {count}
      </p>
      {/* progress bar  */}
      <div
        className="bg-linear-to-r h-1.5 from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
        style={{ width: isHovered ? "100%" : "60%" }}
      />
    </div>
  );
};
