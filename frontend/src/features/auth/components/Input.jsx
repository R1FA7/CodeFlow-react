import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export const Input = ({
  label,
  type = "text",
  value,
  onChange,
  required = false,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  console.log(type);

  return (
    <div className="relative w-full">
      <input
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => !value && setFocused(false)}
        className="w-full border border-slate-600 bg-slate-800/50 text-gray-100 rounded-lg px-3 py-3 focus:outline-none focus:border-purple-400 placeholder-transparent transition-all duration-200"
        required={required}
      />
      <label
        className={`absolute left-4 px-1 transition-all duration-200 pointer-events-none
          ${
            focused || value
              ? "-top-2 text-xs text-purple-400 bg-slate-800/90"
              : "top-1/2 -translate-y-1/2 text-slate-400"
          }`}
      >
        {label === "Name"
          ? "Full Name"
          : label === "Login"
          ? "Username Or Email"
          : label}
      </label>
      {type === "password" &&
        (showPassword ? (
          <EyeSlashIcon
            className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            onClick={() => setShowPassword(false)}
          />
        ) : (
          <EyeIcon
            className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-white"
            onClick={() => setShowPassword(true)}
          />
        ))}
    </div>
  );
};
