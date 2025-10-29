import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { translations } from "./translations";

export default function Login() {
  const [lang, setLang] = useState<"en" | "sq">("sq"); // Default Albanian
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);      
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");


  useEffect(() => {
  const savedLang = localStorage.getItem("lang") as "en" | "sq";
  if (savedLang) setLang(savedLang);
}, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const isOutsideMenu = menuRef.current && !menuRef.current.contains(e.target as Node);
      const isOutsideButton = hamburgerRef.current && !hamburgerRef.current.contains(e.target as Node);
      if (isOutsideMenu && isOutsideButton) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  if (loading) return;

  if (!email || !password) {
    setValidationError(translations[lang].fillBothFields);
    return;
  }

  setLoading(true);
  setValidationError("");
  setError("");
  setSuccess("");

  try {
    const response = await axios.post(
      "http://localhost:8080/api/auth/login",
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    const token = response.data.token;
    localStorage.setItem("token", token);
    setSuccess(translations[lang].loginSuccess);

    const payload = JSON.parse(atob(token.split(".")[1]));

    setTimeout(() => {
      if (payload.role === "ROLE_ADMIN") {
        navigate("/caditiperadmininoheker");
      } else {
        navigate("/");
      }
    }, 1500);
  } catch (err: any) {
    setError(translations[lang].invalidCred);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center px-4">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between fixed top-0 left-0 w-full z-50">
        <div className="flex items-center space-x-3">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <img src="/Logo.png" alt="AlbAutos Logo" className="w-full h-full object-contain" />

            </div>
            <h1 className="text-2xl font-bold text-gray-800">AlbAutos</h1>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <button onClick={() => navigate("/")} className="text-gray-700 hover:text-blue-500 font-medium">
            {translations[lang].home}
          </button>
          <button onClick={() => navigate("/sellyourcar")} className="text-gray-700 hover:text-blue-500 font-medium">
            {translations[lang].sellYourCar}
          </button>
        </div>

        {/* Mobile Navigation (Hamburger Menu) */}
        <div className="md:hidden">
          <button ref={hamburgerRef} onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 text-2xl">☰</button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div ref={menuRef}
          className="md:hidden bg-white shadow-md py-5 flex flex-col items-center space-y-4 mt-14 w-full fixed top-5 left-0">
          <button onClick={() => navigate("/")} className="text-gray-700 hover:text-blue-500 font-medium">
            {translations[lang].home}
          </button>
          <button onClick={() => navigate("/sellyourcar")} className="text-gray-700 hover:text-blue-500 font-medium">
            {translations[lang].sellYourCar}
          </button>
        </div>
      )}

      {/* Login Form */}
<div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-16">
  <h2 className="text-2xl font-bold text-center mb-4">{translations[lang].logInPage}</h2>
  {success && <p className="text-green-600 text-center mb-2">{success}</p>}
  {error && <p className="text-red-500 text-center">{error}</p>}
  {validationError && <p className="text-red-500 text-center">{validationError}</p>}

  <form onSubmit={handleLogin} className="space-y-4">
    <div>
      <label className="block font-medium">{translations[lang].email}</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
    </div>

    <div>
      <label className="block font-medium">{translations[lang].password}</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
    </div>

    <div className="text-right">
      <button
        type="button"
        onClick={() => navigate("/forgot-password")}
        className="text-sm text-blue-600 hover:underline"
      >
        {translations[lang].forgotPassword}
      </button>
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? translations[lang].loggingIn : translations[lang].logIn}
    </button>
  </form>
</div>


      {/* Additional Links Card */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mt-4 text-center space-y-2">
        <p className="text-gray-700">
          {translations[lang].noAccount},{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline font-medium"
          >
            {translations[lang].registerHere}
          </button>
        </p>
        <p className="text-gray-700">
          {translations[lang].dealershipAcc},{" "}
          <button
            onClick={() => navigate("/cardealershiplogin")}
            className="text-blue-600 hover:underline font-medium"
          >
            {translations[lang].loginHere}
          </button>
        </p>
      </div>
    </div>
  );
}
