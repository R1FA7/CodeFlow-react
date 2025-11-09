import { NavLink } from "react-router-dom";
import { GradientButton } from "../../components/gradientButton";

export const MobileNavbar = ({
  NavLinks,
  onClose,
  user,
  onLogOut,
  onLogin,
  isPending,
}) => {
  return (
    <div className="md:hidden absolute top-20 right-5 w-48 bg-gray-800/95 backdrop-blur-md border border-gray-700 p-5 shadow-2xl shadow-indigo-500/20 flex flex-col gap-4 rounded-xl z-50 animate-slideIn">
      {NavLinks.map((nav) => (
        <NavLink
          to={nav.link}
          className="hover:text-indigo-400 hover:translate-x-1 transition-all duration-200 text-left py-2 px-3 rounded-lg hover:bg-gray-700/50"
          key={nav.id}
          onClick={onClose}
        >
          {nav.name}
        </NavLink>
      ))}
      <div className="border-t border-gray-700 pt-3 mt-2">
        {user?.data ? (
          <GradientButton
            className="w-full px-6 py-3"
            onClick={() => {
              onLogOut();
              onClose();
            }}
            disabled={isPending}
            loading={isPending}
          >
            Logout
          </GradientButton>
        ) : (
          <GradientButton
            className="w-full px-6 py-3"
            onClick={() => {
              onLogin();
              onClose();
            }}
          >
            Login
          </GradientButton>
        )}
      </div>
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
    </div>
  );
};
