import {
  Bars3Icon,
  CodeBracketIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  HomeIcon,
  PlayIcon,
  ShieldCheckIcon,
  TrophyIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

const navItems = [
  {
    name: "Overview",
    icon: <HomeIcon className="w-5 h-5" />,
    to: "/overview",
    permission: "view_overview",
  },
  {
    name: "Contests",
    icon: <TrophyIcon className="w-5 h-5" />,
    to: "/contests",
    permission: "view_contests",
  },
  {
    name: "Problemset",
    icon: <CodeBracketIcon className="w-5 h-5" />,
    to: "/problemset",
    permission: "view_problemset",
  },
  {
    name: "Submissions",
    icon: <DocumentTextIcon className="w-5 h-5" />,
    to: "/submissions",
    permission: "view_submissions",
  },
  {
    name: "Playground",
    icon: <PlayIcon className="w-5 h-5" />,
    to: "/playground",
    permission: "view_playground",
  },
  {
    name: "Settings",
    icon: <Cog6ToothIcon className="w-5 h-5" />,
    to: "/settings",
    permission: "view_settings",
  },
];
const navItemsBottom = [
  {
    name: "Host Contest",
    icon: <UserGroupIcon className="w-5 h-5" />,
    to: "/host-contest",
    role: ["setter"],
  },
  {
    name: "Admin",
    icon: <ShieldCheckIcon className="w-5 h-5" />,
    to: "/admin",
    role: ["admin"],
  },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { data } = useCurrentUser();
  const user = data?.data;
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onClose}
        className={`fixed top-20 z-40 rounded-md p-2 text-gray-200 hover:bg-purple-700 transition-all duration-300 shadow-sm cursor-pointer ${
          isOpen ? "left-38" : "left-5"
        }`}
      >
        {isOpen ? (
          <XMarkIcon className="w-5 h-5" />
        ) : (
          <Bars3Icon className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar*/}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-linear-to-br from-slate-800 via-purple-900 to-slate-900 text-gray-200 shadow-2xl transition-all duration-300 z-30 overflow-y-auto ${
          isOpen ? "w-[200px]" : "w-16"
        }`}
      >
        <nav className="flex flex-col space-y-2 px-3 py-6 mt-10">
          {navItems.map(({ name, icon, to }) => (
            <NavLink
              key={name}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? "bg-purple-700 text-white shadow-md border border-purple-500"
                    : "hover:bg-purple-600/50 hover:text-white"
                }`
              }
            >
              <span className="shrink-0">{icon}</span>

              {/* Text for expanded sidebar */}
              {isOpen && <span className="whitespace-nowrap">{name}</span>}
            </NavLink>
          ))}
          <hr className="border-purple-600/40 mx-3" />
          <div className="flex flex-col space-y-2">
            {navItemsBottom.map(({ name, icon, to, role }) => {
              const canAccess = user && role?.some((r) => user[r]);
              console.log(data);
              if (!canAccess) return null;
              return (
                <NavLink
                  key={name}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                      isActive
                        ? "bg-purple-700 text-white shadow-md border border-purple-500"
                        : "hover:bg-purple-600/50 hover:text-white"
                    }`
                  }
                >
                  <span className="shrink-0">{icon}</span>
                  {isOpen && <span className="whitespace-nowrap">{name}</span>}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Mobile Overlay*/}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50 dark:bg-black/10 backdrop-filter"
          onClick={onClose}
        />
      )}
    </>
  );
};
