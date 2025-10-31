export const Footer = () => {
  return (
    <footer className="border-t border-slate-800 py-5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-800">
            CodeFlow
          </h3>
        </div>

        <div className="flex gap-10 text-gray-400">
          <a href="#" className="hover:text-indigo-400 transition-colors">
            Problemset
          </a>
          <a href="#" className="hover:text-indigo-400 transition-colors">
            Contests
          </a>
        </div>

        <div className="text-gray-400 text-sm">
          © 2025 CodeFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
