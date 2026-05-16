import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useAuth, type UserRole } from "../../context/AuthContext";

const roleOptions: { value: UserRole; label: string; color: string }[] = [
  { value: "operator", label: "Operator", color: "bg-success-500" },
  { value: "administrator", label: "Administrator", color: "bg-brand-500" },
  { value: "user", label: "User (Pimpinan)", color: "bg-orange-500" },
];

export default function UserDropdown() {
  const { user, logout, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const currentRoleColor = roleOptions.find((r) => r.value === user.role)?.color || "bg-brand-500";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className={`flex items-center justify-center mr-3 overflow-hidden rounded-full h-11 w-11 ${currentRoleColor} text-white font-medium`}>
          {initials}
        </span>
        <span className="block mr-1 font-medium text-theme-sm">{user.fullName}</span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          width="18" height="20" viewBox="0 0 18 20" fill="none"
        >
          <path d="M4.3125 8.65625L9 13.3437L13.6875 8.65625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute right-0 mt-[17px] flex w-[280px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user.fullName}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </span>
          <span className="mt-1 inline-block px-2 py-0.5 text-theme-xs font-medium rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
            {user.roleName}
          </span>
        </div>

        {/* Role Switcher */}
        <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-800">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            Simulasi Role
          </p>
          <div className="flex flex-col gap-1">
            {roleOptions.map((role) => (
              <button
                key={role.value}
                onClick={() => { switchRole(role.value); setIsOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  user.role === role.value
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${role.color}`} />
                {role.label}
                {user.role === role.value && (
                  <span className="ml-auto text-xs text-brand-500">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <ul className="flex flex-col gap-1 pt-3 pb-3 border-t border-gray-200 dark:border-gray-800 mt-3">
          <li>
            <DropdownItem
              onItemClick={() => setIsOpen(false)}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
            >
              Edit profile
            </DropdownItem>
          </li>
        </ul>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 w-full"
        >
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
