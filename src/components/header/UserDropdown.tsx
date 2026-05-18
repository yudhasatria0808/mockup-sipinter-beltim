import { useState } from "react";
import { useNavigate } from "react-router";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useAuth, type UserRole } from "../../context/AuthContext";

const roleOptions: { value: UserRole; label: string; color: string; gradient: string }[] = [
  { value: "operator", label: "Operator", color: "bg-success-500", gradient: "from-success-400 to-success-600" },
  { value: "administrator", label: "Administrator", color: "bg-brand-500", gradient: "from-brand-400 to-brand-600" },
  { value: "user", label: "User (Pimpinan)", color: "bg-orange-500", gradient: "from-orange-400 to-orange-600" },
];

export default function UserDropdown() {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const currentRole = roleOptions.find((r) => r.value === user.role);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-gray-700 transition-all hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span className={`flex items-center justify-center overflow-hidden rounded-xl h-10 w-10 bg-gradient-to-br ${currentRole?.gradient || "from-brand-400 to-brand-600"} text-white text-sm font-semibold shadow-md shadow-brand-500/20`}>
          {initials}
        </span>
        <div className="hidden text-left sm:block">
          <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">{user.fullName}</span>
          <span className="block text-xs text-gray-400 dark:text-gray-500">{user.roleName}</span>
        </div>
        <svg
          className={`stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          width="18" height="20" viewBox="0 0 18 20" fill="none"
        >
          <path d="M4.3125 8.65625L9 13.3437L13.6875 8.65625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute right-0 mt-[17px] flex w-[300px] flex-col rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xl shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none"
      >
        {/* User info header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
          <span className={`flex items-center justify-center rounded-xl h-12 w-12 bg-gradient-to-br ${currentRole?.gradient || "from-brand-400 to-brand-600"} text-white font-semibold shadow-md`}>
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <span className="block font-semibold text-gray-800 dark:text-gray-200 truncate">
              {user.fullName}
            </span>
            <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </span>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <span className={`h-1.5 w-1.5 rounded-full ${currentRole?.color}`} />
              {user.roleName}
            </span>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="pt-3 pb-3 border-b border-gray-100 dark:border-gray-800">
          <p className="px-2 mb-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Simulasi Role
          </p>
          <div className="flex flex-col gap-1">
            {roleOptions.map((role) => (
              <button
                key={role.value}
                onClick={() => { switchRole(role.value); setIsOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  user.role === role.value
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400 font-medium shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className={`h-3 w-3 rounded-full bg-gradient-to-br ${role.gradient} shadow-sm`} />
                <span className="flex-1 text-left">{role.label}</span>
                {user.role === role.value && (
                  <svg className="h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <ul className="flex flex-col gap-1 pt-3 pb-2">
          <li>
            <DropdownItem
              onItemClick={() => setIsOpen(false)}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2.5 font-medium text-gray-700 rounded-xl text-sm hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Edit profile
            </DropdownItem>
          </li>
        </ul>

        <button
          onClick={() => { logout(); navigate("/signin"); }}
          className="flex items-center gap-3 px-3 py-2.5 font-medium text-error-600 rounded-xl text-sm hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-500/10 w-full transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
