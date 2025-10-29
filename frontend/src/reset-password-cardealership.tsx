import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { translations } from "./translations";

export default function ResetPasswordCarDealership() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [lang, setLang] = useState<"en" | "sq">("sq"); // Default Albanian

  useEffect(() => {
  const savedLang = localStorage.getItem("lang") as "en" | "sq";
  if (savedLang) setLang(savedLang);
}, []);


  useEffect(() => { 
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        hamburgerRef.current && !hamburgerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    if (!token) {
      setErrorMessage("Invalid or missing reset token.");
      return;
    }

    if (password.length < 12) {
      setErrorMessage("Password must be at least 12 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/reset-password-cardealership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (response.ok) {
        setInfoMessage("Dealership password reset successful. You may now log in.");
        // navigate("/car-dealership-login"); // optional redirect
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center px-4">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between fixed top-0 left-0 w-full z-50">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <img src="/Logo.png" alt="AlbAutos Logo" className="w-full h-full object-contain" />

          </div>
          <h1 className="text-2xl font-bold text-gray-800">AlbAutos</h1>
        </div>
        <div className="hidden md:flex space-x-6">
          <button onClick={() => navigate("/")} className="text-gray-700 hover:text-blue-500 font-medium">{translations[lang].home}</button>
          <button onClick={() => navigate("/sellyourcar")} className="text-gray-700 hover:text-blue-500 font-medium">{translations[lang].sellYourCar}</button>
        </div>
        <div className="md:hidden">
          <button ref={hamburgerRef} onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 text-2xl">☰</button>
        </div>
      </nav>

      {menuOpen && (
        <div ref={menuRef} className="md:hidden bg-white shadow-md py-5 flex flex-col items-center space-y-4 mt-14 w-full fixed top-5 left-0">
          <button onClick={() => navigate("/")} className="text-gray-700 hover:text-blue-500 font-medium">{translations[lang].home}</button>
          <button onClick={() => navigate("/sellyourcar")} className="text-gray-700 hover:text-blue-500 font-medium">{translations[lang].sellYourCar}</button>
        </div>
      )}

      {/* Reset Password Form */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-16">
        <h2 className="text-2xl font-bold text-center mb-4">{translations[lang].resetPassDealership}</h2>
        {infoMessage && <p className="text-green-600 text-center mb-2">{infoMessage}</p>}
        {errorMessage && <p className="text-red-500 text-center mb-2">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">{translations[lang].newPass}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">{translations[lang].confrimPass}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {translations[lang].resetPass}
          </button>
        </form>
      </div>
    </div>
  );
}
