const colorClasses = {
  indigo: {
    border: "hover:border-indigo-500/50",
    shadow: "hover:shadow-indigo-500/20",
    bg: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
    text: "text-indigo-400",
  },
  purple: {
    border: "hover:border-purple-500/50",
    shadow: "hover:shadow-purple-500/20",
    bg: "bg-purple-500/10 group-hover:bg-purple-500/20",
    text: "text-purple-400",
  },
  pink: {
    border: "hover:border-pink-500/50",
    shadow: "hover:shadow-pink-500/20",
    bg: "bg-pink-500/10 group-hover:bg-pink-500/20",
    text: "text-pink-400",
  },
  cyan: {
    border: "hover:border-cyan-500/50",
    shadow: "hover:shadow-cyan-500/20",
    bg: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
    text: "text-cyan-400",
  },
};

export const FeatureCard = ({ icon: Icon, title, description, color }) => {
  const c = colorClasses[color];
  return (
    <div
      className={`group bg-linear-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl ${c.border} ${c.shadow}`}
    >
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${c.bg}`}
      >
        <Icon className={`w-6 h-6 ${c.text}`} />
      </div>
      <h3 className={`mb-3 text-lg font-semibold ${c.text}`}>{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
};
