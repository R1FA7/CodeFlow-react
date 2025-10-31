export const StepCard = ({ number, title, description, gradient }) => (
  <div
    className={`flex items-start gap-6 p-2 rounded-md hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 ${
      number === 1
        ? "border border-white"
        : "border-2 border-dashed border-gray-400"
    }`}
  >
    <div className="shrink-0">
      <div
        className={`w-16 h-16 rounded-md bg-linear-to-r ${gradient} flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-500/50`}
      >
        {number}
      </div>
    </div>
    <div className="flex-1 pt-1">
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);
