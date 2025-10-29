import { useEffect, useRef, useState } from "react";import { useNavigate } from "react-router-dom";
import axios from "axios";
import { translations } from "./translations";

export default function Register() {
   const [lang, setLang] = useState<"en" | "sq">("sq"); // Default Albanian
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // ✅ Added phone number
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);      
  const hamburgerRef = useRef<HTMLButtonElement>(null);

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
  

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (password.length < 12) {
    setError(translations[lang].passLength);
    return;
  }

  try {
    const payload = {
      fullName,
      email: (email || "").trim().toLowerCase(),
      password,
      phoneNumber,
    };

    const res = await axios.post(
      "http://localhost:8080/api/auth/register",
      payload,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      }
    );

    if (res.status === 200) {
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (res.status === 409) {
      const data = res.data;
      const code = typeof data === "object" ? data?.code : undefined;
      const msg =
        typeof data === "string"
          ? data
          : typeof data === "object"
          ? String(data?.message ?? data?.error ?? "")
          : "";
      const lower = msg.toLowerCase();

      // If backend ever indicates phone, show generic phone msg;
      // otherwise default ANY 409 to "email already in use".
      if (code === "PHONE_ALREADY_IN_USE" || lower.includes("phone")) {
        setError(translations[lang].registrationFailPhone); // add a phone-specific key if you want
      } else {
        setError(translations[lang].registrationFailEmail);
      }
      return;
    }

    if (res.status === 429) {
      // 👇 Always your frontend message, not backend
      setError(translations[lang].rateLimitGeneric);
      return;
    }

    // Anything else (400/500/etc.)
    setError(translations[lang].registrationFail);
  } catch (err: any) {
    // Only true network/CORS/runtime errors reach here now
    console.error("REGISTER CATCH (network/runtime)", err);
    setError(translations[lang].registrationFail);
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

        {/* Desktop Navigation (Added Home & Sell Your Car Buttons) */}
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

      {/* Register Form */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-16">
        <h2 className="text-2xl font-bold text-center mb-4">{translations[lang].userRegistration}</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block font-medium">{translations[lang].fullName}</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">{translations[lang].phone}</label> {/* ✅ Added phone number field */}
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

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

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            {translations[lang].register}
          </button>
        </form>
</div>
      </div>
  );
}
