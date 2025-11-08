import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../../../api/auth";
import { GradientButton } from "./gradientButton";
import { Sidebar } from "./Sidebar";

export const DashboardLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res.success) {
        queryClient.setQueryData(["currentUser"], null);
        navigate("/");
        toast.success(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center bg-linear-to-r from-slate-800 via-purple-900 to-slate-900 text-gray-200 px-6 py-4 shadow-lg">
        <h3 className="text-2xl font-bold bg-linear-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
          CodeFlow
        </h3>
        <GradientButton className="px-6 py-2" onClick={() => handleLogout()}>
          Logout
        </GradientButton>
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
