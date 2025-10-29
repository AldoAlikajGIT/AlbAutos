import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "./translations";

interface AccountDropdownProps {
  lang: "en" | "sq"; // ✅ Accept lang as a prop
}

export default function AccountDropdown({ lang }: AccountDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.setItem("logoutMessage", "You have been logged out.");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 hover:text-blue-500 font-medium focus:outline-none"
      >
        {translations[lang].myAccount} <span className="ml-1">▾</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <button
            onClick={() => {
              navigate("/myaccount");
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            {translations[lang].myAccount}
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            {translations[lang].logOut}
          </button>
        </div>
      )}
    </div>
  );
}
