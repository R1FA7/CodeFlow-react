export const Footer = () => {
  return (
    <footer className="border-t border-slate-800 py-5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-800">
          CodeFlow
        </h3>
        <div className="text-gray-400 text-sm">
          © 2025 CodeFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
