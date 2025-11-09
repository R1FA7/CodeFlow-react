import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../../../../api/auth";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { GradientButton } from "../../components/gradientButton";
import { MobileNavbar } from "./MobileNavbar";

const NavLinks = [
  { id: 1, name: "Contests", link: "/contests" },
  { id: 2, name: "Problemset", link: "/problemset" },
  { id: 3, name: "Playground", link: "/playground" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  console.log("NAVBAR", user?.data);

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: (response) => {
      queryClient.setQueryData(["currentUser"], null);
      queryClient.invalidateQueries(["currentUser"]);
      navigate("/");
      toast.success(response?.message || "Logged out");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast.error(error?.message || "Logout failed");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-lg relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-5">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="font-bold text-2xl text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-800"
        >
          CodeFlow
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8">
          {NavLinks.map((nav) => (
            <NavLink
              key={nav.link}
              to={nav.link}
              className={({ isActive }) =>
                `hover:text-indigo-400 transition-colors ${
                  isActive ? "text-indigo-400 font-semibold" : ""
                }`
              }
            >
              {nav.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Auth Button */}
        <div className="hidden md:block">
          {user?.data ? (
            <GradientButton
              className="px-6 py-3"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              loading={logoutMutation.isPending}
            >
              Logout
            </GradientButton>
          ) : (
            <GradientButton
              className="px-6 py-3"
              onClick={() => navigate("/login")}
            >
              Login
            </GradientButton>
          )}
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
        <MobileNavbar
          NavLinks={NavLinks}
          onClose={() => setIsOpen(false)}
          user={user}
          onLogOut={handleLogout}
          isPending={logoutMutation.isPending}
          onLogin={() => navigate("/login")}
        />
      )}
    </nav>
  );
};
