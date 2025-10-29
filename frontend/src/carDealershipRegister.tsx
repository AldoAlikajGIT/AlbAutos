import { useEffect, useRef, useState } from "react";import { useNavigate } from "react-router-dom";
import axios from "axios";
import { translations } from "./translations";

export default function CarDealershipRegister() {
   const [lang, setLang] = useState<"en" | "sq">("sq"); // Default Albanian
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);      
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

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
      businessName,
      vatNumber,
      email: (email || "").trim().toLowerCase(), // normalize
      password,
      phoneNumber,
    };

    const res = await axios.post(
      "http://localhost:8080/api/auth/dealerships/register",
      payload,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true, // handle non-2xx here (no throw)
      }
    );

    if (res.status === 200) {
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/carDealershipLogin"), 2000);
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

      // Prioritize phone-specific signal; else default to email
      if (code === "PHONE_ALREADY_IN_USE" || lower.includes("phone")) {
        setError(
          translations[lang].registrationFailPhone ?? translations[lang].registrationFail
        );
      } else if (code === "EMAIL_ALREADY_IN_USE" || lower.includes("email")) {
        setError(translations[lang].registrationFailEmail);
      } else {
        // unknown 409 → assume email
        setError(translations[lang].registrationFailEmail);
      }
      return;
    }

    if (res.status === 429) {
      setError(translations[lang].rateLimitGeneric);
      return;
    }

    setError(translations[lang].registrationFail);
  } catch {
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <button onClick={() => navigate("/")} className="text-gray-700 hover:text-blue-500 font-medium">
            {translations[lang].home}
          </button>
          <button onClick={() => navigate("/sellyourcar")} className="text-gray-700 hover:text-blue-500 font-medium">
            {translations[lang].sellYourCar}
          </button>
        </div>

        {/* Mobile Navigation */}
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
        <h2 className="text-2xl font-bold text-center mb-4">{translations[lang].dealershipRegister}</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block font-medium">{translations[lang].dealershipName}</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">{translations[lang].vat}</label>
            <input
              type="text"
              value={vatNumber}
              onChange={(e) => setVatNumber(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
  <label className="block font-medium">{translations[lang].phone}</label>
  <input
    type="text"
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
