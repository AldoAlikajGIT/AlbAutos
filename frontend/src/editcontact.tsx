import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { translations } from "./translations";

export default function EditContact() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState(""); // 👈 track user role
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [lang, setLang] = useState<"en" | "sq">("sq"); // Default Albanian

    useEffect(() => {
  const savedLang = localStorage.getItem("lang") as "en" | "sq";
  if (savedLang) setLang(savedLang);
}, []);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8080/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setEmail(res.data.email);
        setPhoneNumber(res.data.phoneNumber);
        setRole(res.data.role); // 👈 get role from backend
      })
      .catch(() => {
        setError("Session expired. Please log in again.");
        navigate("/login");
      });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return;

    const endpoint =
      role === "CARDEALERSHIP"
        ? "http://localhost:8080/api/dealerships/update-contact"
        : "http://localhost:8080/api/users/update-contact";

    try {
      await axios.patch(
        endpoint,
        { email, phoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(translations[lang].contactInfoChanged);
      setTimeout(() => navigate("/myaccount"), 1500);
    } catch (err) {
      setError(translations[lang].contactInfoChangeError);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-24 px-4">
      {/* 🔙 Go Back Button */}
      <div className="absolute top-4 left-4">
  <button
    onClick={() => navigate(-1)}
    className="inline-flex items-center gap-2 text-gray-700 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
  >
    <span className="font-medium">{translations[lang].goBack}</span>
  </button>
</div>

      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-center">{translations[lang].editContact}</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">{translations[lang].email}</label>
            <input
              type="email"
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
  <label className="block mb-1 font-medium">{translations[lang].phone}</label>
  <input
    type="tel"
    className="w-full border p-2 rounded"
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
    required
  />
  {/* helper text below the phone field */}
  <p className="text-sm text-gray-500 mt-1">{translations[lang].contactChange}</p>
</div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {translations[lang].saveChanges}
          </button>
        </form>
      </div>
    </div>
  );
}
