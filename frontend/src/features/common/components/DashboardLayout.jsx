import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../../../api/auth";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { GradientButton } from "./GradientButton.jsx";
import { Sidebar } from "./Sidebar";

export const DashboardLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

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
  const handleLogout = async () => {
    logoutMutation.mutate();
  };
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center bg-linear-to-r from-slate-800 via-purple-900 to-slate-900 text-gray-200 px-6 py-4 shadow-lg">
        <button
          className="text-2xl font-bold bg-linear-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent cursor-pointer"
          onClick={() => navigate("/")}
        >
          CodeFlow
        </button>
        {user ? (
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
      </header>

      {/* Layout with Sidebar and Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} />
        <main
          className={`flex-1 transition-all duration-300 mt-4 overflow-x-auto ${
            isOpen ? "ml-46" : "ml-12"
          }`}
        >
          <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
