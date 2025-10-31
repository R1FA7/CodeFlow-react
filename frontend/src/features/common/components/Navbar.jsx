import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { GradientButton } from "./gradientButton";

const NavLinks = [
  { id: 1, name: "Contests", link: "#" },
  { id: 2, name: "Problemset", link: "#" },
  { id: 3, name: "Playground", link: "#" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-lg relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-5">
        {/* Logo */}
        <button className="font-bold text-2xl text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-800">
          CodeFlow
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8">
          {NavLinks.map((nav) => (
            <NavLink
              key={nav.link}
              to={nav.link}
              className={({ isActive }) =>
                `${isActive && "hover:text-indigo-400 transition-colors"}`
              }
            >
              {nav.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Login */}
        <div className="hidden md:block">
          <GradientButton className="px-6 py-3">Login</GradientButton>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <XMarkIcon className="w-7 h-7 text-indigo-400 transition-transform duration-300 rotate-90" />
          ) : (
            <Bars3Icon className="w-7 h-7 text-gray-300 hover:text-indigo-400 transition-colors duration-300" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 right-5 w-48 bg-gray-800/95 backdrop-blur-md border border-gray-700 p-5 shadow-2xl shadow-indigo-500/20 flex flex-col gap-4 rounded-xl z-50 animate-slideIn">
          {NavLinks.map((nav) => (
            <NavLink
              to={nav.link}
              className="hover:text-indigo-400 hover:translate-x-1 transition-all duration-200 text-left py-2 px-3 rounded-lg hover:bg-gray-700/50"
              key={nav.id}
              onClick={() => setIsOpen(false)}
            >
              {nav.name}
            </NavLink>
          ))}
          <div className="border-t border-gray-700 pt-3 mt-2">
            <GradientButton className="px-6 py-3 w-full">Login</GradientButton>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};
